import React from 'react'
import { func, array } from 'prop-types'

export function Sidebar({ onTagClick, listTag }) {
  return (
    <div className="sidebar">
      <h2>Popular Tags</h2>

      <div className="tag-list">
        {listTag.map((tag, idx) => (
          <span
            onClick={() => onTagClick(tag)}
            style={{ cursor: 'pointer' }}
            key={idx}
            className="tag-pill tag-default"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
Sidebar.propTypes = {
  onTagClick: func,
  listTag: array
}

export default Sidebar
