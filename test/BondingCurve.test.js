const { expect } = require("chai");

describe("BondingCurve", () => {
  let bondingCurve;
  let tokenSupply;

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
    const realAmount = ((1/2)*purchaseAmount**2) - ((1/2)*tokenSupply**2);
    expect(amount).to.equal(realAmount)
  })

  it("should get the correct amount to sell tokens when token supply is 10", async () => {
    tokenSupply = 10
    const saleAmount = 10;
    const amount = await bondingCurve.calculateSalesReturn(tokenSupply, saleAmount)
    const realAmount = ((1/2)*tokenSupply**2) - ((1/2)*(tokenSupply - saleAmount)**2);
    expect(amount).to.equal(realAmount)
  })
})
