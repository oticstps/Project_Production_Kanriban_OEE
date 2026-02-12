




import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { Workbook } from 'exceljs';
const Manhour = () => {
  const [data, setData] = useState([]);
  const [tahun, setTahun] = useState('2025');
  const [bulan, setBulan] = useState('11');
  const [pg, setPg] = useState('PG2.3'); 
  const [nameProduct, setNameProduct] = useState('902F-F');
  const [filteredData, setFilteredData] = useState([]);
  const [infoCardData, setInfoCardData] = useState({name_product: '-', bottle_neck_process: '-', setup_manpower: '-', cycle_time: '-'});
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
    // Kolom baru dari database
    manpower: '',
    manpower_help: '',
    loading_time_manpower_help: '',
    machine_fault_preq: '',
    machine_fault_duration: '',
    quality_check: '',
    another: '',
    kaizen: '',
    five_s: '',
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
      { start: "09:20", end: "09:30" },    // 10 menit
      { start: "12:00", end: "12:40" },    // 40 menit
      { start: "14:20", end: "14:30" },    // 10 menit
      { start: "16:10", end: "16:30" },    // 20 menit
    ];
    const fridayBreaks = [
      { start: "09:20", end: "09:30" },    // 10 menit
      { start: "11:40", end: "12:50" },    // 70 menit
      { start: "14:50", end: "15:00" },    // 10 menit
      { start: "16:40", end: "17:00" },    // 20 menit
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
            totalBreakTime += (overlapEnd - overlapStart) / (1000 * 60); // dalam menit
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
    const allData = [];
    const lineNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Common Rail 1 - 12
    for (const num of lineNumbers) {
      const lineName = `Common Rail ${num}`;
      const apiUrl = getApiEndpoint(lineName);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status} for ${apiUrl}`);
          continue; // Lanjut ke iterasi berikutnya
        }
        const result = await response.json();
        if (result.status === 'success') {
          const processedData = result.data.map(item => {
            // Parsing delta_time untuk mendapatkan durasi dalam menit
            let durationMinutes = 0;
            if (item.delta_time && typeof item.delta_time === 'string') {
              const match = item.delta_time.match(/dalam\s+(\d+(?:\.\d+)?)\s+menit/);
              if (match) {
                durationMinutes = parseFloat(match[1]);
              }
            }
            // Parsing loading_time_server untuk mendapatkan loading time
            let loadingTime = 0;
            if (item.loading_time_server && typeof item.loading_time_server === 'string') {
              const match = item.loading_time_server.match(/(\d+(?:\.\d+)?)\s+menit/);
              if (match) {
                loadingTime = parseFloat(match[1]);
              }
            }
            // Parsing created_at untuk mendapatkan start_time dan end_time
            const endTime = new Date(item.created_at);
            const startTime = new Date(endTime.getTime() - (durationMinutes * 60 * 1000));
            // Hitung waktu istirahat
            const breakTime = calculateBreakTime(startTime, endTime);
            // Jika loading_time_server tersedia, gunakan itu, jika tidak hitung dari durasi - break - 5S
            // const calculatedLT = item.loading_time_server ? loadingTime : Math.max(0, durationMinutes - breakTime - 10);
            // Gunakan nilai dari API jika tersedia, jika tidak gunakan placeholder
            return {
              idPrimary: item.idPrimary,
              cycle_number: item.idPrimary,
              line_id: item.line_id || '',
              pg: item.pg || '',
              line_name: item.line_name || '',
              product_name: item.name_product || '', // Diambil dari DB
              target: item.target || '',
              actual: item.actual || '',
              loading_time: item.loading_time || '',
              efficiency: item.efficiency || '',
              delay: item.delay || '',
              cycle_time: item.cycle_time || '', // Diambil dari DB
              status: item.status || '',
              time_trouble: item.time_trouble || '',
              time_trouble_quality: item.time_trouble_quality || '',
              andon: item.andon || '',
              shift: item.shift || '', // Diambil dari DB
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString(),
              duration_minutes: durationMinutes,
              start_actual: 0,
              end_actual: parseInt(item.actual) || 0,
              total_produced: parseInt(item.actual) || 0,
              record_count: 0,
              created_at: item.created_at,
              loading_time_calc: loadingTime, // Gunakan loading_time_server yang diparsing
              break_time: breakTime,
              delta_time: item.delta_time || '',
              year: item.year || '', // Diambil dari DB
              month: item.month || '', // Diambil dari DB
              day: item.day || '', // Diambil dari DB
              time_only: item.time_only || '',
              loading_time_server: item.loading_time_server || '', // Diambil dari DB
              total_break: item.total_break || '', // Diambil dari DB
              // Kolom baru dari database
              manpower: item.manpower || '', // Diambil dari DB
              manpower_help: item.manpower_help || '', // Diambil dari DB
              loading_time_manpower_help: item.loading_time_manpower_help || '', // Diambil dari DB
              machine_fault_preq: item.machine_fault_preq || '', // Diambil dari DB
              machine_fault_duration: item.machine_fault_duration || '', // Diambil dari DB
              quality_check: item.quality_check || '', // Diambil dari DB
              another: item.another || '', // Diambil dari DB
              kaizen: item.kaizen || '10', // Diambil dari DB atau default
              five_s: item.five_s || '10', // Diambil dari DB atau default
              manhour_in_line: item.manhour_in_line || '', // Diambil dari DB
              manhour_helper: item.manhour_helper || '', // Diambil dari DB
              manhour_five_s: item.manhour_five_s || '', // Diambil dari DB
              total_manhour: item.total_manhour || '', // Diambil dari DB
              manhour_man_minutes_per_pcs: item.manhour_man_minutes_per_pcs || '', // Diambil dari DB
              PE: item.PE || '', // Diambil dari DB
              bottle_neck_process: item.bottle_neck_process || '', // Diambil dari DB
              bottle_neck_process_duration: item.bottle_neck_process_duration || '', // Diambil dari DB
              bottle_neck_mct: item.bottle_neck_mct || '', // Diambil dari DB
              bottle_neck_mct_duration: item.bottle_neck_mct_duration || '', // Diambil dari DB
              setup_manpower: item.setup_manpower || '', // Diambil dari DB
              setup_ct: item.setup_ct || '', // Diambil dari DB
              dangae: item.dangae || '' // Diambil dari DB
            };
          });
          allData.push(...processedData); // Gabungkan data dari semua line
        } else {
          console.error(`API error for ${apiUrl}:`, result.message);
        }
      } catch (error) {
        console.error(`Error fetching data from ${apiUrl}:`, error);
      }
    }
    setData(allData);
  };




  useEffect(() => {
    fetchAllDataFromAPIs();
  }, []);




  const uniquePGs = [...new Set(data.map(item => item.pg).filter(pg => pg !== ''))];
  const uniqueProductNames = [...new Set(
    data
      .filter(item => pg === '' || item.pg === pg) // Filter berdasarkan PG jika dipilih
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
             (pg === '' || item.pg === pg) && // Filter berdasarkan PG jika dipilih
             (nameProduct === '' || item.product_name === nameProduct); // Filter berdasarkan Name Product jika dipilih
    });
    setFilteredData(filtered);
    // Update informasi card dengan data terbaru dari filteredData
    if (filtered.length > 0) {
      const latestItem = filtered[filtered.length - 1]; // Ambil item terbaru
      setInfoCardData({
        name_product: latestItem.product_name || '-',
        bottle_neck_process: latestItem.bottle_neck_process || '-',
        setup_manpower: latestItem.setup_manpower || '-',
        cycle_time: latestItem.cycle_time || '-'
      });
    } else {
      // Jika tidak ada data, reset ke placeholder
      setInfoCardData({
        name_product: '-',
        bottle_neck_process: '-',
        setup_manpower: '-',
        cycle_time: '-'
      });
    }
  }, [tahun, bulan, pg, nameProduct, data]);




  const generateTanggalBulan = () => {
    const tanggal = [];
    const daysInMonth = new Date(tahun, bulan, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      tanggal.push(i);
    }
    return tanggal;
  };
  const groupByDateAndShift = (items) => {
    const grouped = {};
    const tanggalBulan = generateTanggalBulan();
    tanggalBulan.forEach(date => {
      const dateStr = `${tahun}-${bulan}-${date.toString().padStart(2, '0')}`;
      grouped[dateStr] = {
        'Shift 1': [],
        'Shift 2': []
      };
    });
    // Add items to their respective dates and shifts
    items.forEach(item => {
      const date = new Date(item.start_time);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      if (grouped[dateKey]) {
        // Hanya tambahkan item jika status = STOP
        if (item.status === 'STOP') {
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
    // Definisikan header - tambahkan Line Name
    const headers = [
      'Tanggal',
      'Shift',
      'Line Name', // Tambahkan kolom ini
      'PG', // Tambahkan kolom ini
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
    // Tambahkan baris header ke worksheet
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' } // Warna abu muda
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    // Siapkan data untuk ekspor
    const tanggalBulan = generateTanggalBulan();
    tanggalBulan.forEach(day => {
        const dateKey = `${tahun}-${bulan}-${day.toString().padStart(2, '0')}`;
        const dayData = groupedData[dateKey];
        if (dayData) {
            // Loop melalui Shift 1 dan Shift 2
            ['Shift 1', 'Shift 2'].forEach(shiftName => {
                const shiftData = dayData[shiftName];
                if (shiftData && shiftData.length > 0) {
                    shiftData.forEach((item, index) => {
                        // --- Perhitungan Manhour dan PE untuk Excel ---
                        // Ambil nilai-nilai dari database dan konversi ke angka
                        const opInLine = parseFloat(item.manpower) || 0;
                        const durationMenit = Math.round(item.duration_minutes || 0); // Gunakan nilai yang dibulatkan
                        const loadingTimeMenit = Math.round(parseFloat(item.loading_time_calc) || 0); // Gunakan loading_time_calc dari DB, dibulatkan
                        const oprBantuan = parseFloat(item.manpower_help) || 0;
                        const loadingTimeOprBantuan = parseFloat(item.loading_time_manpower_help) || 0;
                        const fiveSMenit = parseFloat(item.five_s) || 0; // Ambil dari database
                        const linegaiMenit = parseFloat(item.another) || 0; // Asumsi ini adalah Linegai

                        // Hitung Rincian Manhour
                        const rincianInLine = opInLine * loadingTimeMenit; // ⑥
                        const rincianBantuan = oprBantuan * loadingTimeOprBantuan; // ⑦
                        const rincian5S = parseFloat(item.manhour_five_s) || 0; // Ambil dari database
                        const rincianLinegai = linegaiMenit; // ⑨

                        // Hitung Σ Manhour (⑩)
                        const sigmaManhour = rincianInLine + rincianBantuan + fiveSMenit + rincian5S + rincianLinegai;

                        // Hitung Manhour per pcs (⑪)
                        const produksiPcs = parseInt(item.total_produced) || 0;
                        const manhourPerPcs = produksiPcs > 0 ? sigmaManhour / produksiPcs : 0;

                        // Hitung PE (%)
                        // Ambil cycle_time dari item, konversi dari centisecond ke second dengan membagi 10
                        const cycleTimeAsli = parseFloat(item.cycle_time) || 0; // Misal nilai dari DB: 200
                        const cycleTimeInSeconds = cycleTimeAsli / 10; // 200 / 10 = 20 seconds
                        // Rumus PE: ((Σ produksi * Cycle Time Standar (s)) / 60 / Loading Time (menit)) * 100
                        // Konversi agar satuan sesuai: (pcs * s/pcs) / (menit * 60 s/menit) -> (s) / (s) -> menjadi rasio
                        const pe = loadingTimeMenit > 0 ? ((produksiPcs * cycleTimeInSeconds) / 60 / loadingTimeMenit) * 100 : 0;
                        // --- End Perhitungan ---

                        worksheet.addRow([
                            day,
                            item.shift,
                            item.line_name, // Tambahkan nilai ini
                            item.pg, // Tambahkan nilai ini
                            item.total_produced,
                            item.manpower, // Gunakan nilai dari database
                            durationMenit, // Gunakan nilai yang dibulatkan
                            loadingTimeMenit, // Gunakan loading_time_calc yang dibulatkan
                            item.manpower_help, // Gunakan nilai dari database
                            item.loading_time_manpower_help, // Gunakan nilai dari database
                            item.machine_fault_preq, // Gunakan nilai dari database
                            item.machine_fault_duration, // Gunakan nilai dari database
                            item.dangae, // Gunakan nilai dari database
                            item.quality_check, // Gunakan nilai dari database
                            item.another, // Gunakan nilai dari database
                            item.kaizen, // Gunakan nilai dari database atau konstan
                            item.five_s, // Gunakan nilai dari database atau konstan
                            Math.round(rincianInLine), // Gunakan hasil perhitungan
                            Math.round(rincianBantuan), // Gunakan hasil perhitungan
                            Math.round(rincian5S), // Gunakan hasil perhitungan
                            Math.round(sigmaManhour), // Gunakan hasil perhitungan
                            Math.round(manhourPerPcs), // Gunakan hasil perhitungan
                            Math.round(pe) // Gunakan hasil perhitungan
                        ]);
                    });
                } else {
                    // Jika tidak ada data untuk shift ini
                    worksheet.addRow([
                        day,
                        shiftName,
                        '-', // Placeholder untuk Line Name
                        '-', // Placeholder untuk PG
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '10', // Nilai konstan Kaizen
                        '10', // Nilai konstan 5S
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-'
                    ]);
                }
            });
        } else {
            // Jika tidak ada data untuk hari itu
            ['Shift 1', 'Shift 2'].forEach(shiftName => {
                worksheet.addRow([
                    day,
                    shiftName,
                    '-', // Placeholder untuk Line Name
                    '-', // Placeholder untuk PG
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '10', // Nilai konstan Kaizen
                    '10', // Nilai konstan 5S
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-'
                ]);
            });
        }
    });
    // Atur lebar kolom (opsional)
    worksheet.columns = [
        { width: 10 }, // Tanggal
        { width: 10 }, // Shift
        { width: 15 }, // Line Name
        { width: 10 }, // PG
        { width: 15 }, // Σ Produksi
        { width: 15 }, // Σ OP
        { width: 15 }, // Duration
        { width: 15 }, // LT
        { width: 15 }, // Opr Bantuan
        { width: 20 }, // LT Opr Bantuan
        { width: 15 }, // #Freq
        { width: 15 }, // Perbaikan Mesin
        { width: 10 }, // Dangae
        { width: 20 }, // Quality Check
        { width: 15 }, // Lain-lain
        { width: 20 }, // Kaizen
        { width: 10 }, // 5S
        { width: 20 }, // Rincian In Line
        { width: 20 }, // Rincian Bantuan
        { width: 15 }, // Rincian 5S
        { width: 15 }, // Σ Manhour
        { width: 20 }, // Manhour per pcs
        { width: 10 }, // PE
    ];
    // Buat buffer dan simpan file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manhour_${pg || 'All'}_${nameProduct || 'All'}_${tahun}_${bulan}.xlsx`;
    a.click();
    URL.revokeObjectURL(url); // Membersihkan URL object setelah digunakan
  };
  const handleOpenCreateModal = () => {
    setCurrentItem(null);
    setFormData({
      line_id: '',
      pg: pg, // Isi otomatis dengan pg yang dipilih
      line_name: '', // Biarkan kosong atau isi default jika perlu
      name_product: nameProduct, // Isi otomatis dengan nameProduct yang dipilih
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
      year: tahun, // Isi otomatis dengan tahun yang dipilih
      month: bulan, // Isi otomatis dengan bulan yang dipilih
      day: '',
      shift: '',
      time_only: '',
      loading_time_server: '',
      total_break: '',
      // Nilai default untuk kolom baru
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
      line_id: item.line_id || '',
      pg: item.pg || '',
      line_name: item.line_name || '',
      name_product: item.product_name || '', // Sesuaikan nama field
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
      // Isi dengan nilai dari item untuk kolom baru
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
        // Kita perlu mendapatkan line_name untuk menghapus dari API yang benar
        const itemToDelete = data.find(item => item.idPrimary === id);
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
        // Perlu mengambil data terbaru setelah penghapusan
        await fetchAllDataFromAPIs();
        console.log("Data deleted successfully");
      } catch (error) {
        console.error("Error deleting ", error.message);
        alert("Gagal menghapus  " + error.message);
      }
    }
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {

      const apiUrl = getApiEndpoint(formData.line_name);
      let response;
      if (currentItem) {
        response = await fetch(`${apiUrl}/${currentItem.idPrimary}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create
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
      alert("Gagal menyimpan  " + error.message);
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



  return (
    <Layout>
        <div className="p-2">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-lg text-center font-bold text-gray-800">Kanriban Manhour</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleOpenCreateModal}
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


            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2"> {/* Ubah ke 4 kolom */}
                  <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tahun</label>
                      <select
                        value={tahun}
                        onChange={(e) => setTahun(e.target.value)}
                        className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name Product</label>
                      <select
                        value={nameProduct}
                        onChange={(e) => setNameProduct(e.target.value)}
                        className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih Product</option>
                        {uniqueProductNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                      </select>
                  </div>
                </div>
            </div>
            {/* Info Card Section */}
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                        <p className="text-xs text-gray-500">Product Name</p>
                        <p className="text-sm font-medium text-gray-900">{infoCardData.name_product}</p>
                    </div>
                    <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                        <p className="text-xs text-gray-500">Bottle Neck Process</p>
                        <p className="text-sm font-medium text-gray-900">{infoCardData.bottle_neck_process}</p>
                    </div>
                    <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                        <p className="text-xs text-gray-500">Setup Manpower</p>
                        <p className="text-sm font-medium text-gray-900">{infoCardData.setup_manpower}</p>
                    </div>
                    <div className="p-2 bg-white border border-gray-200 rounded-md text-center">
                        <p className="text-xs text-gray-500">Cycle Time</p>
                        <p className="text-sm font-medium text-gray-900">{infoCardData.cycle_time}</p>
                    </div>
                </div>
            </div>
            {/* Scrollable container */}
            <div className="bg-white rounded-lg shadow overflow-auto max-h-[65vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10"><tr><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-9">TGL</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-9">Shift</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-blue-100">Line Name</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10 bg-blue-100">PG</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">Σ Produksi (pcs) A</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Σ OP (In Line) ①</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">Duration (Menit) ②</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">LT (Menit) ③</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Opr Bantuan ④</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">LT Opr Bantuan (Menit) ⑤</th><th colSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border w-18">Perbaikan Mesin (Menit)</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Dangae</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">Quality Check (Menit)</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Lain-lain (Menit)</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">Kaizen (menit) Out LT</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-12">5S (menit) ⑥</th><th colSpan="3" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border w-18">Rincian Manhour (menit)</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-orange-200">Σ Manhour (manmnt)</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-orange-200">Manhour (man.menit / pcs)</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-12">PE (%)</th><th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-purple-200">Action</th></tr><tr><th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">#Freq (kali)</th><th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">Perbaikan Mesin</th><th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">In Line (⑦=①+②)</th><th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">Bantuan (⑧=④+⑤)</th><th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">5S ⑨</th></tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {generateTanggalBulan().map(day => {
                      const dateKey = `${tahun}-${bulan}-${day.toString().padStart(2, '0')}`;
                      const dayData = groupedData[dateKey];

                      // Cek apakah ada data untuk Shift 1 atau Shift 2
                      const hasShift1Data = dayData && dayData['Shift 1'] && dayData['Shift 1'].length > 0;
                      const hasShift2Data = dayData && dayData['Shift 2'] && dayData['Shift 2'].length > 0;

                      // Kasus 1: Tidak ada data untuk keduanya (Shift 1 dan Shift 2)
                      if (!hasShift1Data && !hasShift2Data) {
                          return [
                              <tr key={dateKey} className="bg-red-50"><td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border text-center">{day}</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">Shift 1</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border bg-blue-100">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border bg-blue-100">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border bg-teal-100">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border bg-teal-100">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border bg-teal-100">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">10</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">10</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td><td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td></tr>
                          ];
                      }

                      // Kasus 2: Hanya ada data untuk satu shift atau kedua shift
                      const allShifts = ['Shift 1', 'Shift 2'];
                      const rows = [];

                      allShifts.forEach(shiftName => {
                          const shiftData = dayData[shiftName] || []; // Ambil data shift, atau array kosong jika tidak ada

                          if (shiftData.length > 0) {
                              // Jika ada data, buat baris untuk setiap item dalam shift tersebut
                              shiftData.forEach((item, index) => {
                                  const rowKey = `${dateKey}-${shiftName}-${index}`;
                                  const rowClass = index === 0 ? "border-t-2 border-gray-300" : ""; // Tambahkan border untuk baris pertama setiap tanggal

                                  // --- Perhitungan Manhour dan PE untuk Tabel ---
                                  // Ambil nilai-nilai dari database dan konversi ke angka
                                  const opInLine = parseFloat(item.manpower) || 0;
                                  const durationMenit = Math.round(item.duration_minutes || 0); // Gunakan nilai yang dibulatkan
                                  const loadingTimeMenit = Math.round(parseFloat(item.loading_time_calc) || 0); // Gunakan loading_time_calc dari DB, dibulatkan
                                  const oprBantuan = parseFloat(item.manpower_help) || 0;
                                  const loadingTimeOprBantuan = parseFloat(item.loading_time_manpower_help) || 0;
                                  const fiveSMenit = parseFloat(item.five_s) || 0; // Ambil dari database
                                  const linegaiMenit = parseFloat(item.another) || 0; // Asumsi ini adalah Linegai
                                  // Hitung Rincian Manhour
                                  const rincianInLine = opInLine * loadingTimeMenit; // ⑥
                                  const rincianBantuan = oprBantuan * loadingTimeOprBantuan; // ⑦
                                  const rincian5S = parseFloat(item.manhour_five_s) || 0; // Ambil dari database
                                  const rincianLinegai = linegaiMenit; // ⑨
                                  // Hitung Σ Manhour (⑩)
                                  const sigmaManhour = rincianInLine + rincianBantuan + fiveSMenit + rincian5S + rincianLinegai;

                                  // Hitung Manhour per pcs (⑪)
                                  const produksiPcs = parseInt(item.total_produced) || 0;
                                  const manhourPerPcs = produksiPcs > 0 ? sigmaManhour / produksiPcs : 0;

                                  // Hitung PE (%)
                                  // Ambil cycle_time dari item, konversi dari centisecond ke second dengan membagi 10
                                  const cycleTimeAsli = parseFloat(item.cycle_time) || 0; // Misal nilai dari DB: 200
                                  const cycleTimeInSeconds = cycleTimeAsli / 10; // 200 / 10 = 20 seconds
                                  // Rumus PE: ((Σ produksi * Cycle Time Standar (s)) / 60 / Loading Time (menit)) * 100
                                  // Konversi agar satuan sesuai: (pcs * s/pcs) / (menit * 60 s/menit) -> (s) / (s) -> menjadi rasio
                                  const pe = loadingTimeMenit > 0 ? ((produksiPcs * cycleTimeInSeconds) / 60 / loadingTimeMenit) * 100 : 0;



                                  const rowCells = [
                                      // Kolom Tanggal: hanya tampilkan di baris pertama *dan* jika ini adalah Shift 1
                                      index === 0 && shiftName === 'Shift 1' ? (
                                          React.createElement('td', {
                                              key: 'date-cell',
                                              rowSpan: hasShift1Data && hasShift2Data ? Math.max(shiftData.length, 1) + (dayData['Shift 2'].length > 0 ? 1 : 0) : shiftData.length, // Jika keduanya ada, span ke total baris
                                              className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-r border-gray-200 text-center align-top" // align-top agar sejajar dengan baris pertama
                                          }, day)
                                      ) : null,
                                      // Kolom Tanggal: Jika shift 1 kosong tapi shift 2 ada, tampilkan di baris pertama shift 2
                                      index === 0 && shiftName === 'Shift 2' && !hasShift1Data ? (
                                          React.createElement('td', {
                                              key: 'date-cell',
                                              rowSpan: 1, // Hanya span 1 baris karena shift 1 kosong
                                              className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-r border-gray-200 text-center align-top"
                                          }, day)
                                      ) : null,
                                      // Kolom Shift: selalu tampilkan
                                      React.createElement('td', {
                                          key: `shift-cell-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, shiftName),
                                      // Kolom-kolom data lainnya
                                      React.createElement('td', {
                                          key: `line-name-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-blue-100"
                                      }, item.line_name),
                                      React.createElement('td', {
                                          key: `pg-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-blue-100"
                                      }, item.pg),
                                      React.createElement('td', {
                                          key: `produksi-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                      }, item.total_produced),
                                      React.createElement('td', {
                                          key: `op-in-line-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.manpower), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `duration-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                      }, durationMenit), // Gunakan nilai yang dibulatkan
                                      React.createElement('td', {
                                          key: `loading-time-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                      }, loadingTimeMenit), // Gunakan loading_time_calc yang dibulatkan
                                      React.createElement('td', {
                                          key: `op-bantuan-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.manpower_help), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `loading-time-bantuan-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.loading_time_manpower_help), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `freq-perbaikan-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.machine_fault_preq), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `perbaikan-mesin-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.machine_fault_duration), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `dangae-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.dangae), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `quality-check-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.quality_check), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `lain-lain-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.another), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `kaizen-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.kaizen), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `fives-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, item.five_s), // Gunakan nilai dari database
                                      React.createElement('td', {
                                          key: `rincian-in-line-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, Math.round(rincianInLine)), // Gunakan hasil perhitungan, dibulatkan
                                      React.createElement('td', {
                                          key: `rincian-bantuan-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, Math.round(rincianBantuan)), // Gunakan hasil perhitungan, dibulatkan
                                      React.createElement('td', {
                                          key: `rincian-5s-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, Math.round(rincian5S)), // Gunakan hasil perhitungan, dibulatkan
                                      React.createElement('td', {
                                          key: `sigma-manhour-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, Math.round(sigmaManhour)), // Gunakan hasil perhitungan, dibulatkan
                                      React.createElement('td', {
                                          key: `manhour-per-pcs-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, Math.round(manhourPerPcs)), // Gunakan hasil perhitungan, dibulatkan
                                      React.createElement('td', {
                                          key: `pe-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, Math.round(pe)), // Gunakan hasil perhitungan, dibulatkan
                                      React.createElement('td', {
                                          key: `action-${shiftName}-${index}`,
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      },
                                          React.createElement('button', {
                                              onClick: () => handleOpenEditModal(item),
                                              className: "text-blue-600 hover:text-blue-900 mr-2"
                                          }, 'Edit'),
                                          React.createElement('button', {
                                              onClick: () => handleDelete(item.idPrimary),
                                              className: "text-red-600 hover:text-red-900"
                                          }, 'Delete')
                                      )
                                  ];
                                  const filteredRowCells = rowCells.filter(cell => cell !== null);
                                  rows.push(React.createElement('tr', { key: rowKey, className: rowClass }, filteredRowCells));
                              });
                          } else {
                              const rowKey = `${dateKey}-${shiftName}-empty`;
                              const rowClass = shiftName === 'Shift 1' ? "border-t-2 border-gray-300" : ""; // Border jika ini Shift 1

                              const rowCells = [
                                  // Kolom Tanggal: tampilkan hanya jika shift ini adalah Shift 1 (dan kosong) atau jika shift ini adalah Shift 2 dan Shift 1 kosong
                                  (shiftName === 'Shift 1' || (!hasShift1Data && shiftName === 'Shift 2')) ? (
                                      React.createElement('td', {
                                          key: 'date-cell-empty',
                                          rowSpan: shiftName === 'Shift 1' && hasShift2Data ? 1 : (shiftName === 'Shift 2' && hasShift1Data ? 1 : 1), // Karena ini baris kosong, span hanya 1
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-r border-gray-200 text-center"
                                      }, day)
                                  ) : null,
                                  React.createElement('td', {
                                      key: `shift-cell-empty-${shiftName}`,
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border text-center"
                                  }, shiftName),
                                  React.createElement('td', {
                                      key: 'line-name-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-blue-100"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'pg-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-blue-100"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'produksi-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'op-in-line-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'duration-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'loading-time-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'op-bantuan-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'loading-time-bantuan-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'freq-perbaikan-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'perbaikan-mesin-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'dangae-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'quality-check-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'lain-lain-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'kaizen-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '10'),
                                  React.createElement('td', {
                                      key: 'fives-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '10'),
                                  React.createElement('td', {
                                      key: 'rincian-in-line-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'rincian-bantuan-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'rincian-5s-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'sigma-manhour-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'manhour-per-pcs-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'pe-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  }, '-'),
                                  React.createElement('td', {
                                      key: 'action-empty',
                                      className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                  },
                                      React.createElement('button', {
                                          onClick: handleOpenCreateModal,
                                          className: "text-blue-600 hover:text-blue-900 mr-2"
                                      }, 'Add'),
                                      '-'
                                  )
                              ];

                              const filteredRowCells = rowCells.filter(cell => cell !== null);
                              rows.push(React.createElement('tr', { key: rowKey, className: rowClass + " bg-red-50" }, filteredRowCells)); // Tambahkan bg-red-50 untuk baris kosong
                          }
                      });

                      return rows;
                      })}
                  </tbody>
                </table>
            </div>



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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Line ID</label>
                          <input
                            type="text"
                            name="line_id"
                            value={formData.line_id}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PG</label>
                          <input
                            type="text"
                            name="pg"
                            value={formData.pg}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Line Name</label>
                          <input
                            type="text"
                            name="line_name"
                            value={formData.line_name}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input
                            type="text"
                            name="name_product"
                            value={formData.name_product}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                          <input
                            type="text"
                            name="target"
                            value={formData.target}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Actual</label>
                          <input
                            type="text"
                            name="actual"
                            value={formData.actual}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Loading Time</label>
                          <input
                            type="text"
                            name="loading_time"
                            value={formData.loading_time}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Efficiency</label>
                          <input
                            type="text"
                            name="efficiency"
                            value={formData.efficiency}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delay</label>
                          <input
                            type="text"
                            name="delay"
                            value={formData.delay}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Time</label>
                          <input
                            type="text"
                            name="cycle_time"
                            value={formData.cycle_time}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="">Select Status</option>
                            <option value="START">START</option>
                            <option value="STOP">STOP</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time Trouble</label>
                          <input
                            type="text"
                            name="time_trouble"
                            value={formData.time_trouble}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time Trouble Quality</label>
                          <input
                            type="text"
                            name="time_trouble_quality"
                            value={formData.time_trouble_quality}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Andon</label>
                          <input
                            type="text"
                            name="andon"
                            value={formData.andon}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delta Time</label>
                          <input
                            type="text"
                            name="delta_time"
                            value={formData.delta_time}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                          <input
                            type="number"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                          <input
                            type="text"
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                          <select
                            name="shift"
                            value={formData.shift}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="">Select Shift</option>
                            <option value="Shift 1">Shift 1</option>
                            <option value="Shift 2">Shift 2</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time Only</label>
                          <input
                            type="time"
                            name="time_only"
                            value={formData.time_only}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Loading Time Server (menit)</label>
                          <input
                            type="text"
                            name="loading_time_server"
                            value={formData.loading_time_server}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total Break (menit)</label>
                          <input
                            type="number"
                            step="0.01"
                            name="total_break"
                            value={formData.total_break}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        {/* Kolom baru dari database */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Σ OP (In Line) ①</label>
                          <input
                            type="text"
                            name="manpower"
                            value={formData.manpower}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Opr Bantuan ④</label>
                          <input
                            type="text"
                            name="manpower_help"
                            value={formData.manpower_help}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">LT Opr Bantuan (Menit) ⑤</label>
                          <input
                            type="text"
                            name="loading_time_manpower_help"
                            value={formData.loading_time_manpower_help}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">#Freq Perbaikan Mesin (kali)</label>
                          <input
                            type="text"
                            name="machine_fault_preq"
                            value={formData.machine_fault_preq}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Durasi Perbaikan Mesin (menit)</label>
                          <input
                            type="text"
                            name="machine_fault_duration"
                            value={formData.machine_fault_duration}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quality Check (Menit)</label>
                          <input
                            type="text"
                            name="quality_check"
                            value={formData.quality_check}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lain-lain (Menit)</label>
                          <input
                            type="text"
                            name="another"
                            value={formData.another}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kaizen (menit) Out LT</label>
                          <input
                            type="text"
                            name="kaizen"
                            value={formData.kaizen}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">5S (menit) ⑥</label>
                          <input
                            type="text"
                            name="five_s"
                            value={formData.five_s}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rincian In Line (⑦=①+②)</label>
                          <input
                            type="text"
                            name="manhour_in_line"
                            value={formData.manhour_in_line}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rincian Bantuan (⑧=④+⑤)</label>
                          <input
                            type="text"
                            name="manhour_helper"
                            value={formData.manhour_helper}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rincian 5S ⑨</label>
                          <input
                            type="text"
                            name="manhour_five_s"
                            value={formData.manhour_five_s}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Σ Manhour (manmnt)</label>
                          <input
                            type="text"
                            name="total_manhour"
                            value={formData.total_manhour}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Manhour (man.menit / pcs)</label>
                          <input
                            type="text"
                            name="manhour_man_minutes_per_pcs"
                            value={formData.manhour_man_minutes_per_pcs}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PE (%)</label>
                          <input
                            type="text"
                            name="PE"
                            value={formData.PE}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dangae</label>
                          <input
                            type="text"
                            name="dangae"
                            value={formData.dangae}
                            onChange={handleChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
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