import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';


// =============== Energy Dashboard ===============
const EnergyDashboard = () => {
  const data = [
    { label: '瞬時電力', value: 151, ratio: 30.2 },
    { label: '現在デマンド', value: 71, ratio: 14.2 },
    { label: '予測デマンド', value: 213, ratio: 42.6 },
  ];

  const targetValue = 500;
  const isBelowTarget = data[2].ratio < 50;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      border: '2px solid #000',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#fff',
      marginBottom: '15px',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#003366', color: '#fff' }}>
            <th style={{ padding: '5px', textAlign: 'left' }}>受電</th>
            <th style={{ padding: '5px', textAlign: 'right' }}>現在値</th>
            <th style={{ padding: '5px', textAlign: 'right' }}>目標比</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#e6f2ff' }}>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>{item.label}</td>
              <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>
                {item.value} <span style={{ fontSize: '12px' }}>kW</span>
              </td>
              <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>
                {item.ratio} <span style={{ fontSize: '12px' }}>%</span>
              </td>
            </tr>
          ))}
          <tr style={{ backgroundColor: '#e6f2ff' }}>
            <td style={{ padding: '5px', fontWeight: 'bold' }}>目標値</td>
            <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>
              {targetValue} <span style={{ fontSize: '12px' }}>kW</span>
            </td>
            <td style={{ padding: '5px', textAlign: 'right' }}>
              <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#ddd',
                borderRadius: '5px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  width: `${data[2].ratio}%`,
                  height: '100%',
                  backgroundColor: isBelowTarget ? '#4CAF50' : '#FF5722',
                  transition: 'width 0.5s ease-in-out',
                }}></div>
                <span style={{
                  position: 'absolute',
                  right: '5px',
                  top: '-15px',
                  fontSize: '10px',
                  color: '#666',
                }}>100%</span>
                <span style={{
                  position: 'absolute',
                  left: '5px',
                  top: '-15px',
                  fontSize: '10px',
                  color: '#666',
                }}>0%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// =============== CMP Status Bar ===============
const CMPStatusBar = () => {
  const cmps = [
    { name: 'CMP1', status: 'red' },
    { name: 'CMP2', status: 'red' },
    { name: 'CMP3', status: 'green' },
    { name: 'CMP4', status: 'red' },
  ];

  const emojis = [
    { symbol: '😊', color: '#4CAF50', label: '90%未満' },
    { symbol: '🙂', color: '#FFC107', label: '90～95%' },
    { symbol: '🙁', color: '#FF9800', label: '95～100%' },
    { symbol: '😢', color: '#F44336', label: '100%以上' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      maxWidth: '800px',
      boxSizing: 'border-box',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flex: 1,
        padding: '5px 10px',
        backgroundColor: '#fff',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        {cmps.map((cmp, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{cmp.name}</span>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: cmp.status === 'green' ? '#4CAF50' : '#F44336',
              border: '2px solid #fff',
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
            }}></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px' }}>
        {emojis.map((emoji, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: emoji.color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px',
              color: '#fff',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {emoji.symbol}
            </div>
            <div style={{ fontSize: '10px', marginTop: '4px', color: '#555', whiteSpace: 'nowrap' }}>
              {emoji.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============== Utility Dashboard ===============
const UtilityDashboard = () => {
  const data = [
    { label: '受電電力量', value: 1062, unit: 'kWh', color: '#007BFF' },
    { label: '市水', value: 1, unit: 'm³', color: '#0056b3' },
    { label: 'エアー', value: 332, unit: 'm³', color: '#007BFF' },
    { label: '都市ガス', value: 634, unit: 'm³', color: '#0056b3' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      padding: '20px 0',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      {data.map((item, index) => (
        <div key={index} style={{
          position: 'relative',
          backgroundColor: item.color,
          color: '#fff',
          borderRadius: '8px',
          padding: '10px 15px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            {item.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{item.value}</span>
            <span style={{ fontSize: '16px' }}>{item.unit}</span>
          </div>

          {/* Panah kuning dekoratif */}
          {index === 3 && (
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '0',
              height: '0',
              borderLeft: '20px solid transparent',
              borderBottom: '20px solid #FFD700',
              transform: 'rotate(-45deg)',
            }}></div>
          )}
          {index === 2 && (
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '-10px',
              width: '0',
              height: '0',
              borderRight: '20px solid transparent',
              borderTop: '20px solid #FFD700',
              transform: 'rotate(45deg)',
            }}></div>
          )}
        </div>
      ))}
    </div>
  );
};

// =============== Komponen Utama Gabungan ===============
const CombinedDashboard = () => {
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState({ average: 0, max: 0, total: 0, lastValue: 0 });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://172.27.6.191:4000/api/kub1-active-power');
      const rawData = response.data?.data;

      if (!Array.isArray(rawData)) {
        console.error('Invalid data format:', response.data);
        return;
      }

      const convertedData = rawData.map(entry => ({
        ...entry,
        date_time: moment(entry.date_time).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
        value: Math.ceil(Number(entry.value))
      }));

      if (convertedData.length === 0) {
        setData([]);
        setSummaryData({ average: 0, max: 0, total: 0, lastValue: 0 });
        return;
      }

      const chartData = convertedData.slice(0, 200);
      const values = convertedData.map(entry => entry.value).filter(Number.isFinite);

      const total = values.reduce((sum, val) => sum + val, 0);
      const max = values.length > 0 ? Math.max(...values) : 0;
      const average = values.length > 0 ? total / values.length : 0;
      const lastValue = values.length > 0 ? values[0] : 0;

      setData(chartData);
      setSummaryData({ average, max, total, lastValue });

    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const contractLimitData = data.map(entry => ({ date_time: entry.date_time, value: 2400 }));
  const lastData = data.length > 0 ? data[0] : null;

  return (
      <div className="container mt-3">
        <h2 className="text-center mb-4">📊 ダッシュボード統合表示</h2>

        {/* Main Two-Column Layout */}
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap', // responsive on small screens
        }}>
          {/* LEFT COLUMN: Static Dashboards */}
          <div style={{
            flex: 1,
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}>
            <EnergyDashboard />
            <CMPStatusBar />
            <UtilityDashboard />
          </div>

          {/* RIGHT COLUMN: Real-time Chart & Info */}
          <div style={{
            flex: 1,
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {/* Last Data Alert */}
            {lastData && (
              <div
                className={`alert text-center fs-5 p-3 d-flex justify-content-between align-items-center ${
                  lastData.value <= 2000 ? 'alert-success' : 'alert-danger'
                }`}
                style={{ borderRadius: '8px' }}
              >
                <span>{lastData.value <= 2000 ? 'Kondisi Aman ✅' : 'WASPADA ⚠️'}</span>
                <span>
                  <strong className="text-primary">{lastData.value} kW</strong>, {lastData.date_time}
                </span>
              </div>
            )}

            {/* Chart */}
            <div className="card p-3 shadow-sm" style={{ flexGrow: 1 }}>
              <h5 className="text-center mb-3">Kubikal 1 Active Power (kW)</h5>
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...data].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date_time"
                      tickFormatter={(tick) => moment(tick).format("HH:mm")}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 2500]} />
                    <Tooltip formatter={(value) => [`${value} kW`, 'Active Power']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Active Power"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive
                      animationDuration={1000}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Kontrak Daya (2400 kW)"
                      data={[...contractLimitData].reverse()}
                      stroke="#ff0000"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Table */}
            {/* <div className="card p-3 shadow-sm">
              <h6 className="text-center">Kondisi Kontrak Daya</h6>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td><strong>Kontrak Daya</strong></td>
                    <td className="bg-danger text-white fw-bold text-center">2400 kVA</td>
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </div>

  );
};

export default CombinedDashboard;