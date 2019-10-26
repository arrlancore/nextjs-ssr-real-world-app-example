import {render} from '../utils'
import SidebarHomepage from '../../components/sidebarHomepage'
import React from 'react'

const dataMocks = ['butt', 'test', 'dragons', 'training'];

const onTagClick = jest.fn();


describe('<SidebarHomepage /> component', () => {
  const renderComponent = () => render(<SidebarHomepage onTagClick={onTagClick} listTag={dataMocks} />)

    it('renders sidebar title', () => {
        const wrapper = renderComponent()
        expect(wrapper.getByText('Popular Tags')).toBeDefined()
      })

    it('renders all tags', () => {
      const wrapper = renderComponent()
      const items= wrapper.container.getElementsByClassName('tag-pill')
      expect(items.length).toEqual(4)
      expect(wrapper.asFragment()).toMatchSnapshot()
    })
})