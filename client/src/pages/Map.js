import L from 'leaflet'
import 'leaflet.markercluster'
import React, { Component } from 'react'
import './Map.sass'

export default class Map extends Component {
  state = {
    bridges: [],
    map: null
  }

  componentDidMount() {
    this.map = this.renderMap()
    let cluster = L.markerClusterGroup({
      disableClusteringAtZoom: 13
    })
    this.map.addLayer(cluster)
    this.getBridges()
  }

  renderMap = () => {
    let map = L.map('map', {
      center: [52.1326, 5.2913],
      zoom: 8
    })

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNsYWQiLCJhIjoiY2pqbzZiczU0MTV5aTNxcnM5bWY1Nnp4YSJ9.C9UeB-y3MTGiU8Lv7_m5dQ',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      }
    ).addTo(map)
    L.circle([52.1326, 5.29313], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map)

    this.setState({ map })
    return map
  }

  getBridges = () => {
    fetch('http://82.196.10.230:8080/api/bridges')
      .then(res => {
        return res.json()
      })
      .then(bridges => {
        this.setState({ bridges })
      })
  }

  renderMarker = location => {
    L.marker([location.latitude, location.longitude]).addTo(this.state.map)
  }

  render() {
    const { bridges } = this.state
    return (
      <div>
        <h1>Map</h1>
        <div className="leaflet-container">
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
            integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
            crossOrigin=""
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css"
          />
          <div id="map"></div>
          {bridges &&
            bridges.map(bridge => {
              this.renderMarker(bridge.location)
            })}
        </div>
      </div>
    )
  }
}
