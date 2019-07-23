import React, { useState } from 'react'
import './DashboardDetail.sass'
import { apiUrl } from '../../config/api'
import { Check, X } from 'react-feather'

/**
 * Table for city events
 */
const DashboardDetail = props => {
  /**
   * @param {bool} boolean
   * @return Icon
   */
  const renderBoolIcon = bool => {
    return bool ? <Check /> : <X />
  }

  /**
   * Fetch event detail data
   */
  const getEventDetails = event => {
    fetch(`${apiUrl}${event.nextUrl}`)
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
          <h4>{eventDetails.id}</h4>
          <p>{eventDetails.version}</p>
          <p>{eventDetails.source}</p>
          {/* <p>{eventDetails.location[0]}</p> */}
          {/* <p>{eventDetails.location[1]}</p> */}
          <p>{eventDetails.situationRecordVersionTime}</p>
          <p>{eventDetails.startTime}</p>
          <p>{eventDetails.endTime}</p>
          <p>{eventDetails.probabilityOfOccurence}</p>
          <p>{eventDetails.generalNetworkManagementType}</p>
          <p>{eventDetails.createdAt}</p>
          <p>{eventDetails.updatedAt}</p>
          <p>{eventDetails.bridgeId}</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <td>Event Id</td>
              <td>Version</td>
              <td>Fields complete</td>
              <td>Probability of occurence</td>
              <td>Source</td>
              <td>Location for display</td>
              <td>Location</td>
              <td>General network management type</td>
            </tr>
          </thead>
          {summary.map(event => {
            return (
              <tbody>
                <tr>
                  <td className='detail-link' onClick={getEventDetails(event)}>
                    {event.bridgeOpeningId}
                  </td>
                  <td>{event.version}</td>
                  <td>{renderBoolIcon(event.allFields)}</td>
                  <td>{renderBoolIcon(event.probabilityOfOccurence)}</td>
                  <td>{renderBoolIcon(event.source)}</td>
                  <td>{renderBoolIcon(event.locationForDisplay)}</td>
                  <td>{renderBoolIcon(event.location)}</td>
                  <td>{renderBoolIcon(event.generalNetworkManagementType)}</td>
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

export default DashboardDetail
