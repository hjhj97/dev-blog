import * as React from "react"
import { ChevronDown, ListTree } from "lucide-react"

const OutlineList = ({ headings, activeId, onNavigate }) => (
  <ol>
    {headings.map(heading => (
      <li key={heading.id}>
        <a
          href={`#${encodeURIComponent(heading.id)}`}
          aria-current={activeId === heading.id ? "location" : undefined}
          onClick={event => onNavigate(event, heading.id)}
        >
          {heading.text}
        </a>
        {heading.children.length > 0 && (
          <OutlineList
            headings={heading.children}
            activeId={activeId}
            onNavigate={onNavigate}
          />
        )}
      </li>
    ))}
  </ol>
)

const ArticleToc = ({ headings, bodyRef, language }) => {
  const [expanded, setExpanded] = React.useState(false)
  const [activeId, setActiveId] = React.useState("")
  const listRef = React.useRef(null)
  const navigationFrame = React.useRef(null)
  const listId = React.useId()
  const label = language === "eng" ? "Contents" : "목차"

  React.useEffect(() => {
    setExpanded(false)
    const body = bodyRef.current
    const ids = new Set()
    const collectIds = items =>
      items.forEach(item => {
        ids.add(item.id)
        collectIds(item.children)
      })
    collectIds(headings)
    const elements = Array.from(
      body.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).filter(element => ids.has(element.id))
    let frame
    let hashFrame
    let disposed = false
    const update = () => {
      const offset = elements.length
        ? parseFloat(getComputedStyle(elements[0]).scrollMarginTop) || 0
        : 0
      let current = elements[0]?.id || ""
      for (const element of elements) {
        if (element.getBoundingClientRect().top > offset + 4) break
        current = element.id
      }
      setActiveId(current)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    const restoreHash = () => {
      let id
      try {
        id = decodeURIComponent(window.location.hash.slice(1))
      } catch {
        return
      }
      const target = elements.find(element => element.id === id)
      if (!target) return
      cancelAnimationFrame(hashFrame)
      hashFrame = requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "auto", block: "start" })
        schedule()
      })
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(body)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", restoreHash)
    schedule()
    restoreHash()
    // Saved language and web fonts can change layout after the browser's initial hash jump.
    const initialHash = window.location.hash
    document.fonts.ready.then(() => {
      if (!disposed && window.location.hash === initialHash) restoreHash()
    })
    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", restoreHash)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(hashFrame)
      cancelAnimationFrame(navigationFrame.current)
    }
  }, [headings, bodyRef])

  React.useEffect(() => {
    const list = listRef.current
    const current = list?.querySelector('[aria-current="location"]')
    if (!current || !list.clientHeight) return
    const itemRect = current.getBoundingClientRect()
    const listRect = list.getBoundingClientRect()
    if (itemRect.top < listRect.top)
      list.scrollTop += itemRect.top - listRect.top
    else if (itemRect.bottom > listRect.bottom) {
      list.scrollTop += itemRect.bottom - listRect.bottom
    }
  }, [activeId, expanded])

  const navigate = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = document.getElementById(id)
    if (!target || !bodyRef.current.contains(target)) return
    event.preventDefault()
    setExpanded(false)
    const hash = `#${encodeURIComponent(id)}`
    if (window.location.hash !== hash) {
      window.history.pushState(window.history.state, "", hash)
    }
    cancelAnimationFrame(navigationFrame.current)
    navigationFrame.current = requestAnimationFrame(() => {
      target.focus({ preventScroll: true })
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      })
    })
  }

  if (!headings.length) return null

  return (
    <nav className="article-toc" aria-label={label}>
      <div className="article-toc-title">
        <ListTree size={16} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <button
        className="article-toc-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setExpanded(value => !value)}
      >
        <ListTree size={16} aria-hidden="true" />
        <span>{label}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      <div
        id={listId}
        ref={listRef}
        className="article-toc-list"
        data-expanded={expanded}
      >
        <OutlineList
          headings={headings}
          activeId={activeId}
          onNavigate={navigate}
        />
      </div>
    </nav>
  )
}

export default ArticleToc
