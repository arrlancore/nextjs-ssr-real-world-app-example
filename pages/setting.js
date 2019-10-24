import React from 'react'
import Setting from '../src/components/setting'
import Layout from '../src/components/Layout'
import { useApi, callApi } from '../src/libs/api'
import { getTokenFromCookie, protectPage } from '../src/libs/userAuth'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import { object } from 'prop-types'
import SeoConfig from '../src/components/seoConfig'

/**
 * @todo
 * - load profile
 * - update profile
 */
const SettingPage = props => {
  const requestConfig = props.initData.data ? null : { path: '/user', secure: true }
  const [userProfileData, requestUser] = useApi(requestConfig, props.initData)
  return (
    <Layout protected>
      <SeoConfig title="Setting" />
      <Setting userApi={[userProfileData, requestUser]} />
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
      response = await callApi({ ...requestConfigUser, secure: token })
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
