// pages/KanribanManhour/hooks/useDeltaActualData.js
import { useEffect, useState } from 'react';

const useDeltaActualData = (selectedLine) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = '';
        if (selectedLine.includes('common_rail_3')) {
          url = 'http://172.27.6.191:4000/api/cr3hourly';
        } else {
          // For non-cr3 lines, no data
          setData([]);
          setLoading(false);
          return;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === 'success') {
          // Filter data berdasarkan selectedLine jika ada field line
          const filteredData = result.data.filter(item => item.line === selectedLine || !item.line);
          setData(filteredData);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLine]);

  return { data, loading, error };
};

export default useDeltaActualData;