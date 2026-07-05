import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Comment from "../components/comment"
import { getLanguageSections } from "../utils/postLanguage"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const [language, setLanguage] = React.useState("kor")
  const languageSections = React.useMemo(
    () => getLanguageSections(post.html),
    [post.html]
  )
  const hasLanguageTabs = Boolean(
    languageSections?.kor && languageSections?.eng
  )
  const title =
    language === "eng" && post.frontmatter.titleEn
      ? post.frontmatter.titleEn
      : post.frontmatter.title
  const articleHtml = hasLanguageTabs
    ? languageSections[language] || languageSections.kor
    : post.html

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{title}</h1>
          <div className="blog-post-bottom">
            <p>{post.frontmatter.date}</p>
            <Link to={`/?category=${post.frontmatter.category}`}>
              <p className="post-category">{post.frontmatter.category}</p>
            </Link>
          </div>
        </header>
        <hr />
        {hasLanguageTabs && (
          <div
            className="post-language-tabs"
            role="tablist"
            aria-label="Post language"
          >
            <button
              type="button"
              className={`post-language-tab ${
                language === "kor" ? "selected" : ""
              }`}
              role="tab"
              aria-selected={language === "kor"}
              onClick={() => setLanguage("kor")}
            >
              KOR
            </button>
            <button
              type="button"
              className={`post-language-tab ${
                language === "eng" ? "selected" : ""
              }`}
              role="tab"
              aria-selected={language === "eng"}
              onClick={() => setLanguage("eng")}
            >
              ENG
            </button>
          </div>
        )}
        <section
          dangerouslySetInnerHTML={{ __html: articleHtml }}
          itemProp="articleBody"
        />
        <hr />
        <footer className="post-footer">
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul>
          {previous && (
            <li>
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            </li>
          )}
          {next && (
            <li>
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <Comment />
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  const title = post.frontmatter.seoTitle || post.frontmatter.title
  const description =
    post.frontmatter.seoDescription ||
    post.frontmatter.description ||
    post.excerpt

  return (
    <Seo
      title={title}
      description={description}
      keywords={post.frontmatter.keywords}
      pathname={post.fields.slug}
      type="article"
      datePublished={post.frontmatter.date}
      dateModified={post.frontmatter.updated || post.frontmatter.date}
      category={post.frontmatter.category}
      image={post.frontmatter.ogImage}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        titleEn
        seoTitle
        date(formatString: "YYYY-MM-DD")
        updated(formatString: "YYYY-MM-DD")
        keywords
        description
        descriptionEn
        seoDescription
        ogImage
        category
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
