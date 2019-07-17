import React, { Component } from 'react'
import './DashboardTable.sass'
import { DashboardDetail } from '../DashboardDetail'
import { Download, Check, X, Percent } from 'react-feather'
import { Pie } from 'react-chartjs-2'

/**
 * Region levels
 * - 3: country
 * - 2: region
 * - 1: province
 * - 0: city
 */
const levelInfo = ['country', 'region', 'province', 'city']

export class DashboardTable extends Component {
  state = {
    level: 1,
    summary: []
  }

  componentDidMount = () => {
    this.fetchSummary()
  }

  fetchSummary = async () => {
    let res = await fetch(
      `http://82.196.10.230:8080/api/qa/bridge_openings/summary`
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
                      this.setState({ summary, level: level + 1 })
                    })
                }}
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
                <h2>{item.name}</h2>
                <hr />
                {item.nextUrl && (
                  <React.Fragment>
                    {/* <h4>API endpoint</h4>
                    <pre>
                      <code>{item.nextUrl}</code>
                    </pre> */}
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
                      {this.getEventDataQuality(
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
              </div>
            )
          })
        ) : (
          <DashboardDetail summary={summary} />
        )}
      </div>
    )
  }
}

export default DashboardTable
