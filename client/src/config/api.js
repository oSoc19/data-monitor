/**
 * API config
 * - base
 * - endpoints for different data sets
 */

export const apiUrl = process.env.REACT_APP_API_DOMAIN || 'http://localhost:8080'

 
export const bridgeOpenings = {
  summary: `${apiUrl}/api/qa/bridge_openings/summary`,
  fetchEvent: `${apiUrl}/api/bridge_openings/`,
  map: `${apiUrl}/api/bridge_openings`,
  csv: `${apiUrl}/api/download/bridge_openings/summary`,
  modify: `${apiUrl}/api/qa/bridge_openings/:id`,
  query: ``
}

export const maintenanceWorks = {
  summary: `${apiUrl}/api/qa/maintenance_works/summary`,
  fetchEvent: `${apiUrl}/api/maintenance_works/`,
  map: `${apiUrl}/api/maintenance_works`,
  csv: `${apiUrl}/api/download/maintenance_works/summary`,
  query: `/api/?startTime=2019-07-08T12:20:38.000Z&endTime=2019-07-20T12:20:38.000Z`
}

export const accidents = {
  summary: `${apiUrl}/api/qa/accidents/summary/`,
  fetchEvent: `${apiUrl}/api/accidents/`,
  map: `${apiUrl}/api/accidents`,
  csv: `${apiUrl}/api/download/accidents/summary/`
}
