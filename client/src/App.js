import React from 'react'
import './App.sass'
import Header from './components/Header/'
import LeafletMap from './pages/LeafletMap'

import Dashboard from './pages/Dashboard'
import Home from './pages/Home'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Header />
      <Route path="/" exact component={Home} />
      <Route path="/map" component={LeafletMap} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  )
}

export default App
