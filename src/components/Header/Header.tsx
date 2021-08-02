import React from 'react'
import './header.css'

interface HeaderProps {
  network: string
  account: undefined | string | null
}

const Header: React.FC<HeaderProps> = ({ network, account }: HeaderProps) => {
  return (
    <header>
      <div className="logo">
        <h3>SmartToken</h3>
      </div>
      <div className="info-box">
        <span id="network">{network || 'Network'}</span>
        <span id="address">{account || 'Account'}</span>
      </div>
    </header>
  )
}

export default Header
