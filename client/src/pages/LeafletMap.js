import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './LeafletMap.sass'
import 'leaflet/dist/leaflet.css'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const coordinates = [42, 35]

class LeafletMap extends Component {
  render() {
    return (
      <Map center={coordinates} zoom={12} style={{ height: '350px' }}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker>
      </Map>
    )
  }
}

export default LeafletMap
