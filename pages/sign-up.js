import React from 'react'
import SignUp from '../src/components/sign-up'
import Layout from '../src/components/Layout'
import SeoConfig from '../src/components/seoConfig'

const SignUpPage = () => {
  return (
    <Layout>
      <SeoConfig title="Sign Up" />
      <SignUp />
    </Layout>
  )
}

SignUpPage.getInitialProps = () => {
  console.log('INIT RUN BEFORE LOAD')
}

export default SignUpPage
