import { parseDocument } from "htmlparser2"
import { getLanguageSections } from "./postLanguage.js"

const OMITTED_ELEMENTS = new Set([
  "script",
  "style",
  "noscript",
  "svg",
  "pre",
  "figure",
  "figcaption",
])

const getText = node => {
  if (OMITTED_ELEMENTS.has(node.name)) return ""
  if (node.type === "text") return node.data
  if (node.name === "br") return " "
  return (node.children || []).map(getText).join("")
}

export const getPostPreview = (html, language = "kor") => {
  if (!html) return ""

  const sections = getLanguageSections(html)
  const content = sections ? sections[language] || "" : html
  const paragraphs = []
  const collectParagraphs = node => {
    if (OMITTED_ELEMENTS.has(node.name)) return
    if (node.name === "p") {
      const text = getText(node).replace(/\s+/g, " ").trim()
      if (text) paragraphs.push(text)
      return
    }
    node.children?.forEach(collectParagraphs)
  }

  collectParagraphs(parseDocument(content))
  const text = paragraphs.join(" ")
  const limit = language === "eng" ? 320 : 180
  if (text.length <= limit) return text

  const preview = text
    .slice(0, limit)
    .replace(/\s+\S*$/, "")
    .trimEnd()
  return `${preview}...`
}
