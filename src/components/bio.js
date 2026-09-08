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
import { RESEARCH_INTERESTS } from "../constants/research"

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
      <div className="bio-content">
        <h3 className="bio-name">{`${author.name} ${author.nickname}`}</h3>
        <p className="bio-summary">{author?.summary || null}</p>
        <p className="bio-description">
          M.S. student (Ajou Univ., Artificial Intelligence)
        </p>
        <ul className="research-interests bio-interests">
          {RESEARCH_INTERESTS.map(interest => (
            <li key={interest} className="research-interest">
              {interest}
            </li>
          ))}
        </ul>
        <div className="bio-social">
          <a
            href={`https://github.com/${social.github}`}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
          >
            <GithubLogo />
          </a>
          <a
            href="https://www.linkedin.com/in/hajuheon/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
          >
            <LinkedinLogo />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Bio
