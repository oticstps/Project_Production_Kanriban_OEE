import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card, Button, Spinner, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from 'recharts';
import {
  FaBolt,
  FaCalendarAlt,
  FaChartLine,
  FaLeaf,
  FaMoneyBillWave,
  FaClock,
  FaArrowUp,
  FaTachometerAlt,
  FaCheck,
  FaSync,
  FaChartPie
} from 'react-icons/fa';

// Header Component
const Header = ({ selectedMonth, handleMonthChange }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
      <h4 className="m-0 d-flex align-items-center text-primary" style={{ color: '#1a73e8' }}>
        <FaBolt className="me-2" size={24} />
        <span className="fw-bold">Otics Indonesia Energy Consumption Dashboard</span>
      </h4>

      <div className="d-flex align-items-center">
        <label htmlFor="monthSelect" className="me-2 text-muted d-none d-md-block">
          <FaCalendarAlt className="me-1" /> Select Month:
        </label>
        <Form.Select
          id="monthSelect"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="form-select shadow-sm border-0 fw-semibold"
          style={{
            width: '180px',
            fontSize: '1rem',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.8)',
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          aria-label="Select Month"
        >
          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </Form.Select>
      </div>
    </div>
  );
};

// SummaryCards Component
const SummaryCards = ({
  totalConsumption,
  averageDailyConsumption,
  uniqueDays,
  totalCO2,
  totalCost,
  avgShift1,
  avgShift2,
  shift1Percent,
  shift2Percent,
  maxShiftValue,
  efficiencyRatio,
  selectedMonth
}) => {

  const getShiftComparisonStatus = () => {
    if (efficiencyRatio < 0.9) return { text: "Shift 1 Efficient", variant: "success", icon: <FaCheck /> };
    if (efficiencyRatio > 1.1) return { text: "Shift 2 Efficient", variant: "success", icon: <FaCheck /> };
    return { text: "Balanced", variant: "info", icon: <FaCheck /> };
  };

  return (
    <Row className="mb-3 p-2 g-2" style={{ backgroundColor: "#bce3ed", borderRadius: "6px"  }}>
      {/* First Row */}
      <Col md={2}>
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-primary fs-5 mb-0 d-flex align-items-center">
                <FaBolt className="me-1" /> Total Energy
              </Card.Title>
              <span className="text-muted fs-7">(総エネルギー)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {totalConsumption.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={2}>
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-warning fs-5 mb-0 d-flex align-items-center">
                <FaMoneyBillWave className="me-1" /> Cost
              </Card.Title>
              <span className="text-muted fs-7">(コスト)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              Rp {totalCost.toLocaleString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2}>
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-success fs-5 mb-0 d-flex align-items-center">
                <FaChartLine className="me-1" /> Avg Daily
              </Card.Title>
              <span className="text-muted fs-7">(平均日次)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {averageDailyConsumption.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>


      {/* Second Row */}
      <Col md={2} className="mt-2">
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-secondary fs-5 mb-0 d-flex align-items-center justify-content-center">
                <FaClock className="me-1" /> Shift 1 Avg
              </Card.Title>
              <span className="text-muted fs-7">(シフト1 平均)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {avgShift1.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} className="mt-2">
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-secondary fs-5 mb-0 d-flex align-items-center justify-content-center">
                <FaClock className="me-1" /> Shift 2 Avg
              </Card.Title>
              <span className="text-muted fs-7">(シフト2 平均)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {avgShift2.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} className="mt-2">
        <Card className="h-100 shadow-sm border-0 p-1">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Card.Title className="text-secondary fs-5 mb-0 d-flex align-items-center justify-content-center">
                <FaArrowUp className="me-1" /> Peak Value
              </Card.Title>
              <span className="text-muted fs-7">(ピーク値)</span> {/* Japanese translation */}
            </div>
            <Card.Text className="display-6 mt-2 fs-5 fw-bold">
              {maxShiftValue.toLocaleString()} kWh
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

    </Row>
  );
};

// EmissionsAndCost Component
const EmissionsAndCost = ({ totalCO2, uniqueDays, totalCost }) => {
  return (
    <Row className="mb-3 p-2 g-2" style={{ backgroundColor: "#bce3ed", borderRadius: "6px" }}>
      {/* CO2 Emissions Summary */}
      <Col md={6}>
        <Card className="text-center shadow-sm border-0 border-left-danger h-100">
          <Card.Body className="d-flex flex-column">
            <Card.Title className="text-danger fs-5 mb-3">
              <FaLeaf className="me-2" />
              CO2 Emissions Summary
              <span className="d-block text-muted small">(CO2排出量サマリー)</span> {/* Japanese translation */}
            </Card.Title>
            <Row>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Monthly</p>
                  <span className="d-block text-muted small">(月間)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">{totalCO2.toLocaleString()} kg</h5>
                </div>
              </Col>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Daily Avg</p>
                  <span className="d-block text-muted small">(日平均)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">{uniqueDays > 0 ? (totalCO2 / uniqueDays).toFixed(2) : "0"} kg</h5>
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <p className="mb-0 text-muted small">Yearly</p>
                  <span className="d-block text-muted small">(年間)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">{(totalCO2 * 12).toLocaleString()} kg</h5>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      {/* Cost Analysis */}
      <Col md={6}>
        <Card className="text-center shadow-sm border-0 border-left-warning h-100">
          <Card.Body className="d-flex flex-column">
            <Card.Title className="text-warning fs-5 mb-3">
              <FaMoneyBillWave className="me-2" />
              Cost Analysis
              <span className="d-block text-muted small">(コスト分析)</span> {/* Japanese translation */}
            </Card.Title>
            <Row>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Monthly</p>
                  <span className="d-block text-muted small">(月間)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">Rp {(totalCost).toLocaleString()}</h5>
                </div>
              </Col>
              <Col md={4}>
                <div className="border-end">
                  <p className="mb-0 text-muted small">Daily Avg</p>
                  <span className="d-block text-muted small">(日平均)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">Rp {uniqueDays > 0 ? Math.ceil(totalCost / uniqueDays).toLocaleString() : "0"}</h5>
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <p className="mb-0 text-muted small">Per kWh</p>
                  <span className="d-block text-muted small">(kWhあたり)</span> {/* Japanese translation */}
                  <h5 className="mb-0 fw-bold fs-5">Rp 2,093</h5>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// DailyConsumption Component
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

// ShiftDistribution Component
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

// YearlySummary Component
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

// Main Component (renamed from Dashboard)
const Main = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalConsumption, setTotalConsumption] = useState(0);
    const [averageDailyConsumption, setAverageDailyConsumption] = useState(0);
    const [totalShift1, setTotalShift1] = useState(0);
    const [totalShift2, setTotalShift2] = useState(0);
    const [avgShift1, setAvgShift1] = useState(0);
    const [avgShift2, setAvgShift2] = useState(0);
    const [maxShiftValue, setMaxShiftValue] = useState(0);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [totalCost, setTotalCost] = useState(0);
    const [totalCO2, setTotalCO2] = useState(0);
    const [uniqueDays, setUniqueDays] = useState(0);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [yearlyTotal, setYearlyTotal] = useState(0);
    const [shiftDistribution, setShiftDistribution] = useState([]);
    const [shift1Percent, setShift1Percent] = useState(0);
    const [shift2Percent, setShift2Percent] = useState(0);
    const [efficiencyRatio, setEfficiencyRatio] = useState(0);

    const fetchData = async (month) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://172.27.6.191:3400/api/tb_pershift_kub/month/${month}?db=db_energy_area_compressor`);
            const data = response.data;

            if (!data || data.length === 0) {
                setChartData([]);
                setTotalConsumption(0);
                setAverageDailyConsumption(0);
                setTotalShift1(0);
                setTotalShift2(0);
                setAvgShift1(0);
                setAvgShift2(0);
                setMaxShiftValue(0);
                setTotalCost(0);
                setTotalCO2(0);
                setUniqueDays(0);
                return;
            }

            const groupedData = data.reduce((acc, entry) => {
                const dayKey = `${month.slice(0, 3)} ${entry.day}`;
                const existingEntry = acc.find(item => item.day === dayKey);

                if (existingEntry) {
                    existingEntry[entry.shift] = Number(entry.consumption_energy) || 0;
                } else {
                    acc.push({
                        day: dayKey,
                        shift_1: entry.shift === "shift_1" ? Number(entry.consumption_energy) || 0 : 0,
                        shift_2: entry.shift === "shift_2" ? Number(entry.consumption_energy) || 0 : 0,
                    });
                }
                return acc;
            }, []);

            setChartData(groupedData);

            // Calculate total for each shift
            const shift1Total = groupedData.reduce((sum, item) => sum + item.shift_1, 0);
            const shift2Total = groupedData.reduce((sum, item) => sum + item.shift_2, 0);
            setTotalShift1(shift1Total);
            setTotalShift2(shift2Total);

            // Calculate days with each shift
            const daysWithShift1 = groupedData.filter(item => item.shift_1 > 0).length;
            const daysWithShift2 = groupedData.filter(item => item.shift_2 > 0).length;

            // Calculate average per shift per day (in kWh)
            const avgS1 = daysWithShift1 > 0 ? Math.ceil(shift1Total / daysWithShift1 / 1000) : 0;
            const avgS2 = daysWithShift2 > 0 ? Math.ceil(shift2Total / daysWithShift2 / 1000) : 0;
            setAvgShift1(avgS1);
            setAvgShift2(avgS2);

            // Calculate efficiency ratio (lower is better)
            if (avgS1 > 0 && avgS2 > 0) {
                setEfficiencyRatio(Math.round((avgS1 / avgS2) * 100) / 100);
            }

            // Calculate shift percentages
            const totalShifts = shift1Total + shift2Total;
            if (totalShifts > 0) {
                const s1Percent = Math.round((shift1Total / totalShifts) * 100);
                const s2Percent = 100 - s1Percent;
                setShift1Percent(s1Percent);
                setShift2Percent(s2Percent);
                setShiftDistribution([
                    { name: 'Shift 1', value: shift1Total },
                    { name: 'Shift 2', value: shift2Total }
                ]);
            }

            // Total kWh
            const total = Math.ceil(
                data.reduce((sum, entry) => sum + (Number(entry.consumption_energy) || 0), 0) / 1000
            );
            setTotalConsumption(total);

            // Average daily consumption
            const uniqueDaysCount = new Set(data.map(entry => entry.day)).size;
            setUniqueDays(uniqueDaysCount);
            setAverageDailyConsumption(Math.ceil(total / uniqueDaysCount));

            // Max value
            const maxShift = Math.ceil(
                Math.max(...data.map(entry => (Number(entry.consumption_energy) || 0) / 1000))
            );
            setMaxShiftValue(maxShift);

            // Assuming the cost per kWh is 2092.94 IDR
            const costPerKWh = 2092.94;
            setTotalCost(Math.ceil(total * costPerKWh));

            // Assuming the CO2 emission factor is 0.92 kg CO2 per kWh
            const co2EmissionFactor = 0.92;
            setTotalCO2(total * co2EmissionFactor / 1000);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllMonthsData = async () => {
        setLoadingSummary(true);
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        try {
            const summaryData = [];
            let total = 0;

            for (const month of months) {
                try {
                    const response = await axios.get(`http://172.27.6.191:3400/api/tb_pershift_kub/month/${month}?db=db_energy_area_compressor`);
                    const data = response.data;

                    // Calculate total consumption for month in kWh
                    const monthlyConsumption = Math.ceil(
                        data.reduce((sum, entry) => sum + (Number(entry.consumption_energy) || 0), 0) / 1000
                    );

                    // Calculate cost
                    const costPerKWh = 2092.94;
                    const monthlyCost = Math.ceil(monthlyConsumption * costPerKWh);

                    // Calculate CO2
                    const co2EmissionFactor = 0.92;
                    const monthlyCO2 = monthlyConsumption * co2EmissionFactor / 1000;

                    summaryData.push({
                        month: month,
                        consumption: monthlyConsumption,
                        cost: monthlyCost,
                        co2: monthlyCO2.toFixed(2)
                    });

                    total += monthlyConsumption;
                } catch (error) {
                    console.error(`Error fetching data for ${month}:`, error);
                    // Add placeholder data for months with errors
                    summaryData.push({
                        month: month,
                        consumption: 0,
                        cost: 0,
                        co2: "0.00"
                    });
                }
            }

            setMonthlySummary(summaryData);
            setYearlyTotal(total);
        } catch (error) {
            console.error('Error fetching monthly summary:', error);
        } finally {
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        fetchData(selectedMonth);
        fetchAllMonthsData();

        const interval = setInterval(() => {
            fetchData(selectedMonth);
        }, 3600000); // Refresh every hour

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <Container fluid className="p-1">
            <Header 
                selectedMonth={selectedMonth} 
                handleMonthChange={handleMonthChange} 
            />

            <SummaryCards 
                totalConsumption={totalConsumption}
                averageDailyConsumption={averageDailyConsumption}
                uniqueDays={uniqueDays}
                totalCO2={totalCO2}
                totalCost={totalCost}
                avgShift1={avgShift1}
                avgShift2={avgShift2}
                shift1Percent={shift1Percent}
                shift2Percent={shift2Percent}
                maxShiftValue={maxShiftValue}
                efficiencyRatio={efficiencyRatio}
                selectedMonth={selectedMonth}
            />

            <Row className="mb-3 p-2 g-2" style={{ backgroundColor: "#bce3ed", borderRadius: "6px" }}>
                <EmissionsAndCost 
                    totalCO2={totalCO2}
                    uniqueDays={uniqueDays}
                    totalCost={totalCost}
                />
                <ShiftDistribution 
                    loading={loading}
                    shiftDistribution={shiftDistribution}
                    totalShift1={totalShift1}
                    totalShift2={totalShift2}
                />
            </Row>

            <DailyConsumption 
                chartData={chartData}
                loading={loading}
                selectedMonth={selectedMonth}
                fetchData={fetchData}
                totalShift1={totalShift1}
                totalShift2={totalShift2}
            />

            <YearlySummary 
                monthlySummary={monthlySummary}
                loadingSummary={loadingSummary}
                yearlyTotal={yearlyTotal}
                fetchAllMonthsData={fetchAllMonthsData}
            />
        </Container>
    );
};

export default Main;
