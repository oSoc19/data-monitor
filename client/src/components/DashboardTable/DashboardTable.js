import React, { Component } from 'react'
import './DashboardTable.sass'
import regionData from '../../components/Map/cities'
import { PlusCircle } from 'react-feather'
import { Route, Link } from 'react-router-dom'
import '../../pages/DashboardDetail'
import DashboardDetail from '../../pages/DashboardDetail'

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
    console.log(cities)
    this.setState({ cities })
  }

  showCities = province => {
    Object.values(regionData[province]).map(city => {
      console.log(city)
    })
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
            console.log(item.name)
            return (
              <div
                className='dashboard-item'
                key={item.name}
                style={{
                  border:
                    this.getEventDataQuality(
                      item.summary.numberOfGoodEvents,
                      item.summary.numberOfBadEvents
                    ) === 100
                      ? '20px solid rgba(0,255,0, .5)'
                      : this.getEventDataQuality(
                          item.summary.numberOfGoodEvents,
                          item.summary.numberOfBadEvents
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
                  </React.Fragment>
                )}
                <h2>Quality</h2>
                <div>
                  Number of good events: {item.summary.numberOfGoodEvents}
                </div>
                <div>
                  Number of bad events: {item.summary.numberOfBadEvents}
                </div>
                <div>
                  {this.getEventDataQuality(
                    item.summary.numberOfGoodEvents,
                    item.summary.numberOfBadEvents
                  )}
                  <Pie
                    data={{
                      datasets: [
                        {
                          data: [
                            this.getEventDataQuality(
                              item.summary.numberOfGoodEvents,
                              item.summary.numberOfBadEvents
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
        {/* {Object.keys(regionData).map(province => {
          return (
            <div className='dashboard-item'>
              <h1>{province}</h1>
              <Link to={`/dashboard/${province}`}>
                <PlusCircle />
              </Link>
            </div>
          )
        })} */}
        {/* <Route path='/dashboard/province' component={DashboardDetail} /> */}
      </div>
    )
  }
}

export default DashboardTable
