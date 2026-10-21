import parseSrcset from "parse-srcset"

export const getEnlargedImageSource = ({ src, srcSet, currentSrc, href }) => {
  const candidates = parseSrcset(srcSet || "")
  const largest = candidates.reduce((best, candidate) => {
    if (!best || (candidate.w || candidate.d || 1) > (best.w || best.d || 1)) {
      return candidate
    }
    return best
  }, null)

  // Generated candidates remain valid even when Markdown links use source-relative paths.
  if (largest) return largest.url
  if (href && /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(href)) {
    return href
  }
  return currentSrc || src
}
