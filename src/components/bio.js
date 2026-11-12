/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, withPrefix } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FileText } from "lucide-react"
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
              <a
                className="bio-cv"
                href={withPrefix("/JuHeon_Ha_CV_2026-10-19.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CV (PDF, opens in a new tab)"
              >
                <FileText size={24} aria-hidden="true" />
                <span className="bio-cv__tooltip" aria-hidden="true">
                  CV (PDF)
                </span>
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
            My research focuses on <strong>AI safety alignment</strong>,{" "}
            <strong>LLM interpretability</strong>, and{" "}
            <strong>Human-centered AI</strong>, particularly persona, emotion,
            and social bias in LLMs. I study how LLMs represent emotions and
            social context, adopt perspectives, express empathy, and respond to
            persona prompts. Building on my interpretability research, I aim to
            understand how post-training shapes the internal mechanisms
            underlying safe and unsafe behavior in LLMs.
          </p>
          <p>
            Before beginning my graduate studies, I worked as a web frontend
            engineer.
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
