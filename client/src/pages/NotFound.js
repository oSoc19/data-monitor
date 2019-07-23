import React from 'react'

const NotFound = ({ location }) => {
  return (
    <div>
      No match for <code>{location.pathname}</code>
    </div>
  )
}

export default NotFound
