import React from 'react'
import Home from '../src/components/homepage'
import { useApi, callApi } from '../src/libs/api'
import { getPage } from '../src/libs/page'
import Layout from '../src/components/Layout'
import { object } from 'prop-types'
import { getTokenFromCookie } from '../src/libs/userAuth'
import { useAuth } from '../src/libs/context'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import Head from '../src/components/head'

const HomePage = ({ initData }) => {
  const [user] = useAuth()
  const isLogin = user && user.isLogin
  const pathOption = { feed: '/articles/feed', global: '/articles' }
  const requestListArticleParam = {
    path: isLogin ? pathOption.feed : pathOption.global,
    pathOption,
    params: getPage(),
    secure: 'optional'
  }
  const requestListTagparam = { path: '/tags' }
  // if init data list article are exist(data load from ssr)
  // assign null to the param useApi to prevent second call api
  // but if initData is undefined, we need to load data from client side
  const initRequestArticle = initData && initData.isServer ? null : requestListArticleParam
  const [listArticle, setRequestArticle] = useApi(initRequestArticle, initData)
  const [listTags] = useApi(requestListTagparam)
  const banner = { title: 'conduit', description: 'A place to share your knowledge.' }

  // As react documentation try use component composition to send props to child component
  return (
    <Layout>
      <Head title="Wellcome to conduit" />
      <Home banner={banner} dataArticle={[listArticle, setRequestArticle]} dataTag={listTags} />
    </Layout>
  )
}

HomePage.getInitialProps = async ({ req, res, isServer }) => {
  let initData = {}
  try {
    if (isServer) {
      const cookies = (req && req.headers && req.headers.cookie) || ''
      const token = getTokenFromCookie(cookies)
      const isLogin = !!token
      const pathOption = { feed: '/articles/feed', global: '/articles' }
      const requestListArticleParam = {
        path: isLogin ? pathOption.feed : pathOption.global,
        pathOption,
        params: getPage(),
        secure: 'optional'
      }
      const response = await callApi({ ...requestListArticleParam, secure: token })
      const data = response.data
      const pages = { [requestListArticleParam.params.pageNumber]: data }
      initData = { data, requestConfig: requestListArticleParam, isServer, pages }
    }
    return { initData }
  } catch (error) {
    return handleErrorInitialProps(res, error)
  }
}

HomePage.propTypes = {
  initData: object
}

export default HomePage
