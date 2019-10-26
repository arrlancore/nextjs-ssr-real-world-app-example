import { render } from '../utils'
import Footer from '../../components/footer'
import React from 'react'
import Link from 'next/link'

describe('<Footer /> component', () => {
  it('renders with brand name and license description should not be blank', () => {
    const wrapper = render(<Footer />)
    expect(wrapper.getByText('conduit')).toBeDefined()
    expect(wrapper.container.getElementsByClassName('.attribution')).not.toBe('')
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('Render footer should anchor point to root ', () => {
    const { getByText } = render(<Footer />)

    expect(getByText('conduit').href).toBe('http://localhost/');
  })

  it('should contain a anchor with link to thinkster.io and Thinkster as link name in attribution span', () => {
    const wrapper = render(<Footer />)

    const thinksterAnchor = wrapper.container.querySelector('.attribution')

    expect(thinksterAnchor.querySelector('a').href).toBe('https://thinkster.io/')
    expect(thinksterAnchor.querySelector('a').text).toBe('Thinkster')
  })
})