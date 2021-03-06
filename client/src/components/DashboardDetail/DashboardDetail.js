import React, { useState } from 'react'
import './DashboardDetail.sass'
import { apiUrl } from '../../config/api'
import { Check, X } from 'react-feather'

const DashboardDetail = props => {
  /**
   * @param {bool} boolean
   * @return Icon
   */
  const renderBoolIcon = number => {
    return number === 1 ? <Check /> : <X />
  }

  /**
   * Fetch event detail data
   */
  const getEventDetails = endpoint => {
    fetch(`${apiUrl}${endpoint}`)
      .then(res => res.json())
      .then(eventDetails => {
        setEventDetails(eventDetails)
      })
  }

  /**
   * Hook for event detail modal
   */
  const [eventDetails, setEventDetails] = useState([])
  const { summary } = props
  return summary.length > 0 ? (
    <div>
      {eventDetails.length !== 0 ? (
        <div className='event-detail-container'>
          <button
            onClick={() => {
              setEventDetails([])
            }}
          >
            <X />
          </button>
          <ul>
            {Object.keys(eventDetails).map(key => {
              return <li>{`${key} : ${eventDetails[key]}`}</li>
            })}
          </ul>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(summary[0]).map(key => {
                if (key !== 'nextUrl') {
                  return <td>{splitCamelCase(key)}</td>
                }
              })}
            </tr>
          </thead>
          {summary.map(event => {
            return (
              <tbody>
                <tr>
                  {Object.keys(event).map(key => {
                    if (key === 'nextUrl') {
                      return
                    }
                    if (key === 'id') {
                      return (
                        <td
                          className='detail-link'
                          onClick={() => {
                            getEventDetails(event.nextUrl)
                          }}
                        >
                          {event[key]}
                        </td>
                      )

                      // } else if() {
                    } else if (typeof event[key] === 'number') {
                      return <td>{renderBoolIcon(event[key])}</td>
                    } else {
                      return <td>{event[key]}</td>
                    }
                  })}
                </tr>
              </tbody>
            )
          })}
        </table>
      )}
    </div>
  ) : (
    <h4>No events for this city</h4>
  )
}

function getId(event) {
  if (!event.bridgeOpeningId) return event.bridgeOpeningId

  if (!event.maintenanceWorkId) return event.maintenanceWorkId

  if (!event.accidentId) return event.accidentId
  return null
}

function splitCamelCase(string) {
  return string
    .split(/(?=[A-Z])/)
    .map(s => s.toLowerCase())
    .join(' ')
}

export default DashboardDetail
