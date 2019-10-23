import React from 'react'
import Link from 'next/link'
import { useApi } from '../libs/api'
import Router from 'next/router'
import { useAuth } from '../libs/context'
import usePrevious from '../libs/usePrevious'
import { saveUser } from '../libs/userAuth'

const Login = () => {
  const [signIn, requestSignIn] = useApi()
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  })
  const [, setDataContext] = useAuth()

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

  const prevSignUp = usePrevious(signIn)
  React.useEffect(() => {
    if (signIn.data && signIn !== prevSignUp) {
      // sign in success
      const dataUser = { ...signIn.data.user }
      dataUser.isLogin = true
      saveUser(dataUser)
      setDataContext(dataUser)

      // redirect to home
      Router.push('/')
    }
  })

  return (
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
  )
}

export default Login
