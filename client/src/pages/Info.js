import React from 'react'

import { Api } from '../config'

const Info = () => {
  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>Summary endpoints</h3>
        <code>{Api.endPoints.bridgeOpenings.summary}</code>
        <code>{Api.endPoints.maintenanceWorks.summary}</code>
        <h3>CSV Download endpoints</h3>
        <code>{Api.endPoints.bridgeOpenings.csv}</code>
        <code>{Api.endPoints.maintenanceWorks.csv}</code>
        <h3>Modify endpoint</h3>
        <code>{Api.endPoints.bridgeOpenings.modify}</code>
      </div>
      <h1>About</h1>
      <p>
        <p>Description goes here</p>
      </p>
      <ul>
        <li>
          <a
            href='https://www.ndw.nu/'
            target='_blank'
            rel='noopener noreferrer'
          >
            NDW
          </a>
        </li>
      </ul>
      <h1>Open Data</h1>
      <ul>
        <li>
          <a
            href='http://opendata.ndw.nu/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Open Data NDW
          </a>
        </li>
      </ul>
    </React.Fragment>
  )
}

export default Info
