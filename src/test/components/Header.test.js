import {render} from '../utils'
import Header from '../../components/header'
import React from 'react'

describe('<Header /> component', () => {
    it('renders with brand name "conduit"', () => {
        const wrapper = render(<Header />)
        expect(wrapper.getByText('conduit')).toBeDefined()
      })
    it('renders with 3 navbar item', () => {
      const wrapper = render(<Header />)
      const navItems= wrapper.container.getElementsByClassName('nav-item')
      expect(navItems.length).toEqual(3)
      expect(wrapper.asFragment()).toMatchSnapshot()
    })
})