import { Contract, BigNumber } from 'ethers'
import IERC20ABI from './abis/IERC20.json'
import SmartTokenABI from './abis/SmartToken.json'
import { SMART_TOKEN_ADDRESSES, DAI_ADDRESSES } from './constants'
import { User } from './types'

const options = { gasLimit: 286750 }
let decimals = BigNumber.from(18)
decimals = BigNumber.from(10).pow(decimals)

export const getNetwork = (chainId?: number): string => {
  let network: string

  switch (chainId) {
    case 1:
      network = 'Mainnet'
      break
    case 3:
      network = 'Ropsten'
      break
    case 4:
      network = 'Rinkeby'
      break
    case 5:
      network = 'Goerli'
      break
    case 42:
      network = 'Kovan'
      break
    default:
      network = ''
  }

  return network
}

export const SmartTokenContract = (user: User): Contract => {
  const network: any = getNetwork(user.chainId)
  const contract = new Contract(
    SMART_TOKEN_ADDRESSES[network],
    SmartTokenABI.abi,
    user.library?.getSigner(),
  )

  return contract
}

export const daiContract = (user: User): Contract => {
  const network: any = getNetwork(user.chainId)
  const contract = new Contract(
    DAI_ADDRESSES[network],
    IERC20ABI.abi,
    user.library?.getSigner(),
  )

  return contract
}

export const getTOKBalance = async (user: User): Promise<BigNumber> => {
  const contract = SmartTokenContract(user)
  const balance = await contract.balanceOf(user.account)
  return balance
}

export const getDAIBalance = async (user: User): Promise<BigNumber> => {
  const contract = daiContract(user)
  const balance = await contract.balanceOf(user.account)
  return balance
}

export const getBuyPrice = async (
  user: User,
  amount: BigNumber,
  supply: BigNumber,
): Promise<number> => {
  const contract = SmartTokenContract(user)
  const buyPrice = await contract.getBuyPrice(amount, supply)
  return buyPrice
}

export const userCanBuy = async (
  user: User,
  amount: BigNumber,
  totalSupply: BigNumber,
  setMessage: (arg0: string) => void,
): Promise<boolean> => {
  const dai = daiContract(user)
  const network: any = getNetwork(user.chainId)
  const allowance = await dai.allowance(
    user.account,
    SMART_TOKEN_ADDRESSES[network],
  )
  const daiBal = await getDAIBalance(user)
  const realDailBal = parseInt(daiBal.div(decimals).toString(), 10)

  const buyPrice = await getBuyPrice(user, amount, totalSupply)
  const realBuyPrice = parseInt(buyPrice.toString(), 10)

  if (realDailBal < realBuyPrice) {
    setMessage(`Your DAI balance is insufficient for this order.`)
    return false
  }

  if (allowance.div(decimals) < buyPrice) {
    setMessage(`Set allowance for ${buyPrice} DAI to continue order.`)
    return false
  }

  return true
}

export const buy = async (user: User, amount: BigNumber): Promise<string> => {
  const contract = SmartTokenContract(user)
  const tx = await contract.buy(amount, options)
  return tx.hash
}

export const initateBuy = async (
  user: User,
  amount: BigNumber,
  setMessage: (arg0: string) => void,
) => {
  let hash
  const contract = SmartTokenContract(user)
  const totalSupply = await contract.totalSupply()
  const bnAmount = BigNumber.from(amount).mul(decimals)
  const canBuy = await userCanBuy(
    user,
    amount,
    totalSupply.div(decimals),
    setMessage,
  )

  if (canBuy) {
    hash = await buy(user, bnAmount)
  }

  return hash
}

export const approve = async (user: User, amount: BigNumber) => {
  const network: any = getNetwork(user.chainId)

  const dai = daiContract(user)
  const tx = await dai.approve(SMART_TOKEN_ADDRESSES[network], amount, options)
  return tx.hash
}

export const initiateSell = async (
  user: User,
  amount: BigNumber,
  setMessage: (arg0: string) => void,
) => {
  const contract = SmartTokenContract(user)
  let balance = await contract.balanceOf(user.account)
  balance = parseInt(balance.div(decimals).toString(), 10)

  if (balance < parseInt(amount.toString(), 10)) {
    setMessage(`Your TOK balance is insufficient for this order.`)
    return false
  }
  const sellAmount = BigNumber.from(amount).mul(decimals)
  const tx = await contract.sell(sellAmount)
  return tx.hash
}
