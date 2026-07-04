import { Link } from "gatsby"
import React from "react"

function Header() {
  return (
    <header className="global-header">
      <div className="header-brand">
        <Link to="/">JuHeon&apos;s Dev</Link>
      </div>
    </header>
  )
}

export default Header
