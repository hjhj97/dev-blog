import React, { useMemo } from "react"

function Category({ categories, currentCategory, selectCategory }) {
  const getToalPostCnt = () => {
    return categories.reduce((acc, cur) => acc + cur.cnt, 0)
  }
  const totalPost = useMemo(getToalPostCnt, [])

  return (
    <ul className="category-wrapper">
      <li
        className={`category-item ${
          currentCategory === "All" ? "selected" : ""
        }`}
        onClick={() => selectCategory("All")}
      >
        All ({totalPost})
      </li>

      {categories.map(({ name, cnt }) => (
        <li
          className={`category-item ${
            currentCategory === name ? "selected" : ""
          }`}
          onClick={() => selectCategory(name)}
        >
          {`${name} (${cnt})`}
        </li>
      ))}
    </ul>
  )
}

export default Category
