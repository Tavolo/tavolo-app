import { useState } from 'react';
import { Layout } from '../src/components/layout/Layout';
import { locations, analyticsData } from '../src/data/mockData';

export default function Analytics() {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const metrics = analyticsData;

  return (
    <Layout title="Analytics">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="select w-64"
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range.value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <button className="btn-secondary ml-auto">
            Export Report
          </button>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Total Reservations"
            value={metrics.totalReservations.toLocaleString()}
            change={`+${metrics.reservationGrowth}%`}
            positive
          />
          <MetricCard
            label="Average Party Size"
            value={metrics.averagePartySize.toFixed(1)}
          />
          <MetricCard
            label="Peak Hour"
            value={metrics.peakHour}
          />
          <MetricCard
            label="No-Show Rate"
            value={`${(metrics.noShowRate * 100).toFixed(1)}%`}
            change={`${metrics.noShowChange > 0 ? '+' : ''}${metrics.noShowChange}%`}
            positive={metrics.noShowChange < 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Chart Placeholder */}
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Daily Overview</h2>
            <div className="h-80 flex items-end gap-2">
              {metrics.dailyData.map((day, index) => {
                const maxReservations = Math.max(...metrics.dailyData.map(d => d.reservations));
                const height = (day.reservations / maxReservations) * 100;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-tavolo-500 rounded-t-md transition-all hover:bg-tavolo-600"
                      style={{ height: `${height}%` }}
                      title={`${day.reservations} reservations`}
                    />
                    <span className="text-xs text-slate-500 -rotate-45 origin-left whitespace-nowrap">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cross-Location Insights */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Cross-Location Insights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-tavolo-50 rounded-lg">
                <p className="text-sm text-tavolo-600 font-medium">Returning Guests</p>
                <p className="text-2xl font-bold text-tavolo-900 mt-1">{metrics.crossLocationGuests}</p>
                <p className="text-sm text-tavolo-500 mt-1">visited multiple locations</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium">Top Migration Route</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium text-slate-900">{metrics.topMigration.from.replace('Tavolo ', '')}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-sm font-medium text-slate-900">{metrics.topMigration.to.replace('Tavolo ', '')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Daily Breakdown</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reservations</th>
                  <th>Walk-ins</th>
                  <th>Total Covers</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {metrics.dailyData.map(day => (
                  <tr key={day.date}>
                    <td className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>{day.reservations}</td>
                    <td>{day.walkIns}</td>
                    <td>{day.covers}</td>
                    <td className="font-medium text-green-600">${day.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td className="font-semibold">Total</td>
                  <td className="font-semibold">{metrics.dailyData.reduce((sum, d) => sum + d.reservations, 0)}</td>
                  <td className="font-semibold">{metrics.dailyData.reduce((sum, d) => sum + d.walkIns, 0)}</td>
                  <td className="font-semibold">{metrics.dailyData.reduce((sum, d) => sum + d.covers, 0)}</td>
                  <td className="font-semibold text-green-600">
                    ${metrics.dailyData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

function MetricCard({ label, value, change, positive }: MetricCardProps) {
  return (
    <div className="metric-card">
      <span className="metric-value">{value}</span>
      <span className="metric-label">{label}</span>
      {change && (
        <span className={`metric-change ${positive ? 'positive' : 'negative'}`}>
          {positive ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {change}
        </span>
      )}
    </div>
  );
}
