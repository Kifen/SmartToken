//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BondingCurve.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

 contract SmartToken is BondingCurve, ERC20Capped {

    IERC20 public immutable reserveToken; 

    // Events
    event Sell(address indexed seller, uint256 indexed amount, uint256 received);
    event Buy(address indexed buyer, uint256 indexed amount, uint256 paid);

   constructor(string memory _name, string memory _symbol, uint256 _maxSupply, IERC20 _token) public ERC20(_name, _symbol)  ERC20Capped(_maxSupply) {
     reserveToken = _token;
   }

  /* 
  * @dev returns the price to purchase `_amount` tokens
  * @param    _amount   number of tokens
  */
   function getBuyPrice(uint256 _amount) public returns (uint256) {
     uint256 tokenSupply = totalSupply();
     return calculatePurchaseReturn(tokenSupply, _amount);
   }

 /* 
  * @dev returns the price to sell `_amount` tokens
  * @param    _amount   number of tokens
  */
   function getSellPrice(uint256 _amount) public returns (uint256) {
     uint256 tokenSupply = totalSupply();
     return calculateSalesReturn(tokenSupply, _amount);
   }

   function buy(uint256 _amount) external {
     uint256 buyPrice = getBuyPrice(_amount);
     require(reserveToken.allowance(msg.sender, address(this)) >= buyPrice, "SmartToken: transfer amount exceeds allowance");

     reserveToken.transferFrom(msg.sender, address(this), buyPrice);
     _mint(msg.sender, _amount);
     emit Buy(msg.sender, _amount, buyPrice);
   }

   function sell(uint256 _amount) external {
      require(_amount > 0, "SmartToken: invalid sell amount");
      uint256 sellPrice = getSellPrice(_amount);
      _burn(msg.sender, _amount);
      reserveToken.transfer(msg.sender, sellPrice);

      emit Sell(msg.sender, _amount, sellPrice);
   }
 }