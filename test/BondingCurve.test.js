const { expect } = require("chai");
const { getSellPrice, getBuyPrice } = require("./testutils.js");

describe("BondingCurve", () => {
  let bondingCurve;
  let tokenSupply
  beforeEach( async () => {
    const BondingCurve = await ethers.getContractFactory("BondingCurve");
    bondingCurve = await BondingCurve.deploy();
    await bondingCurve.deployed();
  })

  it("should return the correct squared of a number", async () => {
    const x = 1000000
    const ret = await bondingCurve.exponent(x)
    expect(ret).to.equal(x**2)
  })

  it("should get the correct amount to purchase tokens when token supply is zero", async () => {
    tokenSupply = 0
    const purchaseAmount = 10;
    const amount = await bondingCurve.calculatePurchaseReturn(tokenSupply, purchaseAmount)
    const realAmount = getBuyPrice(tokenSupply, purchaseAmount);
    expect(amount).to.equal(realAmount)
  })

  it("should get the correct amount to sell tokens when token supply is 10", async () => {
    tokenSupply = 10
    const sellAmount = 10;
    const amount = await bondingCurve.calculateSalesReturn(tokenSupply, sellAmount)
    const realAmount = getSellPrice(tokenSupply, sellAmount);
    expect(amount).to.equal(realAmount)
  })
})
