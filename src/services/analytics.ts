import { AggregatedMetrics, MetricsQuery, LocationMetrics } from '../types';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

/**
 * Aggregates metrics across multiple locations with proper timezone handling.
 *
 * IMPORTANT: Each location may be in a different timezone. When aggregating
 * daily data, we must normalize all timestamps to each location's local
 * timezone before grouping by date. Otherwise, a reservation at 11pm EST
 * would appear as 8pm PST and potentially be counted on the wrong day.
 */
export async function aggregateMetrics(query: MetricsQuery): Promise<AggregatedMetrics> {
  const locationMetrics = await Promise.all(
    query.locationIds.map(id => fetchLocationMetrics(id, query.startDate, query.endDate))
  );

  // Build daily data with proper timezone handling
  const dailyMap = new Map<string, DailyMetrics>();

  for (const location of locationMetrics) {
    for (const reservation of location.reservations) {
      // Convert to location's timezone before extracting date
      const localTime = toZonedTime(new Date(reservation.timestamp), location.timezone);
      const dateKey = formatInTimeZone(localTime, location.timezone, 'yyyy-MM-dd');

      const existing = dailyMap.get(dateKey) || createEmptyDayMetrics(dateKey, location.timezone);
      existing.reservations += 1;
      existing.covers += reservation.partySize;
      existing.revenue += reservation.estimatedRevenue || 0;
      dailyMap.set(dateKey, existing);
    }

    for (const walkIn of location.walkIns) {
      const localTime = toZonedTime(new Date(walkIn.timestamp), location.timezone);
      const dateKey = formatInTimeZone(localTime, location.timezone, 'yyyy-MM-dd');

      const existing = dailyMap.get(dateKey) || createEmptyDayMetrics(dateKey, location.timezone);
      existing.walkIns += 1;
      existing.covers += walkIn.partySize;
      dailyMap.set(dateKey, existing);
    }
  }

  // Calculate cross-location guest visits
  const guestLocationMap = new Map<string, Set<string>>();
  for (const location of locationMetrics) {
    for (const reservation of location.reservations) {
      const guestId = reservation.guestId;
      if (!guestLocationMap.has(guestId)) {
        guestLocationMap.set(guestId, new Set());
      }
      guestLocationMap.get(guestId)!.add(location.id);
    }
  }

  const crossLocationGuests = Array.from(guestLocationMap.values())
    .filter(locations => locations.size > 1).length;

  // Find top migration route
  const migrationCounts = new Map<string, number>();
  for (const location of locationMetrics) {
    for (const reservation of location.reservations) {
      if (reservation.previousLocationId && reservation.previousLocationId !== location.id) {
        const route = `${reservation.previousLocationId}->${location.id}`;
        migrationCounts.set(route, (migrationCounts.get(route) || 0) + 1);
      }
    }
  }

  const topMigrationRoute = Array.from(migrationCounts.entries())
    .sort((a, b) => b[1] - a[1])[0];

  return {
    totalReservations: locationMetrics.reduce((sum, l) => sum + l.reservations.length, 0),
    averagePartySize: calculateAveragePartySize(locationMetrics),
    peakHour: findPeakHour(locationMetrics),
    noShowRate: calculateNoShowRate(locationMetrics),
    noShowChange: calculateNoShowChange(locationMetrics),
    reservationGrowth: calculateReservationGrowth(locationMetrics),
    dailyData: Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
    crossLocationGuests,
    topMigration: topMigrationRoute
      ? parseRoute(topMigrationRoute[0], locationMetrics)
      : { from: 'N/A', to: 'N/A' },
    locationNames: Object.fromEntries(locationMetrics.map(l => [l.id, l.name])),
  };
}

function createEmptyDayMetrics(date: string, timezone: string): DailyMetrics {
  return {
    date,
    timezone,
    reservations: 0,
    walkIns: 0,
    covers: 0,
    revenue: 0,
  };
}

function calculateAveragePartySize(metrics: LocationMetrics[]): number {
  let total = 0;
  let count = 0;
  for (const location of metrics) {
    for (const res of location.reservations) {
      total += res.partySize;
      count++;
    }
  }
  return count > 0 ? total / count : 0;
}

function findPeakHour(metrics: LocationMetrics[]): string {
  const hourCounts = new Map<number, number>();

  for (const location of metrics) {
    for (const res of location.reservations) {
      const localTime = toZonedTime(new Date(res.timestamp), location.timezone);
      const hour = localTime.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    }
  }

  const peakHour = Array.from(hourCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 19;

  return `${peakHour % 12 || 12}:00 ${peakHour >= 12 ? 'PM' : 'AM'}`;
}

function calculateNoShowRate(metrics: LocationMetrics[]): number {
  let noShows = 0;
  let total = 0;
  for (const location of metrics) {
    for (const res of location.reservations) {
      total++;
      if (res.status === 'no_show') noShows++;
    }
  }
  return total > 0 ? noShows / total : 0;
}

function calculateNoShowChange(metrics: LocationMetrics[]): number {
  // Compare to previous period - simplified for demo
  return 0.3;
}

function calculateReservationGrowth(metrics: LocationMetrics[]): number {
  // Compare to previous period - simplified for demo
  return 12;
}

function parseRoute(route: string, metrics: LocationMetrics[]): { from: string; to: string } {
  const [fromId, toId] = route.split('->');
  const fromLocation = metrics.find(l => l.id === fromId);
  const toLocation = metrics.find(l => l.id === toId);
  return {
    from: fromLocation?.name || fromId,
    to: toLocation?.name || toId,
  };
}

async function fetchLocationMetrics(
  locationId: string,
  startDate: Date,
  endDate: Date
): Promise<LocationMetrics> {
  const response = await fetch(`/api/locations/${locationId}/metrics?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
  return response.json();
}

interface DailyMetrics {
  date: string;
  timezone: string;
  reservations: number;
  walkIns: number;
  covers: number;
  revenue: number;
}
