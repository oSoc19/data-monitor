import React from 'react'
import './sass/main.sass'

import LeafletMap from './pages/LeafletMap'
import MapOverview from './pages/MapOverview'
import Dashboard from './pages/Dashboard'

import Home from './pages/Home'
// import NotFound from './pages/NotFound'
import Info from './pages/Info'

import { Route } from 'react-router-dom'

const App = () => {
  return (
    <React.Fragment>
      <Route path='/' exact component={Home} />
      <Route path='/leaflet' component={LeafletMap} />
      <Route path='/mapbox' component={MapOverview} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/info' component={Info} />
    </React.Fragment>
  )
}

export default App
