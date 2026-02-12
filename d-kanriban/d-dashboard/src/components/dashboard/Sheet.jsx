// src/components/dashboard/Sheet.jsx
import React, { useState, useEffect } from 'react';

// Ganti dengan Web App URL Anda dari Google Apps Script (Deployed as Web App)
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbymLr4xW5hniCzyetQwXSr9MYzD0wUJbzCEsMsSV--upsR7j8yd8CvofOX408iesH0o/exec';

const Sheet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${WEB_APP_URL}?sts=read`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        // Cek apakah respons berisi error dari Apps Script
        if (text.includes('Error') || text === 'No Parameters') {
          throw new Error(text);
        }

        // Data dikirim sebagai string CSV (koma terpisah)
        const values = text.split(',').map(val => {
          // Coba parse angka jika memungkinkan
          if (!isNaN(val) && val.trim() !== '') {
            return parseFloat(val);
          }
          return val;
        });

        // Mapping sesuai urutan dari J3:X3 (tanpa idPrimary)
        const [
          line_id,
          pg,
          line_name,
          name_product,
          target,
          actual,
          loading_time,
          efficiency,
          delay,
          cycle_time,
          status,
          time_trouble,
          time_trouble_quality,
          andon,
          created_at
        ] = values;

        setData({
          line_id,
          pg,
          line_name,
          name_product,
          target,
          actual,
          loading_time,
          efficiency,
          delay,
          cycle_time,
          status,
          time_trouble,
          time_trouble_quality,
          andon,
          created_at
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Gagal mengambil data dari Google Sheets');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Opsional: polling setiap 10 detik
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4">Loading latest production data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Latest Production Line Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataItem label="Line ID" value={data.line_id} />
        <DataItem label="PG" value={data.pg} />
        <DataItem label="Line Name" value={data.line_name} />
        <DataItem label="Product" value={data.name_product} />
        <DataItem label="Target" value={data.target} />
        <DataItem label="Actual" value={data.actual} />
        <DataItem label="Loading Time (min)" value={data.loading_time} />
        <DataItem label="Efficiency (%)" value={`${data.efficiency}%`} />
        <DataItem label="Delay (min)" value={data.delay} />
        <DataItem label="Cycle Time (sec)" value={data.cycle_time} />
        <DataItem label="Status" value={data.status} />
        <DataItem label="Time Trouble (min)" value={data.time_trouble} />
        <DataItem label="Quality Trouble (min)" value={data.time_trouble_quality} />
        <DataItem label="Andon" value={data.andon === 1 ? 'Active' : 'Inactive'} />
        <DataItem label="Updated At" value={data.created_at} colSpan="md:col-span-2" />
      </div>
    </div>
  );
};

// Komponen pembantu untuk menampilkan pasangan label-nilai
const DataItem = ({ label, value, colSpan = '' }) => (
  <div className={`flex flex-col ${colSpan}`}>
    <span className="text-sm text-gray-500">{label}</span>
    <span className="font-medium">{value !== undefined && value !== null ? value : '–'}</span>
  </div>
);

export default Sheet;