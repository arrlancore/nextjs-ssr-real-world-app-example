import React from 'react'
import Layout from '../src/components/Layout'
import SeoConfig from '../src/components/seoConfig'
import Link from 'next/link'
import usePrevious from '../src/libs/usePrevious'
import { saveUser } from '../src/libs/userAuth'
import Router from 'next/router'
import { useApi } from '../src/libs/api'
import { useAuth } from '../src/libs/context'

const LoginPage = () => {
  const [signIn, requestSignIn] = useApi()
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  })
  const [, setAuth] = useAuth()

  const handleChangeValue = key => target => {
    setValues({ ...values, [key]: target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const requestConfig = {
      path: '/users/login',
      method: 'post',
      data: { user: values }
    }
    requestSignIn(requestConfig)
  }

  const prevSignIn = usePrevious(signIn)
  React.useEffect(() => {
    if (signIn.data && signIn !== prevSignIn) {
      // sign in success
      const dataUser = { ...signIn.data.user }
      dataUser.isLogin = true
      saveUser(dataUser)
      setAuth(dataUser)

      // redirect to home
      Router.push('/')
    }
  })
  return (
    <Layout>
      <SeoConfig title="Login" />
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Login</h1>
              <p className="text-xs-center">
                <Link href="/sign-up">
                  <a>Create an account?</a>
                </Link>
              </p>

              <ul className="error-messages">{signIn.isError && <li>{signIn.isError}</li>}</ul>

              <form onSubmit={handleSubmit}>
                <fieldset className="form-group">
                  <input
                    disabled={signIn.isLoading}
                    onChange={({ target }) => handleChangeValue('email')(target)}
                    className="form-control form-control-lg"
                    type="email"
                    required
                    placeholder="Email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    disabled={signIn.isLoading}
                    onChange={({ target }) => handleChangeValue('password')(target)}
                    className="form-control form-control-lg"
                    type="password"
                    required
                    placeholder="Password"
                  />
                </fieldset>
                <button disabled={signIn.isLoading} type="submit" className="btn btn-lg btn-primary pull-xs-right">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LoginPage
