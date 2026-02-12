// models/CommonRailModel.js

const db = require('../config/db_core');

const TABLE_PREFIX = 'common_rail_';
const TABLE_SUFFIX = '_filtered';

function getTableName(lineId) {
  const id = parseInt(lineId, 10);
  if (id < 1 || id > 12) throw new Error('Invalid line_id');
  return `${TABLE_PREFIX}${id}${TABLE_SUFFIX}`;
}

/**
 * Tentukan shift berdasarkan jam (dalam backend JavaScript)
 * - Shift 1: 07:10 – 20:10
 * - Shift 2: 20:10 – 07:10 (termasuk tengah malam)
 */
function getShiftFromTime(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;

  const shift1Start = 7 * 60 + 10; // 07:10 → 430 menit
  const shift1End = 20 * 60 + 10;  // 20:10 → 1210 menit

  if (totalMinutes >= shift1Start && totalMinutes < shift1End) {
    return 'Shift 1';
  }
  return 'Shift 2';
}

/**
 * Dapatkan semua data dari 12 tabel, lalu filter berdasarkan TANGGAL & SHIFT (hitung dari created_at)
 */
async function getFilteredDataByDateTime(year, month, day, targetShift) {
  const targetDate = new Date(year, month - 1, day); // month 0-indexed
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  let allData = [];
  
  // Ambil data dari semua 12 tabel dalam rentang 24 jam
  for (let lineId = 1; lineId <= 12; lineId++) {
    const table = getTableName(lineId);
    
    // Ambil semua data di tanggal tersebut (dan sedikit sebelum/sesudah untuk cover shift2 malam)
    const [rows] = await db.execute(
      `SELECT *, ? as line_number FROM ?? 
       WHERE created_at >= ? AND created_at < ?`,
      [lineId, table, targetDate, nextDay]
    );

    // Filter di sisi Node.js berdasarkan jam → shift
    const filtered = rows.filter(row => {
      const recordTime = new Date(row.created_at);
      const shift = getShiftFromTime(recordTime);
      return shift === targetShift;
    });

    allData = allData.concat(filtered);
  }

  return allData;
}

module.exports = {
  getFilteredDataByDateTime
};