import React from 'react'

import { DashboardTable } from '../components/DashboardTable'
import LayoutWrapper from '../components/LayoutWrapper'

/**
 * Dashboard view page
 */
const Dashboard = () => {
  return (
    <LayoutWrapper sidebar={true}>
      <DashboardTable />
    </LayoutWrapper>
  )
}

export default Dashboard
