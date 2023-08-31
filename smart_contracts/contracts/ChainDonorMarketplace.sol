// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BloodToken.sol";

contract ChainDonorMarketplace is Ownable {
    // State Variables

    BloodToken public token;
    mapping(address => bool) public charities;
    mapping(address => bool) public charityCandidates;
    mapping(address => mapping(address => bool)) public addCharityVotes;
    mapping(address => mapping(address => bool)) public removeCharityVotes;
    uint256 public totalCharities;

    // Structs

    struct Item {
        string name;
        uint256 cost;
        address charity;
        bool purchased;
        address purchasedBy;
    }

    Item[] public items;

    // Events

    event ItemAdded(string indexed name, uint256 indexed cost, address indexed charity);
    event ItemPurchased(address indexed donor, uint256 indexed itemId);
    event CharityAdded(address indexed charity);
    event CharityRemoved(address indexed charity);

    // Modifiers

    modifier onlyCharity() {
        require(charities[_msgSender()], "ChainDonorMarketplace: Sender is not a charity");
        _;
    }

    // Constructor

    constructor(address _tokenAddress) {
        token = BloodToken(_tokenAddress);
    }

    // Functions

    function addCharity(address _charity) public onlyOwner {
        require(!charities[_charity], "ChainDonorMarketplace: Charity already exists");
        charityCandidates[_charity] = true;
    }
    function addItem(string memory _name, uint256 _cost) public onlyCharity {
        items.push(Item(_name, _cost, _msgSender(), false, address(0)));
        emit ItemAdded(_name, _cost, _msgSender());
    }

    function approveAddCharity(address _charity) public onlyCharity {
        require(!charities[_charity], "ChainDonorMarketplace: Charity already approved");
        require(charityCandidates[_charity], "ChainDonorMarketplace: Charity does not exist");
        addCharityVotes[_charity][_msgSender()] = true;
        if(countVotes(addCharityVotes[_charity]) * 2 > totalCharities) {
            finalizeCharityAddition(_charity);
        }
    }

    function approveRemoveCharity(address _charity) public onlyCharity {
        require(charities[_charity], "ChainDonorMarketplace: Charity does not exist");
        removeCharityVotes[_charity][_msgSender()] = true;
        if(countVotes(removeCharityVotes[_charity]) * 2 > totalCharities) {
            finalizeCharityRemoval(_charity);
        }
    }

    function finalizeCharityAddition(address _charity) internal {
        charities[_charity] = true;
        totalCharities += 1;
        emit CharityAdded(_charity);
    }

    function finalizeCharityRemoval(address _charity) internal {
        charities[_charity] = false;
        totalCharities -= 1;
        emit CharityRemoved(_charity);
    }

    function purchaseItem(uint256 _itemId) public {
        require(_itemId < items.length, "ChainDonorMarketplace: Invalid item ID");

        Item storage item = items[_itemId];
        require(token.balanceOf(_msgSender()) >= item.cost, "ChainDonorMarketplace: Insufficient BloodTokens");

        // Burn tokens and mark item as purchased
        token.burnFrom(_msgSender(), item.cost);

        item.purchased = true;
        item.purchasedBy = _msgSender();

        emit ItemPurchased(_msgSender(), _itemId);
    }

    // Private helper function to count votes
    function countVotes(mapping(address => bool) storage votes) private view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < totalCharities; i++) {
            if (votes[_msgSender()]) {
                count += 1;
            }
        }
        return count;
    }
}
