import React from 'react'
import { object, node } from 'prop-types'

const HomepageContent = ({ banner, children, sidebar }) => {
  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">{banner.title}</h1>
          <p>{banner.description}</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">{children}</div>
          <div className="col-md-3">{sidebar}</div>
        </div>
      </div>
    </div>
  )
}
HomepageContent.propTypes = {
  children: node,
  sidebar: node,
  banner: object
}

export default HomepageContent
