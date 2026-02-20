import { aggregateMetrics } from '../src/services/analytics';

// Mock fetch for testing
global.fetch = jest.fn();

const mockNYCLocation = {
  id: 'loc-nyc',
  name: 'NYC Downtown',
  timezone: 'America/New_York',
  reservations: [
    {
      id: 'res-1',
      guestId: 'guest-1',
      locationId: 'loc-nyc',
      tableId: 'table-1',
      timestamp: '2025-02-10T23:30:00Z', // 6:30pm EST
      partySize: 4,
      status: 'completed',
      estimatedRevenue: 200,
    },
    {
      id: 'res-2',
      guestId: 'guest-2',
      locationId: 'loc-nyc',
      tableId: 'table-2',
      timestamp: '2025-02-11T04:30:00Z', // 11:30pm EST on Feb 10
      partySize: 2,
      status: 'completed',
      estimatedRevenue: 150,
    },
  ],
  walkIns: [],
};

const mockLALocation = {
  id: 'loc-la',
  name: 'LA Waterfront',
  timezone: 'America/Los_Angeles',
  reservations: [
    {
      id: 'res-3',
      guestId: 'guest-3',
      locationId: 'loc-la',
      tableId: 'table-5',
      timestamp: '2025-02-11T04:00:00Z', // 8pm PST on Feb 10
      partySize: 6,
      status: 'completed',
      estimatedRevenue: 350,
    },
  ],
  walkIns: [],
};

describe('aggregateMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('timezone handling', () => {
    it('correctly attributes reservations to local dates', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockNYCLocation) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockLALocation) });

      const result = await aggregateMetrics({
        locationIds: ['loc-nyc', 'loc-la'],
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-11'),
      });

      // The 11:30pm EST reservation (04:30 UTC) should be counted on Feb 10, not Feb 11
      const feb10 = result.dailyData.find(d => d.date === '2025-02-10');
      const feb11 = result.dailyData.find(d => d.date === '2025-02-11');

      // Feb 10 should have: NYC 6:30pm (1) + NYC 11:30pm (1) + LA 8pm (1) = 3
      expect(feb10?.reservations).toBe(3);

      // Feb 11 should have no reservations (all were on Feb 10 in local time)
      expect(feb11?.reservations || 0).toBe(0);
    });

    it('handles invalid timestamps gracefully', async () => {
      const locationWithBadData = {
        ...mockNYCLocation,
        reservations: [
          ...mockNYCLocation.reservations,
          {
            id: 'res-bad',
            guestId: 'guest-x',
            locationId: 'loc-nyc',
            tableId: 'table-1',
            timestamp: 'invalid-date',
            partySize: 2,
            status: 'completed',
            estimatedRevenue: 100,
          },
        ],
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: () => Promise.resolve(locationWithBadData) });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await aggregateMetrics({
        locationIds: ['loc-nyc'],
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-11'),
      });

      // Should warn about invalid timestamp
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid timestamp')
      );

      // Should still process valid reservations
      expect(result.totalReservations).toBe(2);

      consoleSpy.mockRestore();
    });
  });

  describe('cross-location aggregation', () => {
    it('sums metrics across all locations', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockNYCLocation) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockLALocation) });

      const result = await aggregateMetrics({
        locationIds: ['loc-nyc', 'loc-la'],
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-11'),
      });

      expect(result.totalReservations).toBe(3);

      // Total covers: 4 + 2 + 6 = 12
      const totalCovers = result.dailyData.reduce((sum, d) => sum + d.covers, 0);
      expect(totalCovers).toBe(12);
    });

    it('calculates cross-location guests correctly', async () => {
      const nycWithSharedGuest = {
        ...mockNYCLocation,
        reservations: [
          {
            ...mockNYCLocation.reservations[0],
            guestId: 'shared-guest', // Same guest visits both
          },
        ],
      };

      const laWithSharedGuest = {
        ...mockLALocation,
        reservations: [
          {
            ...mockLALocation.reservations[0],
            guestId: 'shared-guest', // Same guest visits both
          },
        ],
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: () => Promise.resolve(nycWithSharedGuest) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(laWithSharedGuest) });

      const result = await aggregateMetrics({
        locationIds: ['loc-nyc', 'loc-la'],
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-11'),
      });

      expect(result.crossLocationGuests).toBe(1);
    });
  });

  describe('peak hour calculation', () => {
    it('uses local timezone for peak hour', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockNYCLocation) });

      const result = await aggregateMetrics({
        locationIds: ['loc-nyc'],
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-11'),
      });

      // 6:30pm and 11:30pm - peak should be one of these hours
      // Both are PM hours, so peak should show PM
      expect(result.peakHour).toMatch(/PM$/);
    });
  });
});
