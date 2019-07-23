import React from 'react'

import './BottomActions.sass'

import bridgeIcon from '../../assets/icons/bridge.png'
import maintenanceIcon from '../../assets/icons/plannedmaintenance.png'
import accidentIcon from '../../assets/icons/incident.png'

const BottomActions = props => {
  return (
    <div className='bottom-actions-container' style={props.style}>
      <button className='bottom-actions_tab'>
        <img src={bridgeIcon} alt='bridge'></img>
      </button>
      <button className='bottom-actions_tab'>
        <img src={maintenanceIcon} alt='maintenance'></img>
      </button>
      <button className='bottom-actions_tab'>
        <img src={accidentIcon} alt='accident'></img>
      </button>
    </div>
  )
}

export default BottomActions
