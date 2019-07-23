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
    }
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
    let res = await fetch(dataSet.map + filter.date)
    res = await res.json()
    setState({ ...state, dataFeatures: res.features })
  }

  // TODO: refactor to fetch util
  const getBridgeEvents = async id => {
    let res = await fetch(`${apiUrl}/api/bridge_openings/?id=${id}`)
    let bridgeEvents = await res.json()
    setState({ ...state, bridgeEvents })
  }

  const getIcon = () => {
    switch (dataSet.icon) {
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
        setState({ ...state,
          showPopup: true,
          popupCoordinates: iconObject.object.coordinates,
          popupInfo: ['Loading information...']
        })
        let ids = iconObject.object.properties.id
        let id 
        if(Array.isArray(ids) && ids.length > 0) {
          id = ids[0]
        } else {
          id = ids
        }
        let res = await fetch(dataSet.fetchEvent + id)
        res = await res.json()
        console.log('res', res)
        if(Array.isArray(res) && res.length > 0) {
          res = res[0]
        }
        let popupInfo = []
        for(let [key, value] of Object.entries(res)) {
          if(typeof(value) !== 'object') {
            // Get a string with spaces from a camelCase string
            key = key.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join(' ')
            popupInfo.push(`${key}: ${value}`) 
          }
        }
        console.log(popupInfo)
        setState({ ...state,
          showPopup: true,
          popupCoordinates: iconObject.object.coordinates,
          popupInfo: popupInfo
        })
      }
    })
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

  const { dataFeatures, bridgeEvents, viewport, style, showPopup, popupInfo, popupCoordinates } = state
  return (
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
          {console.log(showPopup, "showPopup")}
          {showPopup && <Popup
          latitude={popupCoordinates[1]}
          longitude={popupCoordinates[0]}
          closeButton={true}
          closeOnClick={false}
          dynamicPosition={false}
          onClose={() => setState({ ...state, showPopup: false })} 
          anchor="bottom" >
          <ul>{popupInfo.map((value) => {
            return(<li>{value}</li>)
          })}</ul>
        </Popup>}
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
