import React from 'react'

const Info = () => {
  return (
    <React.Fragment>
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
