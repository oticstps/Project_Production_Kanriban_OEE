import React, { useState } from 'react';
import Layout from '../layout/Layout';







const KanribanGrafikBawahPG21 = () => {


  const [data] = useState({
    productCode: '902F-F',
    line: 'CR12',
    target: '7%',
    targetValue: 6.07,
    baseProduction: 10637,
    baseManHour: 72933,
    baseManHourPerPcs: 6.86,
    monthlyData: [
      { month: 'Base', production: 10637, manHour: 72933, manHourPerPcs: 6.86 },
      { month: 'JAN', production: 11508, manHour: 76528, manHourPerPcs: 6.65 },
      { month: 'FEB', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'MAR', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'APR', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'MEI', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'JUNI', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'JULI', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'AGS', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'SEP', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'OKT', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'NOV', production: null, manHour: null, manHourPerPcs: 0.00 },
      { month: 'DES', production: null, manHour: null, manHourPerPcs: 0.00 }
    ]
  });






  // Hitung posisi tengah untuk setiap bulan
  const totalMonths = data.monthlyData.length; // 13 bulan (Base + 12 bulan)
  const chartWidth = 1200;
  const monthWidth = chartWidth / totalMonths;
  
  // Posisi titik untuk Base (0), JAN (1), dan FEB (2)
  // Posisi x dihitung dari tengah setiap kolom
  const getXPosition = (monthIndex) => {
    return (monthIndex + 0.5) * monthWidth;
  };

  // Hitung posisi y dari nilai
  const getYPosition = (value) => {
    const minYValue = 4.0;
    const maxYValue = 8.0;
    const yRange = maxYValue - minYValue;
    const chartHeight = 300;
    
    // Normalisasi: (value - minYValue) / yRange
    // Kemudian dibalik karena SVG y=0 di atas
    return chartHeight - ((value - minYValue) / yRange) * chartHeight;
  };

  // Data titik untuk chart
  const chartPoints = [
    { monthIndex: 0, y: 6.86 }, // Base
    { monthIndex: 1, y: 6.65 }, // JAN
    { monthIndex: 2, y: 4.0 }  // FEB
  ];

  // Konversi ke koordinat SVG
  const svgPoints = chartPoints.map(point => ({
    x: getXPosition(point.monthIndex),
    y: getYPosition(point.y)
  }));

  // Buat string untuk polyline
  const polylinePoints = svgPoints.map(point => `${point.x},${point.y}`).join(' ');

  return (
    <>



      <Layout>





        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white',
          border: '3px solid black',
          borderRadius: '10px',
          fontFamily: 'Arial, sans-serif'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '10px'
          }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Target : turun {data.target}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {data.targetValue} mnt./Pcs
              </div>
            </div>
            <div style={{ 
              border: '3px solid red',
              padding: '5px 20px',
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'red'
            }}>
              {data.productCode}
            </div>
            <div style={{ 
              border: '3px solid orange',
              padding: '5px 20px',
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'red'
            }}>
              {data.line}
            </div>
          </div>

          {/* Chart Area */}
          <div style={{ position: 'relative', height: '300px', marginBottom: '20px', marginLeft: '17%' }}>
            <svg width="100%" height="100%" viewBox="0 0 1200 300" preserveAspectRatio="none">
              {/* Grid - Horizontal lines */}
              {[4.0, 5.0, 6.0, 7.0, 8.0].map((val, idx) => (
                <line 
                  key={`h-${idx}`}
                  x1="0" 
                  y1={getYPosition(val)} 
                  x2="1200" 
                  y2={getYPosition(val)}
                  stroke="#B8E6F5" 
                  strokeWidth="1"
                />
              ))}
              
              {/* Grid - Vertical lines pada awal setiap kolom */}
              {data.monthlyData.map((_, idx) => (
                <line 
                  key={`v-${idx}`}
                  x1={idx * monthWidth} 
                  y1="0" 
                  x2={idx * monthWidth} 
                  y2="300"
                  stroke="#B8E6F5" 
                  strokeWidth="1"
                />
              ))}

              {/* Target line (dashed red) */}
              <line 
                x1="0" 
                y1={getYPosition(data.targetValue)} 
                x2="1200" 
                y2={getYPosition(data.targetValue)}
                stroke="red" 
                strokeWidth="3"
                strokeDasharray="15,10"
              />
              
              {/* Arrow at end of target line */}
              <polygon
                points="1200,142.5 1180,132.5 1180,152.5"
                fill="red"
              />

              {/* Actual performance line (blue) */}
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="blue"
                strokeWidth="4"
              />

              {/* Data points (blue circles) */}
              {svgPoints.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r="6" fill="blue" />
              ))}
            </svg>

            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: '-40px', top: '0', height: '100%' }}>
              {[8.0, 7.0, 6.0, 5.0, 4.0].map((val, idx) => (
                <div 
                  key={val}
                  style={{ 
                    position: 'absolute',
                    top: `${getYPosition(val)}px`,
                    transform: 'translateY(-50%)',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {val.toFixed(1)}
                </div>
              ))}
            </div>

            {/* Man Hour label */}
            <div style={{ 
              position: 'absolute', 
              left: '-120px', 
              top: '40%',
              transform: 'rotate(-90deg)',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              <div>Man Hour</div>
              <div>(man minute/pcs)</div>
            </div>

            {/* X-axis labels (Month labels) */}
            {/* <div style={{ 
              position: 'absolute', 
              bottom: '-25px', 
              left: '0', 
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around'
            }}>
              {data.monthlyData.map((month, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    width: `${monthWidth}px`,
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {month.month}
                </div>
              ))}
            </div> */}



          </div>

          {/* Data Table */}
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>





            <thead>
              <tr>
                {['', ...data.monthlyData.map(d => d.month)].map((month, idx) => (
                  <th 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      backgroundColor: idx === 0 ? 'white' : '#f0f0f0',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      minWidth: idx === 0 ? '140px' : '70px'
                    }}
                  >
                    {month}
                  </th>
                ))}
              </tr>
            </thead>




            <tbody>
              <tr>
                <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                  ΣProduksi (pcs)
                </td>
                {data.monthlyData.map((d, idx) => (
                  <td 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      textAlign: 'center'
                    }}
                  >
                    {d.production?.toLocaleString() || ''}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                  ΣMan.Hour (man.minute)
                </td>
                {data.monthlyData.map((d, idx) => (
                  <td 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      textAlign: 'center'
                    }}
                  >
                    {d.manHour?.toLocaleString() || ''}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                  Man Hour (man.minute/pcs)
                </td>
                {data.monthlyData.map((d, idx) => (
                  <td 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {d.manHourPerPcs.toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>



          </table>




        </div>





      </Layout>




    </>
  );
};

export default KanribanGrafikBawahPG21;