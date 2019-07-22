import React from 'react'

import { bridgeOpenings, maintenanceWorks } from '../config/api'

import LayoutWrapper from '../components/LayoutWrapper'

const Info = () => {
  return (
    <LayoutWrapper direction='column'>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h4>Summary endpoints</h4>
        <code>{bridgeOpenings.summary}</code>
        <code>{maintenanceWorks.summary}</code>
        <h4>CSV Download endpoints</h4>
        <code>{bridgeOpenings.csv}</code>
        <code>{maintenanceWorks.csv}</code>
        <h4>Modify endpoint</h4>
        <code>{bridgeOpenings.modify}</code>
      </div>
      <h4>About</h4>
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
      <h4>Open Data</h4>
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
    </LayoutWrapper>
  )
}

export default Info
