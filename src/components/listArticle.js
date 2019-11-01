import React from 'react'
import { useApi } from '../libs/api'
import usePrevious from '../libs/usePrevious'
import { array, bool, func, node } from 'prop-types'
import Link from 'next/link'
import EmptyContent from './EmptyContent'
import { MultiplePostLoading } from './Skeletons'

const ListArticle = ({ data, loading, onRequestReload, pagination }) => {
  const [favoritePost, requestFavoritePost] = useApi()
  const favoritePostAction = (favorited, slug) => {
    if (favorited) {
      // unfavorite post
      requestFavoritePost({ path: `/articles/${slug}/favorite`, method: 'delete', secure: true })
    } else {
      // favorite post
      requestFavoritePost({ path: `/articles/${slug}/favorite`, method: 'post', secure: true })
    }
  }
  const prevFavoritePostData = usePrevious(favoritePost.data)
  React.useEffect(() => {
    // after favo/unfavo post update the data article
    if (favoritePost.data && prevFavoritePostData !== favoritePost.data) {
      onRequestReload()
    }
  }, [favoritePost.data, onRequestReload, prevFavoritePostData])
  const isEmpty = !loading && data && data.length === 0
  return (
    <div>
      {isEmpty ? <EmptyContent /> : null}
      {loading ? <MultiplePostLoading /> : null}
      {!isEmpty &&
        !loading &&
        data.map((article, idx) => (
          <div key={idx} className="article-preview">
            <div className="article-meta">
              <Link
                as={`/user-profile/${article.author.username}`}
                href={`/user-profile?username=${article.author.username}`}
              >
                <a>
                  <img src={article.author.image} alt="author-image" />
                </a>
              </Link>
              <div className="info">
                <Link
                  as={`/user-profile/${article.author.username}`}
                  href={`/user-profile?username=${article.author.username}`}
                >
                  <a className="author">{article.author.username}</a>
                </Link>
                <span className="date">{new Date(article.createdAt).toDateString()}</span>
              </div>
              <button
                onClick={() => favoritePostAction(article.favorited, article.slug)}
                className={`btn ${article.favorited ? 'btn-primary' : 'btn-outline-primary'} btn-sm pull-xs-right`}
              >
                <i className="ion-heart" /> {article.favoritesCount}
              </button>
            </div>
            <Link as={`/post/${article.slug}`} href={`/post?slug=${article.slug}`}>
              <a className="preview-link">
                <h1>{article.title}</h1>
                <p>{article.description}</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  {article.tagList.map((tag, idx) => (
                    <li key={idx} className="tag-default tag-pill tag-outline">
                      {tag}
                    </li>
                  ))}
                </ul>
              </a>
            </Link>
          </div>
        ))}
      {pagination}
    </div>
  )
}

ListArticle.propTypes = {
  data: array.isRequired,
  onRequestReload: func,
  pagination: node,
  loading: bool
}

export default ListArticle
