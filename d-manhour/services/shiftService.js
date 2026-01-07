class ShiftService {
  /**
   * Menentukan shift berdasarkan waktu created_at
   * Shift 1: 07:10 - 20:10
   * Shift 2: 20:10 - 07:10 (hari berikutnya)
   */
  static getShiftFromTime(timeString) {
    if (!timeString) return null;
    
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // Waktu batas shift dalam menit
    const shift1Start = 7 * 60 + 10;  // 07:10
    const shift1End = 20 * 60 + 10;   // 20:10
    
    if (totalMinutes >= shift1Start && totalMinutes < shift1End) {
      return 1;
    } else {
      return 2;
    }
  }

  /**
   * Mendapatkan rentang waktu untuk shift tertentu pada tanggal tertentu
   */
  static getShiftTimeRange(date, shift) {
    const targetDate = new Date(date);
    
    if (shift === 1) {
      // Shift 1: 07:10 - 20:10 pada tanggal yang sama
      const startTime = new Date(targetDate);
      startTime.setHours(7, 10, 0, 0);
      
      const endTime = new Date(targetDate);
      endTime.setHours(20, 10, 0, 0);
      
      return {
        start: startTime.toISOString().slice(0, 19).replace('T', ' '),
        end: endTime.toISOString().slice(0, 19).replace('T', ' ')
      };
    } else {
      // Shift 2: 20:10 - 07:10 (hari berikutnya)
      const startTime = new Date(targetDate);
      startTime.setHours(20, 10, 0, 0);
      
      const endTime = new Date(targetDate);
      endTime.setDate(endTime.getDate() + 1);
      endTime.setHours(7, 10, 0, 0);
      
      return {
        start: startTime.toISOString().slice(0, 19).replace('T', ' '),
        end: endTime.toISOString().slice(0, 19).replace('T', ' ')
      };
    }
  }

  /**
   * Mendapatkan data shift untuk tanggal hari ini
   */
  static getTodayShiftRange(shift) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.getShiftTimeRange(today, shift);
  }
}

module.exports = ShiftService;