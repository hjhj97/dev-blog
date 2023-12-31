import { Link } from "gatsby"
import React, { useEffect, useState } from "react"
import { useStorage } from "../hooks/useStorage"
import Switch from "react-switch"

function Header() {
  const IS_FLICKERING = "isFlickering"
  const { getItem, setItem } = useStorage()
  const [isFlickering, setIsFlickering] = useState(true)

  const handleChange = () => {
    setIsFlickering(!isFlickering)
    setItem(IS_FLICKERING, !isFlickering)
  }
  useEffect(() => {
    setIsFlickering(getItem(IS_FLICKERING))
  }, [])

  return (
    <header className="global-header">
      <div className="header-neon">
        <Link to="/">
          <b>
            Ju<span className={!isFlickering && "off"}>Heon</span>'s&nbsp;
            <span className={!isFlickering && "off"}>Dev</span>
          </b>
        </Link>
      </div>

      <div className="header-switch">
        <Switch
          onChange={handleChange}
          checked={isFlickering}
          checkedIcon={<span className="header-switch__text left">off</span>}
          uncheckedIcon={<span className="header-switch__text right">on</span>}
          onColor="#6282e3"
        />
      </div>
    </header>
  )
}

export default Header
