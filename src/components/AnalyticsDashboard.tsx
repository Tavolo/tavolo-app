import { useState, useEffect } from 'react';
import { LocationMetrics, AggregatedMetrics, DateRange } from '../types';
import { aggregateMetrics } from '../services/analytics';
import { formatInTimeZone } from 'date-fns-tz';

interface AnalyticsDashboardProps {
  locationIds: string[];
  dateRange: DateRange;
}

export function AnalyticsDashboard({ locationIds, dateRange }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | 'all'>('all');

  useEffect(() => {
    loadMetrics();
  }, [locationIds, dateRange, selectedLocation]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await aggregateMetrics({
        locationIds: selectedLocation === 'all' ? locationIds : [selectedLocation],
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (!metrics) {
    return <div className="error">Failed to load analytics</div>;
  }

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locationIds.map(id => (
            <option key={id} value={id}>{metrics.locationNames[id]}</option>
          ))}
        </select>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-value">{metrics.totalReservations}</span>
          <span className="metric-label">Total Reservations</span>
          <span className="metric-change positive">+{metrics.reservationGrowth}%</span>
        </div>

        <div className="metric-card">
          <span className="metric-value">{metrics.averagePartySize.toFixed(1)}</span>
          <span className="metric-label">Avg Party Size</span>
        </div>

        <div className="metric-card">
          <span className="metric-value">{metrics.peakHour}</span>
          <span className="metric-label">Peak Hour</span>
        </div>

        <div className="metric-card">
          <span className="metric-value">{(metrics.noShowRate * 100).toFixed(1)}%</span>
          <span className="metric-label">No-Show Rate</span>
          <span className="metric-change negative">+{metrics.noShowChange}%</span>
        </div>
      </div>

      <section className="daily-breakdown">
        <h2>Daily Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reservations</th>
              <th>Walk-ins</th>
              <th>Covers</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {metrics.dailyData.map(day => (
              <tr key={day.date}>
                <td>{formatInTimeZone(new Date(day.date), day.timezone, 'MMM d, yyyy')}</td>
                <td>{day.reservations}</td>
                <td>{day.walkIns}</td>
                <td>{day.covers}</td>
                <td>${day.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="cross-location-insights">
        <h2>Cross-Location Insights</h2>
        <div className="insight-card">
          <h3>Returning Guests</h3>
          <p>{metrics.crossLocationGuests} guests visited multiple locations this period</p>
        </div>
        <div className="insight-card">
          <h3>Top Migrating Route</h3>
          <p>{metrics.topMigration.from} → {metrics.topMigration.to}</p>
        </div>
      </section>
    </div>
  );
}
