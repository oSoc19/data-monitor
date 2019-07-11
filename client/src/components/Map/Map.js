import React, { Component } from 'react'
import ReactMapGL, {
  Marker,
  FlyToInterpolator
} from 'react-map-gl'
import DeckGL, { ScatterplotLayer, IconLayer, LayerManager } from 'deck.gl'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Circle } from 'react-feather'
import './Map.sass'
import Legend from '../Legend'
import bridgeOpenIcon from './bridge-open.svg'
import { Mapbox } from '../../config'

class Map extends Component {
  state = {
    bridges: [],
    province: [],
    style: 'mapbox://styles/mapbox/light-v9',
    viewport: {
      latitude: 52.153,
      longitude: 5.5196,
      width: '100vw',
      height: '100vh',
      zoom: 7.1,
      bearing: 0,
      pitch: 0
    }
  }

  componentDidMount() {
    this.getBridges()
  }

  getProvinceBoundingBox = async province => {
    let res = await fetch(
      `https://nominatim.openstreetmap.org/search.php?q=${province}&polygon_geojson=1&format=json`
    )
    let data = await res.json()
    this.setState({ province: data })
  }

  getBridges = async () => {
    let res = await fetch('http://82.196.10.230:8080/api/bridgeopenings')
    let bridges = await res.json()
    this.setState({ bridges: bridges.features })
  }

  renderBridgeMarkers = () => {
    const { bridges } = this.state
    return bridges.map(bridge => {
      const status = Math.random() > 0.5 ? 1 : 0
      return (
        <Marker
          key={bridge.properties.id}
          latitude={bridge.geometry.coordinates[1]}
          longitude={bridge.geometry.coordinates[0]}
        >
          <Circle color={status ? '#f00' : '#0f0'} />
        </Marker>
      )
    })
  }

  renderIconLayer = () => {
    const { bridges } = this.state

    const data = bridges.map(bridge => {
      return (bridge = {
        coordinates: bridge.geometry.coordinates,
        properties: bridge.properties
      })
    })

    const ICON_MAPPING = {
      marker: { x: 0, y: 0, width: 32, height: 32, mask: true }
    }

    return new IconLayer({
      id: 'icon-layer',
      data,
      pickable: true,
      iconAtlas: bridgeOpenIcon,
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 5,
      getPosition: d => d.coordinates,
      getSize: d => 5,
      getColor: d => [Math.sqrt(d.exits), 140, 0]
    })
  }

  renderScatterPlotLayer = () => {
    const { bridges } = this.state

    const data = bridges.map(bridge => {
      return bridge.geometry
    })

    return new ScatterplotLayer({
      data,
      getPosition: d => d.coordinates,
      getRadius: 10000,
      getFillColor: [128, 128, 128],
      opacity: 0.1,
      radiusMinPixels: 10,
      radiusMaxPixels: 15,
      pickable: true
    })
  }

  _goToNYC = () => {
    const viewport = {
      ...this.state.viewport,
      longitude: -74.1,
      latitude: 40.7,
      zoom: 14,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: t =>
        ((t *= 2) <= 1
          ? Math.pow(2, 10 * t - 10)
          : 2 - Math.pow(2, 10 - 10 * t)) / 2
    }
    this.setState({ viewport })
  }

  render() {
    const { bridges, viewport, style } = this.state
    return (
      <React.Fragment>
        <Header />
        <Sidebar
          onClick={e =>
            !e.target.checked
              ? console.log('no bridges')
              : console.log('bridges')
          }
          style={{ position: 'absolute', zIndex: 5000000, left: 0, top: 0 }}
        />
        {/* <button
          onClick={this._goToNYC}
          style={{
            bottom: 0,
            right: 0
          }}
        >
          Fly to
        </button> */}
        {bridges ? (
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            maxPitch={85}
            onViewportChange={viewport => this.setState({ viewport })}
            mapboxApiAccessToken={Mapbox.token}
            mapStyle={style}
          >
            <Legend />
            <DeckGL
              layers={[this.renderScatterPlotLayer(), this.renderIconLayer()]}
              initialViewState={viewport}
              controller
            ></DeckGL>
          </ReactMapGL>
        ) : (
          <h1>Loading</h1>
        )}
      </React.Fragment>
    )
  }
}

export default Map
