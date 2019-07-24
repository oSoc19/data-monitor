import React from 'react'
import { Redirect } from 'react-router-dom'
import LayoutWrapper from '../components/LayoutWrapper'

/**
 * First time user dataset selection page
 */
const Home = () => {
  // TODO: screen to select initialState dataset for first time users
  // localStorage.setItem('userType', 'bridge')
  // userType = localStorage.getItem('userType')
  return (
    <LayoutWrapper>
      <h2>Choose a dataset</h2>
      <div className='grid-item'>Bridges</div>
      <div className='grid-item'>Maintenance</div>
      <div className='grid-item'>Incidents</div>
      <div className='grid-item'>Logistics</div>
      <Redirect
        to={{
          pathname: '/mapbox'
        }}
      />
    </LayoutWrapper>
  )
}

export default Home
