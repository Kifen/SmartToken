import React, { useState } from 'react'
import './main.css'
import { Form, InputGroup, Button } from 'react-bootstrap'
import PendingTxModal from './PendingTxModal'

const Main = () => {
  const [value, setValue] = useState<any | null>(null)
  const [buy, setBuy] = useState<boolean>(true)
  const [sell, setSell] = useState<boolean>(false)
  return (
    <div className="main-page">
      <div className="main">
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
            <span className="text-muted bal">Balance:</span>
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
      </div>
    </div>
  )
}

export default Main
