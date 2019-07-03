import 'leaflet/dist/leaflet.css'
import React, { Component } from 'react'
import { Map } from 'react-leaflet'

class MapView extends Component {
  render() {
    return (
      <Map
        style={{ height: '480px', width: '100%' }}
        zoom={1}
        center={[-0.09, 51.505]}
      />
    )
  }
}

export default MapView
