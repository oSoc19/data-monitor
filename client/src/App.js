import React from 'react'
import './App.sass'
import Header from './components/Header/'

import LeafletMap from './pages/LeafletMap'
import Map from './pages/Map'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Info from './pages/Info'

import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <React.Fragment>
      {/* <Header /> */}
      <Route path="/" exact component={Home} />
      <Route path="/mapbox" component={Map} />
      <Route path="/map" component={LeafletMap} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/info" component={Info} />
    </React.Fragment>
  )
}

export default App
