import { useState, useEffect } from 'react';
import { isBreakTime } from '../utils/isBreakTime';

export const useProductionData = (selectedLine) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductionData = async (lineId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://172.27.6.191:4000/all/table/${lineId}?page=1&limit=400`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (!result.data || result.data.length === 0) throw new Error('No data available');
  
      const sortedData = [...result.data].sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
  
      const formattedData = sortedData.map((item, index, array) => {
        const createdAt = new Date(item.created_at);
        let actual_ct = null;
      
        if (index > 0) {
          const prevItem = array[index - 1];
          const prevCreatedAt = new Date(prevItem.created_at);
      
          const currentActual = parseInt(item.actual) || 0;
          const prevActual = parseInt(prevItem.actual) || 0;
      
          if (currentActual - prevActual === 1) {
            const diffMs = createdAt.getTime() - prevCreatedAt.getTime();
            actual_ct = isBreakTime(createdAt) ? 0 : Math.round(diffMs / 1000);
          } else {
            actual_ct = parseInt(item.cycle_time)/10 || 0;
          }
        }
      
        return {
          ...item,
          time: createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          date: createdAt.toLocaleDateString('id-ID'),
          actual_pcs: parseInt(item.actual) || 0,
          target: parseInt(item.target) || 0,
          efficiency: parseInt(item.efficiency) / 10 || 0,
          loading_time: parseInt(item.loading_time) || 0,
          cycle_time: parseInt(item.cycle_time) / 10 || 0,
          delay: parseInt(item.delay) || 0,
          product_name: item.name_product,
          actual_ct
        };
      });
  
      setChartData(formattedData);
    } catch (err) {
      setError(`Gagal memuat data: ${err.message}`);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLine) {
      fetchProductionData(selectedLine);
    }
  }, [selectedLine]);

  return { chartData, loading, error, fetchProductionData };
};