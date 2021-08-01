import React from 'react'
import { Modal, Form, InputGroup, Button } from 'react-bootstrap'

interface IndexProps {
  show: boolean
  onHide: () => void
}

const index: React.FC<IndexProps> = ({ show, onHide }: IndexProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Approve</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <InputGroup>
            <Form.Control type="number" />
            <InputGroup.Append>
              <InputGroup.Text>DAI</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <div className="button">
            <Button variant="success">Approve</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default index
