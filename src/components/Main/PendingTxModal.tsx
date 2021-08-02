import React, { useEffect } from 'react'
import { Modal, Spinner } from 'react-bootstrap'

interface PendingTxModalProps {
  show: boolean
  onHide: () => void
  hash: string | null
  setTxShow: (arg0: boolean) => void
}

const PendingTxModal: React.FC<PendingTxModalProps> = ({
  show,
  onHide,
  hash,
  setTxShow,
}: PendingTxModalProps) => {
  const closeModal = () => {
    setTimeout(() => {
      setTxShow(false)
    }, 10000)
  }

  useEffect(() => {
    closeModal()
  })

  return (
    <div>
      <Modal show={show} onHide={onHide} centered>
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
            href={`https://rinkeby.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
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
