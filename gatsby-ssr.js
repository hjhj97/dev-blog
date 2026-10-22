/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

import * as React from "react"
import sansRegular from "@fontsource/noto-sans-kr/files/noto-sans-kr-latin-400-normal.woff2"
import sansBold from "@fontsource/noto-sans-kr/files/noto-sans-kr-latin-700-normal.woff2"
import serifBold from "@fontsource/noto-serif-kr/files/noto-serif-kr-latin-700-normal.woff2"

export { wrapRootElement } from "./src/hooks/useLanguage"

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: `ko` })
  // Match the font CSS URLs so preload and rendering share one request.
  setHeadComponents(
    [sansRegular, sansBold, serifBold].map(href => (
      <link
        key={href}
        rel="preload"
        href={href}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    ))
  )
}
