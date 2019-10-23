import React from 'react'
import SignUp from '../src/components/sign-up'
import Layout from '../src/components/Layout'

const SignUpPage = () => {
  return (
    <Layout>
      <SignUp />
    </Layout>
  )
}

SignUpPage.getInitialProps = () => {
  console.log('INIT RUN BEFORE LOAD')
}

export default SignUpPage
