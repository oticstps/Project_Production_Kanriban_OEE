export const isBreakTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const inShift1Break =
    (timeStr >= '09:20' && timeStr <= '09:30') ||
    (timeStr >= '12:00' && timeStr <= '12:40') ||
    (timeStr >= '14:20' && timeStr <= '14:30') ||
    (timeStr >= '16:20' && timeStr <= '16:30');

  const inShift2Break =
    (timeStr >= '21:50' && timeStr <= '22:00') ||
    (timeStr >= '00:00' && timeStr <= '00:10') ||
    (timeStr >= '02:10' && timeStr <= '02:50') ||
    (timeStr >= '04:50' && timeStr <= '05:10');

  return inShift1Break || inShift2Break;
};