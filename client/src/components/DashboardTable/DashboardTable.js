import React, { useState, useEffect } from 'react'
import './DashboardTable.sass'
import { DashboardDetail } from '../DashboardDetail'
import { Download, Check, X, Percent, Plus } from 'react-feather'
import { Pie } from 'react-chartjs-2'
import { apiUrl } from '../../config/api'

import Loader from '../../components/Loader'

import { useGlobalState } from '../../utilities/state'

/**
 * Region levels
 * - 3: country
 * - 2: region
 * - 1: province
 * - 0: city
 */
const levelInfo = ['country', 'region', 'province', 'city']

const DashboardTable = props => {
  const [state, setState] = useState({ level: 1, summary: [], loading: true })
  const [{ dataSet, filter }] = useGlobalState()

  /**
   * Fetch data on mount
   * Fetch data on dataset change
   */
  useEffect(() => {
    fetchSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet])

  /**
   * Fetch data from global state endpoint
   */
  const fetchSummary = async () => {
    let res = await fetch(dataSet.summary)
    let summary = await res.json()
    setState({ ...state, summary, loading: false })
  }

  /**
   * @param {number} goodEvents
   * @param {number} badEvents
   * @return {number} data quality percentage
   */
  const getEventDataQuality = (goodEvents, badEvents) => {
    if ((goodEvents === 0 && badEvents === 0) || goodEvents === 0) {
      return 0
    } else if (badEvents === 0) {
      return 100
    } else {
      return 100 - (badEvents / goodEvents) * 100
    }
  }

  const { summary, level, loading } = state
  if (!loading) {
    return (
      <React.Fragment>
        <h4>Overview {dataSet.name} datapoints</h4>
        <div className='dashboard-container'>
          {summary && level < 3 ? (
            summary.map(item => {
              const { numberOfGoodEvents, numberOfBadEvents } = item.summary
              return (
                <div
                  /**
                   * Go to next region level
                   * - fetch data for next level
                   * - set state to next level
                   */
                  onClick={async () => {
                    fetch(`${apiUrl}${item.nextUrl}`)
                      .then(res => res.json())
                      .then(summary => {
                        setState({ summary, level: level + 1 })
                      })
                  }}
                  className='dashboard-item'
                  key={item.name}
                  style={{
                    border:
                      /**
                       * Get border color from percentage
                       * TODO: use getColorFromValue utility ('../../utilities/visualisation)'
                       */
                      getEventDataQuality(
                        numberOfGoodEvents,
                        numberOfBadEvents
                      ) === 100
                        ? '1px solid rgba(0,255,0, .5)'
                        : getEventDataQuality(
                            numberOfGoodEvents,
                            numberOfBadEvents
                          ) > 50
                        ? '1px solid rgba(255,128,0, .5)'
                        : '1px solid rgba(255,0,0, .5)'
                  }}
                >
                  <div className='dashboard-item_header'>
                    <h4>{item.name}</h4>
                    <button
                      className='btn-outline'
                      type='submit'
                      title='csv'
                      onClick={e => {
                        /**
                         * Download dataset
                         */
                        e.stopPropagation()
                        const downloadUrlEndpoint = item.nextUrl.replace(
                          '/qa/',
                          '/download/'
                        )
                        const downloadUrl = `${apiUrl}${downloadUrlEndpoint}`
                        window.open(downloadUrl)
                      }}
                    >
                      <Download />
                      csv
                    </button>
                  </div>
                  <hr />
                  <div>
                    {numberOfGoodEvents > 0 || numberOfBadEvents > 0 ? (
                      <Pie
                        data={{
                          datasets: [
                            {
                              label: 'Data quality',
                              data: [numberOfGoodEvents, numberOfBadEvents],
                              backgroundColor: [
                                'rgba(0, 255, 0, .5)',
                                'rgba(255, 0, 0, .5)'
                              ]
                            }
                          ],
                          labels: ['Correct datapoints', 'Incorrect datapoints']
                        }}
                      />
                    ) : (
                      <div className='center'>
                        <h5>No event data available</h5>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            /**
             * Render summary for events overview
             */
            <DashboardDetail summary={summary} />
          )}
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <div className='center'>
        <Loader text='Loading dashboard' />
      </div>
    )
  }
}

export default DashboardTable
