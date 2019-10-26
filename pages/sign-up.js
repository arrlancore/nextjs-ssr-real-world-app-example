import React from 'react'
import Layout from '../src/components/Layout'
import SeoConfig from '../src/components/seoConfig'
import { useApi } from '../src/libs/api'
import { useAuth } from '../src/libs/context'
import usePrevious from '../src/libs/usePrevious'
import { saveUser } from '../src/libs/userAuth'
import Router from 'next/router'
import Link from 'next/link'

const SignUpPage = () => {
  const [signUp, requestSignUp] = useApi()
  const [values, setValues] = React.useState({})
  const [, setAuth] = useAuth()

  const handleChangeValue = key => target => {
    setValues({ ...values, [key]: target.value })
  }

  const handleSignUp = e => {
    e.preventDefault()
    const requestConfig = {
      path: '/users',
      method: 'post',
      data: { user: values }
    }
    requestSignUp(requestConfig)
  }

  const prevSignUp = usePrevious(signUp)
  React.useEffect(() => {
    if (signUp.data && signUp !== prevSignUp) {
      // sign up success
      const dataUser = { ...signUp.data.user }
      dataUser.isLogin = true
      saveUser(dataUser)
      setAuth(dataUser)

      // redirect to home
      Router.push('/')
    }
  })
  return (
    <Layout>
      <SeoConfig title="Sign Up" />
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link href="/login">
                  <a>Have an account?</a>
                </Link>
              </p>

              <ul className="error-messages">{signUp.isError && <li>{signUp.isError}</li>}</ul>

              <form onSubmit={handleSignUp}>
                <fieldset className="form-group">
                  <input
                    disabled={signUp.isLoading}
                    onChange={({ target }) => handleChangeValue('username')(target)}
                    className="form-control form-control-lg"
                    required
                    type="text"
                    placeholder="Your Name"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    disabled={signUp.isLoading}
                    onChange={({ target }) => handleChangeValue('email')(target)}
                    className="form-control form-control-lg"
                    required
                    type="email"
                    placeholder="Email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    disabled={signUp.isLoading}
                    onChange={({ target }) => handleChangeValue('password')(target)}
                    className="form-control form-control-lg"
                    required
                    type="password"
                    placeholder="Password"
                  />
                </fieldset>
                <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SignUpPage
