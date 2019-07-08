import PropTypes from 'prop-types'
import React, { Component } from 'react'
import logo from '../../assets/logo.svg'
import './Header.sass'

import { Map, Home, PieChart } from 'react-feather'

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
            <a href="/" className="header-nav_link">
              Home
            </a>
            <a href="/map" className="header-nav_link">
              <Map />
            </a>
            <a href="/dashboard" className="header-nav_link">
              <PieChart />
            </a>
          </div>
        </div>
      </div>
    )
  }
}
