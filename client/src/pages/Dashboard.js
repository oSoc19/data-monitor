import React from 'react'

import { DashboardTable } from '../components/DashboardTable'
import LayoutWrapper from '../components/LayoutWrapper'

import { Activity } from 'react-feather'

const Dashboard = () => {
  return (
    <LayoutWrapper>
      <DashboardTable />
    </LayoutWrapper>
  )
}

export default Dashboard
