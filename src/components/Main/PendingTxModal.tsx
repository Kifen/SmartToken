import React from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'

const show = true

const PendingTxModal = () => {
  return (
    <div>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Pending</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Spinner
            variant="success"
            animation="grow"
            className="mx-auto"
            size="sm"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary">View on Etherscan</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  )
}

export default PendingTxModal
