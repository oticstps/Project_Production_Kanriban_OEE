import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';

const KanribanGrafikBawahPG21 = () => {
  const [data, setData] = useState({
    productCode: '902F-F',
    line: 'LINE COMMON RAIL 12',
    mct: '88.4',
    target100: 41,
    target89: 36,
    dailyData: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('902F-F');
  const [weekendDates, setWeekendDates] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menentukan weekend/hari libur di Februari 2026
  const calculateWeekendDates = () => {
    // Februari 2026 memiliki 28 hari
    // Tanggal merah di Februari 2026 berdasarkan kalender:
    // 1 Februari 2026: Minggu (weekend)
    // 7 Februari 2026: Sabtu (weekend)
    // 8 Februari 2026: Minggu (weekend)
    // 14 Februari 2026: Sabtu (weekend)
    // 15 Februari 2026: Minggu (weekend)
    // 21 Februari 2026: Sabtu (weekend)
    // 22 Februari 2026: Minggu (weekend)
    // 28 Februari 2026: Sabtu (weekend)
    
    return [1, 7, 8, 14, 15, 21, 22, 28];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.27.6.191:4000/apiCr12/cr12Stop');
      const result = await response.json();
      
      if (result.status === 'success' && result.data && result.data.length > 0) {
        // Hitung tanggal merah
        const weekendDates = calculateWeekendDates();
        setWeekendDates(weekendDates);
        
        processData(result.data, weekendDates);
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








const processData = (apiData, weekendDates) => {
    // 1. Identifikasi semua produk yang ada di data
    const products = [...new Set(apiData.map(item => item.name_product))];
    console.log('Available products:', products);
    
    // 2. Hitung jumlah data untuk setiap produk
    const productCounts = {};
    apiData.forEach(item => {
      productCounts[item.name_product] = (productCounts[item.name_product] || 0) + 1;
    });
    
    // 3. Pilih produk dengan data terbanyak
    let dominantProduct = '902F-F';
    let maxCount = 0;
    Object.entries(productCounts).forEach(([product, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantProduct = product;
      }
    });
    
    setSelectedProduct(dominantProduct);
    
    // 4. Filter data untuk bulan Februari 2026 dan product yang dipilih
    const filteredData = apiData.filter(item => 
      parseInt(item.month) === 2 && 
      parseInt(item.year) === 2026 &&
      item.name_product === dominantProduct
    );
    
    if (filteredData.length === 0) {
      setError(`No data available for product ${dominantProduct} in February 2026`);
      return;
    }

    // 5. Hitung target (100%) berdasarkan cycle_time
    const calculateTarget100 = (cycleTime) => {
      // Rumus: 3600 / (cycle_time / 10)
      // cycle_time dalam format "880" (88.0 detik)
      const cycleTimeValue = parseFloat(cycleTime) || 880;
      const target = 3600 / (cycleTimeValue / 10);
      return Math.round(target * 10) / 10; // 1 desimal
    };
    
    const calculateTarget89 = (target100) => {
      // 89% dari target 100%
      return Math.round((target100 * 0.89) * 10) / 10;
    };
    
    const firstItem = filteredData[0];
    const target100 = calculateTarget100(firstItem.cycle_time);
    const target89 = calculateTarget89(target100);
    
    // 6. Group by day untuk product yang dipilih dengan koreksi shift
    const dailyStats = {};
    
    filteredData.forEach(item => {
      // Tentukan tanggal yang benar berdasarkan shift dan waktu
      let day;
      const createdAt = item.created_at;
      
      // Parse tanggal dari created_at
      const datePart = createdAt.split(' ')[0];
      const timePart = createdAt.split(' ')[1];
      const [year, month, dayOfMonth] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      
      // Tentukan shift berdasarkan data
      const shift = item.shift;
      
      // KOREKSI LOGIKA SHIFT BERDASARKAN INSTRUKSI:
      // Shift 1: jam 7.10 - 19.50
      // Shift 2: jam 19.50 - 7.10
      
      // Konversi waktu ke menit untuk perbandingan yang lebih mudah
      const totalMinutes = hours * 60 + minutes;
      const shift1Start = 7 * 60 + 10; // 07:10
      const shift1End = 19 * 60 + 50; // 19:50
      const shift2Start = 19 * 60 + 50; // 19:50
      const shift2End = 7 * 60 + 10; // 07:10
      
      if (shift === 'Shift 1') {
        // Shift 1: 07:10 - 19:50
        // Jika waktu di antara jam shift 1, gunakan tanggal saat ini
        if (totalMinutes >= shift1Start && totalMinutes <= shift1End) {
          day = dayOfMonth;
        } 
        // Jika waktu sebelum 07:10, ini seharusnya bagian dari Shift 2 hari sebelumnya
        else if (totalMinutes < shift1Start) {
          // Data ini seharusnya Shift 2 dari hari sebelumnya
          // Tapi karena sudah tercatat sebagai Shift 1, kita tetap simpan di tanggal ini
          day = dayOfMonth;
        }
        // Jika waktu setelah 19:50, ini seharusnya bagian dari Shift 2 hari yang sama
        else {
          day = dayOfMonth;
        }
      } 
      else if (shift === 'Shift 2') {
        // Shift 2: 19:50 - 07:10
        // PERHATIKAN: JIKA ADA DATA SHIFT 2 PADA TANGGAL 1 MAKA SAMPAI TANGGAL 2, 
        // TETAP SIMPAN DATA SHIFT 2 PADA TANGGAL 1
        
        // Jika waktu antara 19:50 - 23:59, gunakan tanggal saat ini
        if (totalMinutes >= shift2Start) {
          day = dayOfMonth; // Masih tanggal yang sama
        }
        // Jika waktu antara 00:00 - 07:10, ini adalah lanjutan Shift 2 dari hari sebelumnya
        else if (totalMinutes <= shift2End) {
          // Ini adalah bagian dari Shift 2 yang dimulai pada hari sebelumnya
          // Semua data Shift 2 yang berjalan dari 19:50 tanggal 1 hingga 07:10 tanggal 2
          // harus disimpan pada tanggal 1 (awal shift)
          day = dayOfMonth - 1; // Kembali ke hari sebelumnya
        }
        // Jika waktu antara 07:10 - 19:50, seharusnya tidak ada data Shift 2
        else {
          // Data di luar jam shift, tetap simpan di tanggal ini
          day = dayOfMonth;
        }
      } 
      else {
        // Default jika tidak ada informasi shift
        day = dayOfMonth;
      }
      
      // Pastikan day valid (1-28 untuk Februari)
      if (day < 1) {
        day = 28; // Jika tanggal 1 Februari dan mundur ke Januari, set ke 28 Februari
      }
      if (day > 28) {
        day = 28;
      }
      
      // Inisialisasi data untuk hari ini jika belum ada
      if (!dailyStats[day]) {
        dailyStats[day] = {
          shift1: { 
            production: 0, 
            loadingTime: 0, 
            pcsJam: 0, 
            hasData: false,
            items: [] // Simpan semua item untuk shift ini
          },
          shift2: { 
            production: 0, 
            loadingTime: 0, 
            pcsJam: 0, 
            hasData: false,
            items: [] // Simpan semua item untuk shift ini
          }
        };
      }
      
      // Tentukan shift key
      const shiftKey = shift === 'Shift 1' ? 'shift1' : 'shift2';
      
      // Ambil data produksi dan loading time
      const production = parseInt(item.actual) || 0;
      
      // Gunakan loading_time_server jika tersedia, jika tidak gunakan loading_time
      let loadingTime = 0;
      if (item.loading_time_server) {
        const loadingTimeStr = item.loading_time_server.replace(' menit', '').trim();
        loadingTime = parseFloat(loadingTimeStr) || 0;
      } else if (item.loading_time) {
        loadingTime = parseFloat(item.loading_time) || 0;
      }
      
      // Simpan item ke dalam array items untuk shift ini
      dailyStats[day][shiftKey].items.push({
        production,
        loadingTime,
        createdAt,
        hours,
        minutes,
        originalDay: dayOfMonth,
        shift: shift
      });
      
      // Tandai bahwa shift ini memiliki data
      dailyStats[day][shiftKey].hasData = true;
      
      console.log(`Data: Shift ${shift}, Created: ${createdAt}, DayOfMonth: ${dayOfMonth}, AssignedDay: ${day}, Hours: ${hours}:${minutes}`);
    });
    
    // 7. Proses setiap shift untuk menghitung total per shift
    Object.keys(dailyStats).forEach(day => {
      ['shift1', 'shift2'].forEach(shiftKey => {
        const shiftData = dailyStats[day][shiftKey];
        
        if (shiftData.items.length > 0) {
          // Hitung total produksi untuk shift ini
          shiftData.production = shiftData.items.reduce((sum, item) => sum + item.production, 0);
          
          // Hitung rata-rata loading time untuk shift ini
          const totalLoadingTime = shiftData.items.reduce((sum, item) => sum + item.loadingTime, 0);
          shiftData.loadingTime = shiftData.items.length > 0 ? totalLoadingTime / shiftData.items.length : 0;
          
          // Hitung Pcs/Jam
          shiftData.pcsJam = shiftData.loadingTime > 0 ? 
            (shiftData.production / (shiftData.loadingTime / 60)) : 0;
        }
      });
    });
    
    // 8. Log hasil pengelompokan untuk debugging
    console.log('Daily Stats:', dailyStats);
    
    // 9. Convert to array format
    const dailyDataArray = Object.keys(dailyStats).map(day => {
      const dayInt = parseInt(day);
      return {
        day: dayInt,
        shift1Production: dailyStats[day].shift1.production,
        shift1LoadingTime: dailyStats[day].shift1.loadingTime,
        shift1PcsJam: Math.round(dailyStats[day].shift1.pcsJam * 10) / 10,
        shift2Production: dailyStats[day].shift2.production,
        shift2LoadingTime: dailyStats[day].shift2.loadingTime,
        shift2PcsJam: Math.round(dailyStats[day].shift2.pcsJam * 10) / 10,
        dangae: '',
        isWeekend: weekendDates.includes(dayInt)
      };
    }).sort((a, b) => a.day - b.day);
    
    // 10. Log hasil akhir
    console.log('Daily Data Array:', dailyDataArray);
    
    // 11. Hitung min dan max untuk y-axis
    const allPcsJamValues = dailyDataArray.flatMap(d => [d.shift1PcsJam, d.shift2PcsJam]).filter(v => v > 0);
    const minPcsJam = allPcsJamValues.length > 0 ? Math.min(...allPcsJamValues) : 30;
    const maxPcsJam = allPcsJamValues.length > 0 ? Math.max(...allPcsJamValues) : 50;
    
    // Atur range y-axis dengan margin
    const yMin = Math.max(0, Math.floor(minPcsJam / 5) * 5 - 5);
    const yMax = Math.ceil(Math.max(maxPcsJam, target100) / 5) * 5 + 5;
    
    setData(prev => ({
      ...prev,
      productCode: firstItem.name_product || prev.productCode,
      line: firstItem.line_name || prev.line,
      mct: firstItem.setup_ct || prev.mct,
      target100: target100,
      target89: target89,
      yMin: yMin,
      yMax: yMax,
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
    const minY = data.yMin || 30;
    const maxY = data.yMax || 50;
    const range = maxY - minY;
    return chartHeight - ((value - minY) / range) * chartHeight;
  };

  // Generate grid lines for Y-axis berdasarkan range
  const generateYAxisValues = () => {
    const minY = data.yMin || 30;
    const maxY = data.yMax || 50;
    const step = Math.ceil((maxY - minY) / 4); // Bagi menjadi 4-5 grid lines
    
    const values = [];
    for (let i = minY; i <= maxY; i += step) {
      values.push(Math.round(i));
    }
    
    // Pastikan target100 dan target89 termasuk dalam grid lines
    if (!values.includes(Math.round(data.target100))) {
      values.push(Math.round(data.target100));
    }
    if (!values.includes(Math.round(data.target89))) {
      values.push(Math.round(data.target89));
    }
    
    return values.sort((a, b) => a - b);
  };

  // Fungsi untuk mendapatkan nama hari berdasarkan tanggal
  const getDayName = (day) => {
    // Februari 2026 dimulai pada hari Minggu (1 Feb 2026 = Minggu)
    const dayIndex = (day - 1) % 7;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayIndex];
  };

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

  const yAxisValues = generateYAxisValues();

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
            <div>Target (100%) :</div>
            <div>{data.target100} Pcs/Jam</div>
            <div style={{ marginTop: '5px' }}>Target (89%) :</div>
            <div>{data.target89} Pcs/Jam</div>
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
            <div style={{ fontSize: '14px', marginTop: '5px', color: 'blue' }}>
              Product: {data.productCode} | Cycle Time: {parseFloat(data.mct || 88.4)}s
            </div>
            <div style={{ fontSize: '12px', marginTop: '5px', color: 'green' }}>
              Target 100% = 3600 / ({parseFloat(data.mct || 88.4)} / 10) = {data.target100} Pcs/Jam
            </div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            <div>{parseFloat(data.manpower) || 4}MP Cycle Time = {data.mct}s/Pcs</div>
            <div style={{ marginTop: '5px' }}>Y-Axis Range:</div>
            <div>{data.yMin || 30} - {data.yMax || 50} Pcs/Jam</div>
          </div>
        </div>

        {/* Chart Area */}
        <div style={{ position: 'relative', height: '220px', marginBottom: '10px' }}>
          <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
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
                stroke={weekendDates.includes(idx) ? 'red' : '#B8E6F5'} 
                strokeWidth={weekendDates.includes(idx) ? '2' : '0.5'}
              />
            ))}

            {/* Target line (100%) */}
            <line 
              x1="0" 
              y1={getYPosition(data.target100)} 
              x2="1200" 
              y2={getYPosition(data.target100)}
              stroke="red" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <text 
              x="1210" 
              y={getYPosition(data.target100) + 5} 
              fontSize="10" 
              fill="red"
              fontWeight="bold"
            >
              100% ({data.target100})
            </text>

            {/* Target line (89%) */}
            <line 
              x1="0" 
              y1={getYPosition(data.target89)} 
              x2="1200" 
              y2={getYPosition(data.target89)}
              stroke="red" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <text 
              x="1210" 
              y={getYPosition(data.target89) + 5} 
              fontSize="10" 
              fill="red"
              fontWeight="bold"
            >
              89% ({data.target89})
            </text>

            {/* Legend untuk garis target */}
            <rect x="1000" y="10" width="15" height="15" fill="white" stroke="red" strokeWidth="1" />
            <text x="1020" y="20" fontSize="9" fill="red">Target Lines</text>

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
                    <g key={`s1-${idx}`}>
                      <circle 
                        cx={getXPosition(d.day - 1)} 
                        cy={getYPosition(d.shift1PcsJam)} 
                        r="4" 
                        fill="blue" 
                      />
                      <text 
                        x={getXPosition(d.day - 1)} 
                        y={getYPosition(d.shift1PcsJam) - 8} 
                        fontSize="8" 
                        textAnchor="middle"
                        fill="blue"
                        fontWeight="bold"
                      >
                        {d.shift1PcsJam}
                      </text>
                    </g>
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
                    <g key={`s2-${idx}`}>
                      <circle 
                        cx={getXPosition(d.day - 1)} 
                        cy={getYPosition(d.shift2PcsJam)} 
                        r="4" 
                        fill="black" 
                      />
                      <text 
                        x={getXPosition(d.day - 1)} 
                        y={getYPosition(d.shift2PcsJam) - 8} 
                        fontSize="8" 
                        textAnchor="middle"
                        fill="black"
                        fontWeight="bold"
                      >
                        {d.shift2PcsJam}
                      </text>
                    </g>
                  )
                )}
              </>
            )}
          </svg>

          {/* Y-axis labels */}
          <div style={{ position: 'absolute', left: '-30px', top: '0', height: '100%' }}>
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
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Shift 1</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '15px', backgroundColor: 'black' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Shift 2</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: 'red', border: '1px dashed red' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'red' }}>Target (100% & 89%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#ffcccc' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Tanggal Merah</span>
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
              <th style={{ 
                border: '1px solid black', 
                padding: '4px', 
                minWidth: '100px',
                textAlign: 'center'
              }}>
                <div>Hari/Tgl</div>
                <div>Feb 2026</div>
              </th>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const isWeekend = weekendDates.includes(day);
                const dayName = getDayName(day);
                
                return (
                  <th 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      backgroundColor: isWeekend ? '#ffcccc' : 'white',
                      fontSize: '10px',
                      minWidth: '35px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      fontSize: '8px', 
                      color: isWeekend ? 'red' : 'black',
                      fontWeight: isWeekend ? 'bold' : 'normal'
                    }}>
                      {dayName.substring(0, 3)}
                    </div>
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontSize: '12px',
                      color: isWeekend ? 'red' : 'black'
                    }}>
                      {day}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* Shift 1 (Blue) */}
            <tr>
              <td style={{ 
                border: '1px solid black', 
                padding: '4px', 
                fontWeight: 'bold', 
                backgroundColor: 'blue', 
                color: 'white',
                verticalAlign: 'middle',
                textAlign: 'center'
              }}>
                Shift 1
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const dayData = data.dailyData.find(d => d.day === day);
                const pcsJam = dayData?.shift1PcsJam || 0;
                const isAboveTarget100 = pcsJam >= data.target100;
                const isAboveTarget89 = pcsJam >= data.target89;
                const isWeekend = weekendDates.includes(day);
                
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                     isAboveTarget89 ? '#FFD700' : 
                                     pcsJam > 0 ? '#FFB6C1' : 
                                     isWeekend ? '#ffcccc' : 'white'
                    }}
                  >
                    {dayData?.shift1Production || ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ 
                border: '1px solid black', 
                padding: '4px',
                textAlign: 'center'
              }}>
                Loading Time
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const dayData = data.dailyData.find(d => d.day === day);
                const isWeekend = weekendDates.includes(day);
                
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      backgroundColor: isWeekend ? '#ffcccc' : 'white'
                    }}
                  >
                    {dayData?.shift1LoadingTime ? Math.round(dayData.shift1LoadingTime) : ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ 
                border: '1px solid black', 
                padding: '4px',
                textAlign: 'center'
              }}>
                Pcs/jam
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const dayData = data.dailyData.find(d => d.day === day);
                const pcsJam = dayData?.shift1PcsJam || 0;
                const isAboveTarget100 = pcsJam >= data.target100;
                const isAboveTarget89 = pcsJam >= data.target89;
                const isWeekend = weekendDates.includes(day);
                
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                     isAboveTarget89 ? '#FFD700' : 
                                     pcsJam > 0 ? '#FFB6C1' : 
                                     isWeekend ? '#ffcccc' : 'white'
                    }}
                  >
                    {dayData?.shift1PcsJam || ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ 
                border: '1px solid black', 
                padding: '4px',
                textAlign: 'center'
              }}>
                Dangae(menit)
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const dayData = data.dailyData.find(d => d.day === day);
                const isWeekend = weekendDates.includes(day);
                
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      backgroundColor: isWeekend ? '#ffcccc' : 'white'
                    }}
                  >
                    {dayData?.dangae || ''}
                  </td>
                );
              })}
            </tr>

            {/* Shift 2 (Black) */}
            <tr>
              <td style={{ 
                border: '1px solid black', 
                padding: '4px', 
                fontWeight: 'bold', 
                backgroundColor: 'black', 
                color: 'white',
                verticalAlign: 'middle',
                textAlign: 'center'
              }}>
                Shift 2
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const dayData = data.dailyData.find(d => d.day === day);
                const pcsJam = dayData?.shift2PcsJam || 0;
                const isAboveTarget100 = pcsJam >= data.target100;
                const isAboveTarget89 = pcsJam >= data.target89;
                const isWeekend = weekendDates.includes(day);
                
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                     isAboveTarget89 ? '#FFD700' : 
                                     pcsJam > 0 ? '#FFB6C1' : 
                                     isWeekend ? '#ffcccc' : 'white'
                    }}
                  >
                    {dayData?.shift2Production || ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ 
                border: '1px solid black', 
                padding: '4px',
                textAlign: 'center'
              }}>
                Loading Time
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const dayData = data.dailyData.find(d => d.day === day);
                const isWeekend = weekendDates.includes(day);
                
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      backgroundColor: isWeekend ? '#ffcccc' : 'white'
                    }}
                  >
                    {dayData?.shift2LoadingTime ? Math.round(dayData.shift2LoadingTime) : ''}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td style={{ 
                border: '1px solid black', 
                padding: '4px',
                textAlign: 'center'
              }}>
                Pcs/jam
              </td>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const dayData = data.dailyData.find(d => d.day === day);
                const pcsJam = dayData?.shift2PcsJam || 0;
                const isAboveTarget100 = pcsJam >= data.target100;
                const isAboveTarget89 = pcsJam >= data.target89;
                const isWeekend = weekendDates.includes(day);
                
                return (
                  <td 
                    key={i}
                    style={{ 
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                     isAboveTarget89 ? '#FFD700' : 
                                     pcsJam > 0 ? '#FFB6C1' : 
                                     isWeekend ? '#ffcccc' : 'white'
                    }}
                  >
                    {dayData?.shift2PcsJam || ''}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        
        {/* Color Legend untuk tabel */}
        <div style={{ 
          marginTop: '15px', 
          display: 'flex', 
          justifyContent: 'center',
          gap: '15px',
          fontSize: '10px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#90EE90' }}></div>
            <span>≥ Target 100% ({data.target100} Pcs/Jam)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#FFD700' }}></div>
            <span>≥ Target 89% ({data.target89} Pcs/Jam)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#FFB6C1' }}></div>
            <span>&lt; Target 89%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#ffcccc' }}></div>
            <span>Tanggal Merah (Weekend/Hari Libur)</span>
          </div>
        </div>
        
        {/* Info tambahan */}
        <div style={{ 
          marginTop: '10px', 
          padding: '8px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '11px'
        }}>
          <div><strong>Info Perhitungan:</strong></div>
          <div>• Target 100% = 3600 / (Cycle Time / 10) = 3600 / ({parseFloat(data.mct || 88.4)} / 10) = {data.target100} Pcs/Jam</div>
          <div>• Target 89% = Target 100% × 0.89 = {data.target100} × 0.89 = {data.target89} Pcs/Jam</div>
          <div>• Cycle Time dari data: {parseFloat(data.mct || 88.4)} detik per pcs</div>
          <div>• Product: {data.productCode} | Line: {data.line}</div>
          <div>• Tanggal Merah (Weekend): {weekendDates.join(', ')} Februari 2026</div>
        </div>
      </div>
    </Layout>
  );
};

export default KanribanGrafikBawahPG21;