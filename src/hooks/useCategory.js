import * as qs from "qs"
import { useEffect, useState } from "react"

export function useCategory() {
  const [category, setCategory] = useState("All")

  const selectCategory = category => {
    setCategory(category)
    window.history.pushState(
      { category },
      "",
      `${window.location.pathname}?category=${category}`
    )
  }

  useEffect(() => {
    const { category } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })
    const target = category == null ? "All" : category
    setCategory(target)
  }, [])

  return [category, selectCategory]
}
