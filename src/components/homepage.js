import React from 'react'
import { getPage } from '../libs/page'
import usePrev from '../libs/usePrevious'
import Pagination from './pagination'
import { object, array, func, bool } from 'prop-types'
import { useAuth } from '../libs/context'
import ListArticle from './listArticle'

export const TabContent = ({ global, onTabClick, login }) => {
  const TAB_NAMES = { FEED: 'feed', GLOBAL: 'global' }
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {login ? (
          <li style={{ cursor: 'pointer' }} onClick={() => onTabClick(TAB_NAMES.FEED)} className="nav-item">
            <span className={`nav-link ${global ? '' : 'active'}`}>Your Feed</span>
          </li>
        ) : (
          ''
        )}
        <li style={{ cursor: 'pointer' }} onClick={() => onTabClick(TAB_NAMES.GLOBAL)} className="nav-item">
          <span className={`nav-link ${global ? 'active' : ''}`}>Global Feed</span>
        </li>
      </ul>
    </div>
  )
}
TabContent.propTypes = {
  global: bool,
  login: bool,
  onTabClick: func
}

export const Sidebar = ({ onTabClick, dataTag }) => (
  <div className="sidebar">
    <p>Popular Tags</p>

    <div className="tag-list">
      {dataTag.map((tag, idx) => (
        <span onClick={() => onTabClick(tag)} style={{ cursor: 'pointer' }} key={idx} className="tag-pill tag-default">
          {tag}
        </span>
      ))}
    </div>
  </div>
)
Sidebar.propTypes = {
  onTabClick: func,
  dataTag: array
}

const Home = ({ dataArticle, dataTag, banner }) => {
  const TAB_NAMES = { FEED: 'feed', GLOBAL: 'global' }
  const tags = dataTag && dataTag.data ? dataTag.data.tags : []
  const [dataState, requestData] = dataArticle
  const [pageActive, setPageActive] = React.useState({ ...dataState.data, params: dataState.requestConfig.params })
  const [user] = useAuth()
  const isLogin = user.isLogin
  const [isGlobal, setIsGlobal] = React.useState(!isLogin)

  const handleChangePage = newPageNumber => {
    if (dataState.pages[newPageNumber]) {
      const newParams = { ...pageActive.params, pageNumber: newPageNumber }
      return setPageActive({ ...dataState.pages[newPageNumber], params: newParams })
    }
    const newRequestParams = getPage(newPageNumber)
    const newConfig = { ...dataState.requestConfig, params: { ...pageActive.params, ...newRequestParams } }
    requestData(newConfig)
  }

  const handleFilterByTag = tagName => {
    const currentParams = dataState.requestConfig.params
    const { global } = dataState.requestConfig.pathOption
    if (currentParams.tag !== tagName) {
      currentParams.reset = true
    }
    const newParams = { ...currentParams, ...getPage(), tag: tagName }
    requestData({ ...dataState.requestConfig, params: newParams, path: global })
    !isGlobal && setIsGlobal(true)
  }

  const handleChangeTab = tabName => {
    const tabNameActive = isGlobal ? TAB_NAMES.GLOBAL : TAB_NAMES.FEED
    if (tabName !== tabNameActive && isLogin) {
      const resetParams = getPage()
      const { feed, global } = dataState.requestConfig.pathOption
      const currentParams = dataState.requestConfig.params
      currentParams.reset = true
      const newParams = { ...currentParams, ...resetParams }
      const newConfig = { ...dataState.requestConfig, path: isGlobal ? feed : global, params: newParams }
      setIsGlobal(!isGlobal)
      requestData(newConfig)
    }
  }

  const handleReloadArticles = () => {
    const newParams = { ...dataState.requestConfig.params, reload: Date.now() }
    requestData({ ...dataState.requestConfig, params: newParams })
  }

  const prevDataState = usePrev(dataState.data)
  React.useEffect(() => {
    if (dataState.data && dataState.data !== prevDataState) {
      const params = dataState.requestConfig.params
      if (params.reset) {
        params.reset = false
      }
      setPageActive({ ...dataState.data, params })
    }
  }, [dataState.data, dataState.requestConfig.params, prevDataState])

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">{banner.title}</h1>
          <p>{banner.description}</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <TabContent global={isGlobal} onTabClick={handleChangeTab} login={isLogin} />
            <ListArticle
              onRequestReload={handleReloadArticles}
              loading={dataState.isLoading}
              data={pageActive.articles || []}
              pagination={
                <Pagination
                  params={pageActive.params}
                  totalCount={dataState.data && dataState.data.articlesCount}
                  onClick={handleChangePage}
                />
              }
            />
          </div>
          <div className="col-md-3">
            <Sidebar dataTag={tags} onTabClick={handleFilterByTag} />
          </div>
        </div>
      </div>
    </div>
  )
}
Home.propTypes = {
  dataArticle: array,
  dataTag: object,
  banner: object
}

export default Home
