import React from 'react'
import Header from './header'
import Footer from './footer'
import { node } from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'

const Layout = props => (
  <div className="layout">
    <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_CENTER} />
    <Header />
    {props.children}
    <Footer />
  </div>
)

Layout.propTypes = {
  children: node
}

export default Layout
