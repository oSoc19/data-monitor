import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import DeckGL, { ScatterplotLayer, IconLayer } from 'deck.gl'
import './Map.sass'
import Legend from '../Legend'
import bridgeOpenIcon from '../../assets/markers/bridge.png'
import maintenanceIcon from '../../assets/markers/actualmaintenance.png'
import accidentIcon from '../../assets/markers/incident.png'
import { Mapbox } from '../../config'
import { apiUrl } from '../../config/api'

import Loader from '../../components/Loader'

import { useGlobalState } from '../../utilities/state'

const Map = props => {
  /**
   * Get objects from global state
  */
  const [{ dataSet, filter }] = useGlobalState()
  const [state, setState] = useState({
    dataFeatures: [],
    bridgeEvents: null,
    style: 'mapbox://styles/mapbox/light-v9',
    showPopup: false,
    viewport: {
      latitude: 52.153,
      longitude: 5.5196,
      width: '100%',
      height: '100%',
      zoom: 7.1,
      bearing: 0,
      pitch: 0,
      minZoom: 6
    },
    icon: 'bridge'
  })

  /**
   * Trigger rerender when global state updates
   */
  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet, filter])

  // TODO: refactor to fetch util
  const getData = async () => {
    let res = await fetch(dataSet.map + filter.date.query)
    res = await res.json()
    setState({ ...state, dataFeatures: res.features, icon: dataSet.icon })
  }

  // TODO: refactor to fetch util
  const getBridgeEvents = async id => {
    let res = await fetch(`${dataSet.fetchEvent}${id}`)
    let bridgeEvents = await res.json()
    setState({ ...state, bridgeEvents })
  }

  /**
   * @return icon for current dataset
   */
  const getIcon = () => {
    switch (state.icon) {
      case 'bridge':
        return bridgeOpenIcon
      case 'maintenance':
        return maintenanceIcon
      case 'accident':
        return accidentIcon
      default:
        return 'none'
    }
  }

  // TODO: refactor to map layer component

  /**
   * Render map icon layer with popups
   */
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
      getSize: d => 32,
      onClick: async (iconObject, x, y) => {
        setState({
          ...state,
          showPopup: true,
          popupCoordinates: iconObject.object.coordinates,
          popupInfo: ['Loading information...']
        })
        let ids = iconObject.object.properties.id
        let id
        if (Array.isArray(ids) && ids.length > 0) {
          id = ids[0]
        } else {
          return // bad response
        }
        let res = await fetch(dataSet.fetchEvent + id)
        res = await res.json()
        let popupInfo = []
        for (let [key, value] of Object.entries(res)) {
          if (typeof value !== 'object') {
            // Get a string with spaces from a camelCase string
            key = key
              .split(/(?=[A-Z])/)
              .map(s => s.toLowerCase())
              .join(' ')
            popupInfo.push(`${key}: ${value}`)
          }
        }
        setState({
          ...state,
          showPopup: true,
          popupCoordinates: iconObject.object.coordinates,
          popupInfo: popupInfo
        })
      }
    })
  }

  /**
   * update map style
   */
  const onStyleChange = style => {
    setState({ ...state, style })
  }

  /**
   * update map viewport
   */
  const _onViewportChange = viewport => {
    setState({
      ...state,
      viewport
    })
  }

  const {
    dataFeatures,
    bridgeEvents,
    viewport,
    style,
    showPopup,
    popupInfo,
    popupCoordinates
  } = state
  return (
    <React.Fragment>
      <h4>Overview {dataSet.name} datapoints</h4>
      <div className='map'>
        {dataFeatures.length > 0 ? (
          <ReactMapGL
            {...viewport}
            onViewportChange={viewport => _onViewportChange(viewport)}
            mapboxApiAccessToken={Mapbox.token}
            mapStyle={style}
          >
            <DeckGL
              layers={[renderIconLayer()]}
              initialViewState={viewport}
              controller
            ></DeckGL>
            {showPopup && (
              <Popup
                latitude={popupCoordinates[1]}
                longitude={popupCoordinates[0]}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={false}
                onClose={() => setState({ ...state, showPopup: false })}
                anchor='bottom'
              >
                <ul>
                  {popupInfo.map(value => {
                    return <li>{value}</li>
                  })}
                </ul>
              </Popup>
            )}
          </ReactMapGL>
        ) : (
          <div className='center'>
            <Loader text='Loading map' />
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default Map
