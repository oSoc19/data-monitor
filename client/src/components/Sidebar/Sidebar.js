import React, { useState } from 'React'

import { CheckCircle, XCircle } from 'react-feather'
import './Sidebar.sass'

const Sidebar = props => {
  const [type, setType] = useState('bridges')
  return (
    <div className='sidebar' style={props.style}>
      <h3>Filter</h3>
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
      <div className='data-toggle'>
        <button onClick={() => {}}>bridges</button>
        <button onClick={() => {}}>maintenance</button>
      </div>
    </div>
  )
}

export default Sidebar
