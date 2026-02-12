function toISOStringWIB(date = new Date()) {
  const wib = new Date(
    date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  );
  const y = wib.getFullYear();
  const m = String(wib.getMonth() + 1).padStart(2, '0');
  const d = String(wib.getDate()).padStart(2, '0');
  const h = String(wib.getHours()).padStart(2, '0');
  const i = String(wib.getMinutes()).padStart(2, '0');
  const s = String(wib.getSeconds()).padStart(2, '0');
  const ms = String(wib.getMilliseconds()).padStart(3, '0');

  return `${y}-${m}-${d}T${h}:${i}:${s}.${ms}+07:00`;
}

console.log(toISOStringWIB());