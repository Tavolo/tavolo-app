import { useState } from 'react';
import { Guest, VisitHistory } from '../types';
import { formatDate } from '../utils/dates';

interface GuestProfileProps {
  guest: Guest;
  visits: VisitHistory[];
  onUpdate: (guest: Guest) => void;
  onMergeProfiles?: (secondaryGuestId: string) => void;
}

export function GuestProfile({ guest, visits, onUpdate, onMergeProfiles }: GuestProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState(guest.preferences);

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

  const vipTier = calculateVipTier(visits.length, totalSpend);

  const handleSavePreferences = () => {
    onUpdate({
      ...guest,
      preferences: editedPreferences,
    });
    setIsEditing(false);
  };

  return (
    <div className="card">
      <header className="flex items-start justify-between mb-6 pb-6 border-b border-slate-200">
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
                <span className={`vip-badge tier-${vipTier}`}>
                  {vipTier === 'gold' ? 'Gold VIP' :
                   vipTier === 'silver' ? 'Silver VIP' : 'VIP'}
                </span>
              )}
              {uniqueLocations > 1 && (
                <span className="px-2 py-0.5 bg-tavolo-100 text-tavolo-700 rounded text-xs font-medium">
                  {uniqueLocations} locations
                </span>
              )}
            </div>
            <p className="text-slate-500">{guest.email}</p>
            {guest.phone && <p className="text-slate-500">{guest.phone}</p>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">Preferences</h3>
            <button
              onClick={() => isEditing ? handleSavePreferences() : setIsEditing(true)}
              className="text-sm text-tavolo-600 hover:text-tavolo-700 font-medium"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Seating preference</label>
                <select
                  value={editedPreferences.seating || ''}
                  onChange={(e) => setEditedPreferences({
                    ...editedPreferences,
                    seating: e.target.value as any
                  })}
                  className="select"
                >
                  <option value="">No preference</option>
                  <option value="booth">Booth</option>
                  <option value="window">Window</option>
                  <option value="patio">Patio</option>
                  <option value="bar">Bar</option>
                  <option value="corner">Corner</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Allergies</label>
                <input
                  type="text"
                  value={editedPreferences.allergies?.join(', ') || ''}
                  onChange={(e) => setEditedPreferences({
                    ...editedPreferences,
                    allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., shellfish, peanuts"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Notes</label>
                <textarea
                  value={editedPreferences.notes || ''}
                  onChange={(e) => setEditedPreferences({
                    ...editedPreferences,
                    notes: e.target.value
                  })}
                  placeholder="Any special notes about this guest"
                  className="input min-h-20"
                />
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {guest.preferences.seating && (
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Seating:</span>
                  <span className="text-slate-700 capitalize">{guest.preferences.seating}</span>
                </li>
              )}
              {(guest.preferences.allergies?.length ?? 0) > 0 && (
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-red-500">Allergies:</span>
                  <span className="text-red-700">{guest.preferences.allergies?.join(', ')}</span>
                </li>
              )}
              {(guest.preferences.dietaryRestrictions?.length ?? 0) > 0 && (
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Dietary:</span>
                  <span className="text-slate-700">{guest.preferences.dietaryRestrictions?.join(', ')}</span>
                </li>
              )}
              {guest.preferences.notes && (
                <li className="text-sm mt-2 p-2 bg-slate-50 rounded">
                  <span className="text-slate-600">{guest.preferences.notes}</span>
                </li>
              )}
              {!guest.preferences.seating &&
               !guest.preferences.allergies?.length &&
               !guest.preferences.notes && (
                <li className="text-sm text-slate-400">No preferences recorded</li>
              )}
            </ul>
          )}
        </section>

        <section>
          <h3 className="font-semibold text-slate-900 mb-3">Guest Insights</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="block text-xl font-bold text-slate-900">{visits.length}</span>
              <span className="text-xs text-slate-500">Total visits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="block text-xl font-bold text-slate-900">${totalSpend.toLocaleString()}</span>
              <span className="text-xs text-slate-500">Lifetime spend</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="block text-xl font-bold text-slate-900">{avgPartySize.toFixed(1)}</span>
              <span className="text-xs text-slate-500">Avg party size</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="block text-xl font-bold text-slate-900">{uniqueLocations}</span>
              <span className="text-xs text-slate-500">Locations</span>
            </div>
          </div>

          {favoriteLocation && (
            <p className="mt-3 text-sm text-tavolo-600 bg-tavolo-50 p-2 rounded">
              Most visited: <strong>{favoriteLocation}</strong>
            </p>
          )}
        </section>

        <section>
          <h3 className="font-semibold text-slate-900 mb-3">Recent Visits</h3>
          <div className="space-y-2">
            {visits.slice(0, 5).map(visit => (
              <div key={visit.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{visit.locationName}</p>
                  <p className="text-xs text-slate-400">{formatDate(visit.date)}</p>
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
        </section>
      </div>

      {onMergeProfiles && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={() => {
              const secondaryId = prompt('Enter guest ID to merge into this profile:');
              if (secondaryId) onMergeProfiles(secondaryId);
            }}
            className="btn-secondary"
          >
            Merge duplicate profile
          </button>
        </div>
      )}
    </div>
  );
}

function calculateVipTier(visitCount: number, totalSpend: number): 'gold' | 'silver' | 'bronze' {
  if (visitCount >= 20 || totalSpend >= 5000) return 'gold';
  if (visitCount >= 10 || totalSpend >= 2000) return 'silver';
  return 'bronze';
}
