import React, { useState } from 'react'
import './main.css'
import { Form, InputGroup, Button } from 'react-bootstrap'
import PendingTxModal from './PendingTxModal'
import Message from '../Message/Message'
import ApproveModal from '../ApproveModal/ApproveModal'

const Main = () => {
  const [value, setValue] = useState<any | null>(null)
  const [buy, setBuy] = useState<boolean>(true)
  const [sell, setSell] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  return (
    <div className="main-page">
      <ApproveModal show={show} onHide={() => setShow(false)} />
      <div className="main">
        <div className="balance-div mb-4">
          <div className="bln">
            <span className="bal-name">DAI Balance</span>
            <span>x DAI</span>
          </div>
          <div className="bln">
            <span className="bal-name">TOK Balance</span>
            <span>x TOK</span>
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
                  onChange={(e) => setValue(e.target.value)}
                />
                <InputGroup.Append>
                  <InputGroup.Text>TOK</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              {value && (
                <div className="info-span">
                  <span className="text-muted">{value} TOK = x DAI</span>
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
