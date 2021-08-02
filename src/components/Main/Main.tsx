import React, { useEffect, useState } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { MetaMask } from '../../connectors'
import './main.css'
import PendingTxModal from './PendingTxModal'
import Message from '../Message/Message'
import ApproveModal from '../ApproveModal/ApproveModal'
import { User } from '../../services/types'
import {
  getTOKBalance,
  getDAIBalance,
  initateBuy,
  initiateSell,
} from '../../services/utils'

const getUser = (chainId?: number, account?: any, library?: any): User => {
  const user = {
    account,
    chainId,
    library,
  }
  return user
}

const Main = () => {
  const { active, activate, library, account, chainId } = useWeb3React()
  let decimals = BigNumber.from(18)
  decimals = BigNumber.from(10).pow(decimals)

  const [value, setValue] = useState<any | null>(null)
  const [buy, setBuy] = useState<boolean>(true)
  const [sell, setSell] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [daiBalance, setDaiBalance] = useState<string>('')
  const [tokBalance, setTokBalance] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [txShow, setTxShow] = useState<boolean>(false)
  const [pendingHash, setPendingHash] = useState<string | any>('')

  useEffect(() => {
    async function getBalances() {
      let dai = await getDAIBalance(getUser(chainId, account, library))
      dai = dai.div(decimals)
      const daiBal = dai.toString()

      let tok = await getTOKBalance(getUser(chainId, account, library))
      tok = tok.div(decimals)
      const tokBal = tok.toString()

      setDaiBalance(daiBal)
      setTokBalance(tokBal)
    }

    if (active) {
      activate(MetaMask)
      getBalances()
    }
  }, [active, activate, library, account, chainId, decimals])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!value) return

    if (buy) {
      const buyAmount = BigNumber.from(value)
      const hash = await initateBuy(
        getUser(chainId, account, library),
        buyAmount,
        setMessage,
      )
      if (hash) {
        setPendingHash(hash)
        setTxShow(true)
      }
    } else {
      const sellAmount = BigNumber.from(value)
      const hash = await initiateSell(
        getUser(chainId, account, library),
        sellAmount,
        setMessage,
      )

      if (hash) {
        setPendingHash(hash)
        setTxShow(true)
      }
    }
  }

  return (
    <div className="main-page">
      <ApproveModal
        user={getUser(chainId, account, library)}
        show={show}
        onHide={() => setShow(false)}
        setShow={setShow}
        setPendingHash={setPendingHash}
        setTxShow={setTxShow}
      />
      <PendingTxModal
        show={txShow}
        onHide={() => setTxShow(false)}
        hash={pendingHash}
        setTxShow={setTxShow}
      />
      <div className="main">
        <div className="balance-div mb-4">
          <div className="bln">
            <span className="bal-name">DAI Balance</span>
            <span className="baln">{`${daiBalance} DAI`}</span>
          </div>
          <div className="bln">
            <span className="bal-name">TOK Balance</span>
            <span className="baln">{`${tokBalance} TOK`}</span>
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
            <span>Input</span>
          </div>
          <div className="form">
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Control
                  type="number"
                  required
                  placeholder="0"
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value, 10))}
                />
                <InputGroup.Append>
                  <InputGroup.Text>TOK</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              {/* {value && (
                <div className="info-span">
                  <span className="text-muted">
                    {value} TOK = {buyPrice} DAI
                  </span>
                </div>
              )} */}
              <div className="button">
                <Button type="submit" variant="dark" className="submit-btn">
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
