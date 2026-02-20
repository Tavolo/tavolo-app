import { AggregatedMetrics, MetricsQuery, LocationMetrics, DailyData } from '../types';
import { analyticsData, locations } from '../data/mockData';

/**
 * Aggregates metrics across multiple locations with proper timezone handling.
 *
 * For demo purposes, this returns mock data.
 * In production, this would fetch from the backend API.
 */
export async function aggregateMetrics(query: MetricsQuery): Promise<AggregatedMetrics> {
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
  return {
    ...analyticsData,
    locationNames: Object.keys(filteredLocationNames).length > 0
      ? filteredLocationNames
      : analyticsData.locationNames,
  };
}
