import React from 'react'

import Header from './Header'
import Sidebar from './Sidebar'

const LayoutWrapper = props => {
  return (
    <div className='container'>
      <Header />
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'row'
        }}
      >
        <Sidebar />
        {props.children}
      </div>
    </div>
  )
}

export default LayoutWrapper
