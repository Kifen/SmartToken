//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BondingCurve.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

 contract SmartToken is BondingCurve, ERC20, Ownable {

    IERC20 public immutable reserveToken; 

    // Events
    event Sell(address indexed seller, uint256 indexed amount, uint256 received);
    event Buy(address indexed buyer, uint256 indexed amount, uint256 paid);

   constructor(string memory _name, string memory _symbol, IERC20 _token) public ERC20(_name, _symbol)  {
     reserveToken = _token;
   }

   function buy(uint256 _amount) external {
     uint256 tokenSupply = totalSupply()/1e18;
     uint256 buyPrice = calculatePurchaseReturn(tokenSupply, _amount/1e18);
     buyPrice = buyPrice * 1e18;

     require(reserveToken.allowance(msg.sender, address(this)) >= buyPrice, "SmartToken: transfer amount exceeds allowance");

     reserveToken.transferFrom(msg.sender, address(this), buyPrice);
     _mint(msg.sender, _amount);
     emit Buy(msg.sender, _amount, buyPrice);
   }

   function sell(uint256 _amount) external {
      require(_amount > 0, "SmartToken: invalid sell amount");
      uint256 tokenSupply = totalSupply()/1e18;
      uint256 sellPrice = calculateSalesReturn(tokenSupply, _amount/1e18);
      sellPrice = sellPrice * 1e18;

      _burn(msg.sender, _amount);
      reserveToken.transfer(msg.sender, sellPrice);

      emit Sell(msg.sender, _amount, sellPrice);
   }

   function mint(address _account, uint256 _amount) public onlyOwner {
     _mint(_account, _amount);
   }
 }