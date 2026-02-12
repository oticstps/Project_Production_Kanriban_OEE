import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';

const Test = () => {
  const [rows, setRows] = useState([
    { id: 1, start: '07:30', stop: '16:10' }
  ]);

  const calculateBreakTime = (start, stop) => {
    if (!start || !stop) return 0;
    
    const startTime = parseTime(start);
    const stopTime = parseTime(stop);
    
    if (startTime >= stopTime) return 0;
    
    const breaks = [
      { start: parseTime('09:20'), end: parseTime('09:30'), duration: 10 },
      { start: parseTime('12:00'), end: parseTime('12:40'), duration: 40 },
      { start: parseTime('14:20'), end: parseTime('14:30'), duration: 10 },
      { start: parseTime('16:10'), end: parseTime('16:30'), duration: 20 }
    ];
    
    let totalBreak = 0;
    breaks.forEach(breakPeriod => {
      if (startTime < breakPeriod.end && stopTime > breakPeriod.start) {
        const overlapStart = Math.max(startTime, breakPeriod.start);
        const overlapEnd = Math.min(stopTime, breakPeriod.end);
        totalBreak += overlapEnd - overlapStart;
      }
    });
    
    return totalBreak;
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const calculateRow = (row) => {
    if (!row.start || !row.stop) {
      return {
        actualDurationMin: 0,
        actualDurationHour: 0,
        breakTimeMin: 0,
        loadingTimeMin: 0,
        loadingTimeHour: 0
      };
    }

    const startMin = parseTime(row.start);
    const stopMin = parseTime(row.stop);
    const actualDurationMin = stopMin - startMin;
    const breakTimeMin = calculateBreakTime(row.start, row.stop);
    const loadingTimeMin = actualDurationMin - breakTimeMin;

    return {
      actualDurationMin,
      actualDurationHour: (actualDurationMin / 60).toFixed(2),
      breakTimeMin,
      loadingTimeMin,
      loadingTimeHour: (loadingTimeMin / 60).toFixed(2)
    };
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), start: '', stop: '' }]);
  };

  const deleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const downloadExcel = () => {
    let csv = 'Start,Stop,Aktual Durasi (menit),Aktual Durasi (jam),Loading Time (menit),Loading Time (jam),Jam Istirahat (menit)\n';
    
    rows.forEach(row => {
      const calc = calculateRow(row);
      csv += `${row.start},${row.stop},${calc.actualDurationMin},${calc.actualDurationHour},${calc.loadingTimeMin},${calc.loadingTimeHour},${calc.breakTimeMin}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'loading_time_calculator.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kalkulator Loading Time</h1>
          <p className="text-gray-600 mb-4">Perhitungan waktu kerja dengan pengurangan jam istirahat otomatis</p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Jam Istirahat:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
              <div>• 09:20 - 09:30 (10 menit)</div>
              <div>• 12:00 - 12:40 (40 menit)</div>
              <div>• 14:20 - 14:30 (10 menit)</div>
              <div>• 16:10 - 16:30 (20 menit)</div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={addRow}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Tambah Baris
            </button>
            <button
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={20} />
              Download CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Start</th>
                <th className="px-4 py-3 text-left">Stop</th>
                <th className="px-4 py-3 text-left">Aktual Durasi (menit)</th>
                <th className="px-4 py-3 text-left">Aktual Durasi (jam)</th>
                <th className="px-4 py-3 text-left">Jam Istirahat (menit)</th>
                <th className="px-4 py-3 text-left">Loading Time (menit)</th>
                <th className="px-4 py-3 text-left">Loading Time (jam)</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const calc = calculateRow(row);
                return (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={row.start}
                        onChange={(e) => updateRow(row.id, 'start', e.target.value)}
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={row.stop}
                        onChange={(e) => updateRow(row.id, 'stop', e.target.value)}
                        className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{calc.actualDurationMin}</td>
                    <td className="px-4 py-3 text-gray-600">{calc.actualDurationHour}</td>
                    <td className="px-4 py-3 font-semibold text-orange-600">{calc.breakTimeMin}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{calc.loadingTimeMin}</td>
                    <td className="px-4 py-3 text-green-600">{calc.loadingTimeHour}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteRow(row.id)}
                        disabled={rows.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-3">Rumus Excel:</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm font-mono">
            <p><strong>C2 (Aktual Durasi menit):</strong> =(B2-A2)*1440</p>
            <p><strong>D2 (Aktual Durasi jam):</strong> =C2/60</p>
            <p><strong>G2 (Jam Istirahat):</strong> =IF(AND(A2&lt;TIME(9,30,0), B2&gt;TIME(9,20,0)), (MIN(B2,TIME(9,30,0))-MAX(A2,TIME(9,20,0)))*1440, 0) + IF(AND(A2&lt;TIME(12,40,0), B2&gt;TIME(12,0,0)), (MIN(B2,TIME(12,40,0))-MAX(A2,TIME(12,0,0)))*1440, 0) + IF(AND(A2&lt;TIME(14,30,0), B2&gt;TIME(14,20,0)), (MIN(B2,TIME(14,30,0))-MAX(A2,TIME(14,20,0)))*1440, 0) + IF(AND(A2&lt;TIME(16,30,0), B2&gt;TIME(16,10,0)), (MIN(B2,TIME(16,30,0))-MAX(A2,TIME(16,10,0)))*1440, 0)</p>
            <p><strong>E2 (Loading Time menit):</strong> =C2-G2</p>
            <p><strong>F2 (Loading Time jam):</strong> =E2/60</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;