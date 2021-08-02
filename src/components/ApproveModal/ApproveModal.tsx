import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import { Modal, Form, InputGroup, Button } from 'react-bootstrap'
import { User } from '../../services/types'
import {
  getTOKBalance,
  getDAIBalance,
  getBuyPrice,
  initateBuy,
  approve,
} from '../../services/utils'

interface IndexProps {
  show: boolean
  onHide: () => void
  user: User
  setShow: (arg0: boolean) => void
}

const Index: React.FC<IndexProps> = ({
  show,
  onHide,
  user,
  setShow,
}: IndexProps) => {
  const [value, setValue] = useState<any | null>(null)
  const handleApprove = (e: any) => {
    e.preventDefault()
    console.log(value)

    if (value === 0) {
      return
    }
    console.log('hello2')
    approve(user, BigNumber.from(parseInt(value, 10)))
    setShow(false)
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Approve</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleApprove}>
          <InputGroup>
            <Form.Control
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="number"
            />
            <InputGroup.Append>
              <InputGroup.Text>DAI</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <div className="button">
            <Button type="submit" variant="success">
              Approve
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default Index
