import { Reservation, Guest, Location } from '../types';

export async function createReservation(data: {
  guestId: string;
  locationId: string;
  tableId: string;
  timestamp: string;
  partySize: number;
  notes?: string;
}): Promise<Reservation> {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create reservation');
  }

  return response.json();
}

export async function getReservations(
  locationId: string,
  date: string
): Promise<Reservation[]> {
  const response = await fetch(
    `/api/locations/${locationId}/reservations?date=${date}`
  );
  return response.json();
}

export async function updateReservationStatus(
  reservationId: string,
  status: Reservation['status']
): Promise<Reservation> {
  const response = await fetch(`/api/reservations/${reservationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  return response.json();
}

export async function cancelReservation(reservationId: string): Promise<void> {
  await fetch(`/api/reservations/${reservationId}`, {
    method: 'DELETE',
  });
}
