import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class Header extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    return (
      <div className="header">
        <logo />
      </div>
    )
  }
}
