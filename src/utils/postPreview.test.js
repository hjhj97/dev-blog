import assert from "node:assert/strict"
import test from "node:test"
import { getPostPreview } from "./postPreview.js"

test("extracts prose and decodes entities without including image labels or code blocks", () => {
  const html = `
    <h2>A heading</h2>
    <p><img src="cover.png" alt="demo_image1" /></p>
    <style>.hidden { display: none; }</style>
    <script>doNotRun()</script>
    <pre><code>const example = 1</code></pre>
    <figure><figcaption><p>A caption</p></figcaption></figure>
    <p>One <strong>important</strong> idea &amp; another.<br>Next line.</p>
    <p>Use <code>nextTick()</code> with care.</p>
  `
  assert.equal(
    getPostPreview(html),
    "One important idea & another. Next line. Use nextTick() with care."
  )
})

test("keeps previews within the requested language section", () => {
  const html = `
    <!-- language:kor --><p>Korean section.</p>
    <!-- language:eng --><p>English section.</p>
  `
  assert.equal(getPostPreview(html, "kor"), "Korean section.")
  assert.equal(getPostPreview(html, "eng"), "English section.")
  assert.equal(
    getPostPreview("<!-- language:kor --><p>Only Korean.</p>", "eng"),
    ""
  )
})

test("handles legacy posts, blank content and posts without prose", () => {
  assert.equal(getPostPreview("<p>A legacy post.</p>"), "A legacy post.")
  assert.equal(getPostPreview(null), "")
  assert.equal(getPostPreview(""), "")
  assert.equal(getPostPreview('<p><img src="a.png" alt="image" /></p>'), "")
  assert.equal(getPostPreview("<p> &nbsp; </p>"), "")
})

test("limits preview length without cutting an English word", () => {
  const content = "A thoughtful paragraph about learning and research. ".repeat(
    20
  )
  for (const [language, limit] of [
    ["kor", 180],
    ["eng", 320],
  ]) {
    const preview = getPostPreview(`<p>${content}</p>`, language)
    assert(preview.length <= limit + 3)
    assert(preview.endsWith("..."))
    assert(content.startsWith(`${preview.slice(0, -3)} `))
  }
})
