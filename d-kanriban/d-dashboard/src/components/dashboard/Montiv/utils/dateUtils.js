export const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  // Set time to beginning of day for comparison
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);
  d.setHours(0, 0, 0, 0);
  
  if (start && end) {
    return d >= start && d <= end;
  } else if (start) {
    return d >= start;
  } else if (end) {
    return d <= end;
  }
  return true;
};

export const filterDataByDateRange = (data, startDate, endDate) => {
  if (!startDate && !endDate) return data;
  
  return data.filter(item => isDateInRange(item.created_at, startDate, endDate));
};

export const getUniqueDates = (data) => {
  const dates = data.map(item => {
    const date = new Date(item.created_at);
    return formatDateForInput(date);
  });
  return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
};

export const getCurrentDate = () => {
  return formatDateForInput(new Date());
};

export const sortDataByTime = (data) => {
  return data
    .map(item => ({
      ...item,
      timestamp: new Date(item.created_at).getTime()
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
};