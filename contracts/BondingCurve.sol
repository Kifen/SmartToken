//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BondingCurve{

 /* 
  * @dev given a token supply and a purchase amount
  * calculates the expected return in the continuos token
  *
  * Formula: (1/2 * (tokenSupply + purchaseAmount)^2) -  (1/2 * tokenSupply^2) 
  *
  * @param  _tokenSupply     token total supply
  * @param _purchaseAmount   amount of token to purchse 
  */
  function calculatePurchaseReturn(uint256 _tokenSupply, uint256 _purchaseAmount) public view returns (uint256) {
    uint256 upperBound =  exponent(_tokenSupply + _purchaseAmount)/2;
    uint256 lowerBoundBound =  exponent(_tokenSupply)/2;
    return upperBound - lowerBoundBound;
  }

  /*
  * @dev given a token supply and a sell amount
  * calculates the expected return in the reserve token
  *
  * Formula: (1/2 * tokenSupply^2) -  (1/2 * (tokenSupply - sellAmount)^2)
  *
  * @param  _tokenSupply     token total supply
  * @param _sellAmount       amount of token beign sold
  */
  function calculateSalesReturn(uint256 _tokenSupply, uint256 _sellAmount) public view returns (uint256) {
     uint256 upperBound =  exponent(_tokenSupply)/2;
    uint256 lowerBoundBound =  exponent(_tokenSupply - _sellAmount)/2;
    return upperBound - lowerBoundBound;
  }

  /* 
  * @dev calculates the square of a number
  * @param _x  
  */  
  function exponent(uint256 _x) public view returns (uint256) {
   return  _x*_x;
  }}