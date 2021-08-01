import React from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'

const PendingTxModal = () => {
  return (
    <div>
      <Modal>
        <Modal.Header>
          <Modal.Title style={{ margin: 'auto' }}>
            Transaction Pending
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ margin: 'auto' }}>
          <Spinner
            variant="success"
            animation="border"
            className="mx-auto spin"
          />
        </Modal.Body>

        <Modal.Footer>
          <a
            href="/#"
            target="_blank"
            className="view-tx"
            style={{ margin: 'auto' }}
          >
            View on Etherscan
          </a>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PendingTxModal
