import React from 'react'
import { func, array, bool } from 'prop-types'
import EmptyContent from './EmptyContent'
import { TagSidebarLoading } from './Skeletons'

export function Sidebar({ onTagClick, listTag, tagLoading }) {
  const isEmptyTags = !tagLoading && listTag && listTag.length === 0
  const isListTag = !tagLoading && !isEmptyTags
  return (
    <div className="sidebar">
      {isEmptyTags ? <EmptyContent /> : null}
      {tagLoading ? <TagSidebarLoading /> : null}
      {isListTag ? (
        <>
          <h3>Popular Tags</h3>
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
        </>
      ) : null}
    </div>
  )
}
Sidebar.propTypes = {
  onTagClick: func,
  listTag: array,
  tagLoading: bool
}

export default Sidebar
