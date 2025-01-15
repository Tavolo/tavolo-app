import { Guest, VisitHistory } from '../types';
import { formatDate } from '../utils/dates';

interface GuestProfileProps {
  guest: Guest;
  visits: VisitHistory[];
  onUpdate: (guest: Guest) => void;
}

export function GuestProfile({ guest, visits, onUpdate }: GuestProfileProps) {
  const totalSpend = visits.reduce((sum, v) => sum + v.amount, 0);
  const avgPartySize = visits.reduce((sum, v) => sum + v.partySize, 0) / visits.length;

  return (
    <div className="guest-profile">
      <header className="guest-header">
        <h2>{guest.firstName} {guest.lastName}</h2>
        <span className="visit-count">{visits.length} visits</span>
        {guest.isVIP && <span className="vip-badge">VIP</span>}
      </header>

      <section className="preferences">
        <h3>Preferences</h3>
        <ul>
          {guest.preferences.seating && (
            <li>Seating: {guest.preferences.seating}</li>
          )}
          {guest.preferences.allergies?.length > 0 && (
            <li className="allergy-warning">
              Allergies: {guest.preferences.allergies.join(', ')}
            </li>
          )}
          {guest.preferences.occasions && (
            <li>Special occasions: {guest.preferences.occasions}</li>
          )}
        </ul>
      </section>

      <section className="visit-history">
        <h3>Recent Visits</h3>
        {visits.slice(0, 5).map(visit => (
          <div key={visit.id} className="visit-item">
            <span className="location">{visit.locationName}</span>
            <span className="date">{formatDate(visit.date)}</span>
            <span className="party">Party of {visit.partySize}</span>
          </div>
        ))}
      </section>

      <section className="guest-stats">
        <div className="stat">
          <span className="value">${totalSpend.toLocaleString()}</span>
          <span className="label">Lifetime spend</span>
        </div>
        <div className="stat">
          <span className="value">{avgPartySize.toFixed(1)}</span>
          <span className="label">Avg party size</span>
        </div>
      </section>
    </div>
  );
}
