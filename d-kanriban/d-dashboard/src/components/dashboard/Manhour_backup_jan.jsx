import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { Workbook } from 'exceljs';

const Manhour = () => {
  const [data, setData] = useState([]);
  const now = new Date();
  const [tahun, setTahun] = useState(now.getFullYear().toString());
  const [bulan, setBulan] = useState(
    String(now.getMonth() + 1).padStart(2, "0")
  );

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    line_id: '',
    pg: '',
    line_name: '',
    name_product: '',
    target: '',
    actual: '',
    loading_time: '',
    efficiency: '',
    delay: '',
    cycle_time: '',
    status: '',
    time_trouble: '',
    time_trouble_quality: '',
    andon: '',
    delta_time: '',
    year: '',
    month: '',
    day: '',
    shift: '',
    time_only: '',
    loading_time_server: '',
    total_break: '',
    manpower: '',
    manpower_help: '',
    loading_time_manpower_help: '',
    machine_fault_preq: '',
    machine_fault_duration: '',
    quality_check: '',
    another: '',
    kaizen: '10',
    five_s: '10',
    manhour_in_line: '',
    manhour_helper: '',
    manhour_five_s: '',
    total_manhour: '',
    manhour_man_minutes_per_pcs: '',
    PE: '',
    bottle_neck_process: '',
    bottle_neck_process_duration: '',
    bottle_neck_mct: '',
    bottle_neck_mct_duration: '',
    setup_manpower: '',
    setup_ct: '',
    dangae: ''
  });

  const isFriday = (date) => {
    return date.getDay() === 5;
  };











































  










  const calculateBreakTime = (start, end) => {
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
  };

  const getApiEndpoint = (lineName) => {
    const match = lineName.match(/Common Rail\s+(\d+)/i);
    if (match) {
      const lineNum = match[1];
      return `http://172.27.6.191:4000/apiCr${lineNum}/cr${lineNum}`;
    }
    return 'http://172.27.6.191:4000/apiCr12/cr12/';
  };

  const fetchAllDataFromAPIs = async () => {
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

          // PERBAIKAN: Gunakan loading_time dari data API, bukan loading_time_server
          let loadingTime = 0;
          if (item.loading_time) {
            // loading_time adalah string angka, konversi ke number
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
            loading_time_calc: loadingTime, // PERBAIKAN: Menggunakan loading_time dari API
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
            machine_fault_preq: item.machine_fault_preq || '',
            machine_fault_duration: item.machine_fault_duration || '',
            quality_check: item.quality_check || '',
            another: item.another || '',
            kaizen: item.kaizen || '10',
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
            dangae: item.dangae || ''
          };
        });
        allData.push(...processedData);
      }
    });

    setData(allData);
  };

  useEffect(() => {
    fetchAllDataFromAPIs();
  }, []);

  const uniquePGs = [...new Set(data.map(item => item.pg).filter(pg => pg !== ''))];
  const uniqueLineNames = [...new Set(
    data
      .filter(item => (pg === '' || item.pg === pg))
      .map(item => item.line_name)
      .filter(name => name !== '')
  )];
  const uniqueProductNames = [...new Set(
    data
      .filter(item =>
        (pg === '' || item.pg === pg) &&
        (lineName === '' || item.line_name === lineName)
      )
      .map(item => item.product_name)
      .filter(name => name !== '')
  )];

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

  const generateTanggalBulan = () => {
    const tanggal = [];
    const daysInMonth = new Date(parseInt(tahun), parseInt(bulan), 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      tanggal.push(i);
    }
    return tanggal;
  };

  const groupByDateAndShift = (items) => {
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
  };

  const groupedData = groupByDateAndShift(filteredData);

  const exportToExcel = async () => {
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
      '#Freq (kali)',
      'Perbaikan Mesin',
      'Dangae',
      'Quality Check (Menit)',
      'Lain-lain (Menit)',
      'Kaizen (menit) Out LT',
      '5S (menit) ⑥',
      'Rincian In Line (⑦=①+②)',
      'Rincian Bantuan (⑧=④+⑤)',
      'Rincian 5S ⑨',
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

        // Di dalam exportToExcel function, ubah bagian yang menambahkan data:
        worksheet.addRow([
          day,
          shiftName,
          calculations.total_produced,
          calculations.manpower,
          calculations.durationMenit,
          calculations.loadingTimeMenit,
          calculations.manpower_help,
          calculations.loading_time_manpower_help,
          calculations.machine_fault_preq,
          calculations.machine_fault_duration,
          calculations.dangae,
          calculations.quality_check,
          calculations.another,
          calculations.kaizen,
          calculations.five_s,
          calculations.rincianInLine,
          calculations.rincianBantuan,
          calculations.rincian5S,
          calculations.sigmaManhour,
          // Format manhourPerPcs dengan 2 desimal di Excel
          calculations.manhourPerPcs ? calculations.manhourPerPcs.toFixed(2) : '-',
          // Format PE dengan 1 desimal di Excel
          calculations.pe ? calculations.pe.toFixed(1) : '-'
        ]);




      });
    });

    worksheet.columns = [
      { width: 10 }, { width: 10 }, { width: 15 }, { width: 15 }, { width: 15 },
      { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 15 },
      { width: 10 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 10 },
      { width: 20 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 10 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manhour_${pg || 'All'}_${lineName || 'All'}_${nameProduct || 'All'}_${tahun}_${bulan}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenCreateModal = (defaultShift = '') => {
    setCurrentItem(null);
    setFormData({
      ...formData,
      line_id: '',
      pg: pg,
      line_name: lineName,
      name_product: nameProduct,
      target: '',
      actual: '',
      loading_time: '',
      efficiency: '',
      delay: '',
      cycle_time: '',
      status: '',
      time_trouble: '',
      time_trouble_quality: '',
      andon: '',
      delta_time: '',
      year: tahun,
      month: bulan,
      day: '',
      shift: defaultShift,
      time_only: '',
      loading_time_server: '',
      total_break: '',
      manpower: '',
      manpower_help: '',
      loading_time_manpower_help: '',
      machine_fault_preq: '',
      machine_fault_duration: '',
      quality_check: '',
      another: '',
      kaizen: '10',
      five_s: '10',
      manhour_in_line: '',
      manhour_helper: '',
      manhour_five_s: '',
      total_manhour: '',
      manhour_man_minutes_per_pcs: '',
      PE: '',
      bottle_neck_process: '',
      bottle_neck_process_duration: '',
      bottle_neck_mct: '',
      bottle_neck_mct_duration: '',
      setup_manpower: '',
      setup_ct: '',
      dangae: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      ...formData,
      line_id: item.line_id || '',
      pg: item.pg || '',
      line_name: item.line_name || '',
      name_product: item.product_name || '',
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
      delta_time: item.delta_time || '',
      year: item.year || '',
      month: item.month || '',
      day: item.day || '',
      shift: item.shift || '',
      time_only: item.time_only || '',
      loading_time_server: item.loading_time_server || '',
      total_break: item.total_break || '',
      manpower: item.manpower || '',
      manpower_help: item.manpower_help || '',
      loading_time_manpower_help: item.loading_time_manpower_help || '',
      machine_fault_preq: item.machine_fault_preq || '',
      machine_fault_duration: item.machine_fault_duration || '',
      quality_check: item.quality_check || '',
      another: item.another || '',
      kaizen: item.kaizen || '10',
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
      dangae: item.dangae || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const itemToDelete = data.find(item => item.id_uuid === id);
        if (!itemToDelete) {
          throw new Error("Item not found for deletion");
        }
        const apiUrl = getApiEndpoint(itemToDelete.line_name);
        const response = await fetch(`${apiUrl}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || "Failed to delete data");
        }

        await fetchAllDataFromAPIs();
        console.log("Data deleted successfully");
      } catch (error) {
        console.error("Error deleting ", error.message);
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = getApiEndpoint(formData.line_name);
      let response;
      if (currentItem) {
        response = await fetch(`${apiUrl}/${currentItem.id_uuid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${apiUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to save data");
      }

      const result = await response.json();
      console.log("Data saved successfully", result);
      await fetchAllDataFromAPIs();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving ", error.message);
      alert("Gagal menyimpan data: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const calculateTableColumns = (item) => {
  if (!item) {
    return {
      total_produced: '-',
      manpower: '-',
      durationMenit: '-',
      loadingTimeMenit: '-',
      manpower_help: '-',
      loading_time_manpower_help: '-',
      machine_fault_preq: '-',
      machine_fault_duration: '-',
      dangae: '-',
      quality_check: '-',
      another: '-',
      kaizen: '10',
      five_s: '10',
      rincianInLine: '-',
      rincianBantuan: '-',
      rincian5S: '-',
      sigmaManhour: '-',
      manhourPerPcs: '-',
      pe: '-'
    };
  }

  const opInLine = parseFloat(item.manpower) || 0;
  const durationMenit = Math.round(item.duration_minutes || 0);
  const loadingTimeMenit = Math.round(parseFloat(item.loading_time_calc) || 0);
  const oprBantuan = parseFloat(item.manpower_help) || 0;
  const loadingTimeOprBantuan = parseFloat(item.loading_time_manpower_help) || 0;
  const fiveSMenit = parseFloat(item.five_s) || 0;
  const linegaiMenit = parseFloat(item.another) || 0;

  const rincianInLine = opInLine * loadingTimeMenit;
  const rincianBantuan = oprBantuan * loadingTimeOprBantuan;
  const rincian5S = parseFloat(item.manhour_five_s) || 0;
  const sigmaManhour = rincianInLine + rincianBantuan + fiveSMenit + rincian5S + linegaiMenit;

  const produksiPcs = parseInt(item.total_produced) || 0;
  
  // Perbaikan untuk Manhour per pcs (2 desimal)
  const manhourPerPcs = produksiPcs > 0 ? sigmaManhour / produksiPcs : 0;

  const cycleTimeAsli = parseFloat(item.cycle_time) || 0;
  const cycleTimeInSeconds = cycleTimeAsli / 10;
  
  // Perbaikan untuk PE (1 desimal)
  const pe = loadingTimeMenit > 0 ? ((produksiPcs * cycleTimeInSeconds) / 60 / loadingTimeMenit) * 100 : 0;

  return {
    total_produced: item.total_produced || 0,
    manpower: item.manpower || 0,
    durationMenit: durationMenit,
    loadingTimeMenit: loadingTimeMenit,
    manpower_help: item.manpower_help || 0,
    loading_time_manpower_help: item.loading_time_manpower_help || 0,
    machine_fault_preq: item.machine_fault_preq || 0,
    machine_fault_duration: item.machine_fault_duration || 0,
    dangae: item.dangae || 0,
    quality_check: item.quality_check || 0,
    another: item.another || 0,
    kaizen: item.kaizen || '10',
    five_s: item.five_s || '10',
    rincianInLine: Math.round(rincianInLine),
    rincianBantuan: Math.round(rincianBantuan),
    rincian5S: Math.round(rincian5S),
    sigmaManhour: Math.round(sigmaManhour),
    manhourPerPcs: manhourPerPcs, // Tidak dibulatkan, biar formatNumber yang handle
    pe: pe // Tidak dibulatkan, biar formatNumber yang handle
  };
};




  // Tambahkan fungsi formatter di dalam komponen Manhour, sebelum return statement
  const formatNumber = (value, decimalPlaces = 0) => {
    if (value === '-' || value === null || value === undefined) return '-';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '-';
    return num.toFixed(decimalPlaces);
  };




  return (
    <Layout>
      <div className="p-2">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-lg text-center font-bold text-gray-800">Kanriban Manhour</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenCreateModal('')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md text-sm transition duration-200"
            >
              Add Data
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md text-sm transition duration-200"
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
              <p className="text-sm font-medium text-gray-900">{infoCardData.cycle_time ? (parseFloat(infoCardData.cycle_time) / 10).toFixed(1) : '-'}</p>
            </div>
          </div>
        </div>

        {/* Tabel dengan fixed layout */}
        <div className="bg-white rounded-lg shadow overflow-auto max-h-[65vh]">
          <div className="min-w-[2000px]">
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
                  <th colSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border">Perbaikan Mesin (Menit)</th>
                  <th rowSpan="2" className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Dangae</th>
                  <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Quality Check (Menit)</th>
                  <th rowSpan="2" className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Lain-lain (Menit)</th>
                  <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Kaizen (menit) Out LT</th>
                  <th rowSpan="2" className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">5S (menit) ⑥</th>
                  <th colSpan="3" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border">Rincian Manhour (menit)</th>
                  <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center bg-orange-200">Σ Manhour (manmnt)</th>
                  <th rowSpan="2" className="w-28 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center bg-orange-200">Manhour (man.menit / pcs)</th>
                  <th rowSpan="2" className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">PE (%)</th>
                  <th rowSpan="2" className="w-32 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center bg-purple-200">Action</th>
                </tr>
                <tr>
                  <th className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">#Freq (kali)</th>
                  <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Perbaikan Mesin</th>
                  <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">In Line (⑦=①+②)</th>
                  <th className="w-24 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">Bantuan (⑧=④+⑤)</th>
                  <th className="w-20 px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border text-center">5S ⑨</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generateTanggalBulan().map(day => {
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
                          {shift1Cols.machine_fault_preq}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift1Cols.machine_fault_duration}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift1Cols.dangae}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift1Cols.quality_check}
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
                          {shift1Cols.sigmaManhour}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {formatNumber(shift1Cols.manhourPerPcs, 2)}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {formatNumber(shift1Cols.pe, 1)}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift1Data ? (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(shift1Data)}
                                className="text-blue-600 hover:text-blue-900 mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(shift1Data.id_uuid)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleOpenCreateModal('Shift 1')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Add
                            </button>
                          )}
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
                          {shift2Cols.machine_fault_preq}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift2Cols.machine_fault_duration}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift2Cols.dangae}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift2Cols.quality_check}
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
                          {shift2Cols.sigmaManhour}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {formatNumber(shift1Cols.manhourPerPcs, 2)}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {formatNumber(shift1Cols.pe, 1)}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center">
                          {shift2Data ? (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(shift2Data)}
                                className="text-blue-600 hover:text-blue-900 mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(shift2Data.id_uuid)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleOpenCreateModal('Shift 2')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Add
                            </button>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentItem ? "Edit Data" : "Create New Data"}
                </h2>
              </div>
              <form onSubmit={handleSubmitForm} className="flex-grow overflow-y-auto">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(formData).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </label>
                        {key === 'status' || key === 'shift' ? (
                          <select
                            name={key}
                            value={value}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="">Select {key}</option>
                            {key === 'status' ? (
                              <>
                                <option value="START">START</option>
                                <option value="STOP">STOP</option>
                              </>
                            ) : (
                              <>
                                <option value="Shift 1">Shift 1</option>
                                <option value="Shift 2">Shift 2</option>
                              </>
                            )}
                          </select>
                        ) : key === 'time_only' ? (
                          <input
                            type="time"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        ) : (
                          <input
                            type="text"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Manhour;