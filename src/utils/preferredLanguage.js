export const getPreferredLanguage = ({ languages, language } = {}) => {
  const locales =
    Array.isArray(languages) && languages.length > 0 ? languages : [language]

  for (const locale of locales) {
    if (typeof locale !== "string") continue
    const primaryLanguage = locale.toLowerCase().split("-")[0]
    if (primaryLanguage === "ko") return "kor"
    if (primaryLanguage === "en") return "eng"
  }

  return "eng"
}
