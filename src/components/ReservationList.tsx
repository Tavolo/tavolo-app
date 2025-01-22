import { useState, useEffect } from 'react';
import { Reservation, Guest } from '../types';
import { getReservations, updateReservationStatus } from '../api/reservations';
import { getGuest } from '../api/guests';
import { formatDateInTimezone } from '../utils/dates';

interface ReservationListProps {
  locationId: string;
  date: string;
  timezone: string;
}

export function ReservationList({ locationId, date, timezone }: ReservationListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [guestCache, setGuestCache] = useState<Record<string, Guest>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, [locationId, date]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getReservations(locationId, date);
      setReservations(data);

      // Load guest details
      const guestIds = [...new Set(data.map(r => r.guestId))];
      const guests = await Promise.all(guestIds.map(id => getGuest(id)));
      const cache: Record<string, Guest> = {};
      guests.forEach(g => cache[g.id] = g);
      setGuestCache(cache);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId: string, status: Reservation['status']) => {
    await updateReservationStatus(reservationId, status);
    await loadReservations();
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'yellow';
      case 'seated': return 'blue';
      case 'completed': return 'gray';
      case 'no_show': return 'red';
      case 'cancelled': return 'gray';
      default: return 'gray';
    }
  };

  if (loading) {
    return <div className="loading">Loading reservations...</div>;
  }

  return (
    <div className="reservation-list">
      <h2>Reservations for {date}</h2>

      {reservations.length === 0 ? (
        <p className="empty">No reservations for this date</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Guest</th>
              <th>Party</th>
              <th>Table</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => {
              const guest = guestCache[res.guestId];
              return (
                <tr key={res.id} className={`status-${res.status}`}>
                  <td>{formatDateInTimezone(res.timestamp, timezone, 'h:mm a')}</td>
                  <td>
                    {guest ? (
                      <span className="guest-name">
                        {guest.firstName} {guest.lastName}
                        {guest.isVIP && <span className="vip">VIP</span>}
                      </span>
                    ) : (
                      'Loading...'
                    )}
                  </td>
                  <td>{res.partySize}</td>
                  <td>{res.tableId}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>{res.notes || '-'}</td>
                  <td>
                    {res.status === 'confirmed' && (
                      <button onClick={() => handleStatusChange(res.id, 'seated')}>
                        Seat
                      </button>
                    )}
                    {res.status === 'seated' && (
                      <button onClick={() => handleStatusChange(res.id, 'completed')}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
