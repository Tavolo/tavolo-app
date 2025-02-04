import { useState } from 'react';
import { Guest, VisitHistory } from '../types';
import { formatDate, formatRelativeTime } from '../utils/dates';

interface GuestProfileProps {
  guest: Guest;
  visits: VisitHistory[];
  onUpdate: (guest: Guest) => void;
  onMergeProfiles?: (secondaryGuestId: string) => void;
}

/**
 * Redesigned Guest Profile component for v2.0
 *
 * Changes from v1:
 * - Added cross-location visit summary
 * - New preference editing inline
 * - VIP badge with tier levels
 * - Spending insights section
 * - Profile merge functionality for duplicate guests
 */
export function GuestProfile({ guest, visits, onUpdate, onMergeProfiles }: GuestProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState(guest.preferences);

  const totalSpend = visits.reduce((sum, v) => sum + v.amount, 0);
  const avgPartySize = visits.length > 0
    ? visits.reduce((sum, v) => sum + v.partySize, 0) / visits.length
    : 0;

  // Cross-location analysis
  const locationVisits = visits.reduce((acc, v) => {
    acc[v.locationName] = (acc[v.locationName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueLocations = Object.keys(locationVisits).length;
  const favoriteLocation = Object.entries(locationVisits)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Calculate VIP tier
  const vipTier = calculateVipTier(visits.length, totalSpend);

  const handleSavePreferences = () => {
    onUpdate({
      ...guest,
      preferences: editedPreferences,
    });
    setIsEditing(false);
  };

  return (
    <div className="guest-profile guest-profile-v2">
      <header className="guest-header">
        <div className="guest-identity">
          <h2>{guest.firstName} {guest.lastName}</h2>
          <span className="guest-email">{guest.email}</span>
          {guest.phone && <span className="guest-phone">{guest.phone}</span>}
        </div>

        <div className="guest-badges">
          {guest.isVIP && (
            <span className={`vip-badge tier-${vipTier}`}>
              {vipTier === 'gold' ? '★ Gold VIP' :
               vipTier === 'silver' ? '☆ Silver VIP' : 'VIP'}
            </span>
          )}
          {uniqueLocations > 1 && (
            <span className="multi-location-badge">
              {uniqueLocations} locations
            </span>
          )}
        </div>
      </header>

      <div className="profile-grid">
        <section className="preferences">
          <div className="section-header">
            <h3>Preferences</h3>
            <button
              onClick={() => isEditing ? handleSavePreferences() : setIsEditing(true)}
              className="edit-btn"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <div className="preferences-form">
              <label>
                Seating preference
                <select
                  value={editedPreferences.seating || ''}
                  onChange={(e) => setEditedPreferences({
                    ...editedPreferences,
                    seating: e.target.value as any
                  })}
                >
                  <option value="">No preference</option>
                  <option value="booth">Booth</option>
                  <option value="window">Window</option>
                  <option value="patio">Patio</option>
                  <option value="bar">Bar</option>
                  <option value="corner">Corner</option>
                  <option value="private">Private</option>
                </select>
              </label>

              <label>
                Allergies
                <input
                  type="text"
                  value={editedPreferences.allergies?.join(', ') || ''}
                  onChange={(e) => setEditedPreferences({
                    ...editedPreferences,
                    allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., shellfish, peanuts"
                />
              </label>

              <label>
                Notes
                <textarea
                  value={editedPreferences.notes || ''}
                  onChange={(e) => setEditedPreferences({
                    ...editedPreferences,
                    notes: e.target.value
                  })}
                  placeholder="Any special notes about this guest"
                />
              </label>
            </div>
          ) : (
            <ul className="preferences-list">
              {guest.preferences.seating && (
                <li>
                  <span className="pref-icon">🪑</span>
                  Prefers {guest.preferences.seating} seating
                </li>
              )}
              {guest.preferences.allergies?.length > 0 && (
                <li className="allergy-warning">
                  <span className="pref-icon">⚠️</span>
                  Allergies: {guest.preferences.allergies.join(', ')}
                </li>
              )}
              {guest.preferences.dietaryRestrictions?.length > 0 && (
                <li>
                  <span className="pref-icon">🍽️</span>
                  {guest.preferences.dietaryRestrictions.join(', ')}
                </li>
              )}
              {guest.preferences.notes && (
                <li>
                  <span className="pref-icon">📝</span>
                  {guest.preferences.notes}
                </li>
              )}
              {!guest.preferences.seating &&
               !guest.preferences.allergies?.length &&
               !guest.preferences.notes && (
                <li className="no-prefs">No preferences recorded</li>
              )}
            </ul>
          )}
        </section>

        <section className="guest-stats">
          <h3>Guest Insights</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="value">{visits.length}</span>
              <span className="label">Total visits</span>
            </div>
            <div className="stat">
              <span className="value">${totalSpend.toLocaleString()}</span>
              <span className="label">Lifetime spend</span>
            </div>
            <div className="stat">
              <span className="value">{avgPartySize.toFixed(1)}</span>
              <span className="label">Avg party size</span>
            </div>
            <div className="stat">
              <span className="value">{uniqueLocations}</span>
              <span className="label">Locations visited</span>
            </div>
          </div>

          {favoriteLocation && (
            <p className="favorite-location">
              Most visited: <strong>{favoriteLocation}</strong>
            </p>
          )}
        </section>

        <section className="visit-history">
          <h3>Recent Visits</h3>
          <div className="visits-list">
            {visits.slice(0, 5).map(visit => (
              <div key={visit.id} className="visit-item">
                <div className="visit-main">
                  <span className="location">{visit.locationName}</span>
                  <span className="date">{formatDate(visit.date)}</span>
                </div>
                <div className="visit-details">
                  <span className="party">Party of {visit.partySize}</span>
                  <span className="amount">${visit.amount}</span>
                </div>
              </div>
            ))}
          </div>

          {visits.length > 5 && (
            <button className="view-all">
              View all {visits.length} visits
            </button>
          )}
        </section>
      </div>

      {onMergeProfiles && (
        <div className="profile-actions">
          <button
            onClick={() => {
              const secondaryId = prompt('Enter guest ID to merge into this profile:');
              if (secondaryId) onMergeProfiles(secondaryId);
            }}
            className="merge-btn"
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
