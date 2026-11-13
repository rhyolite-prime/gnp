export function memoryDates(now = new Date()) {
  const day = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const monthAgo = new Date(day);
  monthAgo.setUTCDate(monthAgo.getUTCDate() - 30);
  const yearAgo = new Date(day);
  yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
  // February 29 belongs to February 28 in a non-leap anniversary year.
  if (yearAgo.getUTCMonth() !== day.getUTCMonth()) yearAgo.setUTCDate(0);
  return [
    { label: '30 days ago', date: monthAgo.toISOString().slice(0, 10) },
    { label: 'A year ago', date: yearAgo.toISOString().slice(0, 10) },
  ];
}
