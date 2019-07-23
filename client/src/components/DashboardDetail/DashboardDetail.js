import React, { useState } from 'react'
import './DashboardDetail.sass'
import { apiUrl } from '../../config/api'

import { Check, X } from 'react-feather'

const DashboardDetail = props => {
  const renderBool = number => {
    return number === 1 ? <Check /> : <X />
  }

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
              {Object.keys(summary[0]).map(key => {
                if(key !== 'nextUrl') {
                  return (<td>{splitCamelCase(key)}</td>)
                }
              })}
            </tr>
          </thead>
          {summary.map(event => {
            return (
              <tbody>
                <tr>
                  {Object.keys(event).map(key => {
                    console.log(key, typeof(event[key]))
                    if(key === 'nextUrl') {
                      return
                    }
                    if(key === 'id') {
                      return(<td
                        className='detail-link'
                        onClick={() => {
                          fetch(`${apiUrl}${event.nextUrl}`)
                            .then(res => res.json())
                            .then(eventDetails => {
                              setEventDetails(eventDetails)
                            })
                        }}
                      >
                        {event[key]}
                      </td>)
                    
                    // } else if() {
                    } else if(typeof(event[key]) === 'number') {
                      return(<td>{renderBool(event[key])}</td>)
                    } else {
                      return(<td>{event[key]}</td>)
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
  if (!event.bridgeOpeningId)    
    return event.bridgeOpeningId;    
      
  if (!event.maintenanceWorkId)    
    return event.maintenanceWorkId;    
     
  if (!event.accidentId)    
    return event.accidentId;    
  return null;    
}    
     
function splitCamelCase(string) {    
  return string.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join(' ');    
}  

export default DashboardDetail
