import React, { useState, useEffect } from 'react'
import './DashboardTable.sass'
import { DashboardDetail } from '../DashboardDetail'
import { Download, Check, X, Percent } from 'react-feather'
import { Pie } from 'react-chartjs-2'

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
                  onClick={() => {
                    fetch(`http://82.196.10.230:8080${item.nextUrl}`)
                      .then(res => {
                        return res.json()
                      })
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
                        ? '20px solid rgba(0,255,0, .5)'
                        : getEventDataQuality(
                            numberOfGoodEvents,
                            numberOfBadEvents
                          ) > 50
                        ? '20px solid rgba(255,128,0, .5)'
                        : '20px solid rgba(255,0,0, .5)',
                    borderWidth: '20px 1px 1px 1px'
                  }}
                >
                  <h2>{item.name}</h2>
                  <hr />
                  {item.nextUrl && (
                    <React.Fragment>
                      <button
                        className='btn-outline'
                        type='submit'
                        onClick={() => {
                          console.log(item.nextUrl)
                          const downloadUrlEndpoint = item.nextUrl.replace(
                            'api/qa/bridge_openings/summary/provinces',
                            'api/download/bridge_openings/summary/province'
                          )
                          const downloadUrl = `http://82.196.10.230:8080${downloadUrlEndpoint}`
                          window.open(downloadUrl)
                        }}
                      >
                        <Download />
                        {`${item.name}.csv`}
                      </button>
                    </React.Fragment>
                  )}
                  <h3>Event quality</h3>
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
                  </table>
                  <div>
                    <Pie
                      data={{
                        datasets: [
                          {
                            label: 'Event quality',
                            data: [
                              numberOfGoodEvents,
                              numberOfBadEvents
                              // getEventDataQuality(
                              //   numberOfGoodEvents,
                              //   numberOfBadEvents
                              // )
                            ],
                            backgroundColor: [
                              'rgba(54, 162, 235, 0.2)',
                              'rgba(255, 99, 132, 0.2)'
                            ]
                          }
                        ],
                        labels: ['Good events', 'Bad events']
                      }}
                    />
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
