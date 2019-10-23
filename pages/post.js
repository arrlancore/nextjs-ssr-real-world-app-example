import React from 'react'
import ViewPost from '../src/components/view-post'
import Layout from '../src/components/Layout'
import { useApi, callApi } from '../src/libs/api'
import { object } from 'prop-types'
import { getTokenFromCookie } from '../src/libs/userAuth'
import { handleErrorInitialProps } from '../src/libs/errorHandler'

const getQuery = (router, key) => router.query[key]

const ViewPostPage = ({ initData, router }) => {
  const slug = getQuery(router, 'slug')
  const requestConfig = { method: 'get', secure: 'optional', path: `/articles/${slug}` }
  const apiArticle = useApi(initData && initData.data ? null : requestConfig, initData)

  return (
    <Layout>
      <ViewPost apiArticle={apiArticle} />
    </Layout>
  )
}

ViewPostPage.getInitialProps = async ({ query, isServer, req, res }) => {
  let initData = {}
  try {
    if (isServer) {
      const cookies = (req && req.headers && req.headers.cookie) || ''
      const token = getTokenFromCookie(cookies)
      const slug = query.slug || req.params.slug
      const path = `/articles/${slug}`
      const requestConfig = { method: 'get', path, secure: token }
      const response = await callApi(requestConfig)
      const { data } = response
      initData = { data, isServer, requestConfig }
    }
    return { initData }
  } catch (error) {
    return handleErrorInitialProps(res, error)
  }
}

ViewPostPage.propTypes = { initData: object, router: object }

export default ViewPostPage
