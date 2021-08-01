import React from 'react'
import './header.css'

interface HeaderProps {
  network: string
  account: any
}

const Header: React.FC<HeaderProps> = ({ network, account }: HeaderProps) => {
  return (
    <header>
      <div className="logo">
        <h3>SmartToken</h3>
      </div>
      <div className="info-box">
        <span id="network">{network}</span>
        <span id="address">{account}</span>
      </div>
    </header>
  )
}

export default Header
