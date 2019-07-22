import React, { useState } from 'react'
import { useStateValue } from '../../utilities/state'

import './Sidebar.sass'
import { bridgeOpenings, maintenanceWorks, incidents } from '../../config/api'

import { today } from '../../utilities/calendar'
import { Filter } from 'react-feather'

const Sidebar = props => {
  const [{ dataSet }, dispatch] = useStateValue()
  const [visible, toggleVisible] = useState(true)
  return (
    <React.Fragment>
      <button
        style={{ position: 'absolute', zIndex: 100 }}
        onClick={() => {
          toggleVisible(!visible)
        }}
      >
        <Filter />
      </button>
      {visible && (
        <div className='sidebar' style={props.style}>
          <div className='sidebar-section'></div>
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
