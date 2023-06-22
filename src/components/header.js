import { Link } from "gatsby"
import React, { useState } from "react"
import { useStorage } from "../hooks/useStorage"

function Header() {
  const IS_FLICKERING = "isFlickering"
  const { getItem, setItem } = useStorage()
  const [isFlickering, setIsFlickering] = useState(
    getItem(IS_FLICKERING) || true
  )

  const handleChange = () => {
    setIsFlickering(!isFlickering)
    setItem(IS_FLICKERING, !isFlickering)
  }

  return (
    <header className="global-header">
      <Link to="/" className="header-neon">
        <b>
          Ju<span className={!isFlickering && "off"}>Heon</span>'s&nbsp;
          <span className={!isFlickering && "off"}>Dev</span>
        </b>
      </Link>
      <button onClick={handleChange} style={{ float: "right" }}>
        {isFlickering ? "off" : "on"}
      </button>
    </header>
  )
}

export default React.memo(Header)
