import { Link } from "gatsby"
import React from "react"

function Header() {
  console.log("header")
  const [isNeonFlicker, setIsNeonFlicker] = React.useState(true)
  return (
    <header className="global-header">
      <Link to="/" className="header-neon">
        <b>
          Ju<span className={!isNeonFlicker && "off"}>Heon</span>'s&nbsp;
          <span className={!isNeonFlicker && "off"}>Dev</span>
        </b>
      </Link>
      {/*<button
        onClick={() => setIsNeonFlicker(prev => !prev)}
        style={{ float: "right" }}
      >
        {isNeonFlicker ? "off" : "on"}
      </button>*/}
    </header>
  )
}

export default React.memo(Header)
