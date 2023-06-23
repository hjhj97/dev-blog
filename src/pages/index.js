import React, { useMemo } from "react"
//import * as _ from "lodash"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Category from "../components/category"
import { useCategory } from "../hooks/useCategory"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const [currentCategory, selectCategory] = useCategory()
  //const categories = _.uniq(posts.map(post => post.frontmatter?.category))

  const makeCategoryMap = () => {
    const map = new Map()
    posts.forEach(post => {
      const postCategory = post.frontmatter?.category
      const postCnt = map.get(postCategory) || 0
      map.set(postCategory, postCnt + 1)
    })
    return map
  }
  const categoryByMap = useMemo(makeCategoryMap, [])
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
      <Category
        categories={categories}
        currentCategory={currentCategory}
        selectCategory={selectCategory}
      />

      <ol className="post-list">
        {posts
          .filter(
            post =>
              currentCategory === "All" ||
              post.frontmatter.category === currentCategory
          )
          .map(post => {
            const title = post.frontmatter.title || post.fields.slug

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
                      <small>{post.frontmatter.date}</small>
                    </header>
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: post.frontmatter.description || title,
                        }}
                        itemProp="description"
                      />
                    </section>
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
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          description
          category
        }
      }
    }
  }
`
