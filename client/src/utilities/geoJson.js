import { GeoJSON } from 'geojson'

const GeoJson = {
  parseToGeoJson: bridges => {
    const geoJsonBridges = bridges.map(bridge => {
      return (bridge = {
        lat: bridge.location.latitude,
        lng: bridge.location.longitude
      })
    })
    return GeoJSON.parse(geoJsonBridges, {
      Point: ['lat', 'lng'],
      include: ['name']
    })
  }
}

export { GeoJson }
