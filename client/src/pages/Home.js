import React from 'react'

import { NavLink, Redirect } from 'react-router-dom'

const Home = () => {
  // userType = localStorage.getItem('userType')
  return (
    <React.Fragment>
      <div className='grid-wrapper'>
        <h2>Choose a dataset</h2>
        <div className='grid-item'>Bridges</div>
        <div className='grid-item'>Maintenance</div>
        <div className='grid-item'>Incidents</div>
        <div className='grid-item'>Logistics</div>
      </div>
      <Redirect
        to={{
          pathname: '/mapbox'
        }}
      />
    </React.Fragment>
  )
}

export default Home
