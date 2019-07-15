import React from 'react'

import { CheckCircle, XCircle } from 'react-feather'
import './Sidebar.sass'

const Sidebar = props => {
  return (
    <div className='sidebar' style={props.style}>
      <h3>Filter</h3>
      <label>Show bridges</label>
      <input type='checkbox' onClick={props.onClick} />
      <label>Start date</label>
      <input type='date' />
      <label>End date</label>
      <input type='date' />
      <div className='filter-actions'>
        <button type='submit'>
          <CheckCircle />
          Confirm
        </button>
        <button type='submit'>
          <XCircle />
          Clear
        </button>
      </div>
    </div>
  )
}

export default Sidebar
