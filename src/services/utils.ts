import { Contract, BigNumber } from 'ethers'
import IERC20ABI from './abis/IERC20.json'
import SmartTokenABI from './abis/SmartToken.json'
import { SMART_TOKEN_ADDRESSES, DAI_ADDRESSES } from './constants'
import { User } from './types'

const options = { gasLimit: 286750 }

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
): Promise<number> => {
  const contract = SmartTokenContract(user)
  const buyPrice = await contract.getBuyPrice(amount)
  return buyPrice
}

export const userCanBuy = async (
  user: User,
  amount: BigNumber,
  setMessage: (arg0: string) => void,
): Promise<boolean> => {
  const dai = daiContract(user)
  const contract = SmartTokenContract(user)

  const network: any = getNetwork(user.chainId)
  const allowance = await dai.allowance(
    user.account,
    SMART_TOKEN_ADDRESSES[network],
  )
  const daiBal = await getDAIBalance(user)

  if (daiBal < amount) {
    setMessage(`Your DAI balance is insufficient for this order.`)
    return false
  }

  if (allowance < amount) {
    setMessage(
      `Set allowance for ${await getBuyPrice(
        user,
        amount,
      )} DAI to continue order.`,
    )
    return false
  }

  return true
}

export const buy = async (user: User, amount: BigNumber): Promise<string> => {
  const contract = SmartTokenContract(user)
  const buyPrice = await contract.getBuyPrice(amount)

  const tx = await contract.buy(amount, options)
  console.log(tx)
  return tx.hash
}

export const initateBuy = async (
  user: User,
  amount: BigNumber,
  setMessage: (arg0: string) => void,
) => {
  const canBuy = await userCanBuy(user, amount, setMessage)
  if (canBuy) {
    const price = await getBuyPrice(user, amount)
    await buy(user, amount)
  }
}

export const approve = async (user: User, amount: BigNumber) => {
  console.log('APPROVE CALLED...')
  const network: any = getNetwork(user.chainId)

  const dai = daiContract(user)
  const tx = await dai.approve(SMART_TOKEN_ADDRESSES[network], amount, options)
  console.log('TX: ', tx)
}
// export const userCanSell = async (user: User, amount: number) => {}
