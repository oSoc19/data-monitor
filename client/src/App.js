import React from 'react'

import { StateProvider } from './utilities/state'

import LeafletMap from './pages/LeafletMap'
import MapOverview from './pages/MapOverview'
import Dashboard from './pages/Dashboard'

import Home from './pages/Home'
import Info from './pages/Info'

import { Route } from 'react-router-dom'

import { bridgeOpenings } from './config/api'

import { today } from './utilities/calendar'

import './App.sass'

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
    },
    filter: {
      date: `?startTime=2019-07-20T12:20:38.000Z&endTime=2019-07-21T12:20:38.000Z`
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      /**
       * Switch between datasets
       */
      case 'changeDataSet':
        return {
          ...state,
          dataSet: action.newDataSet
        }
      /**
       * Filter data sets
       * - date:
       *   - startDate
       *   - endDate
       */
      case 'filterDataSet':
        return {
          ...state,
          filter: action.newFilter
        }
      default:
        return state
    }
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Route path='/' exact component={Home} />
      <Route path='/leaflet' component={LeafletMap} />
      <Route path='/mapbox' component={MapOverview} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/info' component={Info} />
    </StateProvider>
  )
}

export default App
