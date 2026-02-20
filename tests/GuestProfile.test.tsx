import { render, screen, fireEvent } from '@testing-library/react';
import { GuestProfile } from '../src/components/GuestProfile';

const mockGuest = {
  id: 'guest-1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '555-123-4567',
  isVIP: true,
  preferences: {
    seating: 'booth' as const,
    allergies: ['shellfish', 'peanuts'],
    notes: 'Prefers quiet tables',
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2025-01-20T15:30:00Z',
};

const mockVisits = [
  {
    id: 'visit-1',
    guestId: 'guest-1',
    locationId: 'loc-1',
    locationName: 'Downtown',
    date: '2025-01-15',
    partySize: 4,
    amount: 280,
    tableId: 'table-12',
  },
  {
    id: 'visit-2',
    guestId: 'guest-1',
    locationId: 'loc-2',
    locationName: 'Waterfront',
    date: '2025-01-08',
    partySize: 2,
    amount: 150,
    tableId: 'table-5',
  },
  {
    id: 'visit-3',
    guestId: 'guest-1',
    locationId: 'loc-1',
    locationName: 'Downtown',
    date: '2024-12-20',
    partySize: 6,
    amount: 520,
    tableId: 'table-8',
  },
];

describe('GuestProfile', () => {
  it('renders guest name and contact info', () => {
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('john.smith@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-123-4567')).toBeInTheDocument();
  });

  it('shows VIP badge for VIP guests', () => {
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText(/VIP/)).toBeInTheDocument();
  });

  it('displays allergy warnings', () => {
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText(/shellfish, peanuts/)).toBeInTheDocument();
  });

  it('calculates and displays correct stats', () => {
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={jest.fn()}
      />
    );

    // Total visits
    expect(screen.getByText('3')).toBeInTheDocument();

    // Total spend ($280 + $150 + $520 = $950)
    expect(screen.getByText('$950')).toBeInTheDocument();

    // Locations visited (Downtown, Waterfront = 2)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows multi-location badge when guest visited multiple locations', () => {
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText('2 locations')).toBeInTheDocument();
  });

  it('allows editing preferences', () => {
    const onUpdate = jest.fn();
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={onUpdate}
      />
    );

    // Click edit button
    fireEvent.click(screen.getByText('Edit'));

    // Should show form elements
    expect(screen.getByLabelText(/Seating preference/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Allergies/)).toBeInTheDocument();
  });

  it('displays favorite location', () => {
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={jest.fn()}
      />
    );

    // Downtown has 2 visits, Waterfront has 1
    expect(screen.getByText(/Downtown/)).toBeInTheDocument();
  });

  it('shows recent visits', () => {
    render(
      <GuestProfile
        guest={mockGuest}
        visits={mockVisits}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText('Party of 4')).toBeInTheDocument();
    expect(screen.getByText('$280')).toBeInTheDocument();
  });
});

describe('VIP Tier Calculation', () => {
  it('returns gold for 20+ visits', () => {
    const manyVisits = Array(25).fill(mockVisits[0]);
    render(
      <GuestProfile
        guest={mockGuest}
        visits={manyVisits}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText(/Gold VIP/)).toBeInTheDocument();
  });

  it('returns gold for $5000+ spend', () => {
    const highSpendVisits = [
      { ...mockVisits[0], amount: 3000 },
      { ...mockVisits[1], amount: 2500 },
    ];
    render(
      <GuestProfile
        guest={mockGuest}
        visits={highSpendVisits}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText(/Gold VIP/)).toBeInTheDocument();
  });
});
