import React from 'react'

import './DashboardTable.sass'

import regionData from '../../components/Map/cities'

import { PlusCircle } from 'react-feather'

const DashboardTable = () => {
  return (
    <div className="dashboard-container">
      {Object.keys(regionData).map(province => {
        return (
          <div className="dashboard-item">
            <h1>{province}</h1>
            <button>
              <PlusCircle />
            </button>
            <ul>
              {Object.values(regionData[province]).map(city => {
                return <li>{city}</li>
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardTable
