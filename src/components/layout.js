import * as React from "react"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"
import Header from "./header"

import { Helmet } from "react-helmet"

const Layout = ({ location, title, children }) => {
  deckDeckGoHighlightElement()

  //const rootPath = `${__PATH_PREFIX__}/`
  //const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper">
      <Helmet>
        <meta
          name="google-site-verification"
          content="ipkpV-iikKXN2GXEGSSXzjz8hakoFDcOsS6QCUUvS18"
        />
      </Helmet>
      <Header />
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
