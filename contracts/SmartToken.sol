//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BondingCurve.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

 contract SmartToken is BondingCurve, ERC20Capped {

   constructor(string memory _name, string memory _symbol, uint256 _maxSupply) public ERC20(_name, _symbol)  ERC20Capped(_maxSupply) {}

   function getBuyPrice(uint256 _amount) external returns (uint256) {
     uint256 tokenSupply = totalSupply();
     return calculatePurchaseReturn(tokenSupply, _amount);
   }

   function getSellPrice(uint256 _amount) external returns (uint256) {
     uint256 tokenSupply = totalSupply();
     return calculateSalesReturn(tokenSupply, _amount);
   }
 }