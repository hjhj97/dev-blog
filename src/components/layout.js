import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
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
          <Link to="/" class="header-text">
            {title}
          </Link>
        </h1>
      </header>
      <main style={{ marginTop: "8rem" }}>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
