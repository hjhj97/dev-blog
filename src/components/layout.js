import * as React from "react"
import { Link } from "gatsby"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"

const Layout = ({ location, title, children }) => {
  deckDeckGoHighlightElement()
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  //if (isRootPath) {
  //  header = (
  //    <h1 className="main-heading">
  //      <Link to="/">{title}</Link>
  //    </h1>
  //  )
  //} else {
  //  header = (
  //    <Link className="header-link-home" to="/">
  //      {title}
  //    </Link>
  //  )
  //}

  return (
    <div className="global-wrapper">
      <header className="global-header">
        <h1 className="main-heading">
          <Link to="/" className="header-text">
            {title}
          </Link>
        </h1>
      </header>
      <main>{children}</main>
      <footer className="global-footer">
        © <a href="https://github.com/hjhj97">Neon</a>, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
