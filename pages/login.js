import React from 'react'
import Login from '../src/components/login'
import Layout from '../src/components/Layout'
import SeoConfig from '../src/components/seoConfig'

const LoginPage = () => {
  return (
    <Layout>
      <SeoConfig title="Login" />
      <Login />
    </Layout>
  )
}

export default LoginPage
