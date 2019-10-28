import React from 'react'
import Layout from '../src/components/Layout'
import { getTokenFromCookie, protectPage } from '../src/libs/userAuth'
import { handleErrorInitialProps } from '../src/libs/errorHandler'
import { serverApiRequest, useApi } from '../src/libs/api'
import { object } from 'prop-types'
import SeoConfig from '../src/components/seoConfig'
import usePrevious from '../src/libs/usePrevious'
import Router from 'next/router'
import TextEditor from '../src/components/TextEditor'

const UpdatePostPage = props => {
  const { slug } = props.router.query
  const requestConfig = !props.initData.data && slug ? { path: `/articles/${slug}`, secure: true } : null
  const [singleArticle, requestSingleArticle] = useApi(requestConfig, props.initData)

  const [values, setValues] = React.useState({
    title: '',
    description: '',
    body: '',
    tagList: ''
  })
  const [isSubmit, setIsSubmit] = React.useState(false)

  const handleChangeValue = key => target => {
    setValues({ ...values, [key]: target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const requestConfig = {
      path: values.edit ? `/articles/${values.slug}` : '/articles',
      method: values.edit ? 'put' : 'post',
      secure: true,
      data: { article: { ...values, tagList: values.tagList.split(',') } }
    }
    setIsSubmit(true)
    requestSingleArticle(requestConfig)
  }

  const prevSingleArticle = usePrevious(singleArticle)
  const prevArticleData = usePrevious(singleArticle.data)
  React.useEffect(() => {
    if (isSubmit && singleArticle.data && singleArticle !== prevSingleArticle) {
      setIsSubmit(false)
      // submit success
      Router.push(`/post?slug=${singleArticle.data.article.slug}`, `/post/${singleArticle.data.article.slug}`)
    }
    if (singleArticle.data && singleArticle.data !== prevArticleData) {
      setValues({ ...singleArticle.data.article, edit: true, tagList: singleArticle.data.article.tagList.join(',') })
    }
  }, [isSubmit, singleArticle, prevSingleArticle, prevArticleData])

  return (
    <Layout protected>
      <SeoConfig title="Editor" />
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              {values.edit ? <h2>Edit</h2> : <h2>New Post</h2>}
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      onChange={({ target }) => handleChangeValue('title')(target)}
                      required
                      type="text"
                      value={values.title}
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                      disabled={singleArticle.isLoading}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      onChange={({ target }) => handleChangeValue('description')(target)}
                      required
                      type="text"
                      value={values.description}
                      className="form-control"
                      placeholder="What's this article about?"
                      disabled={singleArticle.isLoading}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <TextEditor
                      placeholder="Write your article here"
                      markdown={md => handleChangeValue('body')({ value: md })}
                      initValue={values.body}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      onChange={({ target }) => handleChangeValue('tagList')(target)}
                      type="text"
                      className="form-control"
                      value={values.tagList}
                      placeholder="Enter tags"
                      disabled={singleArticle.isLoading}
                    />
                    <div className="tag-list" />
                  </fieldset>
                  <button
                    disabled={singleArticle.isLoading}
                    type="submit"
                    className="btn btn-lg pull-xs-right btn-primary"
                  >
                    {`${values.edit ? 'Update' : 'Publish'} Article`}
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

UpdatePostPage.getInitialProps = async ({ req, res, isServer }) => {
  let initData = {}
  try {
    if (isServer) {
      protectPage(req, res) // this page need authentication
      const cookies = (req && req.headers && req.headers.cookie) || ''
      const token = getTokenFromCookie(cookies) || true
      const { slug } = req.params
      const requestConfigUser = {
        path: `/articles/${slug}`,
        secure: token
      }
      let response = {}
      if (slug) {
        response = await serverApiRequest({ ...requestConfigUser, secure: token })
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
