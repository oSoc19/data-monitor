import React from 'react'
import './DashboardDetail.sass'

import { Check, X } from 'react-feather'

const DashboardDetail = props => {
  const { summary } = props
  return (
    <div>
      <table>
        <tr>
          <td>Event Id</td>
          <td>Fields complete</td>
          <td>Correct Id</td>
          <td>Checksum</td>
          {/* <td>Manual intervention</td>
          <td>Comment</td> */}
        </tr>
        {summary.map(event => {
          return (
            <tr>
              <td>{event.bridgeEventId}</td>
              <td>{event.allFields ? <Check /> : <X />}</td>
              <td>{event.correctID ? <Check /> : <X />}</td>
              <td>{event.checksum ? <Check /> : <X />}</td>
              {/* <td>{event.manualIntervention ? <Check /> : <X />}</td>
              <td>{event.comment}</td> */}
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default DashboardDetail
