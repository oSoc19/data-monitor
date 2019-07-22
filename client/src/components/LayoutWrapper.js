import React from 'react'

import Header from './Header'
import Sidebar from './Sidebar'
import BottomActions from './BottomActions'

const LayoutWrapper = props => {
  return (
    <div className='container'>
      {props.header && <Header />}
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: props.direction
        }}
      >
        {props.sidebar && <Sidebar />}
        {props.children}
        {/* <BottomActions /> */}
      </div>
    </div>
  )
}

LayoutWrapper.defaultProps = {
  header: true
}

export default LayoutWrapper
