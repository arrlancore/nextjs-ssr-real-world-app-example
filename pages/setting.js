import React, { useState } from 'react'
import Layout from '../src/components/Layout'
import { useApi, serverApiRequest } from '../src/libs/api'
import { getTokenFromCookie, protectPage } from '../src/libs/userAuth'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import { object } from 'prop-types'
import SeoConfig from '../src/components/seoConfig'
import usePrevious from '../src/libs/usePrevious'
import Router from 'next/router'

const SettingPage = props => {
  const requestConfig = props.initData.data ? null : { path: '/user', secure: true }
  const [user, requestUser] = useApi(requestConfig, props.initData)
  const [isSubmit, setIsSubmit] = useState(false)
  const [values, setValues] = useState((user.data && user.data.user) || {})

  const handleChangeValue = key => target => {
    setValues({ ...values, [key]: target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsSubmit(true)
    const requestConfig = {
      path: '/user',
      method: 'put',
      secure: true,
      data: { user: values }
    }
    requestUser(requestConfig)
  }
  const prevLoading = usePrevious(user.isLoading)
  const prevUserData = usePrevious(user.data)
  React.useEffect(() => {
    if (isSubmit && user.data && prevLoading && !user.isLoading) {
      // submit success
      setIsSubmit(false)
      Router.push(`/user-profile?username=${values.username}`, `/user-profile/${values.username}`)
    }
    if (user.data && prevUserData !== user.data) {
      setValues(user.data.user)
    }
  }, [isSubmit, user.data, user.isLoading, prevLoading, prevUserData, values.username])

  return (
    <Layout protected>
      <SeoConfig title="Setting" />
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      onChange={({ target }) => handleChangeValue('image')(target)}
                      value={values.image || ''}
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      onChange={({ target }) => handleChangeValue('username')(target)}
                      value={values.username || ''}
                      disabled
                      className="form-control form-control-lg"
                      type="text"
                      required
                      placeholder="Your Name"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      onChange={({ target }) => handleChangeValue('bio')(target)}
                      value={values.bio || ''}
                      className="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      value={values.email}
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      onChange={({ target }) => handleChangeValue('email')(target)}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      onChange={({ target }) => handleChangeValue('password')(target)}
                      className="form-control form-control-lg"
                      type="password"
                      value={values.password}
                      placeholder="Password"
                    />
                  </fieldset>
                  <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
                    Update Settings
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

SettingPage.getInitialProps = async ({ req, res, isServer }) => {
  let initData = {}
  try {
    if (isServer) {
      protectPage(req, res) // this page need authentication
      const cookies = (req && req.headers && req.headers.cookie) || ''
      const token = getTokenFromCookie(cookies) || true
      const requestConfigUser = {
        path: '/user',
        secure: token
      }
      let response = {}
      response = await serverApiRequest({ ...requestConfigUser, secure: token })
      const data = response.data
      initData = { data, requestConfig: requestConfigUser, isServer }
    }
    return { initData }
  } catch (error) {
    return handleErrorInitialProps(res, error)
  }
}

SettingPage.propTypes = { initData: object }

export default SettingPage
