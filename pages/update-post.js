import React from 'react'
import UpdatePost from '../src/components/update-post'
import Layout from '../src/components/Layout'
import { getTokenFromCookie } from '../src/libs/userAuth'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import { callApi, useApi } from '../src/libs/api'
import { object } from 'prop-types'

const UpdatePostPage = props => {
  const { slug } = props.router.query
  const requestConfig = !props.initData.data && slug ? { path: `/articles/${slug}`, secure: true } : null
  const [articleData, requestArticleData] = useApi(requestConfig, props.initData)
  return (
    <Layout>
      {' '}
      <UpdatePost articleApi={[articleData, requestArticleData]} />
    </Layout>
  )
}

UpdatePostPage.getInitialProps = async ({ req, res, isServer }) => {
  let initData = {}
  try {
    if (isServer) {
      const cookies = (req && req.headers && req.headers.cookie) || ''
      const token = getTokenFromCookie(cookies) || true
      const { slug } = req.params
      const requestConfigUser = {
        path: `/articles/${slug}`,
        secure: token
      }
      let response = {}
      if (slug) {
        response = await callApi({ ...requestConfigUser, secure: token })
        const data = response.data
        initData = { data, requestConfig: requestConfigUser, isServer }
      }
    }
    return { initData }
  } catch (error) {
    return handleErrorInitialProps(res, error)
  }
}
UpdatePostPage.propTypes = {
  router: object,
  initData: object
}

export default UpdatePostPage
