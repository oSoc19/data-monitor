import React, { useState } from 'react'
import './DashboardDetail.sass'

import { Check, X } from 'react-feather'

const DashboardDetail = props => {
  const renderBool = bool => {
    return bool ? <Check /> : <X />
  }

  const [eventDetails, setEventDetails] = useState({ eventDetails: null })

  const { summary } = props
  return summary.length > 0 ? (
    <div>
      {eventDetails && (
        <div className='event-detail-container'>
          <button
            onClick={() => {
              setEventDetails(null)
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
      )}
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
                <td
                  className='detail-link'
                  onClick={() => {
                    fetch(`http://82.196.10.230:8080${event.nextUrl}`)
                      .then(res => res.json())
                      .then(eventDetails => {
                        setEventDetails(eventDetails)
                      })
                  }}
                >
                  {event.bridgeOpeningId}
                </td>
                <td>{event.version}</td>
                <td>{renderBool(event.allFields)}</td>
                <td>{renderBool(event.probabilityOfOccurence)}</td>
                <td>{renderBool(event.source)}</td>
                <td>{renderBool(event.locationForDisplay)}</td>
                <td>{renderBool(event.location)}</td>
                <td>{renderBool(event.generalNetworkManagementType)}</td>
              </tr>
            </tbody>
          )
        })}
      </table>
    </div>
  ) : (
    <h4>No events for this city</h4>
  )
}

export default DashboardDetail
