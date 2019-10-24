import React from 'react'
import Header from './header'
import Footer from './footer'
import { node, bool } from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import { useAuth } from '../libs/context'
import Router from 'next/router'

const Layout = props => {
  const [auth] = useAuth()
  const { isLogin } = auth

  React.useEffect(() => {
    if (props.protected && !isLogin) {
      Router.push('/login')
    }
  })
  return (
    <div className="layout">
      <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_CENTER} />
      <Header />
      {props.children}
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: node,
  protected: bool
}

export default Layout
