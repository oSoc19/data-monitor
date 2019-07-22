import React from 'react'
import logo from '../../assets/logo.svg'
import './Header.sass'

import { NavLink } from 'react-router-dom'

import { Map, Grid, Info } from 'react-feather'

export const Header = () => {
  return (
    <div className='header'>
      <NavLink to='/mapbox' className='header-brand'>
        <img className='header-brand_logo' src={logo} alt='' />
        <h4 className='header-brand_name'>Verkeersdatamonitor</h4>
      </NavLink>
      <div className='header-nav'>
        <NavLink to='/mapbox' className='header-nav_link'>
          <Map />
          <span>Map</span>
        </NavLink>
        <NavLink to='/dashboard' className='header-nav_link'>
          <Grid />
          Dashboard
        </NavLink>
        <NavLink to='/info' className='header-nav_link'>
          <Info />
          About
        </NavLink>
      </div>
    </div>
  )
}

export default Header
