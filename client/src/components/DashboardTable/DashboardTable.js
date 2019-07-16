import React, { Component } from 'react'
import './DashboardTable.sass'
import regionData from '../../components/Map/cities'
import { PlusCircle } from 'react-feather'
import { Route, Link } from 'react-router-dom'
import '../../pages/DashboardDetail'
import DashboardDetail from '../../pages/DashboardDetail'

import { Download } from 'react-feather'

import { Pie } from 'react-chartjs-2'

import Loader from '../../components/Loader'

const levels = ['country', 'region', 'province', 'city']

export class DashboardTable extends Component {
  state = {
    level: 1,
    summary: [],
    provinces: []
  }

  componentDidMount = () => {
    this.fetchSummary()
  }

  fetchSummary = async () => {
    let res = await fetch(
      // `http://82.196.10.230:8080/api/qa/bridgeopenings/summary/${level}/:${level}`
      `http://82.196.10.230:8080/api/qa/bridgeopenings/summary`
    )
    let summary = await res.json()
    this.setState({ summary })
  }

  fetchCities = async url => {
    let res = await fetch(url)
    let cities = await res.json()
    this.setState({ cities })
  }

  getEventDataQuality = (goodEvents, badEvents) => {
    if ((goodEvents === 0 && badEvents === 0) || goodEvents === 0) {
      return 0
    } else if (badEvents === 0) {
      return 100
    } else {
      return 100 - (badEvents / goodEvents) * 100
    }
  }

  render() {
    const { summary, level } = this.state
    return (
      <div className='dashboard-container'>
        {summary ? (
          summary.map(item => {
            const { numberOfGoodEvents, numberOfBadEvents } = item.summary
            return (
              <div
                className='dashboard-item'
                key={item.name}
                style={{
                  border:
                    this.getEventDataQuality(
                      numberOfGoodEvents,
                      numberOfBadEvents
                    ) === 100
                      ? '20px solid rgba(0,255,0, .5)'
                      : this.getEventDataQuality(
                          numberOfGoodEvents,
                          numberOfBadEvents
                        ) > 50
                      ? '20px solid rgba(255,128,0, .5)'
                      : '20px solid rgba(255,0,0, .5)',
                  borderWidth: '20px 1px 1px 1px'
                }}
              >
                <h1>{item.name}</h1>
                <hr />
                {item.nextUrl && (
                  <React.Fragment>
                    <h4>API endpoint</h4>
                    <pre>
                      <code>{item.nextUrl}</code>
                    </pre>
                    <button
                      className='btn-outline'
                      type='submit'
                      onClick={() => {
                        console.log(item.nextUrl)
                        const downloadUrlEndpoint = item.nextUrl.replace(
                          'api/qa/bridgeopenings/summary/provinces',
                          'api/download/bridgeopenings/summary/province'
                        )
                        const downloadUrl = `http://82.196.10.230:8080${downloadUrlEndpoint}`
                        window.open(downloadUrl)
                      }}
                    >
                      <Download />
                      Download CSV
                    </button>
                  </React.Fragment>
                )}
                <h2>Quality</h2>
                <div>Number of good events: {numberOfGoodEvents}</div>
                <div>Number of bad events: {numberOfBadEvents}</div>
                <div>
                  {this.getEventDataQuality(
                    numberOfGoodEvents,
                    numberOfBadEvents
                  )}
                  <Pie
                    data={{
                      datasets: [
                        {
                          data: [
                            this.getEventDataQuality(
                              numberOfGoodEvents,
                              numberOfBadEvents
                            )
                          ]
                        }
                      ]
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    fetch(`http://82.196.10.230:8080${item.nextUrl}`)
                      .then(res => {
                        return res.json()
                      })
                      .then(summary => {
                        this.setState({ summary, level: level[3] })
                      })
                  }}
                >
                  Cities in {item.name}
                </button>
              </div>
            )
          })
        ) : (
          <div
            style={{
              background: '#000',
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Loader />
          </div>
        )}
      </div>
    )
  }
}

export default DashboardTable
