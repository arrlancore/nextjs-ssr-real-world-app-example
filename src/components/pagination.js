import React from 'react'
import { object, number, func, string } from 'prop-types'

/**
 *
 * @case
 * - initial list number page [«,‹,1,2,3,4,5,›,»]
 * - when total page 10 currentPage is 1.  page clicked 5, then list number should [<<,<,2,3,4,5,6,>,>>]
 */

const ButtonItem = ({ pageNumber, handleOnClick, pageNumberItem, name }) => (
  <li
    id={name ? 'button-helper' : 'page-number'}
    className={`page-item ${!name && pageNumberItem === pageNumber ? 'active' : ''}`}
  >
    <span onClick={() => handleOnClick(pageNumberItem)} className="page-link" style={{ cursor: 'pointer' }}>
      {name || pageNumberItem}
    </span>
  </li>
)
ButtonItem.propTypes = {
  pageNumber: number,
  handleOnClick: func,
  pageNumberItem: number,
  name: string
}

const Pagination = ({ params, totalCount, onClick }) => {
  if (!params || !totalCount || !(params && params.pageNumber && params.limit)) return null
  let totalPage = Math.ceil(totalCount / params.limit)

  const getPageNumbers = (activePageNumber, totalPage) => {
    let data = []
    const totalPageToShow = 5
    let inc = 1
    if (activePageNumber > totalPageToShow) {
      inc = activePageNumber - totalPageToShow + 1
    }
    data = Array.from({ length: totalPage < totalPageToShow ? totalPage : totalPageToShow }).map((_, idx) => idx + inc)
    return data
  }

  const pageNumberList = getPageNumbers(params.pageNumber, totalPage)

  const handleOnClickButtons = number => {
    number !== params.pageNumber && onClick(number)
  }

  const showPrevButton = params.pageNumber > 5
  const showNextButton = params.pageNumber !== totalPage && totalPage > 5

  return (
    <nav>
      <ul className="pagination">
        {showPrevButton ? (
          <>
            <ButtonItem
              pageNumberItem={1}
              name="«"
              handleOnClick={handleOnClickButtons}
              pageNumber={params.pageNumber}
            />
            <ButtonItem
              pageNumberItem={params.pageNumber - 1}
              name="‹"
              handleOnClick={handleOnClickButtons}
              pageNumber={params.pageNumber}
            />
          </>
        ) : null}

        {totalPage > 1
          ? pageNumberList.map((pageNumberItem, idx) => {
              const handleOnClick = number => {
                number !== params.pageNumber && onClick(pageNumberItem)
              }
              return (
                <ButtonItem
                  key={idx}
                  pageNumberItem={pageNumberItem}
                  handleOnClick={handleOnClick}
                  pageNumber={params.pageNumber}
                />
              )
            })
          : null}
        {showNextButton ? (
          <>
            <ButtonItem
              pageNumberItem={params.pageNumber + 1}
              name="›"
              handleOnClick={handleOnClickButtons}
              pageNumber={params.pageNumber}
            />
            <ButtonItem
              pageNumberItem={totalPage}
              name="»"
              handleOnClick={handleOnClickButtons}
              pageNumber={params.pageNumber}
            />
          </>
        ) : null}
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
