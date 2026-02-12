// src/pages/Manhour/utils/groupDataByHour.js

export const groupDataByHour = (data) => {
  const hourlyData = {};

  data.forEach((item) => {
    const date = new Date(item.created_at);
    const hourKey = `${date.getHours()}:00`; // Format HH:00

    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = {
        time: hourKey,
        actual: 0,
        target: 0,
        efficiency: [],
        loading_time: 0,
        cycle_time: 0,
        count: 0,
        product_name: item.name_product
      };
    }

    hourlyData[hourKey].actual += parseInt(item.actual || 0);
    hourlyData[hourKey].target += parseInt(item.target || 0);
    hourlyData[hourKey].loading_time += parseInt(item.loading_time || 0);
    hourlyData[hourKey].cycle_time += parseInt(item.cycle_time || 0);
    hourlyData[hourKey].efficiency.push(parseFloat(item.efficiency || 0));
    hourlyData[hourKey].count += 1;
  });

  // Hitung rata-rata efficiency
  Object.keys(hourlyData).forEach((key) => {
    const entry = hourlyData[key];
    const avgEfficiency = entry.efficiency.reduce((a, b) => a + b, 0) / entry.efficiency.length;
    entry.efficiency = Math.round(avgEfficiency * 100) / 100; // Dua desimal
  });

  return Object.values(hourlyData);
};