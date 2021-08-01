import React, { useEffect, useState, useRef } from 'react'
import debounce from 'lodash.debounce'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { MetaMask } from '../../connectors'
import './main.css'
import PendingTxModal from './PendingTxModal'
import Message from '../Message/Message'
import ApproveModal from '../ApproveModal/ApproveModal'
import { User } from '../../services/types'
import { getTOKBalance, getDAIBalance, getBuyPrice } from '../../services/utils'

interface MainProps {
  account: string
  chainId: number
  library: any
}

const getUser = (chainId?: number, account?: any, library?: any): User => {
  const user = {
    account,
    chainId,
    library,
  }
  return user
}

const Main = () => {
  const {
    active,
    activate,
    library,
    account,
    error,
    chainId,
  } = useWeb3React<Web3Provider>()

  const [value, setValue] = useState<any>(null)
  const [rAccount, setAccount] = useState<any>(null)
  const [rChainId, setChainId] = useState<any>(null)
  const [rLibrary, setLibrary] = useState<any>(null)
  const [buy, setBuy] = useState<boolean>(true)
  const [sell, setSell] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [daiBalance, setDaiBalance] = useState<string>('')
  const [tokBalance, setTokBalance] = useState<string>('')
  const [buyPrice, setBuyPrice] = useState<number>(1)
  const [user, setUser] = useState<any | null>(null)
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    async function getBalances() {
      const dai = await getDAIBalance(getUser(chainId, account, library))
      const tok = await getTOKBalance(getUser(chainId, account, library))
      console.log('ME_11: ', active, rChainId, rAccount, rLibrary)
      setDaiBalance((dai / 10 ** 18).toString())
      setTokBalance((tok / 10 ** 18).toString())
    }

    if (active) {
      activate(MetaMask)
      setAccount(account)
      setChainId(chainId)
      setLibrary(library)
      setUser(getUser(chainId, account, library))
      getBalances()
      console.log('ME_1: ', active, rChainId, rAccount, rLibrary)
    }
  }, [active, activate, library, account, chainId])

  const debounced = useRef(
    debounce((nextValue) => {
      setValue(nextValue)
      console.log('ME: ', rChainId, rAccount, rLibrary)
      getBuyPrice(getUser(chainId, account, library), parseInt(nextValue, 10))
    }, 1000),
  ).current

  return (
    <div className="main-page">
      <ApproveModal show={show} onHide={() => setShow(false)} />
      <PendingTxModal />
      <div className="main">
        <div className="balance-div mb-4">
          <div className="bln">
            <span className="bal-name">DAI Balance</span>
            <span>{`${daiBalance} DAI`}</span>
          </div>
          <div className="bln">
            <span className="bal-name">TOK Balance</span>
            <span>{`${tokBalance} TOK`}</span>
          </div>
        </div>
        {message && (
          <Message variant="danger">
            <span className="text-center">{message}</span>
            <i
              style={{ float: 'right', cursor: 'pointer', marginTop: '5px' }}
              className="far fa-times-circle"
              onClick={() => setMessage('')}
              onKeyDown={() => setMessage('')}
              aria-hidden="true"
            />
          </Message>
        )}
        <div className="access-box">
          <div className="buy-sell mb-2">
            <Button
              onClick={() => {
                setSell((prev) => !prev)
                setBuy((prev) => !prev)
              }}
              variant="outline"
              className={`buy ${buy && `borderr`}`}
            >
              Buy
            </Button>
            <Button
              onClick={() => {
                setBuy((prev) => !prev)
                setSell((prev) => !prev)
              }}
              variant="outline"
              className={`sell ${sell && `borderr`}`}
            >
              Sell
            </Button>
          </div>
          <div className="top">
            <span>input</span>
          </div>
          <div className="form">
            <Form>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={value}
                  onChange={(e) => {
                    debounced(e.target.value)
                  }}
                />
                <InputGroup.Append>
                  <InputGroup.Text>TOK</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              {value && (
                <div className="info-span">
                  <span className="text-muted">
                    {value} TOK = {buyPrice} DAI
                  </span>
                </div>
              )}
              <div className="button">
                <Button variant="dark" className="submit-btn">
                  {buy ? 'Buy' : 'Sell'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
        {buy && (
          <div className="approve-text">
            <span
              onClick={() => setShow(true)}
              onKeyDown={() => setShow(true)}
              aria-hidden="true"
            >
              <b>Set Approval</b>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Main
