// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BloodToken.sol";

contract ChainDonorHub is Ownable {
    // State variables

    BloodToken public token; // ERC-20 token used for rewards
    // institution => bool
    mapping(address => bool) public medicalInstitutions; // map of registered medical institutions
    // donor wallet => donation index => Donation
    mapping(address => Donation[]) public donorDonations; // map of donations per donor
    // donors
    Donor[] public donors; // list of donors
    // donor wallet => donor index
    mapping(address => uint256) private donorIndex; // map of donor indexes
    // donor wallet => bool
    mapping(address => bool) public isDonor; // map of donors
    uint256 public totalInstitutions = 0; // To calculate the 51% consensus
    // donor wallet => donation index => institution wallet => bool
    mapping(address => mapping(uint256 => mapping(address => bool))) approvedBy; // To check if an institution has already approved a donation; 

    // Structs

    struct Donation {
        uint256 amount; // Amount of tokens donated
        uint256 approvals; // Number of approvals
        bool claimed; // Whether the reward has been claimed
    }

    struct Donor {
        bytes32 hashPersonalInfo; // Hashed personal information
        address wallet; // Wallet address
        bool isDeleted; // Whether the donor has been deleted
    }

    // Events

    event DonationCreated(address indexed donor, uint256 amount); // Event emitted when a new donation is created
    event DonationApproved(address indexed institution, address indexed donor, uint256 index); // Event emitted when a donation is approved
    event DonationClaimed(address indexed donor, uint256 amount); // Event emitted when a donation is claimed
    event InstitutionAdded(address institution); // Event emitted when a new institution is added
    event InstitutionRemoved(address institution); // Event emitted when an institution is removed

    // Modifiers

    // Only medical institutions can perform this action
    modifier onlyMedicalInstitution() {
        require(medicalInstitutions[_msgSender()] == true, "ChainDonorHub: Sender is not a medical institution");
        _;
    }

    modifier onlyDonor() {
        require(isDonor[_msgSender()] == true, "ChainDonorHub: Sender is not a donor");
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
        emit InstitutionAdded(_institution);
    }

    // Remove medical institutions
    function removeMedicalInstitution(address _institution) public onlyOwner {
        medicalInstitutions[_institution] = false;
        totalInstitutions -= 1;
        emit InstitutionRemoved(_institution);
    }

    // Register donors
    function registerDonor(bytes32 _hashPersonalInfo) public {
        require(!isDonor[_msgSender()], "ChainDonorHub: Donor already registered");
        Donor memory donor = Donor({
            hashPersonalInfo: _hashPersonalInfo,
            wallet: _msgSender(),
            isDeleted: false
        });
        donors.push(donor);
        donorIndex[_msgSender()] = donors.length - 1;
        isDonor[_msgSender()] = true;
    }

    // Remove donors
    function removeDonor() public {
        require(donors[donorIndex[_msgSender()]].wallet != address(0), "ChainDonorHub: Donor not registered");
        require(donors[donorIndex[_msgSender()]].isDeleted == false, "ChainDonorHub: Donor already deleted");
        donors[donorIndex[_msgSender()]].isDeleted = true;
        isDonor[_msgSender()] = false;
    }

    // Create a new donation
    function createDonation(address _donor, uint256 _amount) public onlyMedicalInstitution {
        require(donors[donorIndex[_donor]].wallet != address(0), "ChainDonorHub: Donor not registered");
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

    function getDonorCount() public view returns(uint256) {
        return donors.length;
    }
}
