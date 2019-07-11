import React, { Component } from 'react'

import {
  PlusCircle,
  BarChart,
  CheckCircle,
  Circle,
  MinusCircle,
  AlertCircle,
  XCircle
} from 'react-feather'
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
      <div className="legend" style={this.props.style}>
        {!collapsed && (
          <ul className="legend_list">
            <h3>
              <BarChart />
              Data quality
            </h3>
            <li>
              <CheckCircle />
              Perfect quality
            </li>
            <li>
              <Circle />
              Good quality
            </li>
            <li>
              <MinusCircle />
              Reasonable quality
            </li>
            <li>
              <AlertCircle />
              Mediocre quality
            </li>
            <li>
              <XCircle />
              Bad quality
            </li>
          </ul>
        )}
        <button className="legend_btn" onClick={this.toggleLegend}>
          {collapsed ? <PlusCircle /> : <XCircle />}
          Legend
        </button>
      </div>
    )
  }
}

export default Legend
