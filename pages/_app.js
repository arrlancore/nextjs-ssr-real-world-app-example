import App from 'next/app'
import React from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import styledNormalize from 'styled-normalize'
import { AuthProvider } from '../src/libs/context'
import { theme } from '../src/config'
import NextNprogress from 'nextjs-progressbar'

const NormalizeStyle = createGlobalStyle`
  ${styledNormalize}
`
const dev = process.env.NODE_ENV !== 'production'
const registrationSw = () => {
  // ServiceWorker is a progressive technology. Ignore unsupported browsers
  if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.')
    navigator.serviceWorker.register('service-worker.js').then(
      function() {
        console.log('CLIENT: service worker registration complete.')
      },
      function() {
        console.log('CLIENT: service worker registration failure.')
      }
    )
  } else {
    console.log('CLIENT: service worker is not supported.')
  }
}
class MainApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const cookies = ctx && ctx.req ? ctx.req.headers.cookie : ''
    const isServer = !process.browser
    const componentInitProps = Component.getInitialProps ? await Component.getInitialProps({ ...ctx, isServer }) : {}
    return {
      cookies,
      pageProps: componentInitProps
    }
  }
  componentDidMount() {
    !dev && registrationSw()
  }

  render() {
    const { Component, pageProps, cookies, router } = this.props
    const defaultTitle = 'Next SSR - Real World App Example'
    return (
      <ThemeProvider theme={theme}>
        <Head>
          <title>{defaultTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content={defaultTitle} />
          <link
            href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans
                :400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
            rel="stylesheet"
            type="text/css"
          />
          <link rel="stylesheet" href="/main.css" />
          <link rel="stylesheet" href="/rt.min.css" />
          <link rel="stylesheet" href="/editor.css" />
          <link rel="manifest" href="/manifest.json" />
          <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css" />
        </Head>
        <NextNprogress color="#5cb85c" options={{ showSpinner: false }} />
        <NormalizeStyle />
        <AuthProvider cookies={cookies}>
          <Component router={router} {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    )
  }
}

export default withRouter(MainApp)
