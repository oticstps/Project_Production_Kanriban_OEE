// src/utils/shiftUtils.js

export const getShiftAndSlot = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // SHIFT 1 SCHEDULE & OVERTIME ONLY
  const shift1Slots = [
    { start: 7 * 60 + 10, end: 8 * 60 + 10, label: '07:10 - 08:10', theme: 'Schedule' },
    { start: 8 * 60 + 10, end: 9 * 60 + 10, label: '08:10 - 09:10', theme: 'Schedule' },
    { start: 9 * 60 + 30, end: 10 * 60 + 20, label: '09:30 - 10:20', theme: 'Schedule' },
    { start: 10 * 60 + 20, end: 11 * 60 + 20, label: '10:20 - 11:20', theme: 'Schedule' },
    { start: 12 * 60 + 40, end: 13 * 60 + 0, label: '12:40 - 13:00', theme: 'Schedule' },
    { start: 13 * 60 + 0, end: 14 * 60 + 0, label: '13:00 - 14:00', theme: 'Schedule' },
    { start: 14 * 60 + 30, end: 15 * 60 + 10, label: '14:30 - 15:10', theme: 'Schedule' },
    { start: 15 * 60 + 10, end: 16 * 60 + 10, label: '15:10 - 16:10', theme: 'Schedule' },
    { start: 16 * 60 + 30, end: 17 * 60 + 30, label: '16:30 - 17:30', theme: 'Overtime' },
    { start: 17 * 60 + 30, end: 18 * 60 + 30, label: '17:30 - 18:30', theme: 'Overtime' },
    { start: 19 * 60 + 0, end: 20 * 60 + 0, label: '19:00 - 20:00', theme: 'Overtime' },
  ];

  // SHIFT 2 SCHEDULE & OVERTIME ONLY
  const shift2Slots = [
    { start: 19 * 60 + 50, end: 20 * 60 + 50, label: '19:50 - 20:50', theme: 'Schedule' },
    { start: 20 * 60 + 50, end: 21 * 60 + 50, label: '20:50 - 21:50', theme: 'Schedule' },
    { start: 22 * 60 + 0, end: 23 * 60 + 0, label: '22:00 - 23:00', theme: 'Schedule' },
    { start: 23 * 60 + 0, end: 24 * 60 + 0, label: '23:00 - 00:00', theme: 'Schedule' },
    { start: 10, end: 70, label: '00:10 - 01:10', theme: 'Schedule' },
    { start: 70, end: 130, label: '01:10 - 02:10', theme: 'Schedule' },
    { start: 170, end: 230, label: '02:50 - 03:50', theme: 'Schedule' },
    { start: 230, end: 290, label: '03:50 - 04:50', theme: 'Schedule' },
    { start: 310, end: 370, label: '05:10 - 06:10', theme: 'Overtime' },
    { start: 370, end: 430, label: '06:10 - 07:10', theme: 'Overtime' },
  ];

  // Cek SHIFT 1
  for (const slot of shift1Slots) {
    if (timeInMinutes >= slot.start && timeInMinutes < slot.end) {
      return { 
        shift: 'SHIFT1', 
        slot: slot.label, 
        theme: slot.theme 
      };
    }
  }

  // Cek SHIFT 2 (termasuk penanganan waktu malam)
  for (const slot of shift2Slots) {
    if (
      (slot.start <= slot.end && timeInMinutes >= slot.start && timeInMinutes < slot.end) ||
      (slot.start > slot.end && (timeInMinutes >= slot.start || timeInMinutes < slot.end))
    ) {
      return { 
        shift: 'SHIFT2', 
        slot: slot.label, 
        theme: slot.theme 
      };
    }
  }

  // Jika tidak termasuk schedule/overtime
  return { 
    shift: 'OTHER', 
    slot: 'Non-Production', 
    theme: 'Other' 
  };
};

// Fungsi untuk memeriksa apakah slot adalah schedule atau overtime
export const isProductionSlot = (timestamp) => {
  const { theme } = getShiftAndSlot(timestamp);
  return theme === 'Schedule' || theme === 'Overtime';
};