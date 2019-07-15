import React from 'react'

import { DashboardTable } from '../components/DashboardTable'

import { Activity } from 'react-feather'

import Header from '../components/Header'

const Dashboard = () => {
  return (
    <React.Fragment>
      <Header />
      <Activity />
      <DashboardTable />
      <div className="grid-wrapper"></div>
    </React.Fragment>
  )
}

export default Dashboard
