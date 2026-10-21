const assert = require("node:assert/strict")
const test = require("node:test")
const { createRequire } = require("node:module")
const katexPlugin = require("gatsby-remark-katex")
const config = require("../../gatsby-config")

const fromTransformer = createRequire(
  require.resolve("gatsby-transformer-remark/package.json")
)
const remark = fromTransformer("remark")
const gfm = fromTransformer("remark-gfm")
const toHast = fromTransformer("mdast-util-to-hast")
const toHtml = fromTransformer("hast-util-to-html")

function render(markdown) {
  const parser = remark().use(gfm)
  for (const plugin of katexPlugin.setParserPlugins()) parser.use(plugin)
  const markdownAST = parser.parse(markdown)
  katexPlugin({ markdownAST })
  return toHtml(toHast(markdownAST))
}

test("enables math in Gatsby's Markdown pipeline", () => {
  const transformer = config.plugins.find(
    plugin => plugin.resolve === "gatsby-transformer-remark"
  )
  assert(transformer.options.plugins.includes("gatsby-remark-katex"))
})

test("renders inline math with accessible MathML", () => {
  const html = render("Layer $\\ell$ uses strength $\\alpha=+1$.")
  assert.equal((html.match(/class="katex"/g) || []).length, 2)
  assert.match(html, /<math[\s>]/)
  assert.match(html, /class="katex-html" aria-hidden="true"/)
  assert.doesNotMatch(html, /katex-error/)
})

test("renders display equations, subscripts and fractions", () => {
  const html = render(String.raw`$$
v_\ell^m = \operatorname{mean}_{x \in P_m} h_\ell(x)
- \operatorname{mean}_{x \in N_m} h_\ell(x).
$$

$$
h_{\ell,t} \leftarrow h_{\ell,t} + \alpha v_\ell^m.
$$

$$
\frac{\|Q^\top \bar d_p\|^2}{\|\bar d_p\|^2}
$$`)
  assert.equal((html.match(/class="katex-display"/g) || []).length, 3)
  assert.match(html, /<mfrac>/)
  assert.doesNotMatch(html, /katex-error/)
})

test("renders math in tables while leaving inline and fenced code unchanged", () => {
  const html = render(
    [
      "| Strength | Value |",
      "| --- | --- |",
      "| $\\alpha$ | $+1$ |",
      "",
      "`$not_math$`",
      "",
      "```js",
      "const price = '$5';",
      "```",
    ].join("\n")
  )
  assert.match(html, /<table>/)
  assert.equal((html.match(/class="katex"/g) || []).length, 2)
  assert.match(html, /<code>\$not_math\$<\/code>/)
  assert.match(html, /const price = '\$5';/)
})
