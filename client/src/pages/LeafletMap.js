import PropTypes from 'prop-types'
import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import './LeafletMap.sass'
import L from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const coordinates = [52.1326, 5.2913]
const mapBoxToken =
  'pk.eyJ1IjoiaGVrdHIiLCJhIjoiY2p4b2hzZTRlMDZobTNkbnQ2aGl4bXhyaSJ9.UvL3Brt2D11Lq63z9KyjLQ'

// mapbox "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVrdHIiLCJhIjoiY2p4b2hzZTRlMDZobTNkbnQ2aGl4bXhyaSJ9.UvL3Brt2D11Lq63z9KyjLQ"

const tileSetUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export const bridgeOpenIcon = new L.Icon({
  iconUrl: require('../assets/icons/bridge-open.svg'),
  iconRetinaUrl: require('../assets/icons/bridge-open.svg'),
  iconAnchor: [5, 55],
  popupAnchor: [10, -44]
})

export const bridgeClosedIcon = new L.Icon({
  iconUrl: require('../assets/icons/bridge-closed.svg'),
  iconRetinaUrl: require('../assets/icons/bridge-closed.svg'),
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
})

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
    fetch('http://82.196.10.230:8080/api/bridges')
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
      <Map center={coordinates} zoom={12} className="map">
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={tileSetUrl}
        />
        {bridges &&
          bridges.map(bridge => {
            return (
              <Marker
                icon={bridge.status ? bridgeOpenIcon : bridgeClosedIcon}
                position={[bridge.location.latitude, bridge.location.longitude]}
              >
                <Popup>{bridge.status ? 'open' : 'closed'}</Popup>
              </Marker>
            )
            // return (
            //   <Marker
            //     position={[bridge.location.latitude, bridge.location.longitude]}
            //   ></Marker>
            // )
          })}
        {/* <Marker position={coordinates}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker> */}
      </Map>
    )
  }
}

export default LeafletMap
