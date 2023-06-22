export function useStorage() {
  const getItem = key => {
    const item = window.localStorage.getItem(key)
    return item
  }

  const setItem = (key, value) => {
    window.localStorage.setItem(key, value)
  }

  return { getItem, setItem }
}
