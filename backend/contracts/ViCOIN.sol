// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ViCOIN is ERC20, Ownable {
    constructor() ERC20("ViCOIN", "ViC") {
        _mint(msg.sender, 20000 * 10 ** decimals());
        // _mint(msg.sender, 2000);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

}