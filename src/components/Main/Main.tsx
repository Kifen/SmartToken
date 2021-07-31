import React from 'react'
import './main.css'
import { Form, InputGroup, Button } from 'react-bootstrap'

const Main = () => {
  return (
    <div className="main">
      <div className="access-box">
        <div className="buy-sell">
          <Button className="buy">Buy</Button>
          <Button className="sell">Sell</Button>
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
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Main
