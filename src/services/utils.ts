import { Contract } from 'ethers'
import IERC20ABI from './abis/IERC20.json'
import SmartTokenABI from './abis/SmartToken.json'
import { SMART_TOKEN_ADDRESSES, DAI_ADDRESSES } from './constants'
import { User } from './types'

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
  console.log('VIEW: ', SMART_TOKEN_ADDRESSES[network])
  const contract = new Contract(
    SMART_TOKEN_ADDRESSES[network],
    SmartTokenABI.abi,
    user.library?.getSigner().connectUnchecked(),
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

export const getTOKBalance = async (user: User): Promise<number> => {
  const contract = SmartTokenContract(user)
  const balance = contract.balanceOf(user.account)
  return balance
}

export const getDAIBalance = async (user: User): Promise<number> => {
  const contract = daiContract(user)
  const balance = await contract.balanceOf(user.account)
  return balance
}

// export const userCanBuy = async (user: User, amount: number) => {
//   const dai = daiContract(user)
//   const network: any = getNetwork(user.chainId)
//   const allowance = await dai.allowance(
//     user.account,
//     SMART_TOKEN_ADDRESSES[network],
//   )
//   const daiBal = await getDAIBalance(user)

//   if (daiBal < amount) {
//   }

//   if (allowance < amount) {
//   }
// }

// export const userCanSell = async (user: User, amount: number) => {}
