import * as React from "react"
import { Link } from "gatsby"
import { ArrowLeft } from "lucide-react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { useLanguage } from "../hooks/useLanguage"

const AboutPage = ({ location }) => {
  const [language] = useLanguage()

  return (
    <Layout location={location}>
      <article className="about-page">
        <header>
          <Link to="/" aria-label={language === "eng" ? "Home" : "홈으로"}>
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <h1>About my story</h1>
        </header>
        <Bio />
      </article>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="About my story"
    pathname="/about/"
    description="JuHeon Ha, an M.S. student in Artificial Intelligence at Ajou University. Research interests and background."
  />
)

export default AboutPage
