import React from 'react'
import marked from 'marked'
import Link from 'next/link'
import { array } from 'prop-types'
import { useApi } from '../libs/api'
import { isMine } from '../libs/userAuth'
import usePrev from '../libs/usePrevious'
import Router from 'next/router'
import { toast } from 'react-toastify'
import { SinglePostLoading } from './Skeletons'

const ViewArticle = ({ apiArticle }) => {
  const [dataArticle, requestDataArticle] = apiArticle
  const [data, setData] = React.useState(dataArticle.data)
  const [comment, setComment] = React.useState()
  const [favoritePost, requestFavoritePost] = useApi()
  const [followUser, requestFollowUser] = useApi()
  const [listComment, requestListComment] = useApi()
  const [singleComment, requestSingleComment] = useApi()

  const handleDeleteArticle = slug => {
    requestDataArticle({ path: `/articles/${slug}`, method: 'delete', secure: true })
  }

  const favoritePostAction = (favorited, slug) => {
    if (favorited) {
      // unfavorite post
      requestFavoritePost({ path: `/articles/${slug}/favorite`, method: 'delete', secure: true })
    } else {
      // favorite post
      requestFavoritePost({ path: `/articles/${slug}/favorite`, method: 'post', secure: true })
    }
  }

  const folowUserAction = (following, username) => {
    if (following) {
      // unfollow user
      requestFollowUser({ path: `/profiles/${username}/follow`, method: 'delete', secure: true })
    } else {
      // follow user
      requestFollowUser({ path: `/profiles/${username}/follow`, method: 'post', secure: true })
    }
  }

  const commentActions = {
    get: (slug, reload) => {
      requestListComment({ path: `/articles/${slug}/comments`, params: { reload: reload ? Date.now() : '' } })
    },
    add: (slug, body, event) => {
      event.preventDefault()
      const data = { comment: { body } }
      requestSingleComment({ path: `/articles/${slug}/comments`, method: 'post', data, secure: true })
    },
    delete: (slug, commentId) => {
      requestSingleComment({ path: `/articles/${slug}/comments/${commentId}`, method: 'delete', secure: true })
    }
  }

  // track the previous state / props
  const prevDataArticle = usePrev(dataArticle.data)
  const prevFavoritePostData = usePrev(favoritePost.data)
  const prevFollowUserData = usePrev(followUser.data)
  const prevData = usePrev(data)
  const prevSingleCommentData = usePrev(singleComment.data)
  // assign data to local state
  React.useEffect(() => {
    // passing props to local state
    // so we modify it on the future
    if (dataArticle.data && dataArticle.data.article && dataArticle.data !== prevDataArticle) {
      setData(dataArticle.data)
    }
    if (dataArticle.data && !dataArticle.data.article && prevDataArticle && prevDataArticle.article) {
      toast.info('Post has been deleted', {
        autoClose: 2000,
        onClose: () => {
          Router.push(
            `/user-profile?username=${prevDataArticle.article.author.username}`,
            `/user-profile/${prevDataArticle.article.author.username}`
          )
        }
      })
    }
    // after favo/unfavo post update the data article
    if (favoritePost.data && prevFavoritePostData !== favoritePost.data) {
      setData(favoritePost.data)
    }
    // after foll/unfoll user, update data article
    if (followUser.data && prevFollowUserData !== followUser.data) {
      const author = followUser.data.profile
      setData({ ...data, article: { ...data.article, author } })
    }
    // load comment after data article load
    if (data && !listComment.data && prevData !== data) {
      commentActions.get(data.article.slug)
    }
    // load comment after add, edit or delete
    if (singleComment.data && singleComment.data !== prevSingleCommentData) {
      commentActions.get(data.article.slug, true)
      setComment('')
    }
  }, [
    commentActions,
    data,
    dataArticle.data,
    favoritePost.data,
    followUser.data,
    listComment,
    prevData,
    prevDataArticle,
    prevFavoritePostData,
    prevFollowUserData,
    prevSingleCommentData,
    singleComment.data,
    singleComment.isLoading
  ])

  // prepare data to shown on the page
  const { title, body, createdAt, favorited, slug, favoritesCount, author } = data ? data.article : {}
  const dataAuthor = author || {}
  const dataComment = (listComment.data && listComment.data.comments) || []
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{title}</h1>

          <div className="article-meta">
            <Link as={`/user-profile/${dataAuthor.username}`} href={`/user-profile?username=${dataAuthor.username}`}>
              <a>
                <img src={dataAuthor.image} alt="author-image" />
              </a>
            </Link>
            <div className="info">
              <Link as={`/user-profile/${dataAuthor.username}`} href={`/user-profile?username=${dataAuthor.username}`}>
                <a className="author">{dataAuthor.username}</a>
              </Link>
              <span className="date">{new Date(createdAt).toDateString()}</span>
            </div>
            {!isMine(dataAuthor.username) ? (
              <>
                <button
                  onClick={() => folowUserAction(dataAuthor.following, dataAuthor.username)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="ion-plus-round" />
                  &nbsp; {`${dataAuthor.following ? 'Unfollow' : 'Follow'} ${dataAuthor.username}`}{' '}
                  {/* <span className="counter">(10)</span> */}
                </button>
                &nbsp;&nbsp;
                <button onClick={() => favoritePostAction(favorited, slug)} className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart" />
                  &nbsp; {`${favorited ? 'Unfavorited' : 'Favorited'}`} Post{' '}
                  <span className="counter">({favoritesCount})</span>
                </button>
                &nbsp;&nbsp;
              </>
            ) : (
              ''
            )}
            {isMine(dataAuthor.username) ? (
              <>
                <Link href={`/update-post?slug=${slug}`} as={`/update-post/edit/${slug}`}>
                  <a className="btn btn-outline-secondary btn-sm">
                    <i className="ion-edit"></i> Edit Article
                  </a>
                </Link>
                &nbsp;&nbsp;
                <button onClick={() => handleDeleteArticle(slug)} className="btn btn-outline-danger btn-sm">
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            {dataArticle.isLoading ? (
              <SinglePostLoading />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: marked(body || '') }} />
            )}
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link as={`/user-profile/${dataAuthor.username}`} href={`/user-profile?username=${dataAuthor.username}`}>
              <a>
                <img src={dataAuthor.image} alt="author-image" />
              </a>
            </Link>
            <div className="info">
              <Link as={`/user-profile/${dataAuthor.username}`} href={`/user-profile?username=${dataAuthor.username}`}>
                <a className="author">{dataAuthor.username}</a>
              </Link>
              <span className="date">{new Date(createdAt).toDateString()}</span>
            </div>
            {!isMine(dataAuthor.username) ? (
              <>
                <button
                  onClick={() => folowUserAction(dataAuthor.following, dataAuthor.username)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="ion-plus-round" />
                  &nbsp; {`${dataAuthor.following ? 'Unfollow' : 'Follow'} ${dataAuthor.username}`}{' '}
                  {/* <span className="counter">(10)</span> */}
                </button>
                &nbsp;
                <button onClick={() => favoritePostAction(favorited, slug)} className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart" />
                  &nbsp; {`${favorited ? 'Unfavorited' : 'Favorited'}`} Post{' '}
                  <span className="counter">({favoritesCount})</span>
                </button>
              </>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  value={comment}
                  onChange={({ target }) => setComment(target.value)}
                  className="form-control"
                  placeholder="Write a comment..."
                  rows="3"
                />
              </div>
              <div className="card-footer">
                <img src={dataAuthor.image} alt="author-image" className="comment-author-img" />
                <button
                  onClick={e => commentActions.add(slug, comment, e)}
                  disabled={!comment}
                  className="btn btn-sm btn-primary"
                >
                  Post Comment
                </button>
              </div>
            </form>

            {dataComment.map((commentObj, idx) => (
              <div key={idx} className="card">
                <div className="card-block">
                  <p className="card-text">{commentObj.body}</p>
                </div>
                <div className="card-footer">
                  <Link
                    as={`/user-profile/${commentObj.author.username}`}
                    href={`/user-profile?username=${commentObj.author.username}`}
                  >
                    <a className="comment-author">
                      <img src={commentObj.author.image} alt="author-image" className="comment-author-img" />
                    </a>
                  </Link>
                  &nbsp;
                  <Link
                    as={`/user-profile/${commentObj.author.username}`}
                    href={`/user-profile?username=${commentObj.author.username}`}
                  >
                    <a className="comment-author">{commentObj.author.username}</a>
                  </Link>
                  <span className="date-posted">{new Date(commentObj.createdAt).toLocaleString()}</span>
                  <span className="mod-options">
                    {/* <i className="ion-edit"></i> */}
                    {isMine(commentObj.author.username) ? (
                      <i onClick={() => commentActions.delete(slug, commentObj.id)} className="ion-trash-a"></i>
                    ) : (
                      ''
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
ViewArticle.propTypes = { apiArticle: array }
export default ViewArticle
