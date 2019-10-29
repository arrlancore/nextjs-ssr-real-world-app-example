const sm = require('sitemap')
const axios = require('axios').default

const sitemapConfig = {
  hostname: 'https://nextjs-ssr-real-world-example.herokuapp.com',
  cacheTime: 600000 // 600 sec - cache purge period
}

const setup = server => {
  // create post sitemap
  server.get('/post-sitemap.xml', async (req, res) => {
    const postSitemap = sm.createSitemap(sitemapConfig)
    const getPost = await axios.get('https://conduit.productionready.io/api/articles?limit=500&offer=0&page=1')
    const Posts = getPost.data.articles
    for (let i = 0; i < Posts.length; i += 1) {
      const post = Posts[i]
      postSitemap.add({
        url: `/posts/${post.slug}`,
        changefreq: 'daily',
        priority: 0.9
      })
    }
    const postXml = postSitemap.toXML()
    res.header('Content-Type', 'application/xml')
    res.send(postXml)
  })
  //   create main sitemap
  const mainSitemap = sm.createSitemap(sitemapConfig)
  server.get('/sitemap.xml', (req, res) => {
    mainSitemap.add({
      url: `/`,
      changefreq: 'daily',
      priority: 1
    })
    mainSitemap.add({
      url: `/post-sitemap.xml`,
      changefreq: 'daily',
      priority: 1
    })
    const dataXml = mainSitemap.toXML()
    res.header('Content-Type', 'application/xml')
    res.send(dataXml)
  })
}

module.exports = setup
