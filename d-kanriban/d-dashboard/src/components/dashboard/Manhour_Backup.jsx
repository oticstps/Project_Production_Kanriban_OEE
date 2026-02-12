import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { Workbook } from 'exceljs'; // Impor Workbook dari exceljs
import mockData from './data/data';


const Manhour = () => {
  const [data, setData] = useState([]);
  const [tahun, setTahun] = useState('2025');
  const [bulan, setBulan] = useState('09');
  const [lineProduksi, setLineProduksi] = useState('Common Rail 3');
  const [filteredData, setFilteredData] = useState([]);

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

  useEffect(() => {
    // Simulasi data dari API










    
    const mockData = [
      {
          "idPrimary": 21,
          "cycle_number": 21,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-25T00:20:20.000Z",
          "end_time": "2025-09-25T12:01:22.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 162,
          "total_produced": 160,
          "record_count": 117,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 20,
          "cycle_number": 20,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-24T00:21:10.000Z",
          "end_time": "2025-09-24T12:01:21.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 216,
          "total_produced": 215,
          "record_count": 169,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 19,
          "cycle_number": 19,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-23T00:25:41.000Z",
          "end_time": "2025-09-23T12:01:19.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 191,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 18,
          "cycle_number": 18,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-22T00:26:51.000Z",
          "end_time": "2025-09-22T09:31:17.000Z",
          "duration_minutes": 544, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 186,
          "total_produced": 184,
          "record_count": 148,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 17,
          "cycle_number": 17,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-19T00:16:09.000Z",
          "end_time": "2025-09-19T12:01:13.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 205,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 16,
          "cycle_number": 16,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-18T00:17:27.000Z",
          "end_time": "2025-09-18T12:01:11.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 252,
          "total_produced": 249,
          "record_count": 210,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 15,
          "cycle_number": 15,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-17T00:18:18.000Z",
          "end_time": "2025-09-17T12:01:10.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 240,
          "total_produced": 237,
          "record_count": 200,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 14,
          "cycle_number": 14,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-16T00:19:38.000Z",
          "end_time": "2025-09-16T12:01:09.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 277,
          "total_produced": 275,
          "record_count": 225,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 13,
          "cycle_number": 13,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-15T01:00:55.000Z",
          "end_time": "2025-09-15T12:01:07.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 175,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 12,
          "cycle_number": 12,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-12T10:42:14.000Z",
          "end_time": "2025-09-12T12:01:02.000Z",
          "duration_minutes": 78, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 246,
          "total_produced": 244,
          "record_count": 29,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 11,
          "cycle_number": 11,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-11T11:01:31.000Z",
          "end_time": "2025-09-12T10:40:54.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 246,
          "total_produced": 245,
          "record_count": 195,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 10,
          "cycle_number": 10,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-11T00:23:59.000Z",
          "end_time": "2025-09-11T09:30:17.000Z",
          "duration_minutes": 546, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 246,
          "total_produced": 243,
          "record_count": 184,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 9,
          "cycle_number": 9,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-10T00:21:29.000Z",
          "end_time": "2025-09-10T12:00:10.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 246,
          "total_produced": 244,
          "record_count": 200,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 8,
          "cycle_number": 8,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-08T11:31:49.000Z",
          "end_time": "2025-09-09T12:00:15.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 246,
          "total_produced": 244,
          "record_count": 229,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 7,
          "cycle_number": 7,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-08T00:42:49.000Z",
          "end_time": "2025-09-08T10:43:30.000Z",
          "duration_minutes": 600, // Akan dihitung ulang
          "start_actual": 4,
          "end_actual": 259,
          "total_produced": 255,
          "record_count": 193,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 6,
          "cycle_number": 6,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-04T00:19:50.000Z",
          "end_time": "2025-09-04T10:21:24.000Z",
          "duration_minutes": 601, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 276,
          "total_produced": 273,
          "record_count": 232,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 5,
          "cycle_number": 5,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-03T00:26:29.000Z",
          "end_time": "2025-09-03T11:18:58.000Z",
          "duration_minutes": 652, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 247,
          "total_produced": 244,
          "record_count": 213,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 4,
          "cycle_number": 4,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-02T00:14:56.000Z",
          "end_time": "2025-09-02T11:20:56.000Z",
          "duration_minutes": 660, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 300,
          "total_produced": 297,
          "record_count": 255,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 3,
          "cycle_number": 3,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-09-01T00:23:04.000Z",
          "end_time": "2025-09-01T09:00:50.000Z",
          "duration_minutes": 517, // Akan dihitung ulang
          "start_actual": 2,
          "end_actual": 187,
          "total_produced": 185,
          "record_count": 171,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 2,
          "cycle_number": 2,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-08-29T00:16:19.000Z",
          "end_time": "2025-08-29T08:53:44.000Z",
          "duration_minutes": 493, // Akan dihitung ulang
          "start_actual": 3,
          "end_actual": 245,
          "total_produced": 242,
          "record_count": 185,
          "created_at": "2025-09-26T04:06:55.000Z"
      },
      {
          "idPrimary": 1,
          "cycle_number": 1,
          "line_id": "3",
          "line_name": "Common Rail 3",
          "product_name": "4N13",
          "shift": "Shift 1",
          "start_time": "2025-08-28T00:23:16.000Z",
          "end_time": "2025-08-28T08:37:15.000Z",
          "duration_minutes": 493, // Akan dihitung ulang
          "start_actual": 1,
          "end_actual": 271,
          "total_produced": 270,
          "record_count": 177,
          "created_at": "2025-09-26T04:06:55.000Z"
      }
    ];











    // Hitung ulang data dengan durasi dan LT
    const processedData = mockData.map(item => {
      const startTime = new Date(item.start_time);
      const endTime = new Date(item.end_time);
      
      // Hitung durasi dalam menit
      const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
      
      // Hitung waktu istirahat
      const breakTime = calculateBreakTime(startTime, endTime);
      
      // Hitung LT: durasi - istirahat - 5S (10 menit)
      const loadingTime = durationMinutes - breakTime - 10;
      
      return {
        ...item,
        duration_minutes: durationMinutes,
        loading_time: Math.max(0, loadingTime), // tidak negatif
        break_time: breakTime
      };
    });
    
    setData(processedData);
  }, []);

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

  // Group data by date
  const groupByDate = (items) => {
    const grouped = {};
    
    // Initialize all dates with empty arrays
    const tanggalBulan = generateTanggalBulan();
    tanggalBulan.forEach(date => {
      const dateStr = `${tahun}-${bulan}-${date.toString().padStart(2, '0')}`;
      grouped[dateStr] = [];
    });
    
    // Add items to their respective dates
    items.forEach(item => {
      const date = new Date(item.start_time);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      if (grouped[dateKey]) {
        grouped[dateKey].push(item);
      }
    });
    
    return grouped;
  };

  const groupedData = groupByDate(filteredData);

  // Fungsi untuk mengekspor data ke Excel menggunakan exceljs
  const exportToExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Manhour Data');

    // Definisikan header
    const headers = [
      'Tanggal',
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

        if (dayData && dayData.length > 0) {
            dayData.forEach((item, index) => {
                worksheet.addRow([
                    day,
                    item.total_produced,
                    '-', // Nilai placeholder
                    item.duration_minutes,
                    item.loading_time,
                    '-', // Nilai placeholder
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
            // Jika tidak ada data untuk hari itu
            worksheet.addRow([
                day,
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
                '-',
                '-'
            ]);
        }
    });

    // Atur lebar kolom (opsional)
    worksheet.columns = [
        { width: 10 }, // Tanggal
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

  return (
    <Layout>
        <div className="p-2">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-lg text-center font-bold text-gray-800">Kanriban Manhour</h1>
                {/* Tombol Export */}
                <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md text-sm transition duration-200"
                >
                    Export to Excel
                </button>
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
                    {/* <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">Group</th> */}
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">Σ Produksi (pcs) A</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Σ OP (In Line) ①</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">Duration (Menit) ②</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-teal-400">LT (Menit) ③</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Opr Bantuan ④</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">LT Opr Bantuan (Menit) ⑤</th>

                    {/* Perbaikan Mesin (Menit) - subkolom */}
                    <th colSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border w-18">Perbaikan Mesin (Menit)</th>

                    {/* Dangae - Ditempatkan sebelum Quality Check */}
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Dangae</th>

                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">Quality Check (Menit)</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-14">Lain-lain (Menit)</th>

                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18">Kaizen (menit) Out LT</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-12">5S (menit) ⑥</th>

                    {/* Rincian Manhour */}
                    <th colSpan="3" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider text-center border w-18">Rincian Manhour (menit)</th>

                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-orange-200">Σ Manhour (manmnt)</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-18 bg-orange-200">Manhour (man.menit / pcs)</th>
                    <th rowSpan="2" className="px-1.5 py-1.5 text-xs font-medium text-gray-900 uppercase tracking-wider border w-12">PE (%)</th>
                    </tr>

                    {/* Sub Header - Perbaikan Mesin dan Rincian Manhour */}
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

                    if (dayData.length === 0) {
                        // Jika tidak ada data untuk hari ini, tampilkan satu baris kosong
                        return (
                        <tr key={dateKey} className="bg-red-50">
                            <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border text-center">{day}</td>
                            <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 text-center border" colSpan="15">Tidak ada data</td>
                        </tr>
                        );
                    }

                    // Jika ada data, buat baris untuk setiap item
                    // Gunakan map dan kembalikan array baris
                    return dayData.map((item, index) => {
                        // Hanya baris pertama yang memiliki kolom tanggal (karena rowSpan)
                        const rowKey = `${item.idPrimary}-${index}`;
                        const rowClass = index === 0 ? "border-t-2 border-gray-300" : "";

                        // Buat array kolom
                        const rowCells = [];
                        
                        // Kolom tanggal hanya ditampilkan di baris pertama
                        if (index === 0) {
                        rowCells.push(
                            React.createElement('td', {
                            key: 'date-cell',
                            rowSpan: dayData.length,
                            className: "px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-r border-gray-200 text-center"
                            }, day)
                        );
                        }
                        // Tambahkan kolom data lainnya
                        rowCells.push(
                        // React.createElement('td', {
                        //   key: 'group',
                        //   className: "px-1.5 py-1.5 whitespace-nowrap text-xs text-gray-800 border text-center"
                        // }, item.line_name),
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
                        }, item.loading_time),
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
                        }, '-')
                        );

                        return React.createElement('tr', { key: rowKey, className: rowClass }, rowCells);
                    });
                    })}
                </tbody>
                </table>
            </div>
            
        </div>
    </ Layout > 
  );
};

export default Manhour;

