import Map from '../components/Map'
import Legend from '../components/Legend'
import Header from '../components/Header'

import React from 'react'
export default function MapOverview() {
  return (
    <Map>
      <Header />
      <Legend />
    </Map>
  )
}
