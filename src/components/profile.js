import React, { useState } from 'react'
import { isMine } from '../libs/userAuth'
import Router from 'next/router'
import { useApi } from '../libs/api'
import { getPage } from '../libs/page'
import { string, func, array } from 'prop-types'
import ListArticle from './listArticle'
import usePrevious from '../libs/usePrevious'
import Pagination from './pagination'

export const TabContent = ({ activeTab, onTabClick }) => {
  const TAB_NAMES = { MY_ARTICLE: 'My Articles', FAVORITES_ARTICLE: 'Favorite Articles' }
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li style={{ cursor: 'pointer' }} onClick={() => onTabClick(TAB_NAMES.MY_ARTICLE)} className="nav-item">
          <span className={`nav-link ${activeTab === TAB_NAMES.MY_ARTICLE ? 'active' : ''}`}>My Article</span>
        </li>
        <li style={{ cursor: 'pointer' }} onClick={() => onTabClick(TAB_NAMES.FAVORITES_ARTICLE)} className="nav-item">
          <span className={`nav-link ${activeTab === TAB_NAMES.FAVORITES_ARTICLE ? 'active' : ''}`}>
            Favorite Article
          </span>
        </li>
      </ul>
    </div>
  )
}
TabContent.propTypes = {
  activeTab: string,
  onTabClick: func
}

const Profile = ({ userApi, username }) => {
  const TAB_NAMES = { MY_ARTICLE: 'My Articles', FAVORITES_ARTICLE: 'Favorite Articles' }
  const INIT_PAGE_CONFIG = { PAGE: 1, LIMIT: 5 }
  const [userData, requestUserData] = userApi
  const [activeTab, setActiveTab] = useState(TAB_NAMES.MY_ARTICLE)
  const [pageActive, setPageActive] = useState({})
  const [followUser, requestFollowUser] = useApi()
  const initialRequestConfigArticle = {
    path: `/articles`,
    secure: 'optional',
    params: { author: username, ...getPage(INIT_PAGE_CONFIG.PAGE, INIT_PAGE_CONFIG.LIMIT) }
  }
  const [articleData, requestArticleData] = useApi()

  const folowUserAction = (following, username) => {
    if (following) {
      // unfollow user
      requestFollowUser({ path: `/profiles/${username}/follow`, method: 'delete', secure: true })
    } else {
      // follow user
      requestFollowUser({ path: `/profiles/${username}/follow`, method: 'post', secure: true })
    }
  }
  const handleReloadArticles = () => {
    const newParams = { ...articleData.requestConfig.params, reload: Date.now() }
    requestArticleData({ ...articleData.requestConfig, params: newParams })
  }

  const handleTabClick = tabName => {
    let params = {}
    const newPageParams = getPage(INIT_PAGE_CONFIG.PAGE, INIT_PAGE_CONFIG.LIMIT)
    if (tabName === TAB_NAMES.MY_ARTICLE) {
      params = { ...newPageParams, author: username }
    } else {
      params = { ...newPageParams, favorited: username }
    }
    requestArticleData({ ...articleData.requestConfig, params })
    setActiveTab(tabName)
  }
  const handleChangePage = newPageNumber => {
    if (articleData.pages[newPageNumber]) {
      const newParams = { ...pageActive.params, pageNumber: newPageNumber }
      return setPageActive({ ...articleData.pages[newPageNumber], params: newParams })
    }
    const newRequestParams = getPage(newPageNumber, INIT_PAGE_CONFIG.LIMIT)
    const newConfig = { ...articleData.requestConfig, params: { ...pageActive.params, ...newRequestParams } }
    requestArticleData(newConfig)
  }
  const prevArticleData = usePrevious(articleData.data)
  const prevFollowUserData = usePrevious(followUser)
  React.useEffect(() => {
    if (articleData.data && articleData.data !== prevArticleData) {
      setPageActive({ ...articleData.data, params: articleData.requestConfig.params })
    }
    if (followUser.data && prevFollowUserData !== followUser.data) {
      const paramsForReload = { ...followUser.requestConfig.params, reload: Date.now() }
      requestUserData({ ...followUser.requestConfig, params: paramsForReload })
    }
  }, [
    articleData.data,
    articleData.requestConfig.params,
    followUser.data,
    followUser.requestConfig,
    prevArticleData,
    prevFollowUserData,
    requestUserData
  ])
  const prevUserData = usePrevious(userData.data)
  React.useEffect(() => {
    if (userData.data && userData.data !== prevUserData) {
      requestArticleData(initialRequestConfigArticle)
      setActiveTab(TAB_NAMES.MY_ARTICLE)
    }
  }, [userData.data, prevUserData, requestArticleData, initialRequestConfigArticle, TAB_NAMES.MY_ARTICLE])

  const user = userData && userData.data ? userData.data.profile : {}
  const { bio, image, following } = user
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={image} alt="user-image" className="user-img" />
              <h4>{username}</h4>
              <p>{bio}</p>
              {isMine(username) ? (
                <button onClick={() => Router.push('/setting')} className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a" />
                  &nbsp; {`Edit Profile`}
                </button>
              ) : (
                <button
                  onClick={() => folowUserAction(following, username)}
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-plus-round" />
                  &nbsp; {`${following ? 'Unfollow' : 'Follow'} ${username}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <TabContent onTabClick={handleTabClick} activeTab={activeTab} />

            <ListArticle
              data={pageActive.articles || []}
              loading={articleData.isLoading}
              onRequestReload={handleReloadArticles}
              pagination={
                <Pagination
                  params={pageActive.params || {}}
                  totalCount={articleData.data && articleData.data.articlesCount}
                  onClick={handleChangePage}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
Profile.propTypes = {
  userApi: array,
  username: string
}
export default Profile
