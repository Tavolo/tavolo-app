import { useState } from 'react';
import { Layout } from '../src/components/layout/Layout';
import { guests, visitHistory, getGuestVisits } from '../src/data/mockData';
import { Guest, VisitHistory } from '../src/types';

export default function Guests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [vipFilter, setVipFilter] = useState<'all' | 'vip' | 'regular'>('all');

  const filteredGuests = guests.filter(g => {
    const matchesSearch = !searchQuery ||
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVip = vipFilter === 'all' ||
      (vipFilter === 'vip' && g.isVIP) ||
      (vipFilter === 'regular' && !g.isVIP);

    return matchesSearch && matchesVip;
  });

  const getVipTier = (visits: VisitHistory[]): 'gold' | 'silver' | 'bronze' => {
    const totalSpend = visits.reduce((sum, v) => sum + v.amount, 0);
    if (visits.length >= 20 || totalSpend >= 5000) return 'gold';
    if (visits.length >= 10 || totalSpend >= 2000) return 'silver';
    return 'bronze';
  };

  return (
    <Layout title="Guests">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search guests by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            {(['all', 'vip', 'regular'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setVipFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  vipFilter === filter
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'vip' ? 'VIP Only' : 'Regular'}
              </button>
            ))}
          </div>

          <button className="btn-primary ml-auto">
            + Add Guest
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guest List */}
          <div className="lg:col-span-1 card overflow-hidden p-0">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">
                {filteredGuests.length} Guest{filteredGuests.length !== 1 && 's'}
              </h2>
            </div>
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredGuests.map(guest => {
                const visits = getGuestVisits(guest.id);
                const totalSpend = visits.reduce((sum, v) => sum + v.amount, 0);
                const isSelected = selectedGuest?.id === guest.id;

                return (
                  <button
                    key={guest.id}
                    onClick={() => setSelectedGuest(guest)}
                    className={`w-full p-4 text-left border-b border-slate-100 transition-colors ${
                      isSelected ? 'bg-tavolo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        guest.isVIP ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className="font-semibold text-sm">
                          {guest.firstName[0]}{guest.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 truncate">
                            {guest.firstName} {guest.lastName}
                          </span>
                          {guest.isVIP && (
                            <span className={`vip-badge tier-${getVipTier(visits)} text-xs`}>
                              {getVipTier(visits) === 'gold' ? 'Gold' : getVipTier(visits) === 'silver' ? 'Silver' : 'VIP'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 truncate">{guest.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span>{visits.length} visits</span>
                          <span>${totalSpend.toLocaleString()} spent</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guest Profile */}
          <div className="lg:col-span-2">
            {selectedGuest ? (
              <GuestProfileCard guest={selectedGuest} visits={getGuestVisits(selectedGuest.id)} />
            ) : (
              <div className="card flex items-center justify-center h-96">
                <div className="text-center">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-slate-500">Select a guest to view their profile</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface GuestProfileCardProps {
  guest: Guest;
  visits: VisitHistory[];
}

function GuestProfileCard({ guest, visits }: GuestProfileCardProps) {
  const totalSpend = visits.reduce((sum, v) => sum + v.amount, 0);
  const avgPartySize = visits.length > 0
    ? visits.reduce((sum, v) => sum + v.partySize, 0) / visits.length
    : 0;

  const locationVisits = visits.reduce((acc, v) => {
    acc[v.locationName] = (acc[v.locationName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueLocations = Object.keys(locationVisits).length;
  const favoriteLocation = Object.entries(locationVisits)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const getVipTier = (): 'gold' | 'silver' | 'bronze' => {
    if (visits.length >= 20 || totalSpend >= 5000) return 'gold';
    if (visits.length >= 10 || totalSpend >= 2000) return 'silver';
    return 'bronze';
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            guest.isVIP ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
          }`}>
            <span className="font-bold text-xl">
              {guest.firstName[0]}{guest.lastName[0]}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">
                {guest.firstName} {guest.lastName}
              </h2>
              {guest.isVIP && (
                <span className={`vip-badge tier-${getVipTier()}`}>
                  {getVipTier() === 'gold' ? 'Gold VIP' : getVipTier() === 'silver' ? 'Silver VIP' : 'VIP'}
                </span>
              )}
            </div>
            <p className="text-slate-500">{guest.email}</p>
            {guest.phone && <p className="text-slate-500">{guest.phone}</p>}
          </div>
        </div>
        <button className="btn-secondary">Edit Profile</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-slate-900">{visits.length}</p>
          <p className="text-sm text-slate-500">Total Visits</p>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-slate-900">${totalSpend.toLocaleString()}</p>
          <p className="text-sm text-slate-500">Lifetime Spend</p>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-slate-900">{avgPartySize.toFixed(1)}</p>
          <p className="text-sm text-slate-500">Avg Party Size</p>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-slate-900">{uniqueLocations}</p>
          <p className="text-sm text-slate-500">Locations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Preferences */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Preferences</h3>
          <div className="space-y-2">
            {guest.preferences.seating && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Seating:</span>
                <span className="text-slate-700 capitalize">{guest.preferences.seating}</span>
              </div>
            )}
            {guest.preferences.allergies && guest.preferences.allergies.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-slate-400">Allergies:</span>
                <div className="flex flex-wrap gap-1">
                  {guest.preferences.allergies.map(allergy => (
                    <span key={allergy} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {guest.preferences.dietaryRestrictions && guest.preferences.dietaryRestrictions.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-slate-400">Dietary:</span>
                <div className="flex flex-wrap gap-1">
                  {guest.preferences.dietaryRestrictions.map(diet => (
                    <span key={diet} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {guest.preferences.notes && (
              <div className="text-sm">
                <span className="text-slate-400">Notes:</span>
                <p className="text-slate-700 mt-1 bg-slate-50 p-2 rounded">{guest.preferences.notes}</p>
              </div>
            )}
            {!guest.preferences.seating && !guest.preferences.allergies?.length && !guest.preferences.notes && (
              <p className="text-sm text-slate-400">No preferences recorded</p>
            )}
          </div>

          {favoriteLocation && (
            <div className="mt-4 p-3 bg-tavolo-50 rounded-lg">
              <p className="text-sm text-tavolo-600">
                <span className="font-medium">Favorite location:</span> {favoriteLocation}
              </p>
            </div>
          )}
        </div>

        {/* Recent Visits */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Recent Visits</h3>
          <div className="space-y-2">
            {visits.slice(0, 5).map(visit => (
              <div key={visit.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{visit.locationName.replace('Tavolo ', '')}</p>
                  <p className="text-xs text-slate-400">{new Date(visit.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">${visit.amount}</p>
                  <p className="text-xs text-slate-400">Party of {visit.partySize}</p>
                </div>
              </div>
            ))}
          </div>
          {visits.length > 5 && (
            <button className="mt-3 text-sm text-tavolo-600 hover:text-tavolo-700 font-medium">
              View all {visits.length} visits
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
