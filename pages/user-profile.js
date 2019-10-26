import React from 'react'
import Profile from '../src/components/ProfileContent'
import { useApi, serverApiRequest } from '../src/libs/api'
import Layout from '../src/components/Layout'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import { object } from 'prop-types'
import usePrevious from '../src/libs/usePrevious'
import { getTokenFromCookie } from '../src/libs/userAuth'
import SeoConfig from '../src/components/seoConfig'

const UserProfilePage = props => {
  const { username } = props.router.query
  const requestConfig = props.initData.data ? null : { path: `/profiles/${username}`, secure: 'optional' }
  const [singleProfile, requestSingleProfile] = useApi(requestConfig, props.initData)
  const image = singleProfile.data && singleProfile.data.profile.image
  const prevUsername = usePrevious(username)
  React.useEffect(() => {
    if (!props.initData.isServer && username && prevUsername !== username) {
      requestSingleProfile({ path: `/profiles/${username}`, secure: true })
    }
  }, [prevUsername, props.initData.isServer, requestSingleProfile, username])
  return (
    <Layout>
      <SeoConfig title={`${username} profile's`} image={image} />
      <Profile username={username} userApi={[singleProfile, requestSingleProfile]} />
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
      response = await serverApiRequest({ ...requestConfigUser })
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
