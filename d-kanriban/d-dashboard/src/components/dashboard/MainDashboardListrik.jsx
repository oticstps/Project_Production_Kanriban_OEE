import React from 'react';
import { Container } from 'react-bootstrap';
import Nais_Layout from '../layout/Layout';
import MonthlyReport from './MainDashboardPlant1/MonthlyReport';
import ShiftlyReport from './MainDashboardPlant1/ShiftlyReport';

const MainDashboardListrik = () => {
  return (
    <Nais_Layout>
      <Container fluid className="p-1">
        <ShiftlyReport />
        <MonthlyReport />
      </Container>
    </Nais_Layout>
  );
};

export default MainDashboardListrik;