import React from 'react'
import { object, number, func } from 'prop-types'

const Pagination = ({ params, totalCount, onClick }) => {
  const totalPage = Math.ceil(totalCount / params.limit)
  return (
    <nav>
      <ul className="pagination">
        {totalPage > 1
          ? Array.from({ length: totalPage }).map((_, idx) => {
              const newPageNumber = idx + 1
              const handleOnClick = number => {
                number !== params.pageNumber && onClick(newPageNumber)
              }
              return (
                <li key={idx} className={`page-item ${params.pageNumber === newPageNumber ? 'active' : ''}`}>
                  <span
                    onClick={() => handleOnClick(newPageNumber)}
                    className="page-link"
                    style={{ cursor: 'pointer' }}
                  >
                    {newPageNumber}
                  </span>
                </li>
              )
            })
          : ''}
      </ul>
    </nav>
  )
}

Pagination.propTypes = {
  params: object,
  totalCount: number,
  onClick: func
}

export default Pagination
