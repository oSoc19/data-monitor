import React, { useState } from 'react'
import { useStateValue } from '../../utilities/state'

import { CheckCircle, XCircle } from 'react-feather'
import './Sidebar.sass'
import { bridgeOpenings, maintenanceWorks } from '../../config/api'

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
        {/* <button type='submit'>
          <CheckCircle />
          Confirm
        </button>
        <button type='submit'>
          <XCircle />
          Clear
        </button> */}
      </div>
      <div className='data-toggle'>
        <button
          onClick={() => {
            dispatch({
              type: 'changeDataSet',
              newDataSet: {
                name: 'bridges',
                summary: bridgeOpenings.summary,
                map: bridgeOpenings.map,
                icon: 'bridge'
              }
            })
          }}
        >
          Bridges
        </button>
        <button
          onClick={() => {
            dispatch({
              type: 'changeDataSet',
              newDataSet: {
                name: 'maintenance',
                summary: maintenanceWorks.summary,
                map: maintenanceWorks.map,
                icon: 'bridge'
              }
            })
          }}
        >
          Maintenance
        </button>
        <h4>{dataSet.name}</h4>
        <p>{dataSet.summary}</p>
      </div>
    </div>
  )
}

export default Sidebar
