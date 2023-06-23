import { localStorage } from "../utils/storage"
export function useStorage() {
  const getItem = key => {
    const item = localStorage?.getItem(key)

    if (!item) return
    return JSON.parse(item)
  }

  const setItem = (key, value) => {
    localStorage?.setItem(key, JSON.stringify(value))
  }

  return { getItem, setItem }
}
