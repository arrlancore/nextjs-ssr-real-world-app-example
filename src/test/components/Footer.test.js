import {render} from '../utils'
import Footer from '../../components/Footer'
import React from 'react'

describe('<Footer /> component', () => {
    it('renders with brand name and license description should not be blank', () => {
        const wrapper = render(<Footer />)
        expect(wrapper.getByText('conduit')).toBeDefined()
        expect(wrapper.container.getElementsByClassName('.attribution')).not.toBe('')
    })
})