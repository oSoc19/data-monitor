import React, { Component } from 'react'
import './LeafletMap.sass'
import 'leaflet/dist/leaflet.css'

import Legend from '../components/Legend'
import Header from '../components/Header'

import L from 'leaflet'
import { Map, TileLayer, withLeaflet } from 'react-leaflet'
import { HexbinLayer } from 'react-leaflet-d3'
const WrappedHexbinLayer = withLeaflet(HexbinLayer)

const options = {
  colorScaleExtent: [1, 50],
  radiusScaleExtent: [1, 50],
  colorRange: ['#fff', '#ff0000'],
  radiusRange: [1, 10]
}

const coordinates = [52.1326, 5.2913]
const tileSetUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

// export const bridgeOpenIcon = new L.Icon({
//   iconUrl: require('../assets/icons/bridge-open.svg'),
//   iconRetinaUrl: require('../assets/icons/bridge-open.svg'),
//   iconAnchor: [5, 55],
//   popupAnchor: [10, -44]
// })

// export const bridgeClosedIcon = new L.Icon({
//   iconUrl: require('../assets/icons/bridge-closed.svg'),
//   iconRetinaUrl: require('../assets/icons/bridge-closed.svg'),
//   iconAnchor: [20, 40],
//   popupAnchor: [0, -35]
// })

// const bridgeOpen = L.divIcon({
//   className: 'custom icon',
//   html: <div>Bridge open</div>
// })

class LeafletMap extends Component {
  state = {
    bridges: null
  }

  componentDidMount() {
    this.getBridges()
  }

  getBridges = () => {
    fetch('http://82.196.10.230:8080/api/bridgeopenings')
      .then(res => {
        return res.json()
      })
      .then(bridges => {
        this.setState({ bridges })
      })
  }

  render() {
    const { bridges } = this.state
    return (
      <React.Fragment>
        <Header />
        <Legend />
        <Map center={coordinates} zoom={10} id='map'>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={tileSetUrl}
          />
          {bridges && (
            <WrappedHexbinLayer
              className='hexbin-hexagon'
              data={bridges}
              {...options}
            />
          )}
        </Map>
      </React.Fragment>
    )
  }
}

export default LeafletMap
