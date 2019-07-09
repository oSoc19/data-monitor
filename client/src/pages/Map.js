import React, { Component } from 'react'
import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl'
import DeckGL, { ArcLayer } from 'deck.gl'

import GeoJSON from 'geojson'

import './Map.sass'

import Pin from '../components/Pin'

import Legend from '../components/Legend'

const TOKEN =
  'pk.eyJ1IjoiaGVrdHIiLCJhIjoiY2p4b2hzZTRlMDZobTNkbnQ2aGl4bXhyaSJ9.UvL3Brt2D11Lq63z9KyjLQ'

class Map extends Component {
  state = {
    bridges: [],
    viewport: {
      latitude: 52.1326,
      longitude: 5.2913,
      zoom: 10,
      bearing: 0,
      pitch: 0
    }
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

  renderBridges = () => {
    const { bridges } = this.state
    return bridges.map(bridge => {
      return (
        <Marker
          latitude={parseFloat(bridge.location.latitude)}
          longitude={parseFloat(bridge.location.longitude)}
        >
          <Pin size={20} />
        </Marker>
      )
    })
  }

  parseToGeoJson = () => {
    const { bridges } = this.state
    console.log(bridges)
    const geoJsonBridges = bridges.map(bridge => {
      return (bridge = {
        lat: bridge.location.latitude,
        lng: bridge.location.longitude
      })
    })

    return GeoJSON.parse(geoJsonBridges, {
      Point: ['lat', 'lng'],
      include: ['name']
    })
  }
  _updateViewport = viewport => {
    this.setState({ viewport })
  }
  render() {
    const { bridges, viewport } = this.state
    return (
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        className="map"
        mapStyle="mapbox://styles/hektr/cjxuhbxj10twt1cnz2ztmv8x1"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN}
        {...viewport}
      >
        <DeckGL
          viewState={viewport}
          layers={[
            new ArcLayer({
              data: [
                {
                  sourcePosition: [52.1326, 5.2913],
                  targetPosition: [-122.45669, 37.781]
                }
              ],
              strokeWidth: 4,
              getSourceColor: x => [0, 0, 255],
              getTargetColor: x => [0, 255, 0]
            })
          ]}
        />
        {bridges && this.renderBridges()}
        <div className="nav">
          <NavigationControl onViewportChange={this._updateViewport} />
        </div>
      </ReactMapGL>
    )
  }
}

export default Map
