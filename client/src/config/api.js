const api = {
  domain: 'http://82.196.10.230',
  port: 8080,
  endPoint: '/api/'
}

const apiUrl = `${api.domain}:${api.port}${api.endPoint}`

export const bridgeOpenings = {
  summary: `${apiUrl}qa/bridge_openings/summary`,
  map: `${apiUrl}bridges`,
  csv: `${apiUrl}download/bridge_openings/summary`,
  modify: `${apiUrl}qa/bridge_openings/:id`,
  query: ``
}

export const maintenanceWorks = {
  summary: `${apiUrl}qa/maintenance_works/summary`,
  map: `${apiUrl}maintenance_works`,
  csv: `${apiUrl}download/maintenance_works/summary`,
  query: `/?startTime=2019-07-08T12:20:38.000Z&endTime=2019-07-20T12:20:38.000Z`
}

export const accidents = {
  summary: `${apiUrl}qa/accidents/summary/`,
  map: `${apiUrl}accidents`,
  csv: `${apiUrl}download/accidents/summary/`
}
