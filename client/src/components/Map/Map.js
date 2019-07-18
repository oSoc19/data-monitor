import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, FlyToInterpolator } from 'react-map-gl'
import DeckGL, { ScatterplotLayer, IconLayer } from 'deck.gl'
import { Circle } from 'react-feather'
import './Map.sass'
import Legend from '../Legend'
import bridgeOpenIcon from '../../assets/icons/bridge-closed.png'
import bridgeClosedIcon from '../../assets/icons/bridge-closed.png'
import { Mapbox } from '../../config'

import { MapStylePicker } from './Controls'

import { useStateValue } from '../../utilities/state'

const Map = props => {
  const [{ dataSet }] = useStateValue()
  const [state, setState] = useState({
    dataFeatures: [],
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
  })

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet])

  const getData = async () => {
    let res = await fetch(dataSet.map)
    res = await res.json()
    setState({ ...state, dataFeatures: res.features })
  }

  const getBridgeEvents = async id => {
    let res = await fetch(
      `http://82.196.10.230:8080/api/bridge_openings/?id=${id}`
    )
    let bridgeEvents = await res.json()
    setState({ ...state, bridgeEvents })
  }

  const renderIconLayer = () => {
    const { dataFeatures } = state

    const data = dataFeatures.map(feature => {
      return (feature = {
        coordinates: feature.geometry.coordinates.reverse(),
        properties: feature.properties
      })
    })

    const ICON_MAPPING = {
      marker: { x: 0, y: 0, width: 64, height: 64, mask: false }
    }

    return new IconLayer({
      id: 'icon-layer',
      data,
      pickable: true,
      iconAtlas: bridgeOpenIcon,
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 1,
      getPosition: d => d.coordinates,
      getSize: d => 32
    })
  }

  const renderScatterPlotLayer = () => {
    const { dataFeatures } = state

    const data = dataFeatures.map(feature => {
      return {
        coordinates: feature.geometry.coordinates.reverse(),
        id: feature.properties.id
        // createdAt: feature.properties.createdAt,
        // updatedAt: feature.properties.updatedAt
      }
    })

    return new ScatterplotLayer({
      data,
      getPosition: d => d.coordinates,
      getRadius: 10000,
      getFillColor: d => [128, 128, 128],
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
        getBridgeEvents(object.id)

        /**
         * TODO: Zoom to point onClick
         */
      }
    })
  }

  const flyTo = coordinates => {
    const viewport = {
      ...state.viewport,
      ...coordinates,
      // longitude: -74.1,
      // latitude: 40.7,
      zoom: 14,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: t =>
        ((t *= 2) <= 1
          ? Math.pow(2, 10 * t - 10)
          : 2 - Math.pow(2, 10 - 10 * t)) / 2
    }
    setState({ ...state, viewport })
  }

  const onStyleChange = style => {
    setState({ ...state, style })
  }

  const _onViewportChange = viewport => {
    setState({
      ...state,
      viewport
    })
  }

  const { dataFeatures, bridgeEvents, viewport, style } = state
  return (
    <React.Fragment>
      {dataFeatures ? (
        <ReactMapGL
          {...viewport}
          onViewportChange={viewport => _onViewportChange(viewport)}
          mapboxApiAccessToken={Mapbox.token}
          mapStyle={style}
        >
          {bridgeEvents &&
            bridgeEvents.features.map(event => {
              console.log(event)
            })}
          <MapStylePicker
            onStyleChange={onStyleChange}
            currentStyle={state.style}
          />
          <DeckGL
            layers={[renderScatterPlotLayer() /* renderIconLayer() */]}
            initialViewState={viewport}
            controller
          ></DeckGL>
          <button
            style={{ zIndex: 5000, position: 'absolute' }}
            onClick={() => {
              flyTo({ latitude: 41.9028, longitude: 12.4964 })
            }}
          >
            test
          </button>
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

export default Map
