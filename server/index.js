const path = require('path')
const next = require('next')
const helmet = require('helmet')
const express = require('express')
const compression = require('compression')
const sitemap = require('./sitemap')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const port = process.env.PORT || 3100

const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(helmet())
  server.use(compression())

  const staticPath = path.join(__dirname, '../public')
  server.use(
    '/public',
    express.static(staticPath, {
      maxAge: '30d',
      immutable: true
    })
  )

  sitemap(server)
  // custom route pages
  server.get('/post/:slug', (req, res) => {
    return app.render(req, res, '/post', { slug: req.params.slug })
  })

  server.get('/user-profile/:username', (req, res) => {
    return app.render(req, res, '/user-profile', { username: req.params.username })
  })

  server.get('/update-post/edit/:slug', (req, res) => {
    return app.render(req, res, '/update-post', { slug: req.params.slug })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  startServer()

  function startServer() {
    server.listen(port, () => {
      console.log(`Your Apps Ready on http://localhost:${port}`)
    })
  }
})
