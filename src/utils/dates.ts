import { format, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

/**
 * Format a date string for display
 */
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  return format(parseISO(dateString), formatStr);
}

/**
 * Format a date in a specific timezone
 */
export function formatDateInTimezone(
  dateString: string,
  timezone: string,
  formatStr: string = 'MMM d, yyyy h:mm a'
): string {
  const date = parseISO(dateString);
  return formatInTimeZone(date, timezone, formatStr);
}

/**
 * Convert a UTC date to a specific timezone
 */
export function toTimezone(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone);
}

/**
 * Get the start of day in a specific timezone
 */
export function startOfDayInTimezone(date: Date, timezone: string): Date {
  const zonedDate = toZonedTime(date, timezone);
  zonedDate.setHours(0, 0, 0, 0);
  return zonedDate;
}

/**
 * Get the end of day in a specific timezone
 */
export function endOfDayInTimezone(date: Date, timezone: string): Date {
  const zonedDate = toZonedTime(date, timezone);
  zonedDate.setHours(23, 59, 59, 999);
  return zonedDate;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return formatDate(dateString);
}
