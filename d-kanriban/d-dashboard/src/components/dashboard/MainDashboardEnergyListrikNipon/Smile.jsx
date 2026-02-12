import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../layout/Layout';
// =============== Ikon Smiley Kustom ===============
const CustomSmileyIcon = ({ ratio, size = 80 }) => {
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
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id={`grad-${size}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={bgColor} />
          <stop offset="100%" stopColor={darkBgColor} />
        </radialGradient>
        <linearGradient id={`gloss-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id={`shadow-${size}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill={`url(#grad-${size})`} stroke={borderColor} strokeWidth="2" />
      <ellipse cx="30" cy="25" rx="15" ry="10" fill={`url(#gloss-${size})`} />
      {facePath}
      <circle cx="40" cy="40" r="38" fill="none" filter={`url(#shadow-${size})`} />
    </svg>
  );
};

// =============== Navbar ===============
const Navbar = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');



  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };

      setCurrentDate(now.toLocaleDateString('id-ID', dateOptions));
      setCurrentTime(now.toLocaleTimeString('id-ID', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);







  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#1f2937',
      padding: '8px 24px',          // lebih tipis
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #e5e7eb', // border halus
      marginBottom: '15px',
    }}>
    {/* Left */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      lineHeight: '1.1',
      minWidth: '200px',
    }}>
      <span style={{
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#003366', // biru tua
        letterSpacing: '1px',
      }}>
        OTICS
      </span>
      <span style={{
        fontSize: '30px',
        fontWeight: '600',
        color: '#000000', // hitam
      }}>
        Indonesia
      </span>
    </div>


      {/* Center */}
      <div style={{ flex: 1, textAlign: 'center', lineHeight: 1.2 }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          工場1電力消費監視表示
        </div>
        <div style={{
          fontSize: '20px',
          color: '#6b7280'
        }}>
          Display Monitoring Konsumsi Listrik Plant 1
        </div>
      </div>

      {/* Right */}
      <div style={{
        fontSize: '20px',
        textAlign: 'right',
        minWidth: '200px',
        color: '#374151',
        lineHeight: '1.3',
      }}>
        <div style={{ fontWeight: 'bold' }}>
          {currentDate}
        </div>
        <div style={{ fontSize: '20px', color: '#6b7280' }}>
          {currentTime}
        </div>
      </div>

    </div>
  );
};
















// =============== Energy Dashboard ===============
const EnergyDashboard = ({ currentPowerValue }) => {
  const targetValue = 2400;
  const actualValue = currentPowerValue || 0;
  const ratio = actualValue ? ((actualValue / targetValue) * 100).toFixed(1) : 0;
  
  const data = [
    { label: '瞬時電力', labelEn: 'Instantaneous Power', value: NaN, ratio: 0 },
    { label: '予測デマンド', labelEn: 'Predicted Demand', value: NaN, ratio: 0 },
    { label: '現在デマンド', labelEn: 'Current Demand', value: actualValue, ratio: parseFloat(ratio) },
  ];

  const predictionRatio = data[2].ratio;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      border: '1px solid #ccc', // ← lebih lembut dari #000
      borderRadius: '8px',
      backgroundColor: '#fff',
      marginBottom: '15px',
      overflow: 'hidden',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '16px',
        border: '1px solid #ddd', // tambahan border luar soft
      }}>
        <thead>
          <tr style={{ backgroundColor: '#003366', color: '#fff' }}>
            <th style={{ padding: '4px', textAlign: 'left', borderRight: '1px solid #eee' }}>
              受電<br/><span style={{ fontSize: '15px', fontWeight: 'normal' }}>Receiving Power</span>
            </th>
            <th style={{ padding: '4px', textAlign: 'right', borderRight: '1px solid #eee' }}>
              現在値<br/><span style={{ fontSize: '15px', fontWeight: 'normal' }}>Current Value</span>
            </th>
            <th style={{ padding: '4px', textAlign: 'right', borderRight: '1px solid #eee' }}>
              目標比<br/><span style={{ fontSize: '15px', fontWeight: 'normal' }}>Target Ratio</span>
            </th>
            <th style={{ padding: '4px', textAlign: 'center', width: '120px' }}>
              状態<br/><span style={{ fontSize: '15px', fontWeight: 'normal' }}>Status</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ 
                padding: '8px', 
                fontWeight: 'bold',
                backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#e6f2ff',
                borderRight: '1px solid #ddd',
              }}>
                {item.label}<br/>
                <span style={{ fontSize: '15px', fontWeight: 'normal', color: '#666' }}>
                  {item.labelEn}
                </span>
              </td>
              <td style={{ 
                padding: '8px', 
                textAlign: 'right', 
                fontWeight: 'bold', 
                color: '#000',
                backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#e6f2ff',
                borderRight: '1px solid #ddd',
              }}>
                {item.value} <span style={{ fontSize: '12px' }}>kW</span>
              </td>
              <td style={{ 
                padding: '8px', 
                textAlign: 'right', 
                fontWeight: 'bold', 
                color: '#000',
                backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#e6f2ff',
                borderRight: '1px solid #ddd',
              }}>
                {item.ratio} <span style={{ fontSize: '12px' }}>%</span>
              </td>
              {index === 0 && (
                <td style={{ 
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  verticalAlign: 'middle',
                }} rowSpan={3}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CustomSmileyIcon ratio={predictionRatio} size={100} />
                  </div>
                </td>
              )}
            </tr>
          ))}
          <tr style={{ backgroundColor: '#e6f2ff' }}>
            <td style={{ padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>
              目標値<br/><span style={{ fontSize: '11px', fontWeight: 'normal', color: '#666' }}>Setpoint / Contract Power</span>
            </td>
            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#000', borderRight: '1px solid #ddd' }}>
              {targetValue} <span style={{ fontSize: '12px' }}>kW</span>
            </td>
            <td colSpan={2} style={{ padding: '8px' }}>
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
  );
};

// =============== CMP Status Bar ===============
const CMPStatusBar = () => {
  const cmps = [
    { name: 'CMP1', status: 'green' },
    { name: 'CMP2', status: 'green' },
    { name: 'CMP3', status: 'green' },
    { name: 'CMP4', status: 'green' },
  ];

  const emojis = [
    { symbol: '😊', color: '#66BB6A', labelJp: '90%未満', labelEn: 'Below 90%' },
    { symbol: '🙂', color: '#FFCA28', labelJp: '90～95%', labelEn: '90-95%' },
    { symbol: '🙁', color: '#FFA726', labelJp: '95～100%', labelEn: '95-100%' },
    { symbol: '😢', color: '#EF5350', labelJp: '100%以上', labelEn: 'Above 100%' },
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
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{cmp.name}</span>
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
            <div style={{
              fontSize: '9px',
              marginTop: '4px',
              color: '#555',
              whiteSpace: 'nowrap',
            }}>
              {emoji.labelJp}<br/>
              <span style={{ fontSize: '8px', color: '#777' }}>{emoji.labelEn}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// =============== Chart Component ===============
const PowerChart = ({ onDataUpdate }) => {
  const [data, setData] = useState([]);
  const [lastValue, setLastValue] = useState(0);
  const [lastDateTime, setLastDateTime] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://172.27.6.191:4000/api/kub1-active-power');
      const result = await response.json();
      
      const rawData = result?.data;

      if (!Array.isArray(rawData) || rawData.length === 0) {
        setData([]);
        setLastValue(0);
        setLastDateTime('');
        return;
      }

      // Konversi ke waktu lokal Indonesia (WIB) - PERBAIKAN
      let convertedData = rawData.map(entry => {
        const date = new Date(entry.date_time);
        
        // Format waktu lokal Indonesia
        const timeStr = date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        
        // Format tanggal lengkap untuk display
        const fullDateTimeStr = date.toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        return {
          date_time: timeStr, // Format: "HH:mm"
          full_date_time: fullDateTimeStr, // Format: "dd/mm/yyyy, HH:mm:ss"
          value: Math.ceil(Number(entry.value)),
          contractLimit: 2400,
          originalDate: date // Simpan tanggal asli untuk sorting
        };
      });

      // Urutkan berdasarkan tanggal (lama ke baru)
      convertedData.sort((a, b) => a.originalDate - b.originalDate);

      // Ambil maksimal 200 data terbaru
      const chartData = convertedData.slice(-200);

      const lastData = chartData[chartData.length - 1];
      
      setData(chartData);
      setLastValue(lastData?.value || 0);
      setLastDateTime(lastData?.full_date_time || '');
      
      if (onDataUpdate) {
        onDataUpdate(lastData?.value || 0);
      }

    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
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
        {lastValue <= 2000 ? '安全状態 / Safe Condition ✅' : '警告 / WARNING ⚠️'} - {lastValue} kW
        {lastDateTime && (
          <div style={{ fontSize: '14px', marginTop: '5px', fontWeight: 'normal' }}>
            最終データ / Last Data: {lastDateTime}
          </div>
        )}
      </div>

      <h5 style={{ textAlign: 'center', marginBottom: '15px' }}>
        キュービクル1有効電力 / Cubicle 1 Active Power (kW)
      </h5>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date_time" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            label={{ 
              value: 'Waktu (WIB)', 
              position: 'insideBottom', 
              offset: -5,
              fontSize: 12
            }}
          />
          <YAxis 
            domain={[0, 2500]} 
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'kW', 
              angle: -90, 
              position: 'insideLeft',
              fontSize: 12
            }}
          />
          <Tooltip 
            formatter={(value) => [`${value} kW`, 'Konsumsi']}
            labelFormatter={(label) => `Waktu: ${label} WIB`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="有効電力 / Active Power"
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={true}
          />
          <Line 
            type="monotone" 
            dataKey="contractLimit"
            name="契約電力 / Contract Power"
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
          border: '1px solid #ddd',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#343a40', color: '#fff' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>項目 / Item</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>数値 / Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                契約電力 / Contract Power
              </td>
              <td style={{ 
                padding: '8px', 
                borderBottom: '1px solid #ddd',
                backgroundColor: '#dc3545',
                color: '#fff',
                fontWeight: 'bold'
              }}>2400 kVA</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                タイムゾーン / Timezone
              </td>
              <td style={{ 
                padding: '8px', 
                borderBottom: '1px solid #ddd',
                backgroundColor: '#17a2b8',
                color: '#fff',
                fontWeight: 'bold'
              }}>WIB (UTC+7)</td>
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
    { labelJp: '受電電力量', labelEn: 'Purchased Electricity', value: NaN, unit: 'kWh', color: '#007BFF' }, 
    { labelJp: '市水', labelEn: 'City Water', value: NaN, unit: 'm³', color: '#007BFF' }, 
    { labelJp: 'エアー', labelEn: 'Compressed Air', value: NaN, unit: 'm³', color: '#007BFF' }, 
    { labelJp: '都市ガス', labelEn: 'City Gas', value: NaN, unit: 'm³', color: '#007BFF' }, 
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',            // ⬅ lebih rapat
      marginBottom: '10px',
    }}>


      {data.map((item, index) => (
        <div key={index} style={{
          backgroundColor: item.color,
          color: '#fff',
          borderRadius: '6px', // ⬅ sedikit lebih kecil
          padding: '5px',     // ⬅ padding diperkecil
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)', // ⬅ shadow lebih halus
        }}>
          {/* Label */}
          <div style={{
            fontSize: '13px',   // ❌ tidak diubah
            fontWeight: 'bold',
            marginBottom: '6px',
          }}>
            {item.labelJp}<br/>
            <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.9 }}>
              {item.labelEn}
            </span>
          </div>

          {/* Value dengan BG putih */}
          <div style={{
            backgroundColor: '#fff',
            color: '#333',
            borderRadius: '5px',
            padding: '3px 5px', // ⬅ diperkecil
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
          }}>


            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
              {Number.isNaN(item.value) ? 'NaN' : item.value}
            </span>
            <span style={{ fontSize: '14px' }}>
              {item.unit}
            </span>



          </div>
        </div>
      ))}
    </div>
  );
};


// =============== Komponen Utama ===============
const IntegratedDashboard = () => {
  const [currentPowerValue, setCurrentPowerValue] = useState(0);

  return (
    <Layout >
      <div style={{
        backgroundColor: '#fafafa',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        padding: '0 20px 20px',
      }}>
        <Navbar />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div>
            <EnergyDashboard currentPowerValue={currentPowerValue} />
            <CMPStatusBar />
            <UtilityDashboard />
          </div>

          <div>
            <PowerChart onDataUpdate={setCurrentPowerValue} />
          </div>
        </div>
      </div>
    </Layout>
  );
};







export default IntegratedDashboard;