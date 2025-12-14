import React from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaCalendarAlt, FaSync } from 'react-icons/fa';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: '#fff',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <p className="label" style={{ fontWeight: 'bold', marginBottom: '4px' }}>{`${label}`}</p>
        <p className="desc" style={{ margin: 0, color: '#2edace' }}>{`Shift 1: ${(payload[0].value / 1000).toFixed(2)} kWh`}</p>
        <p className="desc" style={{ margin: 0, color: '#172fe5' }}>{`Shift 2: ${(payload[1].value / 1000).toFixed(2)} kWh`}</p>
      </div>
    );
  }

  return null;
};

const DailyConsumption = ({ chartData, loading, selectedMonth, fetchData, totalShift1, totalShift2 }) => {
  return (
    <Row className="mb-3 p-2 g-2" style={{ backgroundColor: "#bce3ed", borderRadius: "6px" }}>
      <Col>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title className="text-primary d-flex justify-content-between align-items-center mb-3">
              <div>
                <FaCalendarAlt className="me-2" />
                Daily Energy Consumption - {selectedMonth}
                <span className="d-block text-muted">(日次エネルギー消費量)</span> {/* Japanese translation */}
              </div>
              <Button variant="outline-primary" size="sm" onClick={() => fetchData(selectedMonth)}>
                <FaSync />
              </Button>
            </Card.Title>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" variant="info" />
              </div>
            ) : (
              <>
                {/* Total Shift Summary Centered Above the Chart */}
                <div className="d-flex justify-content-center mb-3">
                  <div className="text-center">
                    <strong className="text-black fs-5">Total Shift 1:</strong>{' '}
                    <span className="text-success fs-4 fw-bold">{(totalShift1 / 1000).toFixed(0)} kWh</span>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong className="text-black fs-5">Total Shift 2:</strong>{' '}
                    <span className="text-primary fs-4 fw-bold">{(totalShift2 / 1000).toFixed(0)} kWh</span>
                  </div>
                </div>

                {/* Bar Chart */}
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={chartData}
                    barGap={2}
                    barCategoryGap={5}
                    margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                    <XAxis dataKey="day" stroke="#34495E" tick={{ fontSize: 12 }} />
                    <YAxis
                      stroke="#34495E"
                      tickFormatter={(value) => `${(value / 1000).toFixed(1)}kW`}
                      domain={[0, 'dataMax + 1000']}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                    <Legend verticalAlign="top" height={36} iconSize={10} />

                    {/* Shift 1 */}
                    <Bar
                      dataKey="shift_1"
                      name="Shift 1"
                      fill="url(#gradientShift1)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                    />

                    {/* Shift 2 */}
                    <Bar
                      dataKey="shift_2"
                      name="Shift 2"
                      fill="url(#gradientShift2)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                    />

                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="gradientShift1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2edace" stopOpacity={1} />
                        <stop offset="95%" stopColor="#2edace" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="gradientShift2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#172fe5" stopOpacity={1} />
                        <stop offset="95%" stopColor="#172fe5" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DailyConsumption;