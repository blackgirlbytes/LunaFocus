import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function asDate(dateLike) {
  return (typeof dateLike === 'string') ? stringToDate(dateLike) : dateLike;
} 

export function calculatePeriodDays(startDate, endDate) {
  // stringToDate ensures these match the day cell date in the UI
  const start = asDate(startDate);
  const end = asDate(endDate);
  const days = [];
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    days.push(formatDate(d));
  }
  return days;
}

// String(?) to YYYY-MM-DD
export function formatDate(date) {
  if (!date) return '';
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
};

// YYYY-MM-DD string to YYYY-MM-DD date object with time set to 00:00:00 in browser time
export function stringToDate(dateString) {
   // Split the input string into components
   const parts = dateString.split('-');
   const year = parseInt(parts[0], 10);
   const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript Date
   const day = parseInt(parts[2], 10);
 
   const date = new Date(year, month, day);
   return date;
}

// Date object to Date object with the UTC date and time set to 00:00:00 in browser time
// Ex. For day cell #11:
//     Input: Mon Jun 10 2024 17:00:00 GMT-0700 (Pacific Daylight Time)
//     Output: Tue Jun 11 2024 00:00:00 GMT-0700 (Pacific Daylight Time)
export function toUTCDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  // Create a new Date object in UTC
  const utcDate = new Date(year, month, day);
  return utcDate;
}

export const formatDateForCalendar = (date) => date.toISOString().split('T')[0];
