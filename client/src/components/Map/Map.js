import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, FlyToInterpolator } from 'react-map-gl'
import DeckGL, { ScatterplotLayer, IconLayer } from 'deck.gl'
import './Map.sass'
import Legend from '../Legend'
import bridgeOpenIcon from '../../assets/icons/bridge.png'
import maintenanceIcon from '../../assets/icons/actualmaintenance.png'
import { Mapbox } from '../../config'

import Loader from '../../components/Loader'

import { MapStylePicker } from './Controls'

import { useGlobalState } from '../../utilities/state'
import { maintenanceWorks } from '../../config/api'

const Map = props => {
  const [{ dataSet }] = useGlobalState()
  const [state, setState] = useState({
    dataFeatures: [],
    bridgeEvents: null,
    style: 'mapbox://styles/mapbox/light-v9',
    viewport: {
      latitude: 52.153,
      longitude: 5.5196,
      width: '100%',
      height: '100%',
      zoom: 7.1,
      bearing: 0,
      pitch: 0,
      minZoom: 6
    }
  })

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet])

  /**
   * TODO: refactor to fetch util
   */
  const getData = async () => {
    let res = await fetch(dataSet.map)
    res = await res.json()
    setState({ ...state, dataFeatures: res.features })
  }

  /**
   *
   * TODO: refactor to fetch util
   */
  const getBridgeEvents = async id => {
    let res = await fetch(
      `http://82.196.10.230:8080/api/bridge_openings/?id=${id}`
    )
    let bridgeEvents = await res.json()
    setState({ ...state, bridgeEvents })
  }

  const getIcon = () => {
    switch (dataSet.icon) {
      case 'bridge':
        return bridgeOpenIcon
      case 'maintenance':
        return maintenanceIcon
      default:
        return 'none'
    }
  }

  const renderIconLayer = () => {
    const { dataFeatures } = state
    const data = dataFeatures.map(feature => {
      return (feature = {
        coordinates: feature.geometry.coordinates,
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
      iconAtlas: getIcon(),
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
        coordinates: feature.geometry.coordinates,
        id: feature.properties.id,
        createdAt: feature.properties.createdAt,
        updatedAt: feature.properties.updatedAt
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
    <div className='map'>
      {dataFeatures.length > 0 ? (
        <ReactMapGL
          {...viewport}
          onViewportChange={viewport => _onViewportChange(viewport)}
          mapboxApiAccessToken={Mapbox.token}
          mapStyle={style}
        >
          {/* {bridgeEvents &&
            bridgeEvents.features.map(event => {
              console.log(event)
            })} */}
          {/* <MapStylePicker
            onStyleChange={onStyleChange}
            currentStyle={state.style}
        /> */}
          <DeckGL
            layers={[/* renderScatterPlotLayer() */ renderIconLayer()]}
            initialViewState={viewport}
            controller
          ></DeckGL>
        </ReactMapGL>
      ) : (
        <div className='center'>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Map
