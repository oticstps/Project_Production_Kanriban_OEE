import React from 'react'
import Layout from '../layout/Layout';
import LineProductionStatus from './ManhourBreakdown/LineProductionStatus'
import LineBreakdown from './ManhourBreakdown/LineBreakdown'

const ManhourBreakdown = () => {
  return (
    <Layout>
      {/* <div>ManhourBreakdown</div> */}
      <LineBreakdown />
    </Layout>
  )
}

export default ManhourBreakdown;