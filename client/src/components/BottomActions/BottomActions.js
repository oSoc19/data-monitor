import React from 'react'

import './BottomActions.sass'

import bridgeIcon from '../../assets/icons/bridge-open.png'
import maintenanceIcon from '../../assets/icons/plannedmaintenance.png'
import accidentIcon from '../../assets/icons/incident.png'

const BottomActions = props => {
  return (
    <div className='bottom-actions-container' style={props.style}>
      <button className='bottom-actions_tab'>
        <img src={bridgeIcon}></img>
      </button>
      <button className='bottom-actions_tab'>
        <img src={maintenanceIcon}></img>
      </button>
      <button className='bottom-actions_tab'>
        <img src={accidentIcon}></img>
      </button>
    </div>
  )
}

export default BottomActions
