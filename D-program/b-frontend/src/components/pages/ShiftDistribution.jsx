// components/Part_Dashboard/ShiftDistribution.jsx
import React from 'react';
import { Col, Card, Spinner } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartPie } from 'react-icons/fa';

const ShiftDistribution = ({ loading, shiftDistribution, totalShift1, totalShift2 }) => {
  const COLORS = ['#2edace', '#172fe5'];

  return (
    <Col md={4}>
      <Card className="shadow-sm border-0 h-100">
        <Card.Body>
          <Card.Title className="text-primary fs-6 mb-3">
            <FaChartPie className="me-1" /> Shift Energy Distribution
          </Card.Title>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '180px' }}>
              <Spinner animation="border" variant="info" />
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-center" style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={shiftDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {shiftDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Math.round(value/1000).toLocaleString()} kWh`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <div><span style={{ color: COLORS[0], fontWeight: 'bold' }}>⬤</span> Shift 1: {Math.ceil(totalShift1/1000).toLocaleString()} kWh</div>
                <div><span style={{ color: COLORS[1], fontWeight: 'bold' }}>⬤</span> Shift 2: {Math.ceil(totalShift2/1000).toLocaleString()} kWh</div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ShiftDistribution;