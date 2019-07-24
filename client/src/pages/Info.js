import React from 'react'

import { bridgeOpenings, maintenanceWorks } from '../config/api'

import LayoutWrapper from '../components/LayoutWrapper'

const Info = () => {
  return (
    <LayoutWrapper>
      <div className='content-wrapper'>
        <h2>About</h2>
        <p>
          Let’s suppose in a few years, <b>every vehicle</b> in traffic is <b>managed by a system</b>.
          As a result, all these cars can <b>take the best routes</b> and <b>avoid issues</b> along their way by using data in real-time.
          However, if that <b>data contains errors</b>, lots of <b>things can go wrong</b>: ambulances can get stuck behind closed bridges,
          trucks would enter cities at the wrong time and search for unloading areas that are not there and so on.
          With data monitor we want to <b>avoid</b> this.
        </p>
        <p>
          Verkeersdatamonitor is a web-based project for Dutch municipalities,
          provinces and the government, launched by the Dutch Ministry of
          Infrastructure and Water Management. The project is about <b>monitoring
          the quality of mobility data</b> in the Netherlands.
        </p>
        <p>
          It shows a <b>map</b> with a sidebar by default. On the sidebar there is a
          possibility to toggle <b>multiple datasets</b> on and off. Apart from that
          you can also select a date range. The results show several pinpoints
          on the map. You can switch to a <b>dashboard view</b>, that’s divided in
          clickable tiles named after and ordered by the Dutch municipalities,
          regions and provinces. Each tile shows the data in a graph and with
          each click you can narrow down to the smallest part of the
          Netherlands. Finally it gives a <b>detailed view</b> of the dataset as a
          table. You can edit the data where needed and <b>download a csv-file</b> about this dataset.
        </p>
        <p>
          The tests to monitor the quality of the data are mostly based on the <b>completeness</b> of 
          the data and the <b>correctness</b>. So if we miss some data,
          or if it is not what it is supposed to be, then it is considered
          wrong.
        </p>
        <p>
          Three datasets are implemented for now. "Bridge Openings",
          "Maintenance Works" (from "Road Works") and "Accidents" (from
          "Incidents"). More datasets from the NDW opendata should be
          implemented in the future, as well as more tests.
        </p>
        <h3>Example</h3>
        <p>
          If you want to download a CSV file that contains all the bridge
          openings in Amsterdam for the last week, you have to :
        </p>
        <ol>
          <li>Click on "7 days" on the sidebar.</li>
          <li>Click on "Bridges" on the sidebar.</li>
          <li>Click on the dashboard icon on the header of the webpage.</li>
          <li>Click on the "Noth Holland" tile.</li>
          <li>Click on the CSV button on the Amsterdam tile.</li>
        </ol>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <hr />
          <h4>Summary endpoints</h4>
          <code>{bridgeOpenings.summary}</code>
          <code>{maintenanceWorks.summary}</code>
          <hr />
          <h4>CSV Download endpoints</h4>
          <code>{bridgeOpenings.csv}</code>
          <code>{maintenanceWorks.csv}</code>
          <hr />
          <h4>Modify endpoint</h4>
          <code>{bridgeOpenings.modify}</code>
          <hr />
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
      </div>
    </LayoutWrapper>
  )
}

export default Info
