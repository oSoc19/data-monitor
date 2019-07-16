import React from 'react'

import { DashboardTable } from '../components/DashboardTable'

import Header from '../components/Header'

import { Activity } from 'react-feather'

const Dashboard = () => {
  return (
    <React.Fragment>
      <Header />
      {/* <Activity /> */}
      <DashboardTable />
    </React.Fragment>
  )
}

export default Dashboard
