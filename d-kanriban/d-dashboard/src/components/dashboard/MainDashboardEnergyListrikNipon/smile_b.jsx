





import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// =============== Ikon Smiley Kustom dengan Mimik Wajah Sesuai Emosi ===============
const CustomSmileyIcon = ({ ratio }) => {
  let bgColor, darkBgColor, borderColor, facePath;

  if (ratio < 90) {
    bgColor = '#66BB6A';
    darkBgColor = '#4CAF50';
    borderColor = '#388E3C';
    facePath = (
      <>
        <path d="M25 30 Q30 25 35 30" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M45 30 Q50 25 55 30" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M25 45 Q40 55 55 45" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  } else if (ratio < 95) {
    bgColor = '#FFCA28';
    darkBgColor = '#FFB300';
    borderColor = '#FF8F00';
    facePath = (
      <>
        <circle cx="30" cy="30" r="2" fill="black" />
        <circle cx="50" cy="30" r="2" fill="black" />
        <path d="M25 45 Q40 47 55 45" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    );
  } else if (ratio < 100) {
    bgColor = '#FFA726';
    darkBgColor = '#FB8C00';
    borderColor = '#EF6C00';
    facePath = (
      <>
        <path d="M25 32 Q30 30 35 32" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M45 32 Q50 30 55 32" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M25 48 Q40 40 55 48" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  } else {
    bgColor = '#EF5350';
    darkBgColor = '#E53935';
    borderColor = '#C62828';
    facePath = (
      <>
        <path d="M25 32 Q30 30 35 32" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M45 32 Q50 30 55 32" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M25 48 Q40 40 55 48" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="25" cy="25" r="1.5" fill="#fff" stroke="black" strokeWidth="0.5" />
        <circle cx="55" cy="25" r="1.5" fill="#fff" stroke="black" strokeWidth="0.5" />
      </>
    );
  }

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <defs>
        <radialGradient id="grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={bgColor} />
          <stop offset="100%" stopColor={darkBgColor} />
        </radialGradient>
        <linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#grad)" stroke={borderColor} strokeWidth="2" />
      <ellipse cx="30" cy="25" rx="15" ry="10" fill="url(#gloss)" />
      {facePath}
      <circle cx="40" cy="40" r="38" fill="none" filter="url(#shadow)" />
    </svg>
  );
};

// =============== Energy Dashboard ===============
const EnergyDashboard = () => {
  const data = [
    { label: '瞬時電力 (Instantaneous Power)', value: 151, ratio: 30.2 },
    { label: '現在デマンド (Current Demand)', value: 71, ratio: 14.2 },
    { label: '予測デマンド (Predicted Demand)', value: 213, ratio: 80 },
  ];

  const targetValue = 2400;
  const predictionRatio = data[2].ratio;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      border: '2px solid #000',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    }}>
      <div style={{ flex: 1 }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#003366', color: '#fff' }}>
              <th style={{ padding: '5px', textAlign: 'left' }}>受電 (Receiving Power)</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>現在値 (Current Value)</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>目標比 (Target Ratio)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#e6f2ff' }}>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>{item.label}</td>
                <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {item.value} <span style={{ fontSize: '12px' }}>kW</span>
                </td>
                <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {item.ratio} <span style={{ fontSize: '12px' }}>%</span>
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#e6f2ff' }}>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>目標値 (Setpoint / Kontrak Daya)</td>
              <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
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
                    width: `${predictionRatio}%`,
                    height: '100%',
                    backgroundColor: predictionRatio < 90 ? '#66BB6A' :
                                   predictionRatio < 95 ? '#FFCA28' :
                                   predictionRatio < 100 ? '#FFA726' : '#EF5350',
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

      <div style={{
        marginLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        }}>
          <CustomSmileyIcon ratio={predictionRatio} />
        </div>
      </div>
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
    { symbol: '😊', color: '#66BB6A', label: '90%未満' },
    { symbol: '🙂', color: '#FFCA28', label: '90～95%' },
    { symbol: '🙁', color: '#FFA726', label: '95～100%' },
    { symbol: '😢', color: '#EF5350', label: '100%以上' },
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
      marginBottom: '15px',
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
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
            }}>{cmp.name}</span>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: cmp.status === 'green' ? '#66BB6A' : '#EF5350',
              border: '2px solid #fff',
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
            }}></div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginLeft: '20px',
      }}>
        {emojis.map((emoji, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
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
            <div style={{
              fontSize: '10px',
              marginTop: '4px',
              color: '#555',
              whiteSpace: 'nowrap',
            }}>
              {emoji.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============== Chart Component ===============
const PowerChart = () => {
  const [data, setData] = useState([]);
  const [lastValue, setLastValue] = useState(0);
  const [lastDateTime, setLastDateTime] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://172.27.6.191:4000/api/kub1-active-power');
      const result = await response.json();
      
      const rawData = result?.data;

      if (!Array.isArray(rawData)) {
        console.error('Invalid data format:', result);
        return;
      }

      // Convert data dan ambil 200 data terakhir
      const convertedData = rawData.map(entry => {
        const date = new Date(entry.date_time);
        const jakartaTime = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // UTC+7
        
        return {
          date_time: `${jakartaTime.getHours().toString().padStart(2, '0')}:${jakartaTime.getMinutes().toString().padStart(2, '0')}`,
          full_date_time: entry.date_time,
          value: Math.ceil(Number(entry.value)),
          contractLimit: 2400
        };
      });

      if (convertedData.length === 0) {
        setData([]);
        setLastValue(0);
        setLastDateTime('');
        return;
      }

      // Ambil 200 data terbaru dan reverse untuk chart
      const chartData = convertedData.slice(0, 200).reverse();
      
      // Data terakhir (paling baru)
      const lastData = convertedData[0];
      
      setData(chartData);
      setLastValue(lastData.value);
      setLastDateTime(lastData.full_date_time);

    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '15px',
    }}>
      <div style={{
        backgroundColor: lastValue <= 2000 ? '#d4edda' : '#f8d7da',
        color: lastValue <= 2000 ? '#155724' : '#721c24',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
      }}>
        {lastValue <= 2000 ? 'Kondisi Aman ✅' : 'WASPADA ⚠️'} - {lastValue} kW
        {lastDateTime && (
          <div style={{ fontSize: '14px', marginTop: '5px', fontWeight: 'normal' }}>
            Data Terakhir: {lastDateTime}
          </div>
        )}
      </div>

      <h5 style={{ textAlign: 'center', marginBottom: '15px' }}>Kubikal 1 Active Power kW</h5>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date_time" 
            tick={{ fontSize: 12 }}
            interval={20}
          />
          <YAxis domain={[0, 2500]} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="Active Power"
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={true}
          />
          <Line 
            type="monotone" 
            dataKey="contractLimit"
            name="Kontrak Daya"
            stroke="#ff0000" 
            strokeWidth={2} 
            dot={false}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#343a40', color: '#fff' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Item</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Besaran</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Kontrak Daya</td>
              <td style={{ 
                padding: '8px', 
                borderBottom: '1px solid #ddd',
                backgroundColor: '#dc3545',
                color: '#fff',
                fontWeight: 'bold'
              }}>2400 kVA</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============== Utility Dashboard ===============
const UtilityDashboard = () => {
  const data = [
    { label: '受電電力量 (Purchased Electricity)', value: 1062, unit: 'kWh', color: '#007BFF' }, 
    { label: '市水 (City Water)',       value: 1,    unit: 'm³',  color: '#0056b3' }, 
    { label: 'エアー (Compressed Ai)',     value: 332,  unit: 'm³',  color: '#007BFF' }, 
    { label: '都市ガス (Gas)',   value: 634,  unit: 'm³',  color: '#0056b3' }, 
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginBottom: '15px',
    }}>
      {data.map((item, index) => (
        <div key={index} style={{
          position: 'relative',
          backgroundColor: item.color,
          color: '#fff',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '5px',
          }}>
            {item.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{item.value}</span>
            <span style={{ fontSize: '16px' }}>{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// =============== Komponen Utama ===============
const IntegratedDashboard = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fafafa',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        📊 ダッシュボード統合表示
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Kolom Kiri - Dashboard Asli */}
        <div>
          <EnergyDashboard />
          <CMPStatusBar />
          <UtilityDashboard />
        </div>

        {/* Kolom Kanan - Chart */}
        <div>
          <PowerChart />
        </div>
      </div>
    </div>
  );
};

export default IntegratedDashboard;