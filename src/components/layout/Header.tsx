import { useState } from 'react';
import { locations } from '../../data/mockData';

interface HeaderProps {
  title: string;
  selectedLocationId: string;
  onLocationChange: (locationId: string) => void;
}

export function Header({ title, selectedLocationId, onLocationChange }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedLocationId}
            onChange={(e) => onLocationChange(e.target.value)}
            className="select w-64"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-slide-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <NotificationItem
                    title="VIP Guest Arriving"
                    message="Victoria Chen has a 6:30 PM reservation at SF"
                    time="5 min ago"
                    type="vip"
                  />
                  <NotificationItem
                    title="Large Party Confirmed"
                    message="8-person reservation confirmed for 7:30 PM NYC"
                    time="15 min ago"
                    type="info"
                  />
                  <NotificationItem
                    title="No-Show Alert"
                    message="James Thompson missed 6:30 PM reservation in Miami"
                    time="1 hour ago"
                    type="warning"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  type: 'vip' | 'info' | 'warning';
}

function NotificationItem({ title, message, time, type }: NotificationItemProps) {
  const iconColors = {
    vip: 'bg-amber-100 text-amber-600',
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-red-100 text-red-600',
  };

  return (
    <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[type]}`}>
          {type === 'vip' && <span className="text-sm">★</span>}
          {type === 'info' && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">{title}</p>
          <p className="text-sm text-slate-500 truncate">{message}</p>
          <p className="text-xs text-slate-400 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
