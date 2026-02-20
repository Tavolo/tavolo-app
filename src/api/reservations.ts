import { Reservation } from '../types';
import { reservations } from '../data/mockData';

// In-memory state for demo
let localReservations = [...reservations];

export async function createReservation(data: {
  guestId: string;
  locationId: string;
  tableId: string;
  timestamp: string;
  partySize: number;
  notes?: string;
}): Promise<Reservation> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    ...data,
    status: 'pending',
  };
  localReservations.push(newReservation);
  return newReservation;
}

export async function getReservations(
  locationId: string,
  date: string
): Promise<Reservation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return localReservations.filter(r => {
    if (r.locationId !== locationId) return false;
    const resDate = r.timestamp.split('T')[0];
    return resDate === date;
  });
}

export async function updateReservationStatus(
  reservationId: string,
  status: Reservation['status']
): Promise<Reservation> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const reservation = localReservations.find(r => r.id === reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  reservation.status = status;
  return reservation;
}

export async function cancelReservation(reservationId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const index = localReservations.findIndex(r => r.id === reservationId);
  if (index !== -1) {
    localReservations[index].status = 'cancelled';
  }
}
