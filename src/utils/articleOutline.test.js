import assert from "node:assert/strict"
import test from "node:test"
import { parseDocument, DomUtils } from "htmlparser2"
import { getArticleOutline } from "./articleOutline.js"

test("builds a hierarchy from rendered Markdown and raw HTML headings", () => {
  const result = getArticleOutline(
    '<h2 id="intro">Intro</h2><h3>Details</h3><h5>Deep dive</h5><h3>Next</h3><h2>Conclusion</h2>'
  )
  assert.equal(result.headings.length, 2)
  assert.equal(result.headings[0].id, "intro")
  assert.deepEqual(
    result.headings[0].children.map(item => item.text),
    ["Details", "Next"]
  )
  assert.equal(result.headings[0].children[0].children[0].level, 5)
  assert.equal(result.headings[1].text, "Conclusion")
  assert.match(result.html, /tabindex="-1"/)
})

test("preserves authored anchors and prevents collisions with all existing IDs", () => {
  const result = getArticleOutline(
    '<div id="section-intro"></div><h2>Intro</h2><h2 id="section-intro-2">Other</h2><h2 id="saved">First</h2><h2 id="saved">Second</h2><h2>Intro</h2>'
  )
  assert.deepEqual(
    result.headings.map(item => item.id),
    [
      "section-intro-3",
      "section-intro-2",
      "saved",
      "saved-2",
      "section-intro-4",
    ]
  )
})

test("handles Korean text, inline formatting, entities and skipped heading levels", () => {
  const result = getArticleOutline(
    "<h1>연구 <em>결과</em> &amp; 해석</h1><h4>다음<br>단계</h4><h6>!!!</h6>"
  )
  assert.equal(result.headings[0].text, "연구 결과 & 해석")
  assert.equal(result.headings[0].id, "section-연구-결과-해석")
  assert.equal(result.headings[0].children[0].text, "다음 단계")
  assert.equal(result.headings[0].children[0].children[0].id, "section-heading")
})

test("does not turn code samples or empty headings into navigation", () => {
  const html =
    "<pre><code>&lt;h2&gt;Example&lt;/h2&gt;</code></pre><template><h2>Hidden</h2></template><h2> </h2>"
  assert.deepEqual(getArticleOutline(html), { html, headings: [] })
  assert.deepEqual(getArticleOutline(null), { html: "", headings: [] })
})

test("preserves images, links, math and language markers during serialization", () => {
  const html =
    '<!-- language:kor --><h2>Title</h2><a href="/paper?a=1&amp;b=2"><img src="/static/figure.png" srcset="/a.png 630w, /b.png 1260w" alt="A &amp; B"></a><span class="katex"><math><mi>α</mi></math></span>'
  const result = getArticleOutline(html)
  const document = parseDocument(result.html)
  const image = DomUtils.findOne(node => node.name === "img", document.children)
  assert.equal(image.attribs.srcset, "/a.png 630w, /b.png 1260w")
  assert.equal(image.attribs.alt, "A & B")
  assert.equal(image.parent.attribs.href, "/paper?a=1&b=2")
  assert.match(result.html, /<!-- language:kor -->/)
  const mathText = DomUtils.findOne(
    node => node.name === "mi",
    document.children
  )
  assert.equal(DomUtils.textContent(mathText), "α")
  assert.deepEqual(getArticleOutline(result.html).headings, result.headings)
})
