const { expect, use } = require('chai')
const { getSellPrice, getBuyPrice } = require('./testutils.js')

describe('SmartToken', () => {
  let smartToken, mockReserveToken
  let deployer, bob, tunji

  const name = 'SmartToken'
  const symbol = 'TOK'
  const maxSupply = 1000000

  let decimals = ethers.BigNumber.from(18)
  decimals = ethers.BigNumber.from(10).pow(decimals)

  const mintMount = ethers.BigNumber.from(2000).mul(decimals)

  const buyAmount = ethers.BigNumber.from(25).mul(decimals)
  let sellAmount = ethers.BigNumber.from(15).mul(decimals)

  const buy = async (buyer, amount) => {
    let totalSupply = (await smartToken.totalSupply()).div(decimals)
    const buyPrice = await smartToken.calculatePurchaseReturn(
      totalSupply,
      amount.div(decimals),
    )
    // approve SmartToken to transfer from bob's account
    await mockReserveToken
      .connect(buyer)
      .approve(
        smartToken.address,
        ethers.BigNumber.from(buyPrice).mul(decimals),
      )
    await smartToken.connect(buyer).buy(amount)
    return buyPrice
  }

  const sell = async (seller, amount) => {
    let totalSupply = (await smartToken.totalSupply()).div(decimals)
    const sellPrice = await smartToken.calculateSalesReturn(
      totalSupply,
      amount.div(decimals),
    )
    await smartToken.connect(seller).sell(amount)
    return sellPrice
  }

  beforeEach(async () => {
    ;[deployer, bob, tunji] = await ethers.getSigners()
    // deploy mock reserve token
    const MockReserveToken = await ethers.getContractFactory('MockReserveToken')
    mockReserveToken = await MockReserveToken.deploy()
    await mockReserveToken.deployed()

    // deploy the SmartToken
    const SmartToken = await ethers.getContractFactory('SmartToken')
    smartToken = await SmartToken.deploy(name, symbol, mockReserveToken.address)
    await smartToken.deployed()
  })

  describe('Buy', () => {
    it('should get correct buy price', async () => {
      const totalSupply = await smartToken.totalSupply()
      const amount = 1
      const buyPrice = await smartToken.calculatePurchaseReturn(
        amount,
        totalSupply,
      )
      const expectedBuyPrice = getBuyPrice(parseInt(totalSupply), amount)

      expect(buyPrice).to.equal(expectedBuyPrice)
    })

    it('should buy TOK with reserve token', async () => {
      const buyer = bob
      await mockReserveToken.mint(buyer.address, mintMount)
      const buyPrice = await buy(buyer, buyAmount)

      expect(await smartToken.totalSupply()).to.equal(buyAmount)
      expect(await mockReserveToken.balanceOf(buyer.address)).to.equal(
        mintMount.sub(buyPrice.mul(decimals)),
      )
      expect(await mockReserveToken.balanceOf(smartToken.address)).to.equal(
        buyPrice.mul(decimals),
      )
    })

    it('should fail to buy if allowance is insufficient', async () => {
      const buyer = bob
      await mockReserveToken.mint(buyer.address, mintMount)
      await expect(smartToken.connect(buyer).buy(buyAmount)).to.be.revertedWith(
        'SmartToken: transfer amount exceeds allowance',
      )
    })
  })

  describe('Sell', () => {
    it('should get correct sell price', async () => {
      // Mint new tokens
      await smartToken.mint(bob.address, sellAmount)

      let totalSupply = (await smartToken.totalSupply()).div(decimals)
      const sellPrice = await smartToken.calculateSalesReturn(
        sellAmount.div(decimals),
        totalSupply,
      )

      totalSupply = parseInt(totalSupply.toString())
      const expectedSellPrice = getSellPrice(
        totalSupply,
        parseInt(sellAmount.div(decimals).toString()),
      )
      expect(sellPrice).to.equal(expectedSellPrice)
    })

    it('should sell TOK for reserve token', async () => {
      const user1 = bob
      const user2 = tunji
      await mockReserveToken.mint(user1.address, mintMount)
      await mockReserveToken.mint(user2.address, mintMount)

      //  purchase smart tokens
      let buyPrice1 = await buy(user1, buyAmount)
      buyPrice1 = buyPrice1.mul(decimals)

      let buyPrice2 = await buy(user2, buyAmount)
      buyPrice2 = buyPrice2.mul(decimals)

      const totalSupply = await smartToken.totalSupply()
      const mockReserveTokenBalance = await mockReserveToken.balanceOf(
        smartToken.address,
      )
      expect(mockReserveTokenBalance).to.equal(buyPrice1.add(buyPrice2))
      expect(totalSupply).to.equal(buyAmount.mul(ethers.BigNumber.from(2)))

      // sell smart tokens
      let sellPrice = await sell(user1, sellAmount)
      sellPrice = sellPrice.mul(decimals)

      expect(await smartToken.totalSupply()).to.equal(
        totalSupply.sub(sellAmount),
      )
      expect(await mockReserveToken.balanceOf(smartToken.address)).to.equal(
        mockReserveTokenBalance.sub(sellPrice),
      )
      expect(await smartToken.totalSupply()).to.equal(
        totalSupply.sub(sellAmount),
      )
    })
  })
})
