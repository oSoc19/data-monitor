import React, { Component } from 'react'
import logo from '../../assets/logo.svg'
import './Header.sass'

import { NavLink } from 'react-router-dom'

import { Map, Grid, Info, Activity } from 'react-feather'

export default class Header extends Component {
  render() {
    return (
      <div className='header'>
        <NavLink to='/mapbox' className='header-brand'>
          <img className='header-brand_logo' src={logo} alt='' />
          <p className='header-brand_name'>Verkeersdatamonitor</p>
        </NavLink>
        <div className='header-nav'>
          <NavLink to='/mapbox' className='header-nav_link'>
            <Map />
          </NavLink>
          <NavLink to='/dashboard' className='header-nav_link'>
            <Grid />
          </NavLink>
          <NavLink to='/info' className='header-nav_link'>
            <Info />
          </NavLink>
        </div>
      </div>
    )
  }
}
