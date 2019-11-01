import React from 'react'
import Layout from '../src/components/Layout'
import HomepageContent from '../src/components/HomepageContent'
import { useApi, serverApiRequest } from '../src/libs/api'
import { getPage } from '../src/libs/page'
import { object } from 'prop-types'
import { getTokenFromCookie } from '../src/libs/userAuth'
import { useAuth } from '../src/libs/context'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import SeoConfig from '../src/components/seoConfig'
import ListArticle from '../src/components/listArticle'
import Pagination from '../src/components/pagination'
import usePrevious from '../src/libs/usePrevious'
import Sidebar from '../src/components/sidebarHomepage'
import { TabHomePage } from '../src/components/tabs'

const HomePage = ({ initData }) => {
  // prepare initial data & params
  const [auth] = useAuth()
  const isLogin = auth && auth.isLogin
  const pathArticleOption = { feed: '/articles/feed', global: '/articles' }
  const requestListArticleParam = {
    path: isLogin ? pathArticleOption.feed : pathArticleOption.global,
    pathOption: pathArticleOption,
    params: getPage(),
    secure: 'optional'
  }
  const requestListTagParam = { path: '/tags' }
  const banner = { title: 'conduit', description: 'A place to share your knowledge.' }
  const tabNames = { FEED: 'feed', GLOBAL: 'global' }
  const initRequestArticle = initData && initData.isServer ? null : requestListArticleParam

  // using useApi hook to request data from server
  const [listArticle, requestListArticle] = useApi(initRequestArticle, initData)
  const [listTag] = useApi(requestListTagParam)
  const tags = listTag && listTag.data ? listTag.data.tags : []

  // create state for local data manipulate
  const [pageActiveData, setPageActiveData] = React.useState({
    ...listArticle.data,
    params: listArticle.requestConfig.params
  })
  const [isGlobal, setIsGlobal] = React.useState(!isLogin)

  // ***create some handler***
  // handle the pagination, show data by page number
  const handleChangePage = newPageNumber => {
    if (listArticle.pages[newPageNumber]) {
      const newParams = { ...pageActiveData.params, pageNumber: newPageNumber }
      return setPageActiveData({ ...listArticle.pages[newPageNumber], params: newParams })
    }
    const newRequestParams = getPage(newPageNumber)
    const newConfig = { ...listArticle.requestConfig, params: { ...pageActiveData.params, ...newRequestParams } }
    requestListArticle(newConfig)
  }

  // filter list article by tag name
  const handleFilterByTag = tagName => {
    const currentParams = listArticle.requestConfig.params
    const { global } = listArticle.requestConfig.pathOption
    if (currentParams.tag !== tagName) {
      currentParams.reset = true
    }
    const newParams = { ...currentParams, ...getPage(), tag: tagName }
    requestListArticle({ ...listArticle.requestConfig, params: newParams, path: global })
    !isGlobal && setIsGlobal(true)
  }

  // showing data by the tab active that clicked by user
  const handleChangeTab = tabName => {
    const tabNameActive = isGlobal ? tabNames.GLOBAL : tabNames.FEED
    if (tabName !== tabNameActive && isLogin) {
      const resetParams = getPage()
      const { feed, global } = listArticle.requestConfig.pathOption
      const currentParams = listArticle.requestConfig.params
      currentParams.reset = true
      const newParams = { ...currentParams, ...resetParams }
      const newConfig = { ...listArticle.requestConfig, path: isGlobal ? feed : global, params: newParams }
      setIsGlobal(!isGlobal)
      requestListArticle(newConfig)
    }
  }

  // if user do favorites / unfavorites to an article, reload list article to get latest count
  const handleReloadArticles = () => {
    const newParams = { ...listArticle.requestConfig.params, reload: Date.now() }
    requestListArticle({ ...listArticle.requestConfig, params: newParams })
  }

  // handle side effect
  const prevDataState = usePrevious(listArticle.data)
  React.useEffect(() => {
    if (listArticle.data && listArticle.data !== prevDataState) {
      const params = listArticle.requestConfig.params
      if (params.reset) {
        params.reset = false
      }
      setPageActiveData({ ...listArticle.data, params })
    }
  }, [listArticle.data, listArticle.requestConfig.params, prevDataState])

  return (
    <Layout>
      <SeoConfig title="Wellcome to the real world app example" />
      <HomepageContent
        banner={banner}
        sidebar={<Sidebar listTag={tags} tagLoading={listTag.isLoading} onTagClick={handleFilterByTag} />}
      >
        <TabHomePage global={isGlobal} onTabClick={handleChangeTab} login={isLogin} />
        <ListArticle
          onRequestReload={handleReloadArticles}
          loading={listArticle.isLoading}
          data={pageActiveData.articles || []}
          pagination={
            <Pagination
              params={pageActiveData.params}
              totalCount={listArticle.data && listArticle.data.articlesCount}
              onClick={handleChangePage}
            />
          }
        />
      </HomepageContent>
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
      const response = await serverApiRequest({ ...requestListArticleParam, secure: token })
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
