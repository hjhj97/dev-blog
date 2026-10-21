import { parseDocument, DomUtils } from "htmlparser2"

const headingPattern = /^h([1-6])$/i
const skippedElements = new Set(["pre", "code", "script", "style", "template"])

const headingText = node => {
  if (node.type === "text") return node.data
  if (node.name === "br") return " "
  if (node.attribs?.class?.split(/\s+/).includes("katex-mathml")) return ""
  return (node.children || []).map(headingText).join("")
}

export const getArticleOutline = html => {
  if (!html) return { html: "", headings: [] }
  const document = parseDocument(html)
  const nodes = []
  const reserved = new Set()
  const otherIds = new Set()
  const collect = (node, skipped = false) => {
    const excluded = skipped || skippedElements.has(node.name)
    const heading = !excluded && headingPattern.test(node.name || "")
    if (node.attribs?.id) {
      reserved.add(node.attribs.id)
      if (!heading) otherIds.add(node.attribs.id)
    }
    if (heading) nodes.push(node)
    node.children?.forEach(child => collect(child, excluded))
  }
  collect(document)

  const assigned = new Set(otherIds)
  const headings = []
  const ancestors = []
  nodes.forEach(node => {
    const text = headingText(node).replace(/\s+/g, " ").trim()
    if (!text) return
    let id = node.attribs.id
    if (!id || assigned.has(id)) {
      const slug = text
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-")
      const base = id || `section-${slug || "heading"}`
      id = base
      let suffix = 2
      while (reserved.has(id) || assigned.has(id)) id = `${base}-${suffix++}`
    }
    assigned.add(id)
    reserved.add(id)
    node.attribs.id = id
    node.attribs.tabindex ??= "-1"
    const level = Number(node.name[1])
    while (ancestors.length && ancestors.at(-1).level >= level) ancestors.pop()
    const heading = { id, text, level, children: [] }
    if (ancestors.length) ancestors.at(-1).children.push(heading)
    else headings.push(heading)
    ancestors.push(heading)
  })

  return {
    html: headings.length
      ? DomUtils.getOuterHTML(document, { encodeEntities: "utf8" })
      : html,
    headings,
  }
}
