// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BloodToken.sol";

contract ChainDonorHub is Ownable {
    // State variables

    BloodToken public token; // ERC-20 token used for rewards
    
    MedicalInstitution[] public medicalInstitutions; // list of registered medical institutions
    // medical wallet => medical index
    mapping(address => uint256) private medicalInstitutionIndex; // map of donor indexes
    // medical wallet => bool
    mapping(address => bool) public isMedicalInstitution; // map of registered medical institutions
    uint256 public totalInstitutions = 0; // To calculate the 51% consensus
    
    // donors
    Donor[] public donors; // list of donors
    // donor wallet => donor index
    mapping(address => uint256) private donorIndex; // map of donor indexes
    // donor wallet => bool
    mapping(address => bool) public isDonor; // map of donors

     // donor wallet => donation index => Donation
    mapping(address => uint256[]) public donorDonations; // map of donations per donor
    Donation[] public donations; // list of donations
    // donation index => institution wallet => bool
    mapping(uint256 => mapping(address => bool)) approvedBy; // To check if an institution has already approved a donation; 

    // Structs

    struct MedicalInstitution {
        address wallet; // Wallet address
        bool isDeleted; // Whether the institution has been deleted
    }

    struct Donation {
        address donor; // donor wallet address
        uint256 amount; // Amount of tokens donated
        uint256 approvals; // Number of approvals
        bool claimed; // Whether the reward has been claimed
        bool isApproved; // Whether the donation has been approved
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
        require(isMedicalInstitution[_msgSender()] == true, "ChainDonorHub: Sender is not a medical institution");
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
        require(!isMedicalInstitution[_institution], "ChainDonorHub: Institution already registered");
        medicalInstitutions.push(MedicalInstitution({
            wallet: _institution,
            isDeleted: false
        }));
        isMedicalInstitution[_institution] = true;
        medicalInstitutionIndex[_institution] = medicalInstitutions.length - 1;
        totalInstitutions += 1;
        emit InstitutionAdded(_institution);
    }

    // Remove medical institutions
    function removeMedicalInstitution(address _institution) public onlyOwner {
        isMedicalInstitution[_institution] = false;
        medicalInstitutions[medicalInstitutionIndex[_institution]].isDeleted = true;
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
        require(isDonor[_donor], "ChainDonorHub: Donor not registered");
        require(_amount > 0, "ChainDonorHub: Amount must be greater than 0");
        
        Donation memory newDonation = Donation({
            amount: _amount,
            approvals: 0,
            claimed: false,
            donor: _donor,
            isApproved: false
        });

        // add donation
        donations.push(newDonation);
        donorDonations[_donor].push(donations.length - 1);

        emit DonationCreated(_donor, _amount);
    }

    // Approve a donation
    function approveDonation(uint256 _index) public onlyMedicalInstitution {
        // check if donation was not approved yet
        require(!approvedBy[_index][_msgSender()], "ChainDonorHub: Institution has already approved this donation");
        
        // check if donation exists
        require(_index < donations.length, "ChainDonorHub: Donation does not exist");

        // increment approvals
        donations[_index].approvals += 1;
        approvedBy[_index][_msgSender()] = true;

        // check if donation was approved by at least 51 of insitutions
        if (donations[_index].approvals * 2 > totalInstitutions) {
            donations[_index].isApproved = true;
        }

        emit DonationApproved(_msgSender(), donations[_index].donor, _index);
    }

    // Claim a reward
    function claimReward(uint256 _index) public onlyDonor {
        // check if donation was approved by at least 51 of insitutions
        require(donations[_index].isApproved, "ChainDonorHub: Not enough approvals");
        // check if reward was not claimed yet
        require(!donations[_index].claimed, "ChainDonorHub: Already claimed");

        uint256 amount = donations[_index].amount;

        // transfer tokens to donor
        token.mint(_msgSender(), amount);

        // mark reward as claimed
        donations[_index].claimed = true;

        emit DonationClaimed(_msgSender(), amount);
    }

    function totalDonors() public view returns(uint256) {
        return donors.length;
    }

    function totalDonations() public view returns(uint256) {
        return donations.length;
    }
}
