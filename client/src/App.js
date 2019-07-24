import React from 'react'
import { Route } from 'react-router-dom'
import './App.sass'

/**
 * Import pages
 */
import MapOverview from './pages/MapOverview'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Info from './pages/Info'

import { bridgeOpenings } from './config/api'
import { StateProvider } from './utilities/state'
import { lastWeek, now } from './utilities/calendar'

const App = () => {
  /**
   * Initial global state
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
      date: `/?startTime=${lastWeek}&endTime=${now}`
    }
  }

  /**
   * reducer actions
   * - Switch data sets
   * - Filter data sets
   *   - date:
   *     - startDate (as ISOString)
   *     - endDate   (as ISOString)
   */
  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeDataSet':
        return {
          ...state,
          dataSet: action.newDataSet
        }
      case 'filterDataSet':
        return {
          ...state,
          filter: action.newFilter
        }
      default:
        throw new Error(`Unhandled action type: ${action.type}`)
    }
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Route path='/' exact component={Home} />
      <Route path='/mapbox' component={MapOverview} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/info' component={Info} />
    </StateProvider>
  )
}

export default App
