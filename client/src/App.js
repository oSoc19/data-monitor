import React from 'react'
import './sass/main.sass'

import { StateProvider } from './utilities/state'

import LeafletMap from './pages/LeafletMap'
import MapOverview from './pages/MapOverview'
import Dashboard from './pages/Dashboard'

import Home from './pages/Home'
// import NotFound from './pages/NotFound'
import Info from './pages/Info'

import { Route } from 'react-router-dom'

const App = () => {
  /**
   * Global state
   */
  const initialState = {
    dataSet: { name: 'bridges' }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeDataSet':
        return {
          ...state,
          dataSet: action.newDataSet
        }
      default:
        return state
    }
  }

  return (
    <React.Fragment>
      <Route path='/' exact component={Home} />
      <Route path='/leaflet' component={LeafletMap} />
      <StateProvider initialState={initialState} reducer={reducer}>
        <Route path='/mapbox' component={MapOverview} />
        <Route path='/dashboard' component={Dashboard} />
      </StateProvider>
      <Route path='/info' component={Info} />
    </React.Fragment>
  )
}

export default App
