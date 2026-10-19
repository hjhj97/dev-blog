import React, { useMemo } from "react"

function Category({ categories, currentCategory, selectCategory }) {
  const totalPost = useMemo(
    () => categories.reduce((total, category) => total + category.cnt, 0),
    [categories]
  )

  return (
    <ul className="category-wrapper" aria-label="Article categories">
      {[{ name: "All", cnt: totalPost }, ...categories].map(({ name, cnt }) => (
        <li key={name}>
          <button
            type="button"
            className={`category-item ${
              currentCategory === name ? "selected" : ""
            }`}
            aria-pressed={currentCategory === name}
            aria-label={`${name} (${cnt})`}
            onClick={() => selectCategory(name)}
          >
            <span className="category-name">{name}</span>
            <span className="category-count">{cnt}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Category
