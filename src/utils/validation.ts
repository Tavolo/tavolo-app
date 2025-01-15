import { Table, TablePosition, TableSize } from '../types';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates that table positions don't overlap
 */
export function validateTablePositions(tables: Table[]): ValidationResult {
  const errors: string[] = [];

  for (let i = 0; i < tables.length; i++) {
    for (let j = i + 1; j < tables.length; j++) {
      if (tablesOverlap(tables[i], tables[j])) {
        errors.push(`Tables "${tables[i].name}" and "${tables[j].name}" overlap`);
      }
    }
  }

  // Check for tables outside reasonable bounds
  for (const table of tables) {
    if (table.position.x < 0 || table.position.y < 0) {
      errors.push(`Table "${table.name}" has negative position`);
    }
    if (table.position.x > 10000 || table.position.y > 10000) {
      errors.push(`Table "${table.name}" position exceeds maximum bounds`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function tablesOverlap(a: Table, b: Table): boolean {
  const aLeft = a.position.x;
  const aRight = a.position.x + a.size.width;
  const aTop = a.position.y;
  const aBottom = a.position.y + a.size.height;

  const bLeft = b.position.x;
  const bRight = b.position.x + b.size.width;
  const bTop = b.position.y;
  const bBottom = b.position.y + b.size.height;

  // Check if rectangles overlap
  return !(aRight <= bLeft || bRight <= aLeft || aBottom <= bTop || bBottom <= aTop);
}

/**
 * Validates guest preferences
 */
export function validateGuestPreferences(preferences: Record<string, any>): ValidationResult {
  const errors: string[] = [];
  const validSeatingOptions = ['booth', 'window', 'patio', 'bar', 'corner', 'private'];

  if (preferences.seating && !validSeatingOptions.includes(preferences.seating)) {
    errors.push(`Invalid seating preference: ${preferences.seating}`);
  }

  if (preferences.allergies && !Array.isArray(preferences.allergies)) {
    errors.push('Allergies must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates reservation data
 */
export function validateReservation(data: {
  partySize: number;
  timestamp: string;
  maxPartySize?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (data.partySize < 1) {
    errors.push('Party size must be at least 1');
  }

  if (data.maxPartySize && data.partySize > data.maxPartySize) {
    errors.push(`Party size exceeds maximum of ${data.maxPartySize}`);
  }

  const reservationDate = new Date(data.timestamp);
  if (isNaN(reservationDate.getTime())) {
    errors.push('Invalid reservation date');
  }

  if (reservationDate < new Date()) {
    errors.push('Cannot make reservation in the past');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
