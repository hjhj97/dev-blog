import assert from "node:assert/strict"
import test from "node:test"
import { getPreferredLanguage } from "./preferredLanguage.js"

test("maps Korean and English browser locales to supported blog languages", () => {
  for (const locale of ["ko", "ko-KR", "KO-kr"]) {
    assert.equal(getPreferredLanguage({ languages: [locale] }), "kor")
  }
  for (const locale of ["en", "en-US", "en-GB"]) {
    assert.equal(getPreferredLanguage({ languages: [locale] }), "eng")
  }
})

test("uses the first supported language in browser preference order", () => {
  assert.equal(getPreferredLanguage({ languages: ["en-US", "ko-KR"] }), "eng")
  assert.equal(
    getPreferredLanguage({ languages: ["fr-FR", "ko-KR", "en-US"] }),
    "kor"
  )
  assert.equal(
    getPreferredLanguage({ languages: ["en-US"], language: "ko-KR" }),
    "eng"
  )
})

test("falls back to navigator.language when the language list is unavailable", () => {
  assert.equal(getPreferredLanguage({ language: "ko-KR" }), "kor")
  assert.equal(
    getPreferredLanguage({ languages: [], language: "ko-KR" }),
    "kor"
  )
})

test("defaults to English when no supported browser language is available", () => {
  assert.equal(getPreferredLanguage({ languages: ["ja-JP", "fr-FR"] }), "eng")
  assert.equal(getPreferredLanguage(), "eng")
  assert.equal(getPreferredLanguage({ languages: [null, ""] }), "eng")
})
