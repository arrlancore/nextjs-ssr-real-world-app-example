import React from 'react'
import { string } from 'prop-types'

const EmptyContent = ({ title = 'Ups! No Data Yet' }) => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 120,
      background: '#f7f7f7',
      padding: 10,
      margin: '1rem 0'
    }}
  >
    <span style={{ borderBottom: '2px #ddd dashed', color: '#aaa' }}>{title}</span>
  </div>
)

EmptyContent.propTypes = {
  title: string
}

export default EmptyContent
