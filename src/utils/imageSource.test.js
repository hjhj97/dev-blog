import assert from "node:assert/strict"
import test from "node:test"
import { getEnlargedImageSource } from "./imageSource.js"

test("prefers the largest generated asset over a source-relative image link", () => {
  assert.equal(
    getEnlargedImageSource({
      src: "/static/small.png",
      currentSrc: "/static/medium.png",
      srcSet: "/static/original.png 4967w, /static/small.png 630w",
      href: "./paper_review_images/poster.png",
    }),
    "/static/original.png"
  )
})

test("supports density descriptors and URLs with commas", () => {
  assert.equal(
    getEnlargedImageSource({
      srcSet: "https://example.com/image,large.png 2x, small.png 1x",
    }),
    "https://example.com/image,large.png"
  )
})

test("uses linked originals for non-responsive images, but not PDFs or pages", () => {
  assert.equal(
    getEnlargedImageSource({ src: "thumb.png", href: "original.PNG?v=2" }),
    "original.PNG?v=2"
  )
  for (const href of [
    "poster.pdf",
    "https://example.com/project/",
    undefined,
  ]) {
    assert.equal(
      getEnlargedImageSource({ src: "poster.png", href }),
      "poster.png"
    )
  }
})

test("uses the browser-selected source when no candidates or image links exist", () => {
  assert.equal(
    getEnlargedImageSource({
      src: "fallback.png",
      currentSrc: "selected.webp",
    }),
    "selected.webp"
  )
})
