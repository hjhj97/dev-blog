import React from "react"

function category({ categories, currentCategory, selectCategory }) {
  return (
    <ul className="category-wrapper">
      <li
        className={`category-item ${
          currentCategory === "All" ? "selected" : ""
        }`}
        onClick={() => selectCategory("All")}
      >
        All
      </li>
      {categories.map(
        category =>
          category && (
            <li
              className={`category-item ${
                currentCategory === category ? "selected" : ""
              }`}
              onClick={() => selectCategory(category)}
            >
              {category}
            </li>
          )
      )}
    </ul>
  )
}

export default category
