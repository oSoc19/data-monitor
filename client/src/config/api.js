export const apiUrl = process.env.API_DOMAIN
  ? process.env.API_DOMAIN
  : 'https://api.verkeersdatamonitor.nl'

export const bridgeOpenings = {
  summary: `${apiUrl}/api/qa/bridge_openings/summary`,
  map: `${apiUrl}/api/bridges`,
  csv: `${apiUrl}/api/download/bridge_openings/summary`,
  modify: `${apiUrl}/api/qa/bridge_openings/:id`,
  query: ``
}

export const maintenanceWorks = {
  summary: `${apiUrl}/api/qa/maintenance_works/summary`,
  map: `${apiUrl}/api/maintenance_works`,
  csv: `${apiUrl}/api/download/maintenance_works/summary`,
  query: `/api/?startTime=2019-07-08T12:20:38.000Z&endTime=2019-07-20T12:20:38.000Z`
}

export const accidents = {
  summary: `${apiUrl}/api/qa/accidents/summary/`,
  map: `${apiUrl}/api/accidents`,
  csv: `${apiUrl}/api/download/accidents/summary/`
}
