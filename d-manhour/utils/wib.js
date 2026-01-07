// utils/wib.js
/**
 * Buat string datetime WIB dari string tanggal (YYYY-MM-DD)
 * Contoh: toWIBStart("2025-12-08 08:00:00") → "2025-12-08 07:10:00"
 */
function toWIBStart(datetimeStr) {
  // Ambil bagian tanggal: "2025-12-08"
  const datePart = datetimeStr.split(' ')[0];
  return `${datePart} 07:10:00`;
}

/**
 * Format Date object ke string WIB (tanpa konversi timezone)
 * Hanya gunakan jika input memang dalam local time WIB
 */
function formatDateAsWIB(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

module.exports = {
  toWIBStart,
  formatDateAsWIB
};