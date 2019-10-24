import React from 'react'
import { bool, func } from 'prop-types'

export function TabHomePage({ global, onTabClick, login }) {
  const tabNames = { FEED: 'feed', GLOBAL: 'global' }
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {login ? (
          <li style={{ cursor: 'pointer' }} onClick={() => onTabClick(tabNames.FEED)} className="nav-item">
            <span className={`nav-link ${global ? '' : 'active'}`}>Your Feed</span>
          </li>
        ) : (
          ''
        )}
        <li style={{ cursor: 'pointer' }} onClick={() => onTabClick(tabNames.GLOBAL)} className="nav-item">
          <span className={`nav-link ${global ? 'active' : ''}`}>Global Feed</span>
        </li>
      </ul>
    </div>
  )
}
TabHomePage.propTypes = {
  global: bool,
  login: bool,
  onTabClick: func
}
