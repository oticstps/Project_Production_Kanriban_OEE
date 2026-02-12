// src/utils/groupDataByShiftSlot.js

import { getShiftAndSlot, isProductionSlot } from './shiftUtils';

export const groupDataByShiftSlot = (data) => {
  const grouped = {};

  data.forEach(item => {
    // Hanya proses data yang termasuk schedule atau overtime
    if (!isProductionSlot(item.created_at)) {
      return;
    }

    const { shift, slot, theme } = getShiftAndSlot(item.created_at);
    const key = `${shift} - ${slot} (${theme})`;
    
    if (!grouped[key]) {
      grouped[key] = {
        time: key,
        actual_pcs: 0,
        target: 0,
        efficiency: 0,
        loading_time: 0,
        cycle_time: 0,
        actual_ct: 0,
        count: 0
      };
    }
    
    // Akumulasi nilai untuk setiap metrik
    grouped[key].actual_pcs += parseInt(item.actual || 0);
    grouped[key].target += parseInt(item.target || 0);
    grouped[key].efficiency += parseFloat(item.efficiency || 0);
    grouped[key].loading_time += parseInt(item.loading_time || 0);
    grouped[key].cycle_time += parseInt(item.cycle_time || 0);
    
    // Hitung actual cycle time rata-rata (dalam detik)
    const actual = parseInt(item.actual || 0);
    const loadingTime = parseInt(item.loading_time || 0);
    if (actual > 0) {
      grouped[key].actual_ct += loadingTime / actual;
    }
    
    grouped[key].count += 1;
  });

  // Hitung rata-rata dan konversi ke array
  return Object.values(grouped).map(item => ({
    time: item.time,
    actual_pcs: Math.round(item.actual_pcs / item.count),
    target: Math.round(item.target / item.count),
    efficiency: parseFloat((item.efficiency / item.count).toFixed(2)),
    loading_time: Math.round(item.loading_time / item.count),
    cycle_time: Math.round(item.cycle_time / item.count),
    actual_ct: parseFloat((item.actual_ct / item.count).toFixed(2))
  }));
};