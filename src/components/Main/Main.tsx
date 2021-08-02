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
  approve,
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
  const { active, activate, library, account, error, chainId } = useWeb3React()
  let decimals = BigNumber.from(18)
  decimals = BigNumber.from(10).pow(decimals)

  const [value, setValue] = useState<any | null>(null)
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
  const [txShow, setTxShow] = useState<boolean>(false)
  const [pendingHash, setPendingHash] = useState<string | any>('')

  useEffect(() => {
    async function getBalances() {
      let dai = await getDAIBalance(getUser(chainId, account, library))
      console.log(dai.toString(), decimals.toString())
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
      setAccount(account)
      setChainId(chainId)
      setLibrary(library)
      setUser(getUser(chainId, account, library))
      getBalances()
    }
  }, [active, activate, library, account, chainId])

  const handleSubmit = async (e: any) => {
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
    }
  }

  const handleApprove = (e: any) => {
    e.preventDefault()
    if (!e.target.value) return

    const approveAmount = BigNumber.from(parseInt(e.target.value, 10)).mul(
      decimals,
    )
    approve(getUser(chainId, account, library), approveAmount)
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
            <span>Input</span>
          </div>
          <div className="form">
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Control
                  type="number"
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
