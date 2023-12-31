// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Imports

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BloodToken is ERC20, Ownable {
    using SafeMath for uint256;

    // State variables

    address public _minter;

    // Constructor
    constructor() ERC20("BloodToken", "BLOOD") {
        
    }
    
    // Modifiers

    modifier onlyMinter() {
        require(_minter == _msgSender(), "BloodToken: caller is not the minter");
        _;
    }

    // allow to mint tokens to an address only by minter
    function mint(address account, uint256 amount) public onlyMinter {
        _mint(account, amount);
    }

    // allow to set minter only by owner
    function setMinter(address minter) public onlyOwner {
        _minter = minter;
    }

    // allow to burn tokens
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    // allow to burn tokens from an address
    function burnFrom(address account, uint256 amount) public {
        // Ensure allowance is sufficient before proceeding
        require(allowance(account, _msgSender()) >= amount, "ERC20: burn amount exceeds allowance");

        // Safely decrease allowance
        uint256 decreasedAllowance = allowance(account, _msgSender()).sub(amount);  // .sub() will revert if allowance < amount

        // Update allowance
        _approve(account, _msgSender(), decreasedAllowance);

        // Burn tokens
        _burn(account, amount);

    }
}