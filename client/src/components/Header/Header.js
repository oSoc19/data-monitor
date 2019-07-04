import PropTypes from 'prop-types'
import React, { Component } from 'react'
import logo from '../../assets/logo.svg'
import './Header.sass'

export default class Header extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    return (
      <div className="header">
        <div className="header-brand">
          <img className="header-brand_logo" src={logo} alt="" />
          <h1 className="header-brand_name">Liquid Traffic</h1>
        </div>
      </div>
    )
  }
}
