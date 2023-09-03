// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BloodToken.sol";

contract ChainDonorMarketplace is Ownable {
    // State Variables

    BloodToken public token; // ERC-20 token used for rewards
    Charity[] public charities; // List of registered charities
    mapping(address => bool) public isCharity; // Map of registered charities
    mapping(address => bool) public isApprovedCharity; // Map of approved charities
    uint256 public totalApprovedCharities; // To calculate the 51% consensus
    mapping(address => uint256) private charityIndex; // Map of charity indexes

    mapping(address => mapping(address => bool)) public addCharityVotes; // To check if a charity has already voted to add another charity
    mapping(address => mapping(address => bool)) public removeCharityVotes; // To check if a charity has already voted to remove another charity

    Item[] public items; // List of items

    // Structs

    struct Charity {
        address wallet;
        bool isDeleted;
        bool isApproved;
        uint256 totalAddVotes;
        uint256 totalRemoveVotes;
    }

    struct Item {
        string name;
        uint256 price;
        address charity;
        bool purchased;
        address purchasedBy;
    }

    // Events

    event ItemAdded(string indexed name, uint256 indexed cost, address indexed charity);
    event ItemPurchased(address indexed donor, uint256 indexed itemId);
    event CharityAdded(address indexed charity);
    event CharityRemoved(address indexed charity);

    // Modifiers

    modifier onlyCharity() {
        require(charities.length <= 1 || isApprovedCharity[_msgSender()], "ChainDonorMarketplace: Sender is not a charity");
        _;
    }

    // Constructor

    constructor(address _tokenAddress) {
        token = BloodToken(_tokenAddress);
    }

    // Functions

    function addCharity(address _charity) public onlyOwner {
        require(!isCharity[_charity], "ChainDonorMarketplace: Charity already exists");
        isCharity[_charity] = true;
        isApprovedCharity[_charity] = false;
        charities.push(Charity(_charity, false, false, 0, 0));
        charityIndex[_charity] = charities.length - 1;
    }

    function addItem(string memory _name, uint256 _price) public onlyCharity {
        items.push(Item(_name, _price, _msgSender(), false, address(0)));
        emit ItemAdded(_name, _price, _msgSender());
    }

    function approveAddCharity(address _charity) public onlyCharity {
        require(isCharity[_charity], "ChainDonorMarketplace: Charity does not exist");
        require(!isApprovedCharity[_charity], "ChainDonorMarketplace: Charity already approved");
        require(!addCharityVotes[_charity][_msgSender()], "ChainDonorMarketplace: Charity already voted");
        addCharityVotes[_charity][_msgSender()] = true;
        charities[charityIndex[_charity]].totalAddVotes += 1;
        if(charities[charityIndex[_charity]].totalAddVotes * 2 > totalApprovedCharities) {
            finalizeCharityAddition(_charity);
        }
    }

    function approveRemoveCharity(address _charity) public onlyCharity {
        require(isApprovedCharity[_charity], "ChainDonorMarketplace: Charity does not exist");
        require(!removeCharityVotes[_charity][_msgSender()], "ChainDonorMarketplace: Charity already voted");
        removeCharityVotes[_charity][_msgSender()] = true;
         charities[charityIndex[_charity]].totalRemoveVotes += 1;
        if(charities[charityIndex[_charity]].totalRemoveVotes * 2 > totalApprovedCharities) {
            finalizeCharityAddition(_charity);
        }
    }

    function finalizeCharityAddition(address _charity) internal {
        isApprovedCharity[_charity] = true;
        charities[charityIndex[_charity]].isApproved = true;
        totalApprovedCharities += 1;
        emit CharityAdded(_charity);
    }

    function finalizeCharityRemoval(address _charity) internal {
        charities[charityIndex[_charity]].isDeleted = true;
        isApprovedCharity[_charity] = false;
        totalApprovedCharities -= 1;
        emit CharityRemoved(_charity);
    }

    function purchaseItem(uint256 _itemId) public {
        require(_itemId < items.length, "ChainDonorMarketplace: Invalid item ID");

        Item storage item = items[_itemId];
        require(token.balanceOf(_msgSender()) >= item.price, "ChainDonorMarketplace: Insufficient BloodTokens");

        // Burn tokens and mark item as purchased
        token.burnFrom(_msgSender(), item.price);

        item.purchased = true;
        item.purchasedBy = _msgSender();

        emit ItemPurchased(_msgSender(), _itemId);
    }

    function totalCharities() public view returns (uint256) {
        return charities.length;
    }

    function totalItems() public view returns (uint256) {
        return items.length;
    }
}
