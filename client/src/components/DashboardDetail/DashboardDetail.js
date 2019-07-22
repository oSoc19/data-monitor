import React from 'react'
import './DashboardDetail.sass'

import { Check, X } from 'react-feather'

const DashboardDetail = props => {
  const { summary } = props
  return summary.length > 0 ? (
    <div>
      <table>
        <thead>
          <tr>
            <td>Event Id</td>
            <td>Fields complete</td>
            <td>Correct Id</td>
            <td>Version</td>
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
                <td>{event.bridgeOpeningId}</td>
                <td>{event.allFields ? <Check /> : <X />}</td>
                <td>{event.correctID ? <Check /> : <X />}</td>
                <td>{event.version}</td>
                <td>{event.probabilityOfOccurence}</td>
                <td>{event.source}</td>
                <td>{event.locationForDisplay}</td>
                <td>{event.location}</td>
                <td>{event.generalNetworkManagementType}</td>
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
