import React from 'react'

/**
 * 404 Page
 */
const NotFound = ({ location }) => {
  return (
    <div>
      No match for <code>{location.pathname}</code>
    </div>
  )
}

export default NotFound
