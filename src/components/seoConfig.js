import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { siteConfig } from '../config'

function SeoConfig({ description, lang, meta, title, image }) {
  const metaDescription = description || siteConfig.siteDescription
  const metaTitle = title || siteConfig.siteTitle
  const metaImage = image || siteConfig.siteLogo
  const type = 'website'
  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={metaTitle}
      titleTemplate={`%s | ${siteConfig.siteTitle}`}
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: metaTitle
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:image`,
          content: metaImage
        },
        {
          property: `og:type`,
          content: type
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`
        },
        {
          name: `twitter:creator`,
          content: siteConfig.author
        },
        {
          name: `twitter:title`,
          content: metaTitle
        },
        {
          name: `twitter:description`,
          content: metaDescription
        }
      ].concat(meta)}
    />
  )
}

SeoConfig.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``
}

SeoConfig.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  image: PropTypes.string
}

export default SeoConfig
