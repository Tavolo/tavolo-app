import { useState } from 'react';
import { Layout } from '../src/components/layout/Layout';
import { locations, reservations, guests, getGuestById, analyticsData } from '../src/data/mockData';

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState('all');

  const filteredReservations = selectedLocation === 'all'
    ? reservations
    : reservations.filter(r => r.locationId === selectedLocation);

  const todayReservations = filteredReservations.length;
  const confirmedReservations = filteredReservations.filter(r => r.status === 'confirmed').length;
  const seatedGuests = filteredReservations.filter(r => r.status === 'seated').length;
  const pendingReservations = filteredReservations.filter(r => r.status === 'pending').length;

  const upcomingReservations = filteredReservations
    .filter(r => r.status === 'confirmed' || r.status === 'pending')
    .slice(0, 5);

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Location Selector */}
        <div className="flex items-center gap-4">
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
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Today's Reservations"
            value={todayReservations}
            change="+12%"
            positive
            icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
          <StatCard
            label="Confirmed"
            value={confirmedReservations}
            icon="M5 13l4 4L19 7"
            color="green"
          />
          <StatCard
            label="Currently Seated"
            value={seatedGuests}
            icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            color="blue"
          />
          <StatCard
            label="Pending"
            value={pendingReservations}
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            color="yellow"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Reservations */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Reservations</h2>
              <a href="/reservations" className="text-sm text-tavolo-600 hover:text-tavolo-700 font-medium">
                View all
              </a>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Guest</th>
                    <th>Party</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingReservations.map(res => {
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
                        </td>
                        <td>{res.partySize}</td>
                        <td className="text-slate-500">{location?.name.replace('Tavolo ', '')}</td>
                        <td>
                          <span className={`status-badge status-${res.status}`}>
                            {res.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Revenue Card */}
            <div className="card bg-gradient-to-br from-tavolo-600 to-tavolo-800 text-white">
              <h3 className="text-sm font-medium text-tavolo-200">Today's Estimated Revenue</h3>
              <p className="text-3xl font-bold mt-2">
                ${filteredReservations.reduce((sum, r) => sum + (r.estimatedRevenue || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-tavolo-200 mt-1">
                {filteredReservations.filter(r => r.estimatedRevenue).length} reservations with estimates
              </p>
            </div>

            {/* VIP Alerts */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">VIP Arriving Today</h3>
              <div className="space-y-3">
                {filteredReservations
                  .filter(r => {
                    const guest = getGuestById(r.guestId);
                    return guest?.isVIP && (r.status === 'confirmed' || r.status === 'pending');
                  })
                  .slice(0, 3)
                  .map(res => {
                    const guest = getGuestById(res.guestId);
                    const time = new Date(res.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });
                    return (
                      <div key={res.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-amber-600 font-semibold">
                            {guest?.firstName[0]}{guest?.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {guest?.firstName} {guest?.lastName}
                          </p>
                          <p className="text-sm text-slate-500">{time} - Party of {res.partySize}</p>
                        </div>
                      </div>
                    );
                  })}
                {filteredReservations.filter(r => {
                  const guest = getGuestById(r.guestId);
                  return guest?.isVIP && (r.status === 'confirmed' || r.status === 'pending');
                }).length === 0 && (
                  <p className="text-slate-500 text-sm">No VIP reservations today</p>
                )}
              </div>
            </div>

            {/* Location Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Locations Today</h3>
              <div className="space-y-3">
                {locations.map(loc => {
                  const locReservations = reservations.filter(r => r.locationId === loc.id);
                  return (
                    <div key={loc.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{loc.name.replace('Tavolo ', '')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{locReservations.length}</span>
                        <span className="text-xs text-slate-400">reservations</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  change?: string;
  positive?: boolean;
  icon: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

function StatCard({ label, value, change, positive, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };
  const iconBg = color ? colorClasses[color] : 'bg-tavolo-50 text-tavolo-600';

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last week
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}
