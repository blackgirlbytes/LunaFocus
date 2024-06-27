import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
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

// YYYY-MM-DD string to YYYY-MM-DD date without time zone (aka in UTC)
export function stringToDate(dateString) {
   // Split the input string into components
   const parts = dateString.split('-');
   const year = parseInt(parts[0], 10);
   const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript Date
   const day = parseInt(parts[2], 10);
 
   // Create a Date object in UTC
   const date = new Date(year, month, day);
   return date;
}

// Date object to Date object in UTC time
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