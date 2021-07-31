import React from 'react'
import './header.css'

const Header = () => {
  return (
    <header>
      <div className="logo">
        <h3>SmartToken</h3>
      </div>
      <div className="info-box">
        <span id="network">Network</span>
        <span id="address">0x453B7140A2B077760C37d2087627c6450c56F3aE</span>
      </div>
    </header>
  )
}

export default Header
