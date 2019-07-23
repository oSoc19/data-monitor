import React from 'react'

import Header from './Header'
import Sidebar from './Sidebar'
import BottomActions from './BottomActions'

const LayoutWrapper = props => {
  return (
    <React.Fragment>
      <div className='container'>
        {props.header && <Header />}
        <div className='content-container'>
          {props.sidebar && <Sidebar />}
          <div className='content'> {props.children}</div>
        </div>
        {/* <BottomActions /> */}
      </div>
    </React.Fragment>
  )
}

LayoutWrapper.defaultProps = {
  header: true
}

export default LayoutWrapper
