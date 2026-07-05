import { Link } from "gatsby"
import React from "react"

function Header({ children }) {
  return (
    <header className="global-header">
      <div className="header-brand">
        <Link to="/">JuHeon&apos;s Dev</Link>
        {children && <div className="header-controls">{children}</div>}
      </div>
    </header>
  )
}

export default Header
