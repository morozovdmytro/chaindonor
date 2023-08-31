// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import ERC20 interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BloodToken.sol";

contract ChainDonorHub is Ownable {
    // State variables

    BloodToken public token; // ERC-20 token used for rewards
    // institution => bool
    mapping(address => bool) public medicalInstitutions; // map of registered medical institutions
    // donor => bool
    mapping(address => bool) public donors; // map of registered donors
    // donor => donation index => Donation
    mapping(address => Donation[]) public donorDonations; // map of donations per donor
    // donor => hashed personal information
    mapping(address => bytes32) public donorPersonalInfo; // map of hashed personal information per donor
    uint256 public totalInstitutions = 0; // To calculate the 51% consensus
    // donor => donation index => institution => bool
    mapping(address => mapping(uint256 => mapping(address => bool))) approvedBy; // To check if an institution has already approved a donation; 

    // Structs

    struct Donation {
        uint256 amount; // Amount of tokens donated
        uint256 approvals; // Number of approvals
        bool claimed; // Whether the reward has been claimed
    }

    // Events

    event DonationCreated(address indexed donor, uint256 amount); // Event emitted when a new donation is created
    event DonationApproved(address indexed institution, address indexed donor, uint256 index); // Event emitted when a donation is approved
    event DonationClaimed(address indexed donor, uint256 amount); // Event emitted when a donation is claimed

    // Modifiers

    // Only medical institutions can perform this action
    modifier onlyMedicalInstitution() {
        require(medicalInstitutions[_msgSender()] == true, "ChainDonorHub: Sender is not a medical institution");
        _;
    }

    modifier onlyDonor() {
        require(donors[_msgSender()] == true, "ChainDonorHub: Sender is not a donor");
        _;
    }

    // Constructor
    constructor(address _tokenAddress) {
        // Initialize the ERC-20 token used for rewards (Blood)
        token = BloodToken(_tokenAddress);
    }

    // Register medical institutions
    function addMedicalInstitution(address _institution) public onlyOwner {
        medicalInstitutions[_institution] = true;
        totalInstitutions += 1;
    }

    // Remove medical institutions
    function removeMedicalInstitution(address _institution) public onlyOwner {
        medicalInstitutions[_institution] = false;
        totalInstitutions -= 1;
    }

    // Register donors
    function registerDonor(bytes32 _hashPersonalInfo) public {
        require(donors[_msgSender()] == false, "ChainDonorHub: Donor already registered");
        donors[_msgSender()] = true;
        donorPersonalInfo[_msgSender()] = _hashPersonalInfo;
    }

    // Remove donors
    function removeDonor() public {
        require(donors[_msgSender()] == true, "ChainDonorHub: Donor not registered");
        donors[_msgSender()] = false;
        donorPersonalInfo[_msgSender()] = "";
    }

    // Create a new donation
    function createDonation(address _donor, uint256 _amount) public onlyMedicalInstitution {
        require(donors[_donor] == true, "ChainDonorHub: Donor not registered");
        require(_amount > 0, "ChainDonorHub: Amount must be greater than 0");
        
        Donation memory newDonation = Donation({
            amount: _amount,
            approvals: 0,
            claimed: false
        });

        // add donation
        donorDonations[_donor].push(newDonation);

        emit DonationCreated(_donor, _amount);
    }

    // Approve a donation
    function approveDonation(address _donor, uint256 _index) public onlyMedicalInstitution {
        // check if donation was not approved yet
        require(!approvedBy[_donor][_index][_msgSender()], "ChainDonorHub: Institution has already approved this donation");
        
        // check if donation exists
        require(donorDonations[_donor][_index].amount > 0, "ChainDonorHub: Donation does not exist");

        // increment approvals
        donorDonations[_donor][_index].approvals += 1;
        approvedBy[_donor][_index][_msgSender()] = true;

        emit DonationApproved(_msgSender(), _donor, _index);
    }

    // Claim a reward
    function claimReward(uint256 _index) public onlyDonor {
        // check if donation was approved by at least 51 of insitutions
        require(donorDonations[_msgSender()][_index].approvals * 2 > totalInstitutions, "ChainDonorHub: Not enough approvals");
        // check if reward was not claimed yet
        require(!donorDonations[_msgSender()][_index].claimed, "ChainDonorHub: Already claimed");

        uint256 amount = donorDonations[_msgSender()][_index].amount;

        // transfer tokens to donor
        token.mint(_msgSender(), amount);

        // mark reward as claimed
        donorDonations[_msgSender()][_index].claimed = true;

        emit DonationClaimed(_msgSender(), amount);
    }
}
