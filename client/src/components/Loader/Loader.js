import React from 'react'

import './Loader.sass'

const Loader = props => {
  return (
    <div className='loader-wrapper'>
      <div className='loader'></div>
      <h4 className='loader_text'>{props.text}</h4>
    </div>
  )
}

export default Loader
