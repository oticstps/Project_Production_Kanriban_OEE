import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { Workbook } from 'exceljs'; // Impor Workbook dari exceljs


const Manhour = () => {
  const [data, setData] = useState([]);
  const [tahun, setTahun] = useState('2025');
  const [bulan, setBulan] = useState('11');
  const [lineProduksi, setLineProduksi] = useState('Common Rail 12');
  const [filteredData, setFilteredData] = useState([]);
  // State untuk CRUD
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
    total_break: ''
  });

  // Fungsi untuk menentukan apakah hari adalah Jumat
  const isFriday = (date) => {
    return date.getDay() === 5; // 5 = Jumat
  };

  // Fungsi untuk menghitung jam istirahat yang terjadi dalam periode waktu tertentu
  const calculateBreakTime = (start, end) => {
    const startDay = new Date(start);
    const endDay = new Date(end);
    
    let totalBreakTime = 0;
    
    // Jam istirahat Senin-Kamis dan Sabtu-Minggu
    const regularBreaks = [
      { start: "09:20", end: "09:30" },    // 10 menit
      { start: "12:00", end: "12:40" },    // 40 menit
      { start: "14:20", end: "14:30" },    // 10 menit
      { start: "16:10", end: "16:30" },    // 20 menit
    ];
    
    // Jam istirahat Jumat
    const fridayBreaks = [
      { start: "09:20", end: "09:30" },    // 10 menit
      { start: "11:40", end: "12:50" },    // 70 menit
      { start: "14:50", end: "15:00" },    // 10 menit
      { start: "16:40", end: "17:00" },    // 20 menit
    ];
    
    const breaks = isFriday(startDay) ? fridayBreaks : regularBreaks;
    
    // Konversi waktu ke objek Date untuk hari yang sama
    const convertTimeToDate = (timeStr, baseDate) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date(baseDate);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };
    
    // Cek untuk setiap break time
    for (const br of breaks) {
      const breakStart = convertTimeToDate(br.start, startDay);
      const breakEnd = convertTimeToDate(br.end, startDay);
      
      // Jika break terjadi di hari yang sama dengan periode
      if (breakStart >= startDay && breakEnd <= endDay) {
        if (start <= breakEnd && end >= breakStart) {
          // Hitung overlap antara periode dan break
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

  // Fungsi untuk mendapatkan endpoint API berdasarkan nama line produksi
  const getApiEndpoint = (lineName) => {
    // Ambil nomor dari nama line (misalnya, "Common Rail 12" -> "12")
    const match = lineName.match(/Common Rail\s+(\d+)/i);
    if (match) {
      const lineNum = match[1];
      // Format endpoint: http://172.27.6.191:4000/apiCr{num}/cr{num}
      return `http://172.27.6.191:4000/apiCr${lineNum}/cr${lineNum}`;
    }
    // Fallback jika tidak cocok, gunakan default
    return 'http://172.27.6.191:4000/apiCr12/cr12/';
  };

  // Fungsi untuk mengambil data dari API
  const fetchDataFromAPI = async () => {
    // Ambil endpoint berdasarkan line produksi yang dipilih
    const apiUrl = getApiEndpoint(lineProduksi);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === 'success') {
        // Proses data dari API untuk mencocokkan format mockData sebelumnya
        // Kita akan menggunakan loading_time_server dan delta_time untuk menghitung durasi
        const processedData = result.data.map(item => {
          // Parsing delta_time untuk mendapatkan durasi dalam menit
          // Format: "X pcs dalam Y menit"
          let durationMinutes = 0;
          if (item.delta_time && typeof item.delta_time === 'string') {
            const match = item.delta_time.match(/dalam\s+(\d+(?:\.\d+)?)\s+menit/);
            if (match) {
              durationMinutes = parseFloat(match[1]);
            }
          }
          
          // Parsing loading_time_server untuk mendapatkan loading time
          // Format: "X menit"
          let loadingTime = 0;
          if (item.loading_time_server && typeof item.loading_time_server === 'string') {
            const match = item.loading_time_server.match(/(\d+(?:\.\d+)?)\s+menit/);
            if (match) {
              loadingTime = parseFloat(match[1]);
            }
          }
          
          // Parsing created_at untuk mendapatkan start_time dan end_time
          // Kita asumsikan start_time adalah created_at - duration
          const endTime = new Date(item.created_at);
          const startTime = new Date(endTime.getTime() - (durationMinutes * 60 * 1000));
          
          // Hitung waktu istirahat berdasarkan durasi
          const breakTime = calculateBreakTime(startTime, endTime);
          
          // Jika loading_time_server tersedia, gunakan itu, jika tidak hitung dari durasi - break - 5S
          const calculatedLT = item.loading_time_server ? loadingTime : Math.max(0, durationMinutes - breakTime - 10);
          
          return {
            idPrimary: item.idPrimary,
            cycle_number: item.idPrimary, // Gunakan idPrimary sebagai cycle_number
            line_id: item.line_id,
            pg: item.pg,
            line_name: item.line_name,
            product_name: item.name_product,
            target: item.target,
            actual: item.actual,
            loading_time: item.loading_time,
            efficiency: item.efficiency,
            delay: item.delay,
            cycle_time: item.cycle_time,
            status: item.status,
            time_trouble: item.time_trouble,
            time_trouble_quality: item.time_trouble_quality,
            andon: item.andon,
            shift: item.shift,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            duration_minutes: durationMinutes,
            start_actual: 0, // Tidak tersedia di API, gunakan placeholder
            end_actual: parseInt(item.actual) || 0, // Gunakan actual sebagai end_actual
            total_produced: parseInt(item.actual) || 0, // Gunakan actual sebagai total_produced
            record_count: 0, // Tidak tersedia di API, gunakan placeholder
            created_at: item.created_at,
            loading_time_calc: calculatedLT, // Gunakan nama yang berbeda untuk menghindari konflik
            break_time: breakTime,
            delta_time: item.delta_time,
            year: item.year,
            month: item.month,
            day: item.day,
            time_only: item.time_only,
            loading_time_server: item.loading_time_server,
            total_break: item.total_break,
          };
        });
        
        setData(processedData);
      } else {
        console.error('API error:', result.message);
      }
    } catch (error) {
      console.error('Error fetching data from', apiUrl, ':', error);
    }
  };

  useEffect(() => {
    // Ambil data dari API berdasarkan line produksi
    fetchDataFromAPI();
  }, [lineProduksi]); // Tambahkan lineProduksi ke dependency array agar data diambil ulang saat line berubah

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter data berdasarkan tahun, bulan, dan line produksi
  useEffect(() => {
    const filtered = data.filter(item => {
      const date = new Date(item.start_time);
      const itemTahun = date.getFullYear().toString();
      const itemBulan = (date.getMonth() + 1).toString().padStart(2, '0');
      const itemLine = item.line_name;
      
      return itemTahun === tahun && 
             itemBulan === bulan && 
             itemLine === lineProduksi;
    });
    
    setFilteredData(filtered);
  }, [tahun, bulan, lineProduksi, data]);

  // Generate tanggal dalam bulan yang dipilih
  const generateTanggalBulan = () => {
    const tanggal = [];
    const daysInMonth = new Date(tahun, bulan, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      tanggal.push(i);
    }
    
    return tanggal;
  };

  // Group data by date and shift
  const groupByDateAndShift = (items) => {
    const grouped = {};
    
    // Initialize all dates with empty arrays for both shifts
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

  // Fungsi untuk mengekspor data ke Excel menggunakan exceljs
  const exportToExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Manhour Data');

    // Definisikan header
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
                        worksheet.addRow([
                            day,
                            item.shift,
                            item.total_produced,
                            '-', // Nilai placeholder
                            item.duration_minutes,
                            item.loading_time_calc, // Gunakan loading_time_calc
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '10', // Nilai konstan
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-', // Nilai placeholder
                            '-'  // Nilai placeholder
                        ]);
                    });
                } else {
                    // Jika tidak ada data untuk shift ini
                    worksheet.addRow([
                        day,
                        shiftName,
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
                        '-',
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
                    '-',
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
    a.download = `Manhour_${lineProduksi}_${tahun}_${bulan}.xlsx`;
    a.click();
    URL.revokeObjectURL(url); // Membersihkan URL object setelah digunakan
  };

  // Fungsi CRUD
  const handleOpenCreateModal = () => {
    setCurrentItem(null);
    setFormData({
      line_id: '',
      pg: '',
      line_name: lineProduksi, // Isi otomatis dengan line yang dipilih
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
      year: tahun, // Isi otomatis dengan tahun yang dipilih
      month: bulan, // Isi otomatis dengan bulan yang dipilih
      day: '',
      shift: '',
      time_only: '',
      loading_time_server: '',
      total_break: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
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
      total_break: item.total_break || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const apiUrl = getApiEndpoint(lineProduksi);
        const response = await fetch(`${apiUrl}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || "Failed to delete data");
        }
        // Perlu mengambil data terbaru setelah penghapusan
        await fetchDataFromAPI();
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
      const apiUrl = getApiEndpoint(lineProduksi);
      let response;
      if (currentItem) {
        // Update
        response = await fetch(`${apiUrl}/${currentItem.idPrimary}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            name_product: formData.name_product, // Sesuaikan nama field
          }),
        });
      } else {
        // Create
        response = await fetch(`${apiUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            name_product: formData.name_product, // Sesuaikan nama field
          }),
        });
      }

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to save data");
      }

      const result = await response.json();
      console.log("Data saved successfully", result);

      // Panggil fetchData untuk mengambil data terbaru dari server
      await fetchDataFromAPI();

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
                {/* Tombol Export dan Create */}
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
            
            {/* Filter Section */}
            <div className="mb-3 p-2 bg-gray-50 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Line Produksi</label>
                      <select 
                        value={lineProduksi} 
                        onChange={(e) => setLineProduksi(e.target.value)}
                        className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Common Rail 12">Common Rail 12</option>
                        <option value="Common Rail 11">Common Rail 11</option>
                        <option value="Common Rail 10">Common Rail 10</option>
                        <option value="Common Rail 9">Common Rail 9</option>
                        <option value="Common Rail 8">Common Rail 8</option>
                        <option value="Common Rail 7">Common Rail 7</option>
                        <option value="Common Rail 6">Common Rail 6</option>
                        <option value="Common Rail 5">Common Rail 5</option>
                        <option value="Common Rail 4">Common Rail 4</option>
                        <option value="Common Rail 3">Common Rail 3</option>
                        <option value="Common Rail 2">Common Rail 2</option>
                        <option value="Common Rail 1">Common Rail 1</option>
                      </select>
                  </div>
                </div>
            </div>

            {/* Scrollable container */}
            <div className="bg-white rounded-lg shadow overflow-auto max-h-[65vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-9">TGL</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-9">Shift</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">Σ Produksi (pcs) A</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Σ OP (In Line) ①</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">Duration (Menit) ②</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">LT (Menit) ③</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Opr Bantuan ④</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">LT Opr Bantuan (Menit) ⑤</th>
                        <th colSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border w-18">Perbaikan Mesin (Menit)</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Dangae</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">Quality Check (Menit)</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Lain-lain (Menit)</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">Kaizen (menit) Out LT</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-12">5S (menit) ⑥</th>
                        <th colSpan="3" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border w-18">Rincian Manhour (menit)</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-orange-200">Σ Manhour (manmnt)</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-orange-200">Manhour (man.menit / pcs)</th>
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-12">PE (%)</th>
                        {/* Kolom CRUD */}
                        <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-purple-200">Action</th>
                      </tr>
                      <tr>
                        <th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">#Freq (kali)</th>
                        <th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">Perbaikan Mesin</th>
                        <th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">In Line (⑦=①+②)</th>
                        <th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">Bantuan (⑧=④+⑤)</th>
                        <th className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-10">5S ⑨</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {generateTanggalBulan().map(day => {
                      const dateKey = `${tahun}-${bulan}-${day.toString().padStart(2, '0')}`;
                      const dayData = groupedData[dateKey];

                      if (!dayData || (dayData['Shift 1'].length === 0 && dayData['Shift 2'].length === 0)) {
                          return (
                          <React.Fragment key={dateKey}>
                              <tr className="bg-red-50">
                                  <td rowSpan="2" className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border text-center">{day}</td>
                                  <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">Shift 1</td>
                                  <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border" colSpan="15">Tidak ada data</td>
                                  <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td>
                              </tr>
                              <tr className="bg-red-50">
                                  <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">Shift 2</td>
                                  <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border" colSpan="15">Tidak ada data</td>
                                  <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border">-</td>
                              </tr>
                          </React.Fragment>
                          );
                      }

                      const allShifts = ['Shift 1', 'Shift 2'];
                      const rows = [];
                      allShifts.forEach(shiftName => {
                          const shiftData = dayData[shiftName];
                          if (shiftData && shiftData.length > 0) {
                              shiftData.forEach((item, index) => {
                                  const rowKey = `${dateKey}-${shiftName}-${index}`;
                                  const rowClass = index === 0 && shiftName === 'Shift 1' ? "border-t-2 border-gray-300" : "";

                                  const rowCells = [];

                                  if (index === 0) {
                                      rowCells.push(
                                          React.createElement('td', {
                                              key: 'date-cell',
                                              rowSpan: shiftData.length,
                                              className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-r border-gray-200 text-center"
                                          }, day)
                                      );
                                      rowCells.push(
                                          React.createElement('td', {
                                              key: 'shift-cell',
                                              rowSpan: shiftData.length,
                                              className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-r border-gray-200 text-center"
                                          }, shiftName)
                                      );
                                  }

                                  if (index === 0 || shiftName !== 'Shift 1') {
                                    rowCells.push(
                                    React.createElement('td', {
                                        key: 'produksi',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                    }, item.total_produced),
                                    React.createElement('td', {
                                        key: 'op-in-line',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'duration',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                    }, item.duration_minutes),
                                    React.createElement('td', {
                                        key: 'loading-time',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                    }, item.loading_time_calc),
                                    React.createElement('td', {
                                        key: 'op-bantuan',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'loading-time-bantuan',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'freq-perbaikan',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'perbaikan-mesin',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'dangae',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'quality-check',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'lain-lain',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'kaizen',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'fives',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '10'),
                                    React.createElement('td', {
                                        key: 'rincian-in-line',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'rincian-bantuan',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'rincian-5s',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'sigma-manhour',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'manhour-per-pcs',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    React.createElement('td', {
                                        key: 'pe',
                                        className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                    }, '-'),
                                    // Kolom CRUD
                                    React.createElement('td', {
                                        key: 'action',
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
                                    );
                                  }

                                  rows.push(React.createElement('tr', { key: rowKey, className: rowClass }, rowCells));
                              });
                          } else {
                              const rowKey = `${dateKey}-${shiftName}-empty`;
                              const rowClass = shiftName === 'Shift 1' ? "border-t-2 border-gray-300" : "";
                              rows.push(
                                  React.createElement('tr', { key: rowKey, className: rowClass }, [
                                      React.createElement('td', {
                                          key: 'date-cell',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border text-center"
                                      }, day),
                                      React.createElement('td', {
                                          key: 'shift-cell',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border text-center"
                                      }, shiftName),
                                      React.createElement('td', {
                                          key: 'produksi',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'op-in-line',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'duration',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'loading-time',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center bg-teal-100"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'op-bantuan',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'loading-time-bantuan',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'freq-perbaikan',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'perbaikan-mesin',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'dangae',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'quality-check',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'lain-lain',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'kaizen',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'fives',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '10'),
                                      React.createElement('td', {
                                          key: 'rincian-in-line',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'rincian-bantuan',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'rincian-5s',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'sigma-manhour',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'manhour-per-pcs',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      React.createElement('td', {
                                          key: 'pe',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      }, '-'),
                                      // Kolom CRUD
                                      React.createElement('td', {
                                          key: 'action-empty',
                                          className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                                      },
                                          React.createElement('button', {
                                              onClick: handleOpenCreateModal, // Bisa juga buat tombol add spesifik
                                              className: "text-blue-600 hover:text-blue-900 mr-2"
                                          }, 'Add'),
                                          '-'
                                      )
                                  ])
                              );
                          }
                      });

                      return rows;
                      })}
                  </tbody>
                </table>
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Loading Time Server</label>
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
    </ Layout > 
  );
};

export default Manhour;
