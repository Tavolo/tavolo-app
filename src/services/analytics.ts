import { AggregatedMetrics, MetricsQuery, LocationMetrics, DailyData } from '../types';
import { analyticsData, locations } from '../data/mockData';

/**
 * Query optimization hints for analytics queries.
 * In production, these would be used to add database index hints.
 */
const QUERY_INDEX_HINTS = {
  reservationsByDate: 'idx_reservations_location_date',
  guestsBySpend: 'idx_guests_total_spend_desc',
  dailyMetrics: 'idx_daily_metrics_location_date',
} as const;

/**
 * Cache TTL for analytics data (5 minutes)
 */
const METRICS_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Simple in-memory cache for analytics results
 */
const metricsCache = new Map<string, { data: AggregatedMetrics; timestamp: number }>();

function getCacheKey(query: MetricsQuery): string {
  return `${query.locationIds.sort().join(',')}-${query.startDate}-${query.endDate}`;
}

/**
 * Aggregates metrics across multiple locations with proper timezone handling.
 *
 * For demo purposes, this returns mock data.
 * In production, this would fetch from the backend API with index hints.
 */
export async function aggregateMetrics(query: MetricsQuery): Promise<AggregatedMetrics> {
  // Check cache first for performance
  const cacheKey = getCacheKey(query);
  const cached = metricsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < METRICS_CACHE_TTL_MS) {
    return cached.data;
  }
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter location names based on query
  const filteredLocationNames: Record<string, string> = {};
  query.locationIds.forEach(id => {
    const location = locations.find(l => l.id === id);
    if (location) {
      filteredLocationNames[id] = location.name;
    }
  });

  // Return mock data with filtered locations
  const result = {
    ...analyticsData,
    locationNames: Object.keys(filteredLocationNames).length > 0
      ? filteredLocationNames
      : analyticsData.locationNames,
  };

  // Cache the result
  metricsCache.set(cacheKey, { data: result, timestamp: Date.now() });

  return result;
}

/**
 * Clear the metrics cache (useful after data updates)
 */
export function clearMetricsCache(): void {
  metricsCache.clear();
}
