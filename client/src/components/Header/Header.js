import PropTypes from 'prop-types'
import React, { Component } from 'react'
import logo from '../../assets/logo.svg'
import './Header.sass'

import { NavLink } from 'react-router-dom'

import { Map, Grid, Info, Activity } from 'react-feather'

export default class Header extends Component {
  render() {
    return (
      <div className="header-wrapper">
        <div className="header">
          <div className="header-brand">
            <img className="header-brand_logo" src={logo} alt="" />
            <h1 className="header-brand_name">Liquid Traffic</h1>
          </div>
          <div className="header-nav">
            <NavLink to="/map" className="header-nav_link">
              <Map />
            </NavLink>
            <NavLink to="/dashboard" className="header-nav_link">
              <Grid />
            </NavLink>
            <NavLink to="/quality-monitor" className="header-nav_link">
              <Activity />
            </NavLink>
            <NavLink to="/info" className="header-nav_link">
              <Info />
            </NavLink>
          </div>
        </div>
      </div>
    )
  }
}
