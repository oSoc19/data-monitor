import React, { useState } from 'react'
import { useGlobalState } from '../../utilities/state'

import './Sidebar.sass'

import { bridgeOpenings, maintenanceWorks, accidents } from '../../config/api'

import { now, yesterday, lastWeek, lastMonth } from '../../utilities/calendar'
import { Filter, X, Download } from 'react-feather'

import bridgeIcon from '../../assets/icons/bridge.png'
import maintenanceIcon from '../../assets/icons/maintenance.png'
import accidentIcon from '../../assets/icons/incident.png'

const Sidebar = props => {
  const [{ dataSet, filter }, dispatch] = useGlobalState()
  const [visible, toggleVisible] = useState(true)

  const { range } = filter.date

  return (
    <React.Fragment>
      {/* <button
        className='filter-toggle'
        onClick={() => {
          toggleVisible(!visible)
        }}
      >
        {visible ? <X /> : null}
        <Filter />
      </button> */}
      {visible && (
        <div className='sidebar' style={props.style}>
          <div className='sidebar-section'>
            <h4>Filter</h4>
            {/* <input type='text' value='2019-07-08T12:20:38.000Z' />
            <input type='text' value='2019-07-20T12:20:38.000Z' /> */}
            <div className='data-toggle'>
              <button
                className={range === 'day' ? 'btn-active' : ''}
                onClick={() => {
                  dispatch({
                    type: 'filterDataSet',
                    newFilter: {
                      date: {
                        range: 'day',
                        query: `/?startTime=${yesterday}&endTime=${now}`
                      }
                    }
                  })
                }}
              >
                24 Hours
              </button>
            </div>
            <div className='data-toggle'>
              <button
                className={range === 'week' ? 'btn-active' : ''}
                onClick={() => {
                  dispatch({
                    type: 'filterDataSet',
                    newFilter: {
                      date: {
                        range: 'week',
                        query: `/?startTime=${lastWeek}&endTime=${now}`
                      }
                    }
                  })
                }}
              >
                7 Days
              </button>
            </div>
            <div className='data-toggle'>
              <button
                className={range === 'month' ? 'btn-active' : ''}
                onClick={() => {
                  dispatch({
                    type: 'filterDataSet',
                    newFilter: {
                      date: {
                        range: 'month',
                        query: `/?startTime=${lastMonth}&endTime=${now}`
                      }
                    }
                  })
                }}
              >
                1 Month
              </button>
            </div>
          </div>
          <div className='sidebar-section'>
            <h4>Datasets</h4>
            <div className='data-toggle'>
              <button
                className={dataSet.name === 'bridges' ? 'btn-active' : ''}
                onClick={() => {
                  dispatch({
                    type: 'changeDataSet',
                    newDataSet: {
                      name: 'bridges',
                      summary: bridgeOpenings.summary,
                      map: bridgeOpenings.map,
                      fetchEvent: bridgeOpenings.fetchEvent,
                      download: bridgeOpenings.csv,
                      icon: 'bridge'
                    }
                  })
                }}
              >
                <img src={bridgeIcon} alt='' />
                Bridges
              </button>
              <button
                className={dataSet.name === 'maintenance' ? 'btn-active' : ''}
                onClick={() => {
                  dispatch({
                    type: 'changeDataSet',
                    newDataSet: {
                      name: 'maintenance',
                      summary: maintenanceWorks.summary,
                      map: maintenanceWorks.map,
                      fetchEvent: maintenanceWorks.fetchEvent,
                      download: maintenanceWorks.csv,
                      icon: 'maintenance'
                    }
                  })
                }}
              >
                <img src={maintenanceIcon} alt='' />
                Maintenance
              </button>
              <button
                className={dataSet.name === 'accident' ? 'btn-active' : ''}
                onClick={() => {
                  dispatch({
                    type: 'changeDataSet',
                    newDataSet: {
                      name: 'accident',
                      summary: accidents.summary,
                      map: accidents.map,
                      fetchEvent: accidents.fetchEvent,
                      download: accidents.csv,
                      icon: 'accident'
                    }
                  })
                }}
              >
                <img src={accidentIcon} alt='' />
                Accidents
              </button>
            </div>
            {/* <pre>{dataSet.summary}</pre> */}
          </div>
          <div className='sidebar-section'>
            <div className='data-toggle'>
              <h4>Dataset actions</h4>
              <button
                onClick={() => {
                  const downloadUrl = dataSet.download
                  window.open(downloadUrl)
                }}
              >
                <Download />
                {`${dataSet.name}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default Sidebar
