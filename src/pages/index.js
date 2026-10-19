import React, { useMemo } from "react"
//import * as _ from "lodash"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Category from "../components/category"
import Research from "../components/research"
import { useCategory } from "../hooks/useCategory"
import { useLanguage } from "../hooks/useLanguage"
import { getPostPreview } from "../utils/postPreview"
import {
  formatPostDate,
  getLanguageLabel,
  getPostLanguages,
} from "../utils/postLanguage"

const LANGUAGES = ["kor", "eng"]

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const [currentCategory, selectCategory] = useCategory()
  const [language, setLanguage] = useLanguage()

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
  const filteredPosts = useMemo(
    () =>
      visiblePosts.filter(
        post =>
          currentCategory === "All" ||
          post.frontmatter.category === currentCategory
      ),
    [currentCategory, visiblePosts]
  )
  const leftColumnPosts = filteredPosts.filter((_, index) => index % 2 === 0)
  const rightColumnPosts = filteredPosts.filter((_, index) => index % 2 === 1)
  const previews = useMemo(
    () =>
      new Map(
        visiblePosts.map(post => [
          post.fields.slug,
          getPostPreview(post.html, language),
        ])
      ),
    [visiblePosts, language]
  )
  const renderPost = post => {
    const title =
      (language === "eng" && post.frontmatter.titleEn) ||
      post.frontmatter.title ||
      post.fields.slug
    const description =
      (language === "eng" && post.frontmatter.descriptionEn?.trim()) ||
      post.frontmatter.description?.trim()
    const preview = previews.get(post.fields.slug)
    return (
      <article
        key={post.fields.slug}
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <Link to={post.fields.slug} itemProp="url">
          <header>
            <h2>
              <span itemProp="headline">{title}</span>
            </h2>
            {description && (
              <p className="post-list-item__description" itemProp="description">
                {description}
              </p>
            )}
          </header>
          {preview && <p className="post-list-item__preview">{preview}</p>}
          <div className="post-list-item__bottom">
            <time className="post-date" dateTime={post.frontmatter.date}>
              {formatPostDate(post.frontmatter.date, language)}
            </time>
            <small className="post-category">{post.frontmatter.category}</small>
          </div>
        </Link>
      </article>
    )
  }

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
    <Layout
      location={location}
      title={siteTitle}
      headerContent={
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
      }
    >
      <div className="home-intro">
        <div className="home-intro-inner">
          <div className="hero-band">
            <Bio />
          </div>
          <Research />
        </div>
      </div>
      <section aria-labelledby="articles-heading">
        <h2 id="articles-heading" className="articles-heading">
          Articles
        </h2>
        <div className="post-list post-list--desktop">
          <div className="post-list-column">
            {leftColumnPosts.map(renderPost)}
          </div>
          <div className="post-list-column">
            <Category
              categories={categories}
              currentCategory={currentCategory}
              selectCategory={selectCategory}
            />
            {rightColumnPosts.map(renderPost)}
          </div>
        </div>
        <div className="post-list post-list--mobile">
          <Category
            categories={categories}
            currentCategory={currentCategory}
            selectCategory={selectCategory}
          />
          {filteredPosts.map(renderPost)}
        </div>
      </section>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" pathname="/" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: { category: { ne: null }, status: { ne: "progress" } }
      }
    ) {
      nodes {
        html
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          titleEn
          description
          descriptionEn
          keywords
          category
        }
      }
    }
  }
`
