import { render } from '../utils'
import Pagination from '../../components/pagination'
import React from 'react'

/**
 *
 * @case
 * - initial list number page [«,‹,1,2,3,4,5,›,»]
 */

describe('<Pagination /> component', () => {
  it('renders null if the props of params[pageNumber] and or totalCount is undefined', () => {
    const wrapper = render(<Pagination />)
    expect(wrapper.container.firstChild).toBeNull()
  })
  it('renders 3 buttons page number', () => {
    const {container, asFragment} = render(<Pagination params={{pageNumber: 1, limit: 5}} totalCount={15} />)
    expect(container.querySelectorAll('#page-number').length).toEqual(3)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders 5 buttons page number & active class on page 1', () => {
    const pageNumber = 3
    const {container, asFragment} = render(<Pagination params={{pageNumber, limit: 5}} totalCount={50} />)
    expect(container.querySelectorAll('#page-number').length).toEqual(5)
    expect(container.querySelectorAll('#page-number')[pageNumber - 1].classList.contains('active')).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
})