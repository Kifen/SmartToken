import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import { Modal, Form, InputGroup, Button } from 'react-bootstrap'
import { User } from '../../services/types'
import { approve } from '../../services/utils'

interface IndexProps {
  show: boolean
  onHide: () => void
  user: User
  setShow: (arg0: boolean) => void
  setTxShow: (arg0: boolean) => void
  setPendingHash: (arg0: string | undefined) => void
}

const Index: React.FC<IndexProps> = ({
  show,
  onHide,
  user,
  setShow,
  setTxShow,
  setPendingHash,
}: IndexProps) => {
  const [value, setValue] = useState<any | null>(null)
  let decimals = BigNumber.from(18)
  decimals = BigNumber.from(10).pow(decimals)

  const handleApprove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (value === 0) {
      return
    }
    const tx = await approve(
      user,
      BigNumber.from(parseInt(value, 10)).mul(decimals),
    )
    setPendingHash(tx)
    setShow(false)
    setTxShow(true)
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title style={{ margin: 'auto' }}>Approve</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleApprove}>
          <InputGroup>
            <Form.Control
              required
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
