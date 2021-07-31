const { expect, use } = require("chai");
const { getSellPrice, getBuyPrice } = require("./testutils.js");

describe("SmartToken", () => {
  let smartToken, mockReserveToken;
  let deployer, bob, tunji;

  const name = "SmartToken";
  const symbol = "TOK"
  const maxSupply = 1000000
  const buyAmount = 25
  let sellAmount = 25
  const mintMount = 2000
  let decimals = ethers.BigNumber.from(18)
  decimals = decimals.pow(ethers.BigNumber.from(10))

  const buy = async (buyer, amount) => {
    const buyPrice = await smartToken.getBuyPrice(amount)

    // approve SmartToken to transfer from bob's account
    await mockReserveToken.connect(buyer).approve(smartToken.address, buyPrice) 
    await smartToken.connect(buyer).buy(amount)
    return buyPrice
  }

  const sell = async (seller, amount) => {
    const sellPrice = await smartToken.getSellPrice(amount)
    await smartToken.connect(seller).sell(amount)
    return sellPrice
  }

  beforeEach( async () => {
    [deployer, bob, tunji] = await ethers.getSigners();
    // deploy mock reserve token
    const MockReserveToken = await ethers.getContractFactory("MockReserveToken");
    mockReserveToken = await MockReserveToken.deploy();
    await mockReserveToken.deployed();

    // deploy the SmartToken
    const SmartToken = await ethers.getContractFactory("SmartToken");
    smartToken = await SmartToken.deploy(name, symbol, maxSupply, mockReserveToken.address);
    await smartToken.deployed();
  })

  it("should get correct buy price", async () => {
    const totalSupply = await smartToken.totalSupply();
    const amount = 10;
    const buyPrice = await smartToken.getBuyPrice(amount)
    const expectedBuyPrice = getBuyPrice(parseInt(totalSupply), amount)

    expect(buyPrice).to.equal(expectedBuyPrice)
  })

  it("should get correct sell price", async () => {
    // Mint new tokens
    const tokens = ethers.BigNumber.from(25)
    await smartToken.mint(bob.address, tokens)

    const totalSupply = tokens
    const amount = 17
    const sellPrice = await smartToken.getSellPrice(amount)
    const expectedSellPrice = getSellPrice(parseInt(totalSupply), amount)
    expect(sellPrice).to.equal(expectedSellPrice)
  })

  it("should buy TOK with reserve token", async () => {
    const buyer = bob
    await mockReserveToken.mint(buyer.address, mintMount);
    const buyPrice = await buy(buyer, buyAmount)

    expect(await smartToken.totalSupply()).to.equal(25)
    expect(await mockReserveToken.balanceOf(buyer.address)).to.equal(mintMount - buyPrice)
    expect(await mockReserveToken.balanceOf(smartToken.address)).to.equal(buyPrice)
  })

  it("should sell TOK for reserve token", async () => {
    const user1 = bob
    const user2 = tunji
    sellAmount = 15

    await mockReserveToken.mint(user1.address, mintMount);
    await mockReserveToken.mint(user2.address, mintMount);

    //  purchase smart tokens
    const buyPrice1 = await buy(user1, buyAmount)
    const buyPrice2 = await buy(user2, buyAmount)

    const totalSupply = await smartToken.totalSupply()
    const mockReserveTokenBalance = await mockReserveToken.balanceOf(smartToken.address)
    expect(mockReserveTokenBalance).to.equal(parseInt(buyPrice1) + parseInt(buyPrice2))
    expect(totalSupply).to.equal(buyAmount * 2)

    const sellPrice = await sell(user1, sellAmount)

    expect(await smartToken.totalSupply()).to.equal( totalSupply - sellAmount)
    expect(await mockReserveToken.balanceOf(smartToken.address)).to.equal(mockReserveTokenBalance - sellPrice)
    expect(await smartToken.totalSupply()).to.equal(totalSupply - sellAmount)
  })
})
