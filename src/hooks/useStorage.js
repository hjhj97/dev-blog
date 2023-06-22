import { localStorage } from "../utils/storage"
export function useStorage() {
  const getItem = key => {
    const item = localStorage?.getItem(key)
    return item
  }

  const setItem = (key, value) => {
    localStorage?.setItem(key, value)
  }

  return { getItem, setItem }
}
