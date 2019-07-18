import React from 'react'

import { bridgeOpenings, maintenanceWorks } from '../config/api'

const Info = () => {
  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>Summary endpoints</h3>
        <code>{bridgeOpenings.summary}</code>
        <code>{maintenanceWorks.summary}</code>
        <h3>CSV Download endpoints</h3>
        <code>{bridgeOpenings.csv}</code>
        <code>{maintenanceWorks.csv}</code>
        <h3>Modify endpoint</h3>
        <code>{bridgeOpenings.modify}</code>
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
