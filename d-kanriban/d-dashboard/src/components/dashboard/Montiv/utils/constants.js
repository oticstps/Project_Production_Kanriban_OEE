export const productionLines = [
  { id: 'common_rail_1_filtered', name: 'CR1', category: 'PG' },
  { id: 'common_rail_2_filtered', name: 'CR2', category: 'PG' },
  { id: 'common_rail_3_filtered', name: 'CR3', category: 'PG' },
  { id: 'common_rail_4_filtered', name: 'CR4', category: 'PG' },
  { id: 'common_rail_5_filtered', name: 'CR5', category: 'PG' },
  { id: 'common_rail_6_filtered', name: 'CR6', category: 'PG' },
  { id: 'common_rail_7_filtered', name: 'CR7', category: 'PG' },
  { id: 'common_rail_8_filtered', name: 'CR8', category: 'PG' },
  { id: 'common_rail_9_filtered', name: 'CR9', category: 'PG' },
  { id: 'common_rail_10_filtered', name: 'CR10', category: 'PG' },
  { id: 'common_rail_11_filtered', name: 'CR11', category: 'PG' },
  { id: 'common_rail_12_filtered', name: 'CR12', category: 'PG' }
];

export const metricColors = {
  actual_pcs: '#1f77b4',    // Biru
  target: '#ff7f0e',        // Oranye
  efficiency: '#2ca02c',    // Hijau
  loading_time: '#d62728',  // Merah
  cycle_time: '#9467bd',    // Ungu
  actual_ct: '#8c564b'      // Coklat
};

// src/pages/Montiv/utils/constants.js
export const productionGroups = [
  { id: 'pg_1', name: 'PG-1' },
  { id: 'pg_2_1', name: 'PG 2-1' },
  { id: 'pg_2_2', name: 'PG 2-2' },
  { id: 'pg_2_3', name: 'PG 2-3' },
  { id: 'pg_3_1', name: 'PG 3-1' },
  { id: 'pg_3_2', name: 'PG 3-2' },
];

export const pd1Data = {
  title: 'PD-1',
  target: 93,
  months: ['Base', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
  actualProductivityHours: [73.06, 7.964, 7.618, 6.764, 6.633, 7.620, 7.500, 7.200, 7.300, 7.400, 7.100, 7.000, 7.650],
  targetProductivityHours: [73.06, 7.422, 7.378, 6.333, 6.029, 7.100, 7.000, 6.900, 7.100, 7.200, 6.950, 6.800, 7.500],
  productivityPercent: [100, 93.19, 96.85, 93.62, 90.90, 93.19, 93.33, 95.83, 97.30, 97.22, 96.45, 94.12, 98.04],
  totalManHour: [20.94, 18.87, 19.91, 18.97, 18.54, 19.46, 19.30, 19.10, 19.25, 19.40, 19.00, 18.90, 19.60]
};

// ✅ Baru: Data Pareto
export const paretoData = [
  { name: 'HOUSING WATER SLE 1', value: 4.36 },
  { name: 'BALANCE SHAFT No.1 & 2', value: 3.73 },
  { name: 'INLET WATER 1H', value: 1.66 },
  { name: 'CONNECTOR', value: 1.65 },
  { name: 'RETAHER OIL SEAL INLET WATER 1H', value: 1.47 },
  { name: 'DRIVE GEAR & SPACER', value: 1.22 },
  { name: 'INSPECTION - PACKING DAM HOUSING - A', value: 1.11 },
  { name: 'INSPECTION - PACKING DAM HOUSING - C', value: 0.92 },
  { name: 'INSPECTION - PACKING DAM HOUSING - B', value: 0.87 },
  { name: 'INSPEC - COMMON SEAL', value: 0.84 },
  { name: 'PACKING COMBINA', value: 0.36 }
];

export const paretoTotal = 19.46;
