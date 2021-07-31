import React from 'react'
import './main.css'
import { Form, InputGroup, Button } from 'react-bootstrap'

const Main = () => {
  return (
    <div className="main-page">
      <div className="main">
        <div className="access-box">
          <div className="buy-sell">
            <Button variant="dark" className="buy">
              Buy
            </Button>
            <Button variant="dark" className="sell">
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
                <Form.Control type="number" />
                <InputGroup.Append>
                  <InputGroup.Text>TOK</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              {/* <span style={{ margin: 'auto' }} className="text-muted mx-auto">
                1 TOK = x DAI
              </span> */}
              <div className="button">
                <Button variant="dark" className="submit-btn">
                  Buy
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
