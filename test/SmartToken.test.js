const { expect } = require("chai");
const { getSellPrice, getBuyPrice } = require("./testutils.js");

describe("SmartToken", () => {
  let smartToken, mockReserveToken;
  let deployer, bob, tunji;

  const name = "SmartToken";
  const symbol = "TOK"
  const maxSupply = 1000000
  let decimals = ethers.BigNumber.from(18)
  decimals = decimals.pow(ethers.BigNumber.from(10))

  beforeEach( async () => {
    [deployer, bob, tunji] = await ethers.getSigners();
    // deploy mock reserve token
    const MockReserveToken = await ethers.getContractFactory("MockReserveToken");
    mockReserveToken = await MockReserveToken.deploy()
    await mockReserveToken.deployed();

    // deploy the SmartToken
    const SmartToken = await ethers.getContractFactory("SmartToken");
    smartToken = await SmartToken.deploy(name, symbol, maxSupply, mockReserveToken.address);
    await smartToken.deployed();
  })

  it("should get correct buy price", async () => {
    const totalSupply = await smartToken.totalSupply()
    const amount = 10
    const buyPrice = await smartToken.getBuyPrice(amount)
    const expectedBuyPrice = getBuyPrice(parseInt(totalSupply), amount)

    expect(buyPrice).to.equal(expectedBuyPrice)
  })

  it("should get correct sell price", async () => {
    // Mint new tokens
    const tokens = ethers.BigNumber.from(25)
    await smartToken.mint(bob.address, tokens)

    const totalSupply = await smartToken.totalSupply()
    const amount = 16
    const sellPrice = await smartToken.getSellPrice(amount)
    const expectedSellPrice = getSellPrice(parseInt(totalSupply), amount)
    expect(sellPrice).to.equal(expectedSellPrice)
  })
})
