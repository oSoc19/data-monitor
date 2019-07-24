import Map from '../components/Map'
import LayoutWrapper from '../components/LayoutWrapper'

import React from 'react'

/**
 * Map overview page
 */
const MapOverview = () => {
  return (
    <LayoutWrapper sidebar>
      <Map />
    </LayoutWrapper>
  )
}

export default MapOverview
