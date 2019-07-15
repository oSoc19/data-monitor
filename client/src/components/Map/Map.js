import React, { Component } from 'react'
import ReactMapGL, { Marker, FlyToInterpolator } from 'react-map-gl'
import DeckGL, { ScatterplotLayer, IconLayer } from 'deck.gl'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Circle } from 'react-feather'
import './Map.sass'
import Legend from '../Legend'
import bridgeOpenIcon from './bridge-open.svg'
import { Mapbox } from '../../config'

import { MapStylePicker } from './Controls'

class Map extends Component {
  state = {
    bridges: [],
    bridgeEvents: null,
    style: 'mapbox://styles/mapbox/light-v9',
    viewport: {
      latitude: 52.153,
      longitude: 5.5196,
      width: '100vw',
      height: '100vh',
      zoom: 7.1,
      bearing: 0,
      pitch: 0
      // TODO: min & max zoom
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
    let res = await fetch('http://82.196.10.230:8080/api/bridges')
    let bridges = await res.json()
    this.setState({ bridges: bridges.features })
  }

  getBridgeEvents = async id => {
    let res = await fetch(
      `http://82.196.10.230:8080/api/bridgeopenings/?id=${id}`
    )
    let bridgeEvents = await res.json()
    this.setState({ bridgeEvents })
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
      return {
        coordinates: bridge.geometry.coordinates,
        id: bridge.properties.id,
        createdAt: bridge.properties.createdAt,
        updatedAt: bridge.properties.updatedAt
      }
    })

    return new ScatterplotLayer({
      data,
      getPosition: d => d.coordinates,
      getRadius: 10000,
      getFillColor: [128, 128, 128],
      opacity: 0.1,
      radiusMinPixels: 10,
      radiusMaxPixels: 15,
      pickable: true,
      // onHover: ({ object, x, y }) => {
      //   const tooltip = object ? `${object.id}` : 'no tooltip'
      //   console.log(tooltip)
      // }
      onClick: ({ object, x, y }) => {
        const tooltip = object ? `${object.id}` : console.log('no valid point')
        this.getBridgeEvents(object.id)

        /**
         * TODO: Zoom to point onClick
         */
      }
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

  onStyleChange = style => {
    this.setState({ style })
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  }

  render() {
    const { bridges, bridgeEvents, viewport, style } = this.state
    const { children } = this.props
    return (
      <React.Fragment>
        {/* <Header /> */}
        <Sidebar
          onClick={e =>
            !e.target.checked
              ? console.log('no bridges')
              : console.log('bridges')
          }
          style={{
            position: 'absolute',
            zIndex: 5000000,
            left: '3rem',
            top: '10rem',
            borderRadius: '1rem',
            padding: '1rem'
          }}
        />
        {bridges ? (
          <ReactMapGL
            {...viewport}
            onViewportChange={viewport => this._onViewportChange(viewport)}
            mapboxApiAccessToken={Mapbox.token}
            mapStyle={style}
          >
            {bridgeEvents &&
              bridgeEvents.features.map(event => {
                console.log(event)
              })}
            <MapStylePicker
              onStyleChange={this.onStyleChange}
              currentStyle={this.state.style}
            />
            {children}
            <DeckGL
              layers={[
                this.renderScatterPlotLayer() /*, this.renderIconLayer()*/
              ]}
              initialViewState={viewport}
              controller
            ></DeckGL>
          </ReactMapGL>
        ) : (
          <h1
            style={{
              display: 'flex',
              width: '100vw',
              height: '100vh',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Loading
          </h1>
        )}
      </React.Fragment>
    )
  }
}

export default Map
