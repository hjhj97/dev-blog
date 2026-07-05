/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const normalizeUrl = (siteUrl, pathname = "") => {
  if (!pathname) {
    return null
  }

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "")
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`

  return `${normalizedSiteUrl}${normalizedPathname}`
}

const removeEmptyValues = object =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value)
  )

const Seo = ({
  authorName,
  category,
  children,
  dateModified,
  datePublished,
  description,
  image,
  keywords,
  pathname,
  title,
  type = "website",
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            author {
              name
            }
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const metaKeywords = keywords || site.siteMetadata?.keywords
  const siteUrl = site.siteMetadata?.siteUrl
  const canonicalUrl = siteUrl ? normalizeUrl(siteUrl, pathname) : null
  const isArticle = type === "article"
  const resolvedAuthorName =
    authorName || site.siteMetadata?.author?.name || defaultTitle
  const absoluteImageUrl =
    image && siteUrl && image.startsWith("/")
      ? normalizeUrl(siteUrl, image)
      : image
  const structuredData = isArticle
    ? [
        removeEmptyValues({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description: metaDescription,
          datePublished,
          dateModified: dateModified || datePublished,
          author: resolvedAuthorName && {
            "@type": "Person",
            name: resolvedAuthorName,
          },
          publisher: resolvedAuthorName && {
            "@type": "Person",
            name: resolvedAuthorName,
          },
          mainEntityOfPage: canonicalUrl && {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
          url: canonicalUrl,
          image: absoluteImageUrl,
          articleSection: category,
        }),
        removeEmptyValues({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: siteUrl,
            },
            category && {
              "@type": "ListItem",
              position: 2,
              name: category,
              item: `${siteUrl}/?category=${encodeURIComponent(category)}`,
            },
            canonicalUrl && {
              "@type": "ListItem",
              position: category ? 3 : 2,
              name: title,
              item: canonicalUrl,
            },
          ].filter(Boolean),
        }),
      ]
    : [
        removeEmptyValues({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: defaultTitle,
          description: site.siteMetadata.description,
          url: siteUrl,
        }),
      ]

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={defaultTitle} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {absoluteImageUrl && (
        <meta property="og:image" content={absoluteImageUrl} />
      )}
      {isArticle && datePublished && (
        <meta property="article:published_time" content={datePublished} />
      )}
      {isArticle && (dateModified || datePublished) && (
        <meta
          property="article:modified_time"
          content={dateModified || datePublished}
        />
      )}
      {isArticle && category && (
        <meta property="article:section" content={category} />
      )}
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta
        name="twitter:card"
        content={absoluteImageUrl ? "summary_large_image" : "summary"}
      />
      {site.siteMetadata?.social?.twitter && (
        <meta
          name="twitter:creator"
          content={site.siteMetadata.social.twitter}
        />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {absoluteImageUrl && (
        <meta name="twitter:image" content={absoluteImageUrl} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  )
}

export default Seo
