//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BondingCurve{

  function calculatePurchaseReturn(uint256 _tokenSupply, uint256 _purchaseAmount) external view returns (uint256) {
    uint256 upperBound =  exponent(_tokenSupply + _purchaseAmount)/2;
    uint256 lowerBoundBound =  exponent(_tokenSupply)/2;
    return upperBound - lowerBoundBound;
  }

  function calculateSalesReturn(uint256 _tokenSupply, uint256 _saleAmount) external view returns (uint256) {
     uint256 upperBound =  exponent(_tokenSupply)/2;
    uint256 lowerBoundBound =  exponent(_tokenSupply - _saleAmount)/2;
    return upperBound - lowerBoundBound;
  }

  function exponent(uint256 _x) public view returns (uint256) {
   return  _x*_x;
  }
}