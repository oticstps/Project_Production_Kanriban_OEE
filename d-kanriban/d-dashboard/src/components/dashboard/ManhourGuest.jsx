import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Workbook } from 'exceljs';
import Layout from '../layout/Layout';



const ManhourGuest = () => {
  const [data, setData] = useState([]);
  const now = new Date();
  const [tahun, setTahun] = useState(now.getFullYear().toString());
  const [bulan, setBulan] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [pg, setPg] = useState('PG2.1');
  const [lineName, setLineName] = useState('Common Rail 12');
  const [nameProduct, setNameProduct] = useState('902F-F');
  const [filteredData, setFilteredData] = useState([]);
  const [infoCardData, setInfoCardData] = useState({
    name_product: '-',
    bottle_neck_process: '-',
    setup_manpower: '-',
    cycle_time: '-'
  });

  const [isLoading, setIsLoading] = useState(false);

  const isFriday = useCallback((date) => {
    return date.getDay() === 5;
  }, []);

  const calculateBreakTime = useCallback((start, end) => {
    const startDay = new Date(start);
    const endDay = new Date(end);
    let totalBreakTime = 0;
    const regularBreaks = [
      { start: "09:20", end: "09:30" },
      { start: "12:00", end: "12:40" },
      { start: "14:20", end: "14:30" },
      { start: "16:10", end: "16:30" },
    ];
    const fridayBreaks = [
      { start: "09:20", end: "09:30" },
      { start: "11:40", end: "12:50" },
      { start: "14:50", end: "15:00" },
      { start: "16:40", end: "17:00" },
    ];

    const breaks = isFriday(startDay) ? fridayBreaks : regularBreaks;

    const convertTimeToDate = (timeStr, baseDate) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date(baseDate);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    for (const br of breaks) {
      const breakStart = convertTimeToDate(br.start, startDay);
      const breakEnd = convertTimeToDate(br.end, startDay);

      if (breakStart >= startDay && breakEnd <= endDay) {
        if (start <= breakEnd && end >= breakStart) {
          const overlapStart = new Date(Math.max(start, breakStart));
          const overlapEnd = new Date(Math.min(end, breakEnd));
          if (overlapEnd > overlapStart) {
            totalBreakTime += (overlapEnd - overlapStart) / (1000 * 60);
          }
        }
      }
    }

    return Math.round(totalBreakTime);
  }, [isFriday]);

  const getApiEndpoint = useCallback((lineName) => {
    const match = lineName?.match(/Common Rail\s+(\d+)/i);
    if (match) {
      const lineNum = match[1];
      return `http://172.27.6.191:4000/apiCr${lineNum}/cr${lineNum}`;
    }
    return 'http://172.27.6.191:4000/apiCr12/cr12/';
  }, []);

  const fetchAllDataFromAPIs = useCallback(async () => {
    setIsLoading(true);
    try {
      const lineNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const apiPromises = lineNumbers.map(async (num) => {
        const lineName = `Common Rail ${num}`;
        const apiUrl = getApiEndpoint(lineName);
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} for ${apiUrl}`);
            return null;
          }
          const result = await response.json();
          if (result.status === 'success') {
            return { lineName, data: result.data };
          } else {
            console.error(`API error for ${apiUrl}:`, result.message);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching data from ${apiUrl}:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(apiPromises);
      const allData = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const { lineName, data } = result.value;
          const processedData = data.map(item => {
            let durationMinutes = 0;
            if (item.delta_time && typeof item.delta_time === 'string') {
              const match = item.delta_time.match(/dalam\s+(\d+(?:\.\d+)?)\s+menit/);
              if (match) {
                durationMinutes = parseFloat(match[1]);
              }
            }

            let loadingTime = 0;
            if (item.loading_time) {
              loadingTime = parseFloat(item.loading_time);
            }

            const endTime = new Date(item.created_at);
            const startTime = new Date(endTime.getTime() - (durationMinutes * 60 * 1000));
            const breakTime = calculateBreakTime(startTime, endTime);

            const id_uuid = item.id_uuid || `fallback_${Date.now()}_${Math.random()}`;

            return {
              id_uuid,
              line_id: item.line_id || '',
              pg: item.pg || '',
              line_name: item.line_name || '',
              product_name: item.name_product || '',
              target: item.target || '',
              actual: item.actual || '',
              loading_time: item.loading_time || '',
              efficiency: item.efficiency || '',
              delay: item.delay || '',
              cycle_time: item.cycle_time || '',
              status: item.status || '',
              time_trouble: item.time_trouble || '',
              time_trouble_quality: item.time_trouble_quality || '',
              andon: item.andon || '',
              shift: item.shift || '',
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString(),
              duration_minutes: durationMinutes,
              start_actual: 0,
              end_actual: parseInt(item.actual) || 0,
              total_produced: parseInt(item.actual) || 0,
              record_count: 0,
              created_at: item.created_at,
              loading_time_calc: loadingTime,
              break_time: breakTime,
              delta_time: item.delta_time || '',
              year: item.year || '',
              month: item.month || '',
              day: item.day || '',
              time_only: item.time_only || '',
              loading_time_server: item.loading_time_server || '',
              total_break: item.total_break || '',
              manpower: item.manpower || '',
              manpower_help: item.manpower_help || '',
              loading_time_manpower_help: item.loading_time_manpower_help || '',
              quality_check: item.quality_check || '',
              machine_fault_preq: item.machine_fault_preq || '',
              machine_fault_duration: item.machine_fault_duration || '',
              linegai: item.linegai || '',
              kaizen: item.kaizen || '0',
              five_s: item.five_s || '10',
              manhour_in_line: item.manhour_in_line || '',
              manhour_helper: item.manhour_helper || '',
              manhour_five_s: item.manhour_five_s || '',
              total_manhour: item.total_manhour || '',
              manhour_man_minutes_per_pcs: item.manhour_man_minutes_per_pcs || '',
              PE: item.PE || '',
              bottle_neck_process: item.bottle_neck_process || '',
              bottle_neck_process_duration: item.bottle_neck_process_duration || '',
              bottle_neck_mct: item.bottle_neck_mct || '',
              bottle_neck_mct_duration: item.bottle_neck_mct_duration || '',
              setup_manpower: item.setup_manpower || '',
              setup_ct: item.setup_ct || '',
              dangae: item.dangae || '',
              another: item.another || '',
            };
          });
          allData.push(...processedData);
        }
      });

      setData(allData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getApiEndpoint, calculateBreakTime]);

  useEffect(() => {
    fetchAllDataFromAPIs();
  }, [fetchAllDataFromAPIs]);

  const uniquePGs = useMemo(() =>
    [...new Set(data.map(item => item.pg).filter(pg => pg !== ''))],
    [data]
  );

  const uniqueLineNames = useMemo(() =>
    [...new Set(
      data
        .filter(item => (pg === '' || item.pg === pg))
        .map(item => item.line_name)
        .filter(name => name !== '')
    )],
    [data, pg]
  );

  const uniqueProductNames = useMemo(() =>
    [...new Set(
      data
        .filter(item =>
          (pg === '' || item.pg === pg) &&
          (lineName === '' || item.line_name === lineName)
        )
        .map(item => item.product_name)
        .filter(name => name !== '')
    )],
    [data, pg, lineName]
  );

  useEffect(() => {
    const filtered = data.filter(item => {
      const date = new Date(item.start_time);
      const itemTahun = date.getFullYear().toString();
      const itemBulan = (date.getMonth() + 1).toString().padStart(2, '0');
      return itemTahun === tahun &&
             itemBulan === bulan &&
             (pg === '' || item.pg === pg) &&
             (lineName === '' || item.line_name === lineName) &&
             (nameProduct === '' || item.product_name === nameProduct);
    });

    setFilteredData(filtered);

    if (filtered.length > 0) {
      const latestItem = filtered[filtered.length - 1];
      setInfoCardData({
        name_product: latestItem.product_name || '-',
        bottle_neck_process: latestItem.bottle_neck_process || '-',
        setup_manpower: latestItem.setup_manpower || '-',
        cycle_time: latestItem.cycle_time || '-'
      });
    } else {
      setInfoCardData({
        name_product: '-',
        bottle_neck_process: '-',
        setup_manpower: '-',
        cycle_time: '-'
      });
    }
  }, [tahun, bulan, pg, lineName, nameProduct, data]);

  const generateTanggalBulan = useCallback(() => {
    const tanggal = [];
    const daysInMonth = new Date(parseInt(tahun), parseInt(bulan), 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      tanggal.push(i);
    }
    return tanggal;
  }, [tahun, bulan]);

  const groupByDateAndShift = useCallback((items) => {
    const grouped = {};
    const tanggalBulan = generateTanggalBulan();

    tanggalBulan.forEach(date => {
      const dateStr = `${tahun}-${bulan.padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
      grouped[dateStr] = {
        'Shift 1': [],
        'Shift 2': []
      };
    });

    items.forEach(item => {
      if (item.status === 'STOP') {
        const date = new Date(item.start_time);
        const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        if (grouped[dateKey] && grouped[dateKey][item.shift]) {
          grouped[dateKey][item.shift].push(item);
        }
      }
    });

    return grouped;
  }, [generateTanggalBulan, tahun, bulan]);

  const groupedData = useMemo(() =>
    groupByDateAndShift(filteredData),
    [groupByDateAndShift, filteredData]
  );







  
  const calculateTotals = useCallback(() => {
    let totalActualProduksi = 0;
    let totalLoadingTime = 0;
    let totalSigmaManhour = 0;
    let totalPE = 0;
    let peCount = 0;

    // Gunakan tanggalBulanArray yang sama seperti di tabel
    const tanggalBulanArray = generateTanggalBulan();
    
    tanggalBulanArray.forEach(day => {
      const dateKey = `${tahun}-${bulan.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayData = groupedData[dateKey];
      
      if (dayData) {
        ['Shift 1', 'Shift 2'].forEach(shiftName => {
          const shiftData = dayData[shiftName];
          // Hanya ambil data pertama untuk setiap shift (sama seperti tabel)
          if (shiftData && shiftData.length > 0) {
            const item = shiftData[0];
            totalActualProduksi += parseInt(item.total_produced) || 0;
            totalLoadingTime += Math.round(parseFloat(item.loading_time_calc) || 0);

            const opInLine = parseFloat(item.manpower) || 0;
            const loadingTimeMenit = Math.round(parseFloat(item.loading_time_calc) || 0);
            const oprBantuan = parseFloat(item.manpower_help) || 0;
            const loadingTimeOprBantuan = parseFloat(item.loading_time_manpower_help) || 0;
            const fiveSMenit = parseFloat(item.five_s) || 0;
            const linegaiMenit = parseFloat(item.linegai) || 0;

            const rincianInLine = Math.round(opInLine * loadingTimeMenit);
            const rincianBantuan = Math.round(oprBantuan * loadingTimeOprBantuan);
            const rincian5S = Math.round(parseFloat(item.manhour_five_s) || 0);
            const sigmaManhour = Math.round(rincianInLine + rincianBantuan + rincian5S + linegaiMenit);

            totalSigmaManhour += sigmaManhour;

            const produksiPcs = parseInt(item.total_produced) || 0;
            const cycleTimeAsli = parseFloat(item.cycle_time) || 0;
            const cycleTimeInSeconds = cycleTimeAsli / 10;
            const pe = loadingTimeMenit > 0 ? 
              ((produksiPcs * cycleTimeInSeconds) / 60 / loadingTimeMenit) * 100 : 0;

            if (!isNaN(pe) && pe > 0) {
              totalPE += pe;
              peCount++;
            }
          }
        });
      }
    });

    const totalManhourPerPcs = totalActualProduksi > 0 ? 
      totalSigmaManhour / totalActualProduksi : 0;
    const averagePE = peCount > 0 ? totalPE / peCount : 0;

    return {
      totalActualProduksi,
      totalLoadingTime,
      totalSigmaManhour,
      totalManhourPerPcs,
      averagePE
    };
  }, [groupedData, generateTanggalBulan, tahun, bulan]);















  const totals = useMemo(() => calculateTotals(), [calculateTotals]);

  const calculateTableColumns = useCallback((item) => {
    if (!item) {
      return {
        total_produced: '-',
        manpower: '-',
        durationMenit: '-',
        loadingTimeMenit: '-',
        manpower_help: '-',
        loading_time_manpower_help: '-',
        quality_check: '-',
        machine_fault_preq: '-',
        machine_fault_duration: '-',
        dangae: '-',
        another: '-',
        linegai: '-',
        kaizen: '',
        five_s: '10',
        rincianInLine: '-',
        rincianBantuan: '-',
        rincian5S: '-',
        sigmaManhour: '-',
        manhourPerPcs: null,
        pe: null
      };
    }

    const opInLine = parseFloat(item.manpower) || 0;
    const durationMenit = Math.round(item.duration_minutes || 0);
    const loadingTimeMenit = Math.round(parseFloat(item.loading_time_calc) || 0);
    const oprBantuan = parseFloat(item.manpower_help) || 0;
    const loadingTimeOprBantuan = parseFloat(item.loading_time_manpower_help) || 0;
    const fiveSMenit = parseFloat(item.five_s) || 0;
    const linegaiMenit = parseFloat(item.linegai) || 0;

    const rincianInLine = opInLine * loadingTimeMenit;
    const rincianBantuan = oprBantuan * loadingTimeOprBantuan;
    const rincian5S = parseFloat(item.manhour_five_s) || 0;
    const sigmaManhour = rincianInLine + rincianBantuan + rincian5S + linegaiMenit;

    const produksiPcs = parseInt(item.total_produced) || 0;
    const manhourPerPcs = produksiPcs > 0 ? sigmaManhour / produksiPcs : null;

    const cycleTimeAsli = parseFloat(item.cycle_time) || 0;
    const cycleTimeInSeconds = cycleTimeAsli / 10;
    const pe = loadingTimeMenit > 0 ? ((produksiPcs * cycleTimeInSeconds) / 60 / loadingTimeMenit) * 100 : null;

    return {
      total_produced: item.total_produced || 0,
      manpower: item.manpower || 0,
      durationMenit: durationMenit,
      loadingTimeMenit: loadingTimeMenit,
      manpower_help: item.manpower_help || 0,
      loading_time_manpower_help: item.loading_time_manpower_help || 0,
      quality_check: item.quality_check || 0,
      machine_fault_preq: item.machine_fault_preq || 0,
      machine_fault_duration: item.machine_fault_duration || 0,
      dangae: item.dangae || 0,
      another: item.another || 0,
      linegai: item.linegai || 0,
      kaizen: item.kaizen || '0',
      five_s: item.five_s || '10',
      rincianInLine: Math.round(rincianInLine),
      rincianBantuan: Math.round(rincianBantuan),
      rincian5S: Math.round(rincian5S),
      sigmaManhour: Math.round(sigmaManhour),
      manhourPerPcs: manhourPerPcs,
      pe: pe
    };
  }, []);

  const safeToFixed = useCallback((value, decimals) => {
    if (value === null || value === undefined || value === '-' || isNaN(value)) {
      return '-';
    }
    return typeof value === 'number' ? value.toFixed(decimals) : '-';
  }, []);

  const formatNumber = useCallback((value, decimalPlaces = 0) => {
    if (value === '-' || value === null || value === undefined) return '-';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '-';
    return num.toFixed(decimalPlaces);
  }, []);

  const exportToExcel = useCallback(async () => {
    try {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Manhour Data');

      const headers = [
        'Tanggal',
        'Shift',
        'Σ Produksi (pcs) A',
        'Σ OP (In Line) ①',
        'Duration (Menit) ②',
        'LT (Menit) ③',
        'Opr Bantuan ④',
        'LT Opr Bantuan (Menit) ⑤',
        'Quality Check (Menit)',
        'Perbaikan Mesin (Lama Menit)',
        'Perbaikan Mesin (#Freq kali)',
        'Dangae (Menit)',
        'Lain-lain (Menit)',
        'Kaizen (menit) Out LT',
        '5S (menit) ⑥',
        'Rincian In Line (⑦=①+③)',
        'Rincian Bantuan (⑧=④+⑤)',
        'Rincian 5S ⑨',
        'Linegai ⑩',
        'Σ Manhour (manmnt)',
        'Manhour (man.menit / pcs)',
        'PE (%)'
      ];

      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      const tanggalBulan = generateTanggalBulan();
      tanggalBulan.forEach(day => {
        const dateKey = `${tahun}-${bulan.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayData = groupedData[dateKey];

        ['Shift 1', 'Shift 2'].forEach(shiftName => {
          const shiftData = dayData && dayData[shiftName] && dayData[shiftName].length > 0 ? dayData[shiftName][0] : null;
          const calculations = calculateTableColumns(shiftData);

          worksheet.addRow([
            day,
            shiftName,
            calculations.total_produced,
            calculations.manpower,
            calculations.durationMenit,
            calculations.loadingTimeMenit,
            calculations.manpower_help,
            calculations.loading_time_manpower_help,
            calculations.quality_check,
            calculations.machine_fault_duration,
            calculations.machine_fault_preq,
            calculations.dangae,
            calculations.another,
            calculations.kaizen,
            calculations.five_s,
            calculations.rincianInLine,
            calculations.rincianBantuan,
            calculations.rincian5S,
            calculations.linegai,
            calculations.sigmaManhour,
            safeToFixed(calculations.manhourPerPcs, 2),
            safeToFixed(calculations.pe, 1)
          ]);
        });
      });

      worksheet.columns = [
        { width: 10 }, { width: 10 }, { width: 15 }, { width: 15 }, { width: 15 },
        { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 15 },
        { width: 10 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 10 }, { width: 20 },
        { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 10 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Manhour_Guest_${pg || 'All'}_${lineName || 'All'}_${nameProduct || 'All'}_${tahun}_${bulan}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Gagal mengekspor data ke Excel: " + error.message);
    }
  }, [generateTanggalBulan, tahun, bulan, groupedData, calculateTableColumns, safeToFixed, pg, lineName, nameProduct]);

  const tanggalBulanArray = useMemo(() => generateTanggalBulan(), [generateTanggalBulan]);

  return (







    <Layout>

        <div className="p-2">
        <div className="flex justify-between items-center mb-3">
            <h1 className="text-lg text-center font-bold text-gray-800">Kanriban Manhour</h1>
            <div className="flex space-x-2">
            <div className="bg-blue-100 text-blue-800 font-medium py-1 px-3 rounded-md text-sm">
                Mode - View Only
            </div>
            <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md text-sm transition duration-200"
                disabled={isLoading}
            >
                Export to Excel
            </button>
            </div>
        </div>

        {/* Filter Section */}
        <div className="mb-3 p-2 bg-white-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tahun</label>
                <select
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                >
                <option value="2030">2030</option>
                <option value="2029">2029</option>
                <option value="2028">2028</option>
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Bulan</label>
                <select
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">PG</label>
                <select
                value={pg}
                onChange={(e) => setPg(e.target.value)}
                className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                >
                <option value="">Pilih PG</option>
                {uniquePGs.map((pgName, index) => (
                    <option key={index} value={pgName}>{pgName}</option>
                ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Line Name</label>
                <select
                value={lineName}
                onChange={(e) => setLineName(e.target.value)}
                className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                >
                <option value="">Pilih Line</option>
                {uniqueLineNames.map((line, index) => (
                    <option key={index} value={line}>{line}</option>
                ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name Part</label>
                <select
                value={nameProduct}
                onChange={(e) => setNameProduct(e.target.value)}
                className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                >
                <option value="">Pilih Part</option>
                {uniqueProductNames.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                ))}
                </select>
            </div>
            </div>
        </div>

        {/* Info Card Section */}
        <div className="mb-3 p-2 bg-white-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                <p className="text-xs text-gray-500">Line Name</p>
                <p className="text-sm font-medium text-gray-900">{lineName || '-'}</p>
            </div>
            <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                <p className="text-xs text-gray-500">PG</p>
                <p className="text-sm font-medium text-gray-900">{pg || '-'}</p>
            </div>
            <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                <p className="text-xs text-gray-500">Product Name</p>
                <p className="text-sm font-medium text-gray-900">{infoCardData.name_product}</p>
            </div>
            <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                <p className="text-xs text-gray-500">Cycle Time (s)</p>
                <p className="text-sm font-medium text-gray-900">
                {infoCardData.cycle_time ? (parseFloat(infoCardData.cycle_time) / 10).toFixed(1) : '-'}
                </p>
            </div>
            </div>
        </div>

        {/* Loading State */}
        {isLoading && (
            <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-600">Loading data...</p>
            </div>
        )}

        {/* Tabel tanpa Action Column */}
        <div className="bg-white rounded-lg shadow overflow-auto max-h-[45vh]">
            <div className="min-w-[1800px]">
            <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                    <th rowSpan="2" className="w-16 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">TGL</th>
                    <th rowSpan="2" className="w-16 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Shift</th>
                    <th rowSpan="2" className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center bg-teal-400">Σ Produksi (pcs) A</th>
                    <th rowSpan="2" className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Σ OP (In Line) ①</th>
                    <th rowSpan="2" className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center bg-teal-400">LT (Menit) ③</th>
                    <th rowSpan="2" className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Opr Bantuan ④</th>
                    <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">LT Opr Bantuan (Menit) ⑤</th>
                    <th colSpan="5" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border">Line Stop (terhitung dlm Loading Time)</th>
                    <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Kaizen (menit) Out LT</th>
                    <th rowSpan="2" className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">5S (menit) ⑥</th>
                    <th colSpan="4" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border">Rincian Manhour (menit)</th>
                    <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center bg-orange-200">Σ Manhour (manmnt)</th>
                    <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center bg-orange-200">Manhour (man.menit / pcs)</th>
                    <th rowSpan="2" className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">PE (%)</th>
                </tr><tr>
                    <th className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Quality Check (Menit)</th>
                    <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">*Perbaikan Mesin (menit)</th>
                    <th className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">#Freq (kali)</th>
                    <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Dangae (Menit)</th>
                    <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Lain-lain (Menit)</th>
                    <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">In Line (⑦=①+③)</th>
                    <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Bantuan (⑧=④+⑤)</th>
                    <th className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">5S ⑨</th>
                    <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Linegai ⑩</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {tanggalBulanArray.map(day => {
                    const dateKey = `${tahun}-${bulan.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const dayData = groupedData[dateKey];
                    const shift1Data = dayData && dayData['Shift 1'] && dayData['Shift 1'].length > 0 ? dayData['Shift 1'][0] : null;
                    const shift2Data = dayData && dayData['Shift 2'] && dayData['Shift 2'].length > 0 ? dayData['Shift 2'][0] : null;

                    const shift1Cols = calculateTableColumns(shift1Data);
                    const shift2Cols = calculateTableColumns(shift2Data);

                    return (
                    <React.Fragment key={dateKey}>
                        {/* Baris Shift 1 */}
                        <tr className={!shift1Data ? "bg-red-50" : ""}>
                        <td rowSpan="2" className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border text-center align-top">
                            {day}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            Shift 1
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100">
                            {shift1Cols.total_produced}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.manpower}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100">
                            {shift1Cols.loadingTimeMenit}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.manpower_help}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.loading_time_manpower_help}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.quality_check}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.machine_fault_duration}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.machine_fault_preq}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.dangae}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.another}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.kaizen}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.five_s}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.rincianInLine}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.rincianBantuan}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.rincian5S}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.linegai}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift1Cols.sigmaManhour}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {formatNumber(shift1Cols.manhourPerPcs, 2)}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {formatNumber(shift1Cols.pe, 0)}
                        </td>
                        </tr>
                        {/* Baris Shift 2 */}
                        <tr className={!shift2Data ? "bg-red-50" : ""}>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            Shift 2
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100">
                            {shift2Cols.total_produced}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.manpower}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100">
                            {shift2Cols.loadingTimeMenit}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.manpower_help}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.loading_time_manpower_help}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.quality_check}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.machine_fault_duration}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.machine_fault_preq}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.dangae}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.another}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.kaizen}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.five_s}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.rincianInLine}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.rincianBantuan}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.rincian5S}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.linegai}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {shift2Cols.sigmaManhour}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {formatNumber(shift2Cols.manhourPerPcs, 2)}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                            {formatNumber(shift2Cols.pe, 0)}
                        </td>
                        </tr>
                    </React.Fragment>
                    );
                })}
                {/* Baris Total */}
                <tr className="bg-blue-50 font-bold">
                    <td colSpan="2" className="px-1.5 py-1.5 text-xs text-gray-800 border text-center">TOTAL</td>
                    <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100">
                    {totals.totalActualProduksi}
                    </td>
                    <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                    {/* Kosong untuk Σ OP (In Line) */}
                    </td>
                    <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100">
                    {totals.totalLoadingTime}
                    </td>
                    <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center" colSpan="12">
                    {/* Kosong untuk kolom lainnya */}
                    </td>
                    <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                    {totals.totalSigmaManhour}
                    </td>
                    <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                    {formatNumber(totals.totalManhourPerPcs, 2)}
                    </td>
                    <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                    {formatNumber(totals.averagePE, 1)}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>

        {/* Info Guest */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
            <div className="mr-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <p className="text-sm text-yellow-800">
                <strong>Mode User:</strong> Anda hanya dapat melihat data.
                </p>
            </div>
            </div>
        </div>
        </div>

    </Layout>





  );
};

export default ManhourGuest;