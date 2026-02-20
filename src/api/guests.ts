import { Guest, VisitHistory, GuestPreferences } from '../types';
import { guests, visitHistory } from '../data/mockData';

// In-memory state for demo
let localGuests = [...guests];

// Search result limit for performance
const MAX_SEARCH_RESULTS = 50;

export async function searchGuests(query: string, limit: number = MAX_SEARCH_RESULTS): Promise<Guest[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Early return for empty queries
  if (!query || query.length < 2) {
    return localGuests.slice(0, limit);
  }

  const lowerQuery = query.toLowerCase();
  const results: Guest[] = [];

  // Use early termination for better performance on large datasets
  for (const g of localGuests) {
    const fullName = `${g.firstName} ${g.lastName}`.toLowerCase();
    if (fullName.includes(lowerQuery) || g.email.toLowerCase().includes(lowerQuery)) {
      results.push(g);
      if (results.length >= limit) break;
    }
  }

  return results;
}

export async function getGuest(guestId: string): Promise<Guest> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const guest = localGuests.find(g => g.id === guestId);
  if (!guest) {
    throw new Error('Guest not found');
  }
  return guest;
}

export async function getGuestVisitHistory(guestId: string): Promise<VisitHistory[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return visitHistory[guestId] || [];
}

export async function updateGuestPreferences(
  guestId: string,
  preferences: Partial<GuestPreferences>
): Promise<Guest> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const guest = localGuests.find(g => g.id === guestId);
  if (!guest) {
    throw new Error('Guest not found');
  }
  guest.preferences = { ...guest.preferences, ...preferences };
  guest.updatedAt = new Date().toISOString();
  return guest;
}

export async function createGuest(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  preferences?: GuestPreferences;
}): Promise<Guest> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const newGuest: Guest = {
    id: `guest-${Date.now()}`,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    isVIP: false,
    preferences: data.preferences || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localGuests.push(newGuest);
  return newGuest;
}

export async function mergeGuestProfiles(
  primaryGuestId: string,
  secondaryGuestId: string
): Promise<Guest> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const primary = localGuests.find(g => g.id === primaryGuestId);
  if (!primary) {
    throw new Error('Primary guest not found');
  }

  // In a real app, this would merge visit history and other data
  localGuests = localGuests.filter(g => g.id !== secondaryGuestId);

  return primary;
}
