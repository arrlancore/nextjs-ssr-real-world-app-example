const { ANALYZE, ASSET_HOST } = process.env
const assetPrefix = ASSET_HOST || ''

const configs = {
  assetPrefix,
  webpack: config => {
    config.output.publicPath = `${assetPrefix}${config.output.publicPath}`

    if (ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8080,
          openAnalyzer: true
        })
      )
    }
    return config
  }
}

module.exports = configs
