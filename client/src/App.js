import React from 'react'

import { StateProvider } from './utilities/state'

import LeafletMap from './pages/LeafletMap'
import MapOverview from './pages/MapOverview'
import Dashboard from './pages/Dashboard'

import Home from './pages/Home'
import Info from './pages/Info'

import { Route } from 'react-router-dom'

import { bridgeOpenings } from './config/api'

const App = () => {
  /**
   * Global state
   */
  const initialState = {
    dataSet: {
      name: 'bridges',
      summary: bridgeOpenings.summary,
      map: bridgeOpenings.map,
      download: bridgeOpenings.csv,
      icon: 'bridge'
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeDataSet':
        return {
          ...state,
          dataSet: action.newDataSet
        }
      /**
       * TODO: filter actions
       */
      default:
        return state
    }
  }

  return (
    <React.Fragment>
      <StateProvider initialState={initialState} reducer={reducer}>
        <Route path='/' exact component={Home} />
        <Route path='/leaflet' component={LeafletMap} />
        <Route path='/mapbox' component={MapOverview} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/info' component={Info} />
      </StateProvider>
    </React.Fragment>
  )
}

export default App
