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
      <div className="bio-top">
        <div className="bio-identity">
          <div className="bio-heading">
            <h3 className="bio-name">
              <span lang="ko">{author.name}</span>{" "}
              <span lang="en">{author.nickname}</span>
            </h3>
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
          <p className="bio-description" lang="en">
            I am an M.S. student in Artificial Intelligence at Ajou University.
          </p>
        </div>
        <StaticImage
          className="bio-avatar"
          layout="constrained"
          formats={["auto", "webp", "avif"]}
          src="../images/profile-2508.jpg"
          width={160}
          height={160}
          quality={100}
          alt="Profile picture"
        />
      </div>
      <div className="bio-content">
        <div className="bio-summary" lang="en">
          <p>
            My research focuses on <strong>LLM interpretability</strong>,{" "}
            <strong>human-centered AI</strong>, and{" "}
            <strong>AI safety and alignment</strong>, with particular interests
            in persona, emotion, and social bias in LLMs. I explore how AI can
            model human emotion and behavior, and the underlying model
            mechanisms that shape human-like behavior.
          </p>
          <p>
            Before beginning my graduate studies, I worked as a web
            developer.
          </p>
        </div>
        <ul className="research-interests bio-interests">
          {RESEARCH_INTERESTS.map(interest => (
            <li key={interest} className="research-interest">
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Bio
