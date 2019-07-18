import React, { useState } from 'react'
import { useStateValue } from '../../utilities/state'

import { CheckCircle, XCircle } from 'react-feather'
import './Sidebar.sass'
import { bridgeOpenings, maintenanceWorks } from '../../config/api'

const Sidebar = props => {
  const [{ dataSet }, dispatch] = useStateValue()
  return (
    <div className='sidebar' style={props.style}>
      <div className='sidebar-section'>
        <h4>Filter</h4>
        <label>Start date</label>
        <input type='date' />
        <label>End date</label>
        <input type='date' />
      </div>
      <div className='sidebar-section'>
        <h4>Datasets</h4>
        <div className='data-toggle'>
          <button
            onClick={() => {
              dispatch({
                type: 'changeDataSet',
                newDataSet: {
                  name: 'bridges',
                  summary: bridgeOpenings.summary,
                  map: bridgeOpenings.map,
                  download: bridgeOpenings.csv,
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
                  download: bridgeOpenings.csv,
                  icon: 'bridge'
                }
              })
            }}
          >
            Maintenance
          </button>
        </div>

        {/* <pre>{dataSet.summary}</pre> */}
      </div>
      <div className='sidebar-section'>
        <h4>Dataset actions</h4>
        <button
          onClick={() => {
            const downloadUrl = dataSet.download
            window.open(downloadUrl)
          }}
        >
          {`Download ${dataSet.name}`}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
