import React from 'react'

import { bridgeOpenings, maintenanceWorks } from '../config/api'

import LayoutWrapper from '../components/LayoutWrapper'

const Info = () => {
  return (
    <LayoutWrapper direction='column'>
      <h4>About</h4>
      <p>Let’s suppose you own an autonomous car and you want to navigate to Amsterdam. You set up your car to calculate a route and start following the directions. On the way, the car system included the passage of a bridge as part of the route, but upon arrival you can’t cross it. This is because incorrect data has been sent to the car and hasn’t been changed ever since. With Verkeersdatamonitor problems like these are resolved. Accurate mobility data fixes the problem of traffic jams and unnecessary detours and makes way for a fluid traffic.</p>
      <p>Verkeersdatamonitor is a web-based project for Dutch municipalities, provinces and the government, launched by the Dutch Ministry of Infrastructure and Water Management. The project is about monitoring the quality of mobility data about the Netherlands.</p>
      <p>It shows a map with a sidebar by default. On the sidebar there is a possibility to toggle multiple datasets on and off. Apart from that you can also select a date range. The results show several pinpoints on the map.
You can switch to a dashboard view, that’s divided in clickable tiles named after and ordered by the Dutch municipalities, regions and provinces. Each tile shows the data in a graph and with each click you can narrow down to the smallest part of the Netherlands. Finally it gives a detailed view of the dataset as a table. You can edit the data where needed and download a csv-file about this dataset.</p>
      <p>The tests to monitor the quality of the data are mostly based on the completeness of the data and the correctness. So if we miss some data, or if it is not what it is supposed to be, then it is considered wrong.</p>
      <p>Three datasets are implemented for now. "Bridge Openings", "Maintenance Works" (from "Road Works") and "Accidents" (from "Incidents"). More datasets from the NDW opendata should be implemented in the future.</p>
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
      <ul>
        <li>
          <a
            href='https://www.ndw.nu/'
            target='_blank'
            rel='noopener noreferrer'
          >
            NDW website
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
