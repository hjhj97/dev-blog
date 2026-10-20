import React, { createContext, useContext, useEffect, useState } from "react"
import { getPreferredLanguage } from "../utils/preferredLanguage"

const STORAGE_KEY = "blog-language"
const LanguageContext = createContext(null)
const isLanguage = value => value === "kor" || value === "eng"

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("kor")

  useEffect(() => {
    // Resolve after hydration so the initial render matches Gatsby's HTML.
    let initialLanguage = getPreferredLanguage(window.navigator)
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (isLanguage(saved)) initialLanguage = saved
    } catch {
      // Browser language still works when storage is unavailable.
    }
    setLanguage(initialLanguage)

    const onStorage = event => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setLanguage(
          isLanguage(event.newValue)
            ? event.newValue
            : getPreferredLanguage(window.navigator)
        )
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const selectLanguage = value => {
    if (!isLanguage(value)) return
    setLanguage(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Navigation still preserves the selection within this session.
    }
  }

  return (
    <LanguageContext.Provider value={[language, selectLanguage]}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

export const wrapRootElement = ({ element }) => (
  <LanguageProvider>{element}</LanguageProvider>
)
