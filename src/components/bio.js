/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import GithubLogo from "../images/logo/GithubLogo"
import LinkedinLogo from "../images/logo/LinkedinLogo"
import TistoryLogo from "../images/logo/TistoryLogo"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            nickname
            summary
          }
          social {
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social
  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-2508.jpg"
        width={120}
        height={120}
        quality={100}
        alt="Profile picture"
        style={{ minWidth: "120px" }}
      />
      <div>
        <h3 className="bio-name">{`${author.name} ${author.nickname}`}</h3>
        <p>{author?.summary || null}</p>
        <div className="bio-social">
          <a href={`https://github.com/${social.github}`} target="_blank">
            <GithubLogo />
          </a>
          <a
            href={`https://www.linkedin.com/in/%EC%A3%BC%ED%97%8C-%ED%95%98-38805a218/`}
            target="_blank"
          >
            <LinkedinLogo />
          </a>
          <a href={`https://ps-hjhj97.tistory.com/`} target="_blank">
            <TistoryLogo />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Bio
