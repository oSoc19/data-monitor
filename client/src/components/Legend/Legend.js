import React, { Component } from 'react'

import { PlusCircle } from 'react-feather'
import './Legend.sass'

class Legend extends Component {
  render() {
    return (
      <div className="legend">
        <button>
          <PlusCircle />
          Legend
        </button>
        <h1>Legend</h1>
      </div>
    )
  }
}

export default Legend
