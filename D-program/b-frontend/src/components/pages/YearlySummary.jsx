// components/Part_Dashboard/YearlySummary.jsx
import React from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Table } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { FaCalendarAlt, FaSync } from 'react-icons/fa';

const YearlySummary = ({ monthlySummary, loadingSummary, yearlyTotal, fetchAllMonthsData }) => {
  return (
    <Row className="mb-3 p-2 g-2" style={{ backgroundColor: "#bce3ed", borderRadius: "6px" }}>
      <Col>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title className="text-primary d-flex justify-content-between align-items-center mb-3">
              <div>
                <FaCalendarAlt className="me-2" />
                Yearly Energy Consumption Summary 2025
                <div className="text-muted small">年間エネルギー消費サマリー</div> {/* Japanese translation */}
              </div>
              <div>
                <Badge bg="primary" className="me-2" style={{ fontSize: '1rem' }}>
                  Total: {yearlyTotal.toLocaleString()} kWh
                </Badge>
                <Button variant="outline-primary" size="sm" onClick={fetchAllMonthsData}>
                  <FaSync />
                </Button>
              </div>
            </Card.Title>

            {loadingSummary ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" variant="info" />
              </div>
            ) : (
              <>
                {/* Bar Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlySummary}
                    barGap={2}
                    barCategoryGap={18}
                    margin={{ left: 30, top: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                    <XAxis dataKey="month" stroke="#34495E" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#34495E" tickFormatter={(value) => `${value.toLocaleString()} kWh`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#F8F9FA',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                      formatter={(value) => [`${value.toLocaleString()} kWh`, 'Consumption']}
                    />
                    <Bar dataKey="consumption" fill="url(#gradientEnergy)" name="Energy (kWh)" radius={[4, 4, 0, 0]}>
                      <LabelList
                        dataKey="consumption"
                        position="top"
                        fontSize={14}
                        fontWeight="bold"
                        formatter={(value) => value > 0 ? `${value.toFixed()}k` : '0'}
                        style={{ fill: '#000000' }}
                      />
                    </Bar>
                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="gradientEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3498db" stopOpacity={1} />
                        <stop offset="95%" stopColor="#3498db" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>

                {/* Data Table */}
                <div className="mt-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <Table striped bordered hover size="sm" responsive>
                    <thead className="bg-primary text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                      <tr>
                        <th>
                          Month
                          <div className="text-muted small">月</div> {/* Japanese translation */}
                        </th>
                        <th className="text-end">
                          kWh
                          <div className="text-muted small">エネルギー</div> {/* Japanese translation */}
                        </th>
                        <th className="text-end">
                          Cost (Rp)
                          <div className="text-muted small">コスト</div> {/* Japanese translation */}
                        </th>
                        <th className="text-end">
                          CO2 (ton)
                          <div className="text-muted small">CO2排出量</div> {/* Japanese translation */}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlySummary.map((item, index) => (
                        <tr key={index}>
                          <td>{item.month}</td>
                          <td className="text-end">{item.consumption.toLocaleString()}</td>
                          <td className="text-end">{(item.cost).toLocaleString()}</td>
                          <td className="text-end">{item.co2}</td>
                        </tr>
                      ))}
                      <tr className="fw-bold bg-light">
                        <td>Total</td>
                        <td className="text-end">{yearlyTotal.toLocaleString()}</td>
                        <td className="text-end">
                          {(monthlySummary.reduce((sum, item) => sum + item.cost, 0) / 1000000).toFixed(1)}M
                        </td>
                        <td className="text-end">
                          {monthlySummary.reduce((sum, item) => sum + parseFloat(item.co2), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default YearlySummary;