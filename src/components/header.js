import { Link, graphql, useStaticQuery } from "gatsby"
import React from "react"

function Header({ children }) {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          author {
            summary
          }
        }
      }
    }
  `)
  const subtitle = data.site.siteMetadata?.author?.summary

  return (
    <header className="global-header">
      <div className="header-brand">
        <div className="header-identity">
          <Link className="header-title" to="/">
            JuHeon&apos;s Dev
          </Link>
          {subtitle && <span className="header-subtitle">{subtitle}</span>}
        </div>
        {children && <div className="header-controls">{children}</div>}
      </div>
    </header>
  )
}

export default Header
