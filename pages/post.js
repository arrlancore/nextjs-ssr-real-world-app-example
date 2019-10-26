import React from 'react'
import ViewPost from '../src/components/ViewPost'
import Layout from '../src/components/Layout'
import { useApi, serverApiRequest } from '../src/libs/api'
import { object } from 'prop-types'
import { getTokenFromCookie } from '../src/libs/userAuth'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import SeoConfig from '../src/components/seoConfig'

const getQuery = (router, key) => router.query[key]

const ViewPostPage = ({ initData, router }) => {
  const slug = getQuery(router, 'slug')
  const requestConfig = { method: 'get', secure: 'optional', path: `/articles/${slug}` }
  const apiArticle = useApi(initData && initData.data ? null : requestConfig, initData)
  const [singleArticle] = apiArticle
  const article = singleArticle.data ? singleArticle.data.article : {}
  const title = article.title || ''
  return (
    <Layout>
      <SeoConfig title={title} description={article.description} />
      <ViewPost apiArticle={apiArticle} />
    </Layout>
  )
}

ViewPostPage.getInitialProps = async ({ query, isServer, req, res }) => {
  let initData = {}
  try {
    const cookies = (isServer && req && req.headers && req.headers.cookie) || ''
    const token = getTokenFromCookie(cookies)
    const slug = query.slug || req.params.slug
    const path = `/articles/${slug}`
    const requestConfig = { method: 'get', path, secure: token || 'optional' }
    const response = await serverApiRequest(requestConfig)
    const { data } = response
    initData = { data, isServer, requestConfig }
    return { initData }
  } catch (error) {
    return handleErrorInitialProps(res, error)
  }
}

ViewPostPage.propTypes = { initData: object, router: object }

export default ViewPostPage
