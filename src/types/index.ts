export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isVIP: boolean;
  preferences: GuestPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface GuestPreferences {
  seating?: 'booth' | 'window' | 'patio' | 'bar' | 'corner' | 'private';
  allergies?: string[];
  dietaryRestrictions?: string[];
  occasions?: string;
  notes?: string;
}

export interface VisitHistory {
  id: string;
  guestId: string;
  locationId: string;
  locationName: string;
  date: string;
  partySize: number;
  amount: number;
  tableId: string;
  serverId?: string;
  notes?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  tables: Table[];
  dimensions: { width: number; height: number };
  createdAt: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  position: TablePosition;
  size: TableSize;
  shape: 'round' | 'square' | 'rectangle';
  section: string;
}

export interface TablePosition {
  x: number;
  y: number;
}

export interface TableSize {
  width: number;
  height: number;
}

export interface ImportResult {
  success: boolean;
  floorPlanId: string;
  tablesImported: number;
  warnings?: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  timezone: string;
  floorPlanId?: string;
  settings: LocationSettings;
}

export interface LocationSettings {
  defaultReservationDuration: number;
  maxPartySize: number;
  acceptWalkIns: boolean;
  requireDeposit: boolean;
  depositAmount?: number;
}

export interface Reservation {
  id: string;
  guestId: string;
  locationId: string;
  tableId: string;
  timestamp: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'no_show' | 'cancelled';
  notes?: string;
  estimatedRevenue?: number;
  previousLocationId?: string;
}

export interface WalkIn {
  id: string;
  locationId: string;
  tableId: string;
  timestamp: string;
  partySize: number;
  guestId?: string;
}

export interface LocationMetrics {
  id: string;
  name: string;
  timezone: string;
  reservations: Reservation[];
  walkIns: WalkIn[];
}

export interface MetricsQuery {
  locationIds: string[];
  startDate: Date;
  endDate: Date;
}

export interface AggregatedMetrics {
  totalReservations: number;
  averagePartySize: number;
  peakHour: string;
  noShowRate: number;
  noShowChange: number;
  reservationGrowth: number;
  dailyData: DailyData[];
  crossLocationGuests: number;
  topMigration: { from: string; to: string };
  locationNames: Record<string, string>;
}

export interface DailyData {
  date: string;
  timezone: string;
  reservations: number;
  walkIns: number;
  covers: number;
  revenue: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}
