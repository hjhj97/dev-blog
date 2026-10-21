import * as React from "react"
import { getEnlargedImageSource } from "../utils/imageSource"

const ArticleBody = ({ html, language }) => {
  const bodyRef = React.useRef(null)
  const dialogRef = React.useRef(null)
  const triggerRef = React.useRef(null)
  const [image, setImage] = React.useState(null)
  const [failed, setFailed] = React.useState(false)
  const english = language === "eng"
  const closeLabel = english ? "Close image" : "이미지 닫기"

  React.useEffect(() => {
    const body = bodyRef.current
    const originals = []
    body.querySelectorAll("img").forEach(img => {
      const trigger = img.closest("a") || img
      if (originals.some(entry => entry.trigger === trigger)) return
      const attributes = ["role", "tabindex", "aria-haspopup", "aria-label"]
      originals.push({
        trigger,
        attributes: attributes.map(name => [name, trigger.getAttribute(name)]),
      })
      if (trigger === img) {
        trigger.setAttribute("role", "button")
        trigger.setAttribute("tabindex", "0")
      }
      trigger.setAttribute("aria-haspopup", "dialog")
      trigger.setAttribute(
        "aria-label",
        `${english ? "Enlarge image" : "이미지 확대"}${
          img.alt ? `: ${img.alt}` : ""
        }`
      )
    })

    const openImage = event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return
      const target = event.target
      const img =
        target.closest("img") || target.closest("a")?.querySelector("img")
      if (!img || !body.contains(img)) return
      if (
        event.type === "keydown" &&
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return
      }
      event.preventDefault()
      const link = img.closest("a")
      const source = getEnlargedImageSource({
        src: img.src,
        srcSet: img.srcset,
        currentSrc: img.currentSrc,
        href: link?.href,
      })
      triggerRef.current = link || img
      setFailed(false)
      setImage({ src: source, alt: img.alt })
    }

    body.addEventListener("click", openImage)
    body.addEventListener("keydown", openImage)
    return () => {
      body.removeEventListener("click", openImage)
      body.removeEventListener("keydown", openImage)
      originals.forEach(({ trigger, attributes }) => {
        attributes.forEach(([name, value]) => {
          if (value === null) trigger.removeAttribute(name)
          else trigger.setAttribute(name, value)
        })
      })
    }
  }, [html, english])

  React.useEffect(() => {
    setImage(null)
  }, [html])

  React.useEffect(() => {
    if (!image) return
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (triggerRef.current?.isConnected) {
        triggerRef.current.focus({ preventScroll: true })
      }
    }
  }, [image])

  return (
    <>
      <section
        ref={bodyRef}
        className="article-body"
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
      />
      <dialog
        ref={dialogRef}
        className="image-viewer"
        aria-label={english ? "Enlarged image" : "확대 이미지"}
        onClose={() => setImage(null)}
      >
        {image && (
          <>
            <button
              className="image-viewer-dismiss"
              type="button"
              aria-label={closeLabel}
              onClick={() => setImage(null)}
            >
              {!failed && (
                <img
                  src={image.src}
                  alt={image.alt}
                  onError={() => setFailed(true)}
                />
              )}
            </button>
            {failed && (
              <p className="image-viewer-error" role="alert">
                {english
                  ? "Unable to load image."
                  : "이미지를 불러오지 못했습니다."}{" "}
                <a href={image.src}>
                  {english ? "Open original" : "원본 열기"}
                </a>
              </p>
            )}
          </>
        )}
      </dialog>
    </>
  )
}

export default ArticleBody
