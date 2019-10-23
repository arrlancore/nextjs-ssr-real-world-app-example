import React, { useState } from 'react'
import { array } from 'prop-types'
import usePrevious from '../libs/usePrevious'
import Router from 'next/router'

const Setting = ({ userApi }) => {
  const [userData, requestUser] = userApi
  const [isSubmit, setIsSubmit] = useState(false)
  const [values, setValues] = useState((userData.data && userData.data.user) || {})

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
  const prevLoading = usePrevious(userData.isLoading)
  const prevUserData = usePrevious(userData.data)
  React.useEffect(() => {
    if (isSubmit && userData.data && prevLoading && !userData.isLoading) {
      // submit success
      setIsSubmit(false)
      Router.push(`/user-profile?username=${values.username}`, `/user-profile/${values.username}`)
    }
    if (userData.data && prevUserData !== userData.data) {
      setValues(userData.data.user)
    }
  }, [isSubmit, userData.data, userData.isLoading, prevLoading, prevUserData, values.username])

  return (
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
  )
}

Setting.propTypes = {
  userApi: array
}

export default Setting
