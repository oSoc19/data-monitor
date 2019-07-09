import React, { Component } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import DeckGL, { ScatterplotLayer } from 'deck.gl'

import './Map.sass'
import Pin from '../components/Pin'
import Legend from '../components/Legend'

import { Mapbox } from '../config'

import { GeoJson } from '../utilities'

class Map extends Component {
  state = {
    bridges: [],
    province: [],
    viewport: {
      latitude: 52.153,
      longitude: 5.5196,
      zoom: 7.1,
      bearing: 0,
      pitch: 0
    }
  }

  componentDidMount() {
    this.getBridges()
    this.getProvinceBoundingBox('Amsterdam')
  }

  getProvinceBoundingBox = async province => {
    let res = await fetch(
      `https://nominatim.openstreetmap.org/search.php?q=${province}&polygon_geojson=1&format=json`
    )
    let data = await res.json()
    this.setState({ province: data })
  }

  getBridges = async () => {
    let res = await fetch('http://82.196.10.230:8080/api/bridges')
    let bridges = await res.json()
    this.setState({ bridges })
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

  renderScatterPlotLayer = () => {
    const { bridges } = this.state
    const data = bridges.map(bridge => {
      return (bridge = {
        location: [
          parseFloat(bridge.location.longitude),
          parseFloat(bridge.location.latitude)
        ],
        message: 'test'
      })
    })

    return new ScatterplotLayer({
      data,
      getPosition: d => d.location,
      getRadius: 10000,
      getFillColor: [255, 255, 0],
      opacity: 0.5,
      radiusMinPixels: 0.25,
      radiusMaxPixels: 30,
      // Enable picking
      pickable: true
    })
  }

  render() {
    const { bridges, viewport } = this.state
    if (bridges) {
      return (
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100%"
          maxPitch={85}
          onViewportChange={viewport => this.setState({ viewport })}
          mapboxApiAccessToken={Mapbox.token}
        >
          <Legend/>
          <DeckGL
            layers={[this.renderScatterPlotLayer()]}
            initialViewState={viewport}
            controller
          >
            {/* <StaticMap mapboxApiAccessToken={TOKEN}></StaticMap> */}
          </DeckGL>
        </ReactMapGL>
      )
    } else {
      return <div>Loading</div>
    }
  }
}

export default Map
