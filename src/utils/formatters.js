// utils/formatters.js - Utility functions for formatting data

/**
 * Format a date object to a readable string
 * @param {Date|string|number} date - Date to format
 * @param {boolean} includeTime - Whether to include time in the formatted string
 * @return {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return "Unknown";

  // Convert to Date object if it's not already
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "Invalid date";

  // Today's date for comparison
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Basic formatting
  const options = {
    month: "short",
    day: "numeric",
    year: today.getFullYear() !== dateObj.getFullYear() ? "numeric" : undefined,
  };

  // Determine if it's today or yesterday
  if (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  ) {
    if (includeTime) {
      return `Today, ${dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return "Today";
  }

  if (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  ) {
    if (includeTime) {
      return `Yesterday, ${dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return "Yesterday";
  }

  // Add time if requested
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Format a number with commas for thousands separator
 * @param {number} num - Number to format
 * @return {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Format a file size in bytes to a readable string
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @return {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Format a duration in seconds to a readable string
 * @param {number} seconds - Duration in seconds
 * @return {string} Formatted duration string (MM:SS)
 */
export const formatDuration = (seconds) => {
  if (!seconds) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Truncate text to a maximum length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @return {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Convert a string to a title case
 * @param {string} str - String to convert
 * @return {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};
