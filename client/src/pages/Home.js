import React from 'react'
import { Redirect } from 'react-router-dom'
import LayoutWrapper from '../components/LayoutWrapper'

const Home = () => {
  // localStorage.setItem('userType', 'bridge')
  // userType = localStorage.getItem('userType')
  return (
    <LayoutWrapper>
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
    </LayoutWrapper>
  )
}

export default Home
