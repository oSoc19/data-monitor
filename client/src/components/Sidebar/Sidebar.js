import React from 'react'
import { useStateValue } from '../../utilities/state'

import { CheckCircle, XCircle } from 'react-feather'
import './Sidebar.sass'

const Sidebar = props => {
  const [{ dataSet }, dispatch] = useStateValue()
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
        <button
          onClick={() => {
            dispatch({
              type: 'changeDataSet',
              newDataSet: { name: 'bridges' }
            })
          }}
        >
          bridges
        </button>
        <button
          onClick={() => {
            dispatch({
              type: 'changeDataSet',
              newDataSet: { name: 'maintenance' }
            })
          }}
        >
          maintenance
        </button>
        <h1>{dataSet.name}</h1>
      </div>
    </div>
  )
}

export default Sidebar
