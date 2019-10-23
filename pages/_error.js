/**
 * Creating a page named _error.js lets you override HTTP error messages
 */
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { number, object } from 'prop-types'
import Layout from '../src/components/Layout'

class ErrorPage extends React.Component {
  static getInitialProps({ res, xhr }) {
    const errorCode = res ? res.statusCode : xhr ? xhr.status : null
    return { errorCode }
  }

  render() {
    var response
    switch (this.props.errorCode) {
      case 200: // Also display a 404 if someone requests /_error explicitly
      case 404:
        response = (
          <Layout>
            <div className="container page">
              <Head>
                <title>{`Upss sorry! - something error(code: 404)`}</title>
              </Head>
              <h1 className="display-4">Page Not Found</h1>
              <p>
                The page <strong> you are looking is </strong> does not exist.
              </p>
              <p>
                <Link href="/">
                  <a>Go To Home</a>
                </Link>
              </p>
              {/* </div> */}
            </div>
          </Layout>
        )
        break
      case 500:
        response = (
          <div className="container page">
            <Head>
              <title>{`Upss sorry! - something error (code: 500)`}</title>
            </Head>
            <div className="pt-5 text-center">
              <h1 className="display-4">Internal Server Error</h1>
              <p>An internal server error occurred.</p>
            </div>
          </div>
        )
        break
      default:
        response = (
          <Layout>
            <div className="container page">
              <Head>
                <title>{`Upss sorry! - something error`}</title>
              </Head>
              <div className="pt-5 text-center">
                <h1 className="display-4">HTTP {this.props.errorCode} Error</h1>
                <p>
                  An <strong>HTTP {this.props.errorCode}</strong> error occurred while trying to access{' '}
                  <strong>{this.props.router.pathname}</strong>
                </p>
              </div>
            </div>
          </Layout>
        )
    }

    return response
  }
}
ErrorPage.propTypes = {
  errorCode: number,
  router: object
}
export default withRouter(ErrorPage)
