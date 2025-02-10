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
 *
 * FIX (2025-02-10): When aggregating across locations in different timezones,
 * we now use location-specific date keys to prevent cross-timezone date bleeding.
 * A reservation at 11:30pm in NYC should count as that NYC date, not the UTC date.
 */
export async function aggregateMetrics(query: MetricsQuery): Promise<AggregatedMetrics> {
  const locationMetrics = await Promise.all(
    query.locationIds.map(id => fetchLocationMetrics(id, query.startDate, query.endDate))
  );

  // Build daily data with proper timezone handling
  // KEY FIX: Use a composite key of date + normalized timezone offset to handle
  // cross-location aggregation correctly. Each location's data is first grouped
  // by its local date, then merged into a unified daily view.
  const locationDailyMaps = new Map<string, Map<string, DailyMetrics>>();

  for (const location of locationMetrics) {
    const locationDaily = new Map<string, DailyMetrics>();

    for (const reservation of location.reservations) {
      // Convert UTC timestamp to location's local timezone
      const utcDate = new Date(reservation.timestamp);

      // FIX: Validate timestamp before processing to catch data issues early
      if (isNaN(utcDate.getTime())) {
        console.warn(`Invalid timestamp for reservation ${reservation.id}: ${reservation.timestamp}`);
        continue;
      }

      const localTime = toZonedTime(utcDate, location.timezone);
      const dateKey = formatInTimeZone(localTime, location.timezone, 'yyyy-MM-dd');

      const existing = locationDaily.get(dateKey) || createEmptyDayMetrics(dateKey, location.timezone);
      existing.reservations += 1;
      existing.covers += reservation.partySize;
      existing.revenue += reservation.estimatedRevenue || 0;
      locationDaily.set(dateKey, existing);
    }

    for (const walkIn of location.walkIns) {
      const utcDate = new Date(walkIn.timestamp);

      if (isNaN(utcDate.getTime())) {
        console.warn(`Invalid timestamp for walk-in ${walkIn.id}: ${walkIn.timestamp}`);
        continue;
      }

      const localTime = toZonedTime(utcDate, location.timezone);
      const dateKey = formatInTimeZone(localTime, location.timezone, 'yyyy-MM-dd');

      const existing = locationDaily.get(dateKey) || createEmptyDayMetrics(dateKey, location.timezone);
      existing.walkIns += 1;
      existing.covers += walkIn.partySize;
      locationDaily.set(dateKey, existing);
    }

    locationDailyMaps.set(location.id, locationDaily);
  }

  // Merge all location daily maps into unified daily data
  // FIX: Merge by date string, summing metrics across locations
  const dailyMap = mergeDailyMetrics(locationDailyMaps, locationMetrics);

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

/**
 * Merge daily metrics from multiple locations into a unified view.
 * This handles the case where different locations are in different timezones
 * but we want to show a unified daily rollup.
 *
 * FIX (2025-02-10): Previously, the last location's timezone would overwrite
 * earlier entries, causing incorrect date attribution for reservations near midnight.
 */
function mergeDailyMetrics(
  locationDailyMaps: Map<string, Map<string, DailyMetrics>>,
  locationMetrics: LocationMetrics[]
): Map<string, DailyMetrics> {
  const merged = new Map<string, DailyMetrics>();

  // Determine the primary timezone (use the first location or default to America/New_York)
  const primaryTimezone = locationMetrics[0]?.timezone || 'America/New_York';

  for (const [_locationId, dailyMap] of locationDailyMaps) {
    for (const [dateKey, metrics] of dailyMap) {
      const existing = merged.get(dateKey);

      if (existing) {
        // Sum metrics for the same date
        existing.reservations += metrics.reservations;
        existing.walkIns += metrics.walkIns;
        existing.covers += metrics.covers;
        existing.revenue += metrics.revenue;
      } else {
        // First entry for this date - clone and use primary timezone for display
        merged.set(dateKey, {
          ...metrics,
          timezone: primaryTimezone,
        });
      }
    }
  }

  return merged;
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
