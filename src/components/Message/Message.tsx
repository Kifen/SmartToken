import React from 'react'
import { Alert } from 'react-bootstrap'

interface MessageProps {
  variant: string
  children: React.ReactNode
}

const Message: React.FC<MessageProps> = ({
  variant,
  children,
}: MessageProps) => {
  return (
    <Alert className="mb-3 alert-" variant={variant}>
      {children}
    </Alert>
  )
}

export default Message
