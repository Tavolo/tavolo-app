import { useState } from 'react';
import { Layout } from '../src/components/layout/Layout';
import { locations, reservations, getGuestById, waitlistEntries } from '../src/data/mockData';
import { Reservation } from '../src/types';

export default function Reservations() {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localReservations, setLocalReservations] = useState(reservations);

  const filteredReservations = localReservations.filter(r => {
    if (selectedLocation !== 'all' && r.locationId !== selectedLocation) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (reservationId: string, newStatus: Reservation['status']) => {
    setLocalReservations(prev =>
      prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r)
    );
  };

  const getStatusActions = (status: Reservation['status'], resId: string) => {
    switch (status) {
      case 'pending':
        return (
          <button
            onClick={() => handleStatusChange(resId, 'confirmed')}
            className="text-sm text-tavolo-600 hover:text-tavolo-700 font-medium"
          >
            Confirm
          </button>
        );
      case 'confirmed':
        return (
          <button
            onClick={() => handleStatusChange(resId, 'seated')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Seat
          </button>
        );
      case 'seated':
        return (
          <button
            onClick={() => handleStatusChange(resId, 'completed')}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Complete
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="Reservations">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="select w-64"
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select w-48"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="input w-48"
          />

          <button className="btn-primary ml-auto">
            + New Reservation
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reservations Table */}
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Today's Reservations ({filteredReservations.length})
            </h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Guest</th>
                    <th>Party</th>
                    <th>Table</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map(res => {
                    const guest = getGuestById(res.guestId);
                    const location = locations.find(l => l.id === res.locationId);
                    const time = new Date(res.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });
                    return (
                      <tr key={res.id}>
                        <td className="font-medium">{time}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span>{guest?.firstName} {guest?.lastName}</span>
                            {guest?.isVIP && (
                              <span className="vip-badge tier-gold text-xs">VIP</span>
                            )}
                          </div>
                          {guest?.phone && (
                            <p className="text-xs text-slate-400">{guest.phone}</p>
                          )}
                        </td>
                        <td>{res.partySize}</td>
                        <td>{res.tableId}</td>
                        <td className="text-slate-500">{location?.name.replace('Tavolo ', '')}</td>
                        <td>
                          <span className={`status-badge status-${res.status}`}>
                            {res.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="max-w-32 truncate text-slate-500" title={res.notes}>
                          {res.notes || '-'}
                        </td>
                        <td>
                          {getStatusActions(res.status, res.id)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Waitlist */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Waitlist ({waitlistEntries.length})
            </h2>
            <div className="space-y-3">
              {waitlistEntries.map((entry, index) => {
                const waitedMins = Math.floor((Date.now() - new Date(entry.addedAt).getTime()) / 60000);
                return (
                  <div key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-tavolo-100 text-tavolo-700 rounded-full flex items-center justify-center font-semibold">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{entry.guestName}</p>
                          <p className="text-sm text-slate-500">Party of {entry.partySize}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Waited {waitedMins}m • Est. {entry.estimatedWait}m
                      </span>
                      <div className="flex gap-2">
                        <button className="text-tavolo-600 hover:text-tavolo-700 font-medium">
                          Notify
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Seat
                        </button>
                      </div>
                    </div>
                    {entry.preferences && (
                      <p className="mt-2 text-xs text-slate-400">{entry.preferences}</p>
                    )}
                  </div>
                );
              })}
              {waitlistEntries.length === 0 && (
                <p className="text-slate-500 text-center py-8">No one on the waitlist</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <button className="btn-secondary w-full">
                + Add to Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
