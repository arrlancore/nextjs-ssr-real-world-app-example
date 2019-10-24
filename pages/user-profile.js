import React from 'react'
import Profile from '../src/components/profile'
import { useApi, callApi } from '../src/libs/api'
import Layout from '../src/components/Layout'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import { object } from 'prop-types'
import usePrevious from '../src/libs/usePrevious'
import { getTokenFromCookie } from '../src/libs/userAuth'
import SeoConfig from '../src/components/seoConfig'
const UserProfilePage = props => {
  const { username } = props.router.query
  const requestConfig = props.initData.data ? null : { path: `/profiles/${username}`, secure: 'optional' }
  const [userProfileData, requestUser] = useApi(requestConfig, props.initData)
  const prevUsername = usePrevious(username)
  React.useEffect(() => {
    if (!props.initData.isServer && username && prevUsername !== username) {
      requestUser({ path: `/profiles/${username}`, secure: true })
    }
  }, [prevUsername, props.initData.isServer, requestUser, username])
  return (
    <Layout>
      <SeoConfig title={`Profile: ${username}`} />
      <Profile username={username} userApi={[userProfileData, requestUser]} />
    </Layout>
  )
}

UserProfilePage.getInitialProps = async ({ req, res, isServer }) => {
  let initData = {}
  try {
    if (isServer) {
      const cookies = (req && req.headers && req.headers.cookie) || ''
      const token = getTokenFromCookie(cookies) || 'optional'
      const { username } = req.params
      const requestConfigUser = {
        path: `/profiles/${username}`,
        secure: token
      }
      let response = {}
      response = await callApi({ ...requestConfigUser })
      const data = response.data
      initData = { data, requestConfig: requestConfigUser, isServer }
    }
    return { initData }
  } catch (error) {
    return handleErrorInitialProps(res, error)
  }
}

UserProfilePage.propTypes = { initData: object, router: object }

export default UserProfilePage
