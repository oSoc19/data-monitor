import React, { Component } from 'react'

import { PlusCircle } from 'react-feather'
import './Legend.sass'

class Legend extends Component {
  state = {
    collapsed: true
  }

  toggleLegend = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { collapsed } = this.state
    return (
      <div className="legend">
        {!collapsed && (
          <ul className="legend_list">
            <li>Perfect quality</li>
            <li>Good quality</li>
            <li>Reasonable quality</li>
            <li>Mediocre quality</li>
            <li>Bad quality</li>
          </ul>
        )}
        <button className="legend_btn" onClick={this.toggleLegend}>
          <PlusCircle />
          Legend
        </button>
      </div>
    )
  }
}

export default Legend
