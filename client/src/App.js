import React from 'react'
import './App.sass'
import './sass/main.sass'

import LeafletMap from './pages/LeafletMap'
import Map from './pages/Map'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
// import NotFound from './pages/NotFound'
import Info from './pages/Info'

// import LayoutWrapper from './components/LayoutWrapper'

import { Route } from 'react-router-dom'

const App = () => {
  return (
    <React.Fragment>
      <Route path="/" exact component={Home} />
      <Route path="/leaflet" component={LeafletMap} />
      <Route path="/mapbox" component={Map} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/info" component={Info} />
    </React.Fragment>
  )
}

export default App
