import { Guest, VisitHistory, GuestPreferences } from '../types';

export async function searchGuests(query: string): Promise<Guest[]> {
  const response = await fetch(`/api/guests/search?q=${encodeURIComponent(query)}`);
  return response.json();
}

export async function getGuest(guestId: string): Promise<Guest> {
  const response = await fetch(`/api/guests/${guestId}`);
  return response.json();
}

export async function getGuestVisitHistory(guestId: string): Promise<VisitHistory[]> {
  const response = await fetch(`/api/guests/${guestId}/visits`);
  return response.json();
}

export async function updateGuestPreferences(
  guestId: string,
  preferences: Partial<GuestPreferences>
): Promise<Guest> {
  const response = await fetch(`/api/guests/${guestId}/preferences`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });

  return response.json();
}

export async function createGuest(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  preferences?: GuestPreferences;
}): Promise<Guest> {
  const response = await fetch('/api/guests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function mergeGuestProfiles(
  primaryGuestId: string,
  secondaryGuestId: string
): Promise<Guest> {
  const response = await fetch('/api/guests/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ primaryGuestId, secondaryGuestId }),
  });

  return response.json();
}
