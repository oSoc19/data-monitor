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
  const [{ dataSet }] = useGlobalState()

  useEffect(() => {
    fetchSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet])

  const fetchSummary = async () => {
    let res = await fetch(dataSet.summary)
    let summary = await res.json()
    console.log(summary)
    setState({ ...state, summary, loading: false })
  }

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
        <div className='dashboard-container'>
          {summary && level < 3 ? (
            summary.map(item => {
              const { numberOfGoodEvents, numberOfBadEvents } = item.summary
              return (
                <div
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
                      onClick={e => {
                        e.stopPropagation()
                        console.log(item.nextUrl)
                        const downloadUrlEndpoint = item.nextUrl.replace(
                          '/qa/',
                          '/download/'
                        )
                        // console.log(downloadUrlEndpoint)
                        const downloadUrl = `${apiUrl}/api/${downloadUrlEndpoint}`
                        window.open(downloadUrl)
                      }}
                    >
                      <Download />
                      csv
                    </button>
                  </div>
                  <hr />
                  {item.nextUrl && <React.Fragment></React.Fragment>}
                  {/* <h4>Data quality</h4>
                  <table>
                    <tr>
                      <td>
                        <Check />
                      </td>
                      <td>
                        <X />
                      </td>
                      <td>
                        <Percent />
                      </td>
                    </tr>
                    <tr>
                      <td>{numberOfGoodEvents}</td>
                      <td>{numberOfBadEvents}</td>
                      <td>
                        {getEventDataQuality(
                          numberOfGoodEvents,
                          numberOfBadEvents
                        ).toFixed(1)}
                      </td>
                    </tr>
                  </table> */}
                  <div>
                    {numberOfGoodEvents > 0 || numberOfBadEvents > 0 ? (
                      <Pie
                        data={{
                          datasets: [
                            {
                              label: 'Data quality',
                              data: [
                                numberOfGoodEvents,
                                numberOfBadEvents
                                // getEventDataQuality(
                                //   numberOfGoodEvents,
                                //   numberOfBadEvents
                                // )
                              ],
                              backgroundColor: [
                                'rgba(0, 255, 0, .5)',
                                'rgba(255, 0, 0, .5)'
                              ]
                            }
                          ],
                          labels: ['Correct events', 'Incorrect events']
                        }}
                      />
                    ) : (
                      <div className='center'>
                        <h4>No event data available</h4>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <DashboardDetail summary={summary} />
          )}
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <div className='center'>
        <Loader />
      </div>
    )
  }
}

export default DashboardTable
