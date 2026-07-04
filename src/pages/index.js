import React, { useMemo, useState } from "react"
//import * as _ from "lodash"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Category from "../components/category"
import { useCategory } from "../hooks/useCategory"
import {
  getLanguageLabel,
  getLanguageSections,
  getPostLanguages,
} from "../utils/postLanguage"

const LANGUAGES = ["kor", "eng"]
const PREVIEW_LENGTH = 150

const getPreviewText = (post, language) => {
  if (language === "eng") {
    const sections = getLanguageSections(post.html)
    if (sections?.eng) {
      const text = sections.eng
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
      return text.length > PREVIEW_LENGTH
        ? `${text.slice(0, PREVIEW_LENGTH)}…`
        : text
    }
  }
  return post.excerpt
}

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const [currentCategory, selectCategory] = useCategory()
  const [language, setLanguage] = useState("kor")

  const visiblePosts = useMemo(
    () => posts.filter(post => getPostLanguages(post.html).includes(language)),
    [posts, language]
  )

  const makeCategoryMap = () => {
    const map = new Map()
    visiblePosts.forEach(post => {
      const postCategory = post.frontmatter?.category
      const postCnt = map.get(postCategory) || 0
      map.set(postCategory, postCnt + 1)
    })
    return map
  }
  const categoryByMap = useMemo(makeCategoryMap, [visiblePosts])
  const categories = Array.from(categoryByMap, ([name, cnt]) => ({ name, cnt }))

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      <div className="list-controls">
        <Category
          categories={categories}
          currentCategory={currentCategory}
          selectCategory={selectCategory}
        />
        <div
          className="post-language-tabs"
          role="tablist"
          aria-label="Post list language"
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              type="button"
              role="tab"
              aria-selected={language === lang}
              className={`post-language-tab ${
                language === lang ? "selected" : ""
              }`}
              onClick={() => setLanguage(lang)}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      </div>

      <ol className="post-list">
        {visiblePosts
          .filter(
            post =>
              currentCategory === "All" ||
              post.frontmatter.category === currentCategory
          )
          .map(post => {
            const title =
              (language === "eng" && post.frontmatter.titleEn) ||
              post.frontmatter.title ||
              post.fields.slug
            const languages = getPostLanguages(post.html)

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <Link to={post.fields.slug} itemProp="url">
                    <header>
                      <h2>
                        <span itemProp="headline">{title}</span>
                      </h2>
                    </header>
                    <section>
                      <p itemProp="description">
                        {getPreviewText(post, language)}
                      </p>
                    </section>
                    <div className="post-list-item__bottom">
                      <small>{post.frontmatter.date}</small>
                      <div className="post-list-item__meta">
                        <span
                          className="post-language-badges"
                          aria-label={`Languages: ${languages
                            .map(getLanguageLabel)
                            .join(", ")}`}
                        >
                          {languages.map(language => (
                            <small
                              key={language}
                              className="post-language-badge"
                            >
                              {getLanguageLabel(language)}
                            </small>
                          ))}
                        </span>
                        <small className="post-category">
                          {post.frontmatter.category}
                        </small>
                      </div>
                    </div>
                  </Link>
                </article>
              </li>
            )
          })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { category: { ne: null } } }
    ) {
      nodes {
        excerpt(pruneLength: 150, truncate: true)
        html
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          titleEn
          description
          keywords
          category
        }
      }
    }
  }
`
