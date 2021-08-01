import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { MetaMask } from './connectors'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import { getNetwork } from './services/utils'

function App() {
  const {
    active,
    activate,
    library,
    account,
    error,
    chainId,
  } = useWeb3React<Web3Provider>()
  useEffect(() => {
    if (!active) {
      activate(MetaMask)
    }
  }, [active, library, activate, account, chainId])

  return (
    <div className="app">
      <>
        <Header
          network={chainId ? getNetwork(chainId) : ''}
          account={account}
        />
        <Main />
      </>
    </div>
  )
}

export default App
