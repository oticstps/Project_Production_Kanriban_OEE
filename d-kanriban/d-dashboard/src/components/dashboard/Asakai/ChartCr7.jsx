import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';

const KanribanGrafikBawahPG21 = () => {
  const [data, setData] = useState({
    productCode: '902F-F',
    line: 'LINE COMMON RAIL 12',
    mct: '88.4',
    target: 41,
    targetPercentage: 100,
    
    dailyData: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.27.6.191:4000/apiCr12/cr12Stop');
      const result = await response.json();
      
      if (result.status === 'success' && result.data && result.data.length > 0) {
        processData(result.data);
      } else {
        setError('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

const processData = (apiData) => {
  // Filter data untuk bulan Februari 2026
  const februaryData = apiData.filter(item => 
    parseInt(item.month) === 2 && parseInt(item.year) === 2026
  );

  // Group by day
  const dailyStats = {};
  
  februaryData.forEach(item => {
    // Tentukan tanggal yang benar berdasarkan shift dan waktu
    let day;
    const createdAtDate = new Date(item.created_at);
    const hour = createdAtDate.getHours();
    
    if (item.shift === 'Shift 2' && hour < 12) {
      // Shift 2 yang created pada pagi hari (sebelum jam 12) seharusnya tanggal sebelumnya
      const prevDate = new Date(createdAtDate);
      prevDate.setDate(prevDate.getDate() - 1);
      day = prevDate.getDate();
    } else {
      // Untuk kasus lain, gunakan tanggal dari created_at
      day = parseInt(item.created_at.split(' ')[0].split('-')[2]);
    }
    
    if (!dailyStats[day]) {
      dailyStats[day] = {
        shift1: { production: 0, loadingTime: 0, pcsJam: 0 },
        shift2: { production: 0, loadingTime: 0, pcsJam: 0 }
      };
    }
    
    const shift = item.shift === 'Shift 1' ? 'shift1' : 'shift2';
    const production = parseInt(item.actual) || 0;
    const loadingTimeStr = item.loading_time?.replace(' menit', '').trim() || '0';
    const loadingTime = parseFloat(loadingTimeStr) || 0;
    
    dailyStats[day][shift].production = production;
    dailyStats[day][shift].loadingTime = loadingTime;
    dailyStats[day][shift].pcsJam = loadingTime > 0 ? (production / (loadingTime / 60)) : 0;
  });

  // Convert to array format
  const dailyDataArray = Object.keys(dailyStats).map(day => ({
    day: parseInt(day),
    shift1Production: dailyStats[day].shift1.production,
    shift1LoadingTime: dailyStats[day].shift1.loadingTime,
    shift1PcsJam: Math.round(dailyStats[day].shift1.pcsJam),
    shift2Production: dailyStats[day].shift2.production,
    shift2LoadingTime: dailyStats[day].shift2.loadingTime,
    shift2PcsJam: Math.round(dailyStats[day].shift2.pcsJam),
    dangae: '' // Placeholder for dangae
  })).sort((a, b) => a.day - b.day);

  // Get product info from first item
  const firstItem = februaryData[0];
  
  setData(prev => ({
    ...prev,
    productCode: firstItem.name_product || prev.productCode,
    line: firstItem.line_name || prev.line,
    mct: firstItem.setup_ct || prev.mct,
    dailyData: dailyDataArray
  }));
};






  // Chart dimensions
  const chartWidth = 1200;
  const chartHeight = 200;
  const totalDays = 28; // February days
  const dayWidth = chartWidth / totalDays;

  const getXPosition = (dayIndex) => {
    return dayIndex * dayWidth + dayWidth / 2;
  };

  const getYPosition = (value) => {
    const minY = 30;
    const maxY = 50;
    const range = maxY - minY;
    return chartHeight - ((value - minY) / range) * chartHeight;
  };

  // Generate grid lines for Y-axis
  const yAxisValues = [30, 35, 40, 45, 50];

  if (loading) {
    return (
      <Layout>
        <div style={{padding: '20px', textAlign: 'center', fontSize: '18px'}}>
          Loading data...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{padding: '20px', textAlign: 'center', fontSize: '18px', color: 'red'}}>
          Error: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white',
        border: '4px solid black',
        borderRadius: '15px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            <div>Target :</div>
            <div>{data.target} Pcs/Jam</div>
          </div>
          <div style={{ 
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <div>{data.line}</div>
            <div style={{ fontSize: '24px', marginTop: '5px' }}>
              GRAFIK Pcs/Jam {data.productCode}
            </div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            <div>4MP MCT = {data.mct}"/Pcs</div>
          </div>
        </div>

        {/* Chart Area */}
        <div style={{ position: 'relative', height: '220px', marginBottom: '10px'}}>
          <svg width="100%" height="100%" viewBox="0 0 1230 200" preserveAspectRatio="xMidYMid meet">
            {/* Background grid - horizontal lines */}
            {yAxisValues.map((val, idx) => (
              <line 
                key={`h-${idx}`}
                x1="0" 
                y1={getYPosition(val)} 
                x2="1200" 
                y2={getYPosition(val)}
                stroke="#B8E6F5" 
                strokeWidth="0.5"
              />
            ))}
            
            {/* Vertical lines for each day */}
            {Array.from({ length: totalDays + 1 }).map((_, idx) => (
              <line 
                key={`v-${idx}`}
                x1={idx * dayWidth} 
                y1="0" 
                x2={idx * dayWidth} 
                y2="200"
                stroke={idx % 7 === 0 ? 'blue' : '#B8E6F5'} 
                strokeWidth={idx % 7 === 0 ? '2' : '0.5'}
              />
            ))}

            {/* Target lines (100% and 93%) */}
            <line 
              x1="0" 
              y1={getYPosition(data.target)} 
              x2="1200" 
              y2={getYPosition(data.target)}
              stroke="red" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <text 
              x="1210" 
              y={getYPosition(data.target) + 5} 
              fontSize="10" 
              fill="red"
            >
              100%
            </text>

            <line 
              x1="0" 
              y1={getYPosition(data.target * 0.93)} 
              x2="1200" 
              y2={getYPosition(data.target * 0.93)}
              stroke="red" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <text 
              x="1210" 
              y={getYPosition(data.target * 0.93) + 5} 
              fontSize="10" 
              fill="red"
            >
              89%
            </text>

            {/* Plot data points and lines for Shift 1 (Blue) */}
            {data.dailyData.length > 0 && (
              <>
                <polyline
                  points={data.dailyData
                    .filter(d => d.shift1PcsJam > 0)
                    .map(d => `${getXPosition(d.day - 1)},${getYPosition(d.shift1PcsJam)}`)
                    .join(' ')}
                  fill="none"
                  stroke="blue"
                  strokeWidth="2"
                />
                {data.dailyData.map((d, idx) => 
                  d.shift1PcsJam > 0 && (
                    <circle 
                      key={`s1-${idx}`}
                      cx={getXPosition(d.day - 1)} 
                      cy={getYPosition(d.shift1PcsJam)} 
                      r="4" 
                      fill="blue" 
                    />
                  )
                )}
              </>
            )}

            {/* Plot data points and lines for Shift 2 (Black) */}
            {data.dailyData.length > 0 && (
              <>
                <polyline
                  points={data.dailyData
                    .filter(d => d.shift2PcsJam > 0)
                    .map(d => `${getXPosition(d.day - 1)},${getYPosition(d.shift2PcsJam)}`)
                    .join(' ')}
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                />
                {data.dailyData.map((d, idx) => 
                  d.shift2PcsJam > 0 && (
                    <circle 
                      key={`s2-${idx}`}
                      cx={getXPosition(d.day - 1)} 
                      cy={getYPosition(d.shift2PcsJam)} 
                      r="4" 
                      fill="black" 
                    />
                  )
                )}
              </>
            )}
          </svg>
          {/* Y-axis labels */}
          <div style={{ position: 'absolute', left: '-10px', top: '0', height: '100%' }}>
            {yAxisValues.reverse().map((val) => (
              <div 
                key={val}
                style={{ 
                  position: 'absolute',
                  top: `${(getYPosition(val) / 200) * 100}%`,
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', marginLeft: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '15px', backgroundColor: 'blue' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Hasil Prod</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '15px', backgroundColor: 'black' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Loading Time</span>
          </div>
        </div>

        {/* Data Table */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '11px'
          
        }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '4px', minWidth: '100px' }}></th>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const monthLabel = day === 1 ? 'Nov2' : (day === 2 ? 'Des2' : '');
                const isWeekend = [7, 14, 15, 22, 28].includes(day);
                return (
                  <th 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      backgroundColor: isWeekend ? '#ffcccc' : 'white',
                      fontSize: '10px',
                      minWidth: '35px'
                    }}
                  >
                    <div>{monthLabel}</div>
                    <div style={{ fontWeight: 'bold' }}>{day}</div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* Shift 1 (Blue) */}
            <tr>
              <td style={{ border: '1px solid black', padding: '4px', fontWeight: 'bold', backgroundColor: 'blue', color: 'white' }}>
                Hasil Prod
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const dayData = data.dailyData.find(d => d.day === i + 1);
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {dayData?.shift1Production || ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '4px' }}>Loading Time</td>
              {Array.from({ length: 28 }, (_, i) => {
                const dayData = data.dailyData.find(d => d.day === i + 1);
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center'
                    }}
                  >
                    {dayData?.shift1LoadingTime ? Math.round(dayData.shift1LoadingTime) : ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '4px' }}>Pcs/jam</td>
              {Array.from({ length: 28 }, (_, i) => {
                const dayData = data.dailyData.find(d => d.day === i + 1);
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {dayData?.shift1PcsJam || ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '4px' }}>Dangae(menit)</td>
              {Array.from({ length: 28 }, (_, i) => (
                <td 
                  key={i}
                  style={{ 
                    border: '1px solid black',
                    padding: '4px',
                    textAlign: 'center'
                  }}
                >
                </td>
              ))}
            </tr>

            {/* Shift 2 (Black) */}
            <tr>
              <td style={{ border: '1px solid black', padding: '4px', fontWeight: 'bold', backgroundColor: 'black', color: 'white' }}>
                Hasil Prod
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const dayData = data.dailyData.find(d => d.day === i + 1);
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {dayData?.shift2Production || ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '4px' }}>Loading Time</td>
              {Array.from({ length: 28 }, (_, i) => {
                const dayData = data.dailyData.find(d => d.day === i + 1);
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center'
                    }}
                  >
                    {dayData?.shift2LoadingTime ? Math.round(dayData.shift2LoadingTime) : ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '4px' }}>Pcs/jam</td>
              {Array.from({ length: 28 }, (_, i) => {
                const dayData = data.dailyData.find(d => d.day === i + 1);
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {dayData?.shift2PcsJam || ''}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default KanribanGrafikBawahPG21;