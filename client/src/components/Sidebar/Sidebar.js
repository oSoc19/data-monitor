import React, { useState } from 'react'
import { useGlobalState } from '../../utilities/state'

import './Sidebar.sass'
import { bridgeOpenings, maintenanceWorks, incidents } from '../../config/api'

import { today } from '../../utilities/calendar'
import { Filter, ArrowLeft } from 'react-feather'

const Sidebar = props => {
  const [{ dataSet, filter }, dispatch] = useGlobalState()
  const [visible, toggleVisible] = useState(true)

  return (
    <React.Fragment>
      <button
        style={{ position: 'absolute', zIndex: 100 }}
        onClick={() => {
          toggleVisible(!visible)
        }}
      >
        {visible ? <ArrowLeft /> : null}
        <Filter />
      </button>
      {visible && (
        <div className='sidebar' style={props.style}>
          <div className='sidebar-section'>
            <input type='text' value='2019-07-08T12:20:38.000Z' />
            <input type='text' value='2019-07-20T12:20:38.000Z' />
            <button
              onClick={() => {
                dispatch({ type: 'filterDataSet', newFilter: { date: 'test' } })
              }}
            ></button>
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
                      download: maintenanceWorks.csv,
                      icon: 'maintenance'
                    }
                  })
                }}
              >
                Maintenance
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: 'changeDataSet',
                    newDataSet: {
                      name: 'incidents',
                      summary: incidents.summary,
                      map: incidents.map,
                      download: incidents.csv,
                      icon: 'incident'
                    }
                  })
                }}
                disabled
              >
                Incidents
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
      )}
    </React.Fragment>
  )
}

export default Sidebar
