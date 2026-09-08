import * as React from "react"
import GithubLogo from "../images/logo/GithubLogo"

const PUBLICATIONS = [
  {
    title:
      "Empathy Is Steerable but Multi-Axial: Mechanism Geometry and Persona Effects in LLMs",
    venue: "EMNLP 2026 Main Conference",
    role: "First Author",
    year: "2026",
    projectPage:
      "https://hjhj97.github.io/Empathy-Is-Steerable-but-Multi-Axial/",
    paper:
      "https://hjhj97.github.io/Empathy-Is-Steerable-but-Multi-Axial/Empathy_Is_Steerable_But_Multi_Axial__Mechanism_Geometry_and_Persona_Effects_in_LLM_camera.pdf",
    repository:
      "https://github.com/hjhj97/Empathy-Is-Steerable-but-Multi-Axial",
    abstract:
      "This work investigates the activation-level structure of supportive empathy in instruction-tuned LLMs. Using the EPITOME framework and contrastive activation steering, we examine the controllability and representational geometry of emotional reactions, interpretations, and explorations, as well as their interaction with persona-induced activation shifts.",
  },
]

const Research = () => {
  const structuredData = PUBLICATIONS.map(publication => ({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: publication.title,
    name: publication.title,
    author: {
      "@type": "Person",
      name: "JuHeon Ha",
      alternateName: "하주헌",
      url: "https://juheon.dev",
    },
    datePublished: publication.year,
    publisher: {
      "@type": "Organization",
      name: publication.venue,
    },
    url: publication.projectPage,
    sameAs: [publication.repository, publication.paper],
    abstract: publication.abstract,
  }))

  return (
    <section className="research" aria-labelledby="research-heading">
      <div className="research-inner">
        <h2 id="research-heading" className="research-heading">
          Publications
        </h2>
        {PUBLICATIONS.map(publication => (
          <article
            key={publication.title}
            className="publication"
            itemScope
            itemType="https://schema.org/ScholarlyArticle"
          >
            <h4 className="publication-title">
              <a
                href={publication.projectPage}
                target="_blank"
                rel="noreferrer"
                itemProp="url"
              >
                <span itemProp="headline">{publication.title}</span>
              </a>
            </h4>
            <p className="publication-venue">
              <span className="publication-venue-name">
                {publication.venue}
              </span>
              <span className="publication-role">{publication.role}</span>
            </p>
            <details className="publication-details">
              <summary className="publication-summary">
                <span className="publication-summary-label">Abstract</span>
                <svg
                  className="publication-chevron"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="publication-abstract" itemProp="abstract">
                {publication.abstract}
              </p>
            </details>
            <div className="publication-links">
              <a
                className="publication-link"
                href={publication.projectPage}
                target="_blank"
                rel="noreferrer"
              >
                Project Page
              </a>
              <a
                className="publication-link"
                href={publication.paper}
                target="_blank"
                rel="noreferrer"
              >
                Paper (PDF)
              </a>
              <a
                className="publication-link publication-link--repo"
                href={publication.repository}
                target="_blank"
                rel="noreferrer"
              >
                <GithubLogo />
                Repository
              </a>
            </div>
          </article>
        ))}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </div>
    </section>
  )
}

export default Research
