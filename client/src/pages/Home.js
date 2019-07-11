import React from 'react'

import { NavLink, Redirect } from 'react-router-dom'

const Home = () => {
  // userType = localStorage.getItem('userType')
  return (
    <React.Fragment>
      <Redirect
        to={{
          pathname: '/mapbox'
        }}
      />
    </React.Fragment>
  )
}

export default Home
