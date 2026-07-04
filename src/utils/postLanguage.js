const LANGUAGE_ORDER = ["kor", "eng"]
const LANGUAGE_LABELS = {
  kor: "KOR",
  eng: "ENG",
}
const LANGUAGE_MARKER_PATTERN = /<!--\s*language:(kor|eng)\s*-->/gi

export const getLanguageSections = html => {
  const matches = []
  let match

  LANGUAGE_MARKER_PATTERN.lastIndex = 0
  while ((match = LANGUAGE_MARKER_PATTERN.exec(html)) !== null) {
    matches.push({
      language: match[1].toLowerCase(),
      index: match.index,
      marker: match[0],
    })
  }

  if (matches.length === 0) {
    return null
  }

  return matches.reduce((sections, current, index) => {
    const start = current.index + current.marker.length
    const end = matches[index + 1]?.index ?? html.length

    return {
      ...sections,
      [current.language]: html.slice(start, end).trim(),
    }
  }, {})
}

export const getPostLanguages = html => {
  const languageSections = getLanguageSections(html)

  if (!languageSections) {
    return ["kor"]
  }

  return LANGUAGE_ORDER.filter(language => languageSections[language])
}

export const getLanguageLabel = language =>
  LANGUAGE_LABELS[language] || language.toUpperCase()
