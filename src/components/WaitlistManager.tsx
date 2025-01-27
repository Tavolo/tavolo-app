import { useState, useEffect } from 'react';
import { formatRelativeTime } from '../utils/dates';

interface WaitlistEntry {
  id: string;
  guestName: string;
  partySize: number;
  phone: string;
  addedAt: string;
  estimatedWait: number;
  notes?: string;
  preferences?: string;
}

interface WaitlistManagerProps {
  locationId: string;
  onSeatGuest: (entryId: string, tableId: string) => void;
}

export function WaitlistManager({ locationId, onSeatGuest }: WaitlistManagerProps) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    guestName: '',
    partySize: 2,
    phone: '',
    notes: '',
  });

  useEffect(() => {
    loadWaitlist();
    const interval = setInterval(loadWaitlist, 30000);
    return () => clearInterval(interval);
  }, [locationId]);

  const loadWaitlist = async () => {
    const response = await fetch(`/api/locations/${locationId}/waitlist`);
    const data = await response.json();
    setEntries(data);
  };

  const handleAddToWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/locations/${locationId}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });
    setNewEntry({ guestName: '', partySize: 2, phone: '', notes: '' });
    await loadWaitlist();
  };

  const handleRemove = async (entryId: string) => {
    await fetch(`/api/locations/${locationId}/waitlist/${entryId}`, {
      method: 'DELETE',
    });
    await loadWaitlist();
  };

  const handleNotify = async (entry: WaitlistEntry) => {
    await fetch(`/api/locations/${locationId}/waitlist/${entry.id}/notify`, {
      method: 'POST',
    });
    alert(`SMS sent to ${entry.phone}`);
  };

  return (
    <div className="waitlist-manager">
      <h2>Waitlist</h2>

      <form onSubmit={handleAddToWaitlist} className="add-form">
        <input
          type="text"
          placeholder="Guest name"
          value={newEntry.guestName}
          onChange={(e) => setNewEntry({ ...newEntry, guestName: e.target.value })}
          required
        />
        <input
          type="number"
          min={1}
          max={20}
          value={newEntry.partySize}
          onChange={(e) => setNewEntry({ ...newEntry, partySize: parseInt(e.target.value) })}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={newEntry.phone}
          onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Notes"
          value={newEntry.notes}
          onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
        />
        <button type="submit">Add to Waitlist</button>
      </form>

      <div className="waitlist-entries">
        {entries.length === 0 ? (
          <p className="empty">No one on the waitlist</p>
        ) : (
          entries.map((entry, index) => (
            <div key={entry.id} className="waitlist-entry">
              <span className="position">#{index + 1}</span>
              <div className="entry-details">
                <span className="name">{entry.guestName}</span>
                <span className="party">Party of {entry.partySize}</span>
                <span className="wait">
                  {formatRelativeTime(entry.addedAt)} - Est. {entry.estimatedWait} min
                </span>
                {entry.notes && <span className="notes">{entry.notes}</span>}
              </div>
              <div className="entry-actions">
                <button onClick={() => handleNotify(entry)}>Notify</button>
                <button onClick={() => onSeatGuest(entry.id, '')}>Seat</button>
                <button onClick={() => handleRemove(entry.id)} className="remove">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
