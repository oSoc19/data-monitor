import React from 'react'
import './App.sass'
import Header from './components/Header/'
import LeafletMap from './pages/LeafletMap'

function App() {
  return (
    <React.Fragment>
      <Header />
      {/* <Map /> */}
      <LeafletMap />
    </React.Fragment>
  )
}

export default App
