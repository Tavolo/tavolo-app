import { Location, Guest, Reservation, VisitHistory, AggregatedMetrics, DailyData, FloorPlan, Table } from '../types';

// 3 Restaurant Locations across different timezones
export const locations: Location[] = [
  {
    id: 'loc-sf',
    name: 'Tavolo San Francisco',
    address: '425 Market St, San Francisco, CA 94105',
    timezone: 'America/Los_Angeles',
    floorPlanId: 'fp-sf',
    settings: {
      defaultReservationDuration: 90,
      maxPartySize: 12,
      acceptWalkIns: true,
      requireDeposit: false,
    },
  },
  {
    id: 'loc-nyc',
    name: 'Tavolo New York',
    address: '220 Park Ave S, New York, NY 10003',
    timezone: 'America/New_York',
    floorPlanId: 'fp-nyc',
    settings: {
      defaultReservationDuration: 120,
      maxPartySize: 16,
      acceptWalkIns: true,
      requireDeposit: true,
      depositAmount: 50,
    },
  },
  {
    id: 'loc-miami',
    name: 'Tavolo Miami',
    address: '1601 Collins Ave, Miami Beach, FL 33139',
    timezone: 'America/New_York',
    floorPlanId: 'fp-miami',
    settings: {
      defaultReservationDuration: 90,
      maxPartySize: 20,
      acceptWalkIns: true,
      requireDeposit: false,
    },
  },
];

// Guest profiles with varying VIP status and preferences
export const guests: Guest[] = [
  {
    id: 'guest-1',
    firstName: 'Victoria',
    lastName: 'Chen',
    email: 'victoria.chen@gmail.com',
    phone: '(415) 555-0123',
    isVIP: true,
    preferences: {
      seating: 'window',
      allergies: ['shellfish'],
      dietaryRestrictions: ['pescatarian'],
      notes: 'Prefers sparkling water. Always celebrates birthdays here.',
    },
    createdAt: '2022-03-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'guest-2',
    firstName: 'Marcus',
    lastName: 'Williams',
    email: 'marcus.w@outlook.com',
    phone: '(212) 555-0456',
    isVIP: true,
    preferences: {
      seating: 'booth',
      allergies: ['peanuts', 'tree nuts'],
      notes: 'Wine collector. Ask sommelier to present special bottles.',
    },
    createdAt: '2021-08-22T16:00:00Z',
    updatedAt: '2024-02-10T09:15:00Z',
  },
  {
    id: 'guest-3',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@company.com',
    phone: '(305) 555-0789',
    isVIP: false,
    preferences: {
      seating: 'patio',
      dietaryRestrictions: ['vegetarian'],
    },
    createdAt: '2023-06-10T11:00:00Z',
    updatedAt: '2024-01-05T18:20:00Z',
  },
  {
    id: 'guest-4',
    firstName: 'James',
    lastName: 'Thompson',
    email: 'j.thompson@techstartup.io',
    phone: '(415) 555-1234',
    isVIP: true,
    preferences: {
      seating: 'private',
      notes: 'Hosts client dinners frequently. Needs quiet space for business discussions.',
    },
    createdAt: '2022-11-01T09:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z',
  },
  {
    id: 'guest-5',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.r@email.com',
    phone: '(212) 555-5678',
    isVIP: false,
    preferences: {
      seating: 'bar',
      allergies: ['gluten'],
      dietaryRestrictions: ['gluten-free'],
    },
    createdAt: '2023-09-20T14:00:00Z',
    updatedAt: '2024-01-28T16:45:00Z',
  },
  {
    id: 'guest-6',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@venture.vc',
    phone: '(415) 555-9012',
    isVIP: true,
    preferences: {
      seating: 'corner',
      notes: 'Investor. Often brings founders for dinner meetings. Comp dessert.',
    },
    createdAt: '2022-05-18T10:30:00Z',
    updatedAt: '2024-02-18T08:00:00Z',
  },
  {
    id: 'guest-7',
    firstName: 'Rachel',
    lastName: 'Anderson',
    email: 'rachel.a@magazine.com',
    phone: '(305) 555-3456',
    isVIP: false,
    preferences: {
      seating: 'patio',
      dietaryRestrictions: ['vegan'],
      notes: 'Food critic. Ensure chef is notified.',
    },
    createdAt: '2023-12-05T13:00:00Z',
    updatedAt: '2024-02-01T10:30:00Z',
  },
  {
    id: 'guest-8',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'mike.brown@law.com',
    phone: '(212) 555-7890',
    isVIP: true,
    preferences: {
      seating: 'booth',
      allergies: ['dairy'],
      notes: 'Partner at law firm. Bills go to corporate account #4521.',
    },
    createdAt: '2021-10-12T15:00:00Z',
    updatedAt: '2024-02-12T11:20:00Z',
  },
];

// Generate today's date for reservations
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

// Today's reservations across all locations
export const reservations: Reservation[] = [
  // San Francisco
  {
    id: 'res-sf-1',
    guestId: 'guest-1',
    locationId: 'loc-sf',
    tableId: 'T1',
    timestamp: `${todayStr}T18:30:00-08:00`,
    partySize: 4,
    status: 'confirmed',
    notes: 'Anniversary dinner',
    estimatedRevenue: 320,
  },
  {
    id: 'res-sf-2',
    guestId: 'guest-4',
    locationId: 'loc-sf',
    tableId: 'T5',
    timestamp: `${todayStr}T19:00:00-08:00`,
    partySize: 6,
    status: 'confirmed',
    notes: 'Client meeting - needs private room',
    estimatedRevenue: 580,
  },
  {
    id: 'res-sf-3',
    guestId: 'guest-6',
    locationId: 'loc-sf',
    tableId: 'T3',
    timestamp: `${todayStr}T12:00:00-08:00`,
    partySize: 2,
    status: 'completed',
    estimatedRevenue: 180,
  },
  {
    id: 'res-sf-4',
    guestId: 'guest-3',
    locationId: 'loc-sf',
    tableId: 'T8',
    timestamp: `${todayStr}T20:00:00-08:00`,
    partySize: 3,
    status: 'pending',
    estimatedRevenue: 210,
  },
  {
    id: 'res-sf-5',
    guestId: 'guest-5',
    locationId: 'loc-sf',
    tableId: 'T2',
    timestamp: `${todayStr}T13:30:00-08:00`,
    partySize: 2,
    status: 'seated',
    estimatedRevenue: 140,
  },

  // New York
  {
    id: 'res-nyc-1',
    guestId: 'guest-2',
    locationId: 'loc-nyc',
    tableId: 'T12',
    timestamp: `${todayStr}T19:30:00-05:00`,
    partySize: 8,
    status: 'confirmed',
    notes: 'Birthday celebration - needs cake',
    estimatedRevenue: 920,
  },
  {
    id: 'res-nyc-2',
    guestId: 'guest-8',
    locationId: 'loc-nyc',
    tableId: 'T7',
    timestamp: `${todayStr}T20:00:00-05:00`,
    partySize: 4,
    status: 'confirmed',
    notes: 'Corporate account',
    estimatedRevenue: 450,
  },
  {
    id: 'res-nyc-3',
    guestId: 'guest-5',
    locationId: 'loc-nyc',
    tableId: 'T3',
    timestamp: `${todayStr}T18:00:00-05:00`,
    partySize: 2,
    status: 'seated',
    estimatedRevenue: 160,
  },
  {
    id: 'res-nyc-4',
    guestId: 'guest-1',
    locationId: 'loc-nyc',
    tableId: 'T9',
    timestamp: `${todayStr}T21:00:00-05:00`,
    partySize: 2,
    status: 'pending',
    notes: 'Visiting from SF',
    previousLocationId: 'loc-sf',
    estimatedRevenue: 280,
  },

  // Miami
  {
    id: 'res-miami-1',
    guestId: 'guest-3',
    locationId: 'loc-miami',
    tableId: 'T4',
    timestamp: `${todayStr}T19:00:00-05:00`,
    partySize: 4,
    status: 'confirmed',
    estimatedRevenue: 340,
  },
  {
    id: 'res-miami-2',
    guestId: 'guest-7',
    locationId: 'loc-miami',
    tableId: 'T10',
    timestamp: `${todayStr}T20:30:00-05:00`,
    partySize: 2,
    status: 'confirmed',
    notes: 'Food reviewer - chef tasting menu',
    estimatedRevenue: 450,
  },
  {
    id: 'res-miami-3',
    guestId: 'guest-4',
    locationId: 'loc-miami',
    tableId: 'T6',
    timestamp: `${todayStr}T18:30:00-05:00`,
    partySize: 6,
    status: 'no_show',
    estimatedRevenue: 0,
  },
];

// Visit history for guests
export const visitHistory: Record<string, VisitHistory[]> = {
  'guest-1': [
    { id: 'v1-1', guestId: 'guest-1', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-02-10', partySize: 4, amount: 380, tableId: 'T1' },
    { id: 'v1-2', guestId: 'guest-1', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-01-15', partySize: 2, amount: 220, tableId: 'T3' },
    { id: 'v1-3', guestId: 'guest-1', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-02', partySize: 4, amount: 520, tableId: 'T9' },
    { id: 'v1-4', guestId: 'guest-1', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2023-12-24', partySize: 6, amount: 780, tableId: 'T5' },
    { id: 'v1-5', guestId: 'guest-1', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2023-11-28', partySize: 2, amount: 190, tableId: 'T2' },
    { id: 'v1-6', guestId: 'guest-1', locationId: 'loc-miami', locationName: 'Tavolo Miami', date: '2023-11-05', partySize: 4, amount: 410, tableId: 'T4' },
    { id: 'v1-7', guestId: 'guest-1', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2023-10-15', partySize: 2, amount: 180, tableId: 'T1' },
    { id: 'v1-8', guestId: 'guest-1', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2023-09-22', partySize: 4, amount: 340, tableId: 'T3' },
  ],
  'guest-2': [
    { id: 'v2-1', guestId: 'guest-2', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-02-08', partySize: 6, amount: 1200, tableId: 'T12', notes: 'Wine pairing dinner' },
    { id: 'v2-2', guestId: 'guest-2', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-20', partySize: 4, amount: 850, tableId: 'T7' },
    { id: 'v2-3', guestId: 'guest-2', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-05', partySize: 2, amount: 420, tableId: 'T3' },
    { id: 'v2-4', guestId: 'guest-2', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2023-12-15', partySize: 4, amount: 680, tableId: 'T5' },
    { id: 'v2-5', guestId: 'guest-2', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2023-11-28', partySize: 8, amount: 1500, tableId: 'T12' },
  ],
  'guest-3': [
    { id: 'v3-1', guestId: 'guest-3', locationId: 'loc-miami', locationName: 'Tavolo Miami', date: '2024-02-05', partySize: 3, amount: 240, tableId: 'T4' },
    { id: 'v3-2', guestId: 'guest-3', locationId: 'loc-miami', locationName: 'Tavolo Miami', date: '2024-01-18', partySize: 2, amount: 180, tableId: 'T10' },
    { id: 'v3-3', guestId: 'guest-3', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-01-02', partySize: 4, amount: 320, tableId: 'T8' },
  ],
  'guest-4': [
    { id: 'v4-1', guestId: 'guest-4', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-02-12', partySize: 8, amount: 1450, tableId: 'T5', notes: 'Client dinner - Series B celebration' },
    { id: 'v4-2', guestId: 'guest-4', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-01-28', partySize: 6, amount: 980, tableId: 'T5' },
    { id: 'v4-3', guestId: 'guest-4', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-15', partySize: 4, amount: 720, tableId: 'T7' },
    { id: 'v4-4', guestId: 'guest-4', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-01-05', partySize: 2, amount: 280, tableId: 'T3' },
    { id: 'v4-5', guestId: 'guest-4', locationId: 'loc-miami', locationName: 'Tavolo Miami', date: '2023-12-20', partySize: 4, amount: 520, tableId: 'T6' },
  ],
  'guest-5': [
    { id: 'v5-1', guestId: 'guest-5', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-02-01', partySize: 2, amount: 160, tableId: 'T3' },
    { id: 'v5-2', guestId: 'guest-5', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-10', partySize: 2, amount: 140, tableId: 'B1' },
  ],
  'guest-6': [
    { id: 'v6-1', guestId: 'guest-6', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-02-15', partySize: 4, amount: 890, tableId: 'T3', notes: 'Founder dinner' },
    { id: 'v6-2', guestId: 'guest-6', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-02-01', partySize: 2, amount: 320, tableId: 'T1' },
    { id: 'v6-3', guestId: 'guest-6', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2024-01-18', partySize: 6, amount: 1100, tableId: 'T5' },
    { id: 'v6-4', guestId: 'guest-6', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-08', partySize: 4, amount: 680, tableId: 'T9' },
    { id: 'v6-5', guestId: 'guest-6', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2023-12-28', partySize: 2, amount: 240, tableId: 'T2' },
    { id: 'v6-6', guestId: 'guest-6', locationId: 'loc-sf', locationName: 'Tavolo San Francisco', date: '2023-12-10', partySize: 4, amount: 520, tableId: 'T3' },
  ],
  'guest-7': [
    { id: 'v7-1', guestId: 'guest-7', locationId: 'loc-miami', locationName: 'Tavolo Miami', date: '2024-01-25', partySize: 2, amount: 380, tableId: 'T10', notes: 'Reviewing new menu' },
  ],
  'guest-8': [
    { id: 'v8-1', guestId: 'guest-8', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-02-10', partySize: 4, amount: 680, tableId: 'T7' },
    { id: 'v8-2', guestId: 'guest-8', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-22', partySize: 6, amount: 920, tableId: 'T12' },
    { id: 'v8-3', guestId: 'guest-8', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2024-01-05', partySize: 2, amount: 340, tableId: 'T3' },
    { id: 'v8-4', guestId: 'guest-8', locationId: 'loc-nyc', locationName: 'Tavolo New York', date: '2023-12-18', partySize: 4, amount: 580, tableId: 'T7' },
  ],
};

// Analytics mock data
export const analyticsData: AggregatedMetrics = {
  totalReservations: 847,
  averagePartySize: 3.8,
  peakHour: '7:30 PM',
  noShowRate: 0.042,
  noShowChange: -0.8,
  reservationGrowth: 12.5,
  crossLocationGuests: 24,
  topMigration: { from: 'Tavolo San Francisco', to: 'Tavolo New York' },
  locationNames: {
    'loc-sf': 'Tavolo San Francisco',
    'loc-nyc': 'Tavolo New York',
    'loc-miami': 'Tavolo Miami',
  },
  dailyData: [
    { date: '2024-02-19', timezone: 'America/Los_Angeles', reservations: 42, walkIns: 18, covers: 168, revenue: 14250 },
    { date: '2024-02-18', timezone: 'America/Los_Angeles', reservations: 58, walkIns: 24, covers: 224, revenue: 19800 },
    { date: '2024-02-17', timezone: 'America/Los_Angeles', reservations: 65, walkIns: 32, covers: 268, revenue: 24500 },
    { date: '2024-02-16', timezone: 'America/Los_Angeles', reservations: 38, walkIns: 14, covers: 142, revenue: 12100 },
    { date: '2024-02-15', timezone: 'America/Los_Angeles', reservations: 44, walkIns: 16, covers: 156, revenue: 13400 },
    { date: '2024-02-14', timezone: 'America/Los_Angeles', reservations: 72, walkIns: 8, covers: 198, revenue: 28900 },
    { date: '2024-02-13', timezone: 'America/Los_Angeles', reservations: 35, walkIns: 12, covers: 124, revenue: 10200 },
  ],
};

// Floor plans for each location
export const floorPlans: Record<string, FloorPlan> = {
  'fp-sf': {
    id: 'fp-sf',
    name: 'San Francisco Main Floor',
    dimensions: { width: 800, height: 600 },
    createdAt: '2023-01-15T10:00:00Z',
    tables: [
      { id: 'T1', name: 'Table 1', capacity: 4, position: { x: 50, y: 50 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Main' },
      { id: 'T2', name: 'Table 2', capacity: 2, position: { x: 150, y: 50 }, size: { width: 60, height: 60 }, shape: 'round', section: 'Main' },
      { id: 'T3', name: 'Table 3', capacity: 4, position: { x: 250, y: 50 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Main' },
      { id: 'T4', name: 'Table 4', capacity: 6, position: { x: 50, y: 160 }, size: { width: 120, height: 80 }, shape: 'rectangle', section: 'Main' },
      { id: 'T5', name: 'Private Room', capacity: 12, position: { x: 200, y: 160 }, size: { width: 180, height: 120 }, shape: 'rectangle', section: 'Private' },
      { id: 'T6', name: 'Table 6', capacity: 4, position: { x: 50, y: 280 }, size: { width: 80, height: 80 }, shape: 'square', section: 'Window' },
      { id: 'T7', name: 'Table 7', capacity: 4, position: { x: 150, y: 280 }, size: { width: 80, height: 80 }, shape: 'square', section: 'Window' },
      { id: 'T8', name: 'Table 8', capacity: 4, position: { x: 250, y: 280 }, size: { width: 80, height: 80 }, shape: 'square', section: 'Window' },
      { id: 'B1', name: 'Bar 1', capacity: 2, position: { x: 400, y: 50 }, size: { width: 60, height: 40 }, shape: 'rectangle', section: 'Bar' },
      { id: 'B2', name: 'Bar 2', capacity: 2, position: { x: 470, y: 50 }, size: { width: 60, height: 40 }, shape: 'rectangle', section: 'Bar' },
    ],
  },
  'fp-nyc': {
    id: 'fp-nyc',
    name: 'New York Main Floor',
    dimensions: { width: 900, height: 700 },
    createdAt: '2022-08-20T10:00:00Z',
    tables: [
      { id: 'T1', name: 'Table 1', capacity: 4, position: { x: 50, y: 50 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Front' },
      { id: 'T2', name: 'Table 2', capacity: 4, position: { x: 150, y: 50 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Front' },
      { id: 'T3', name: 'Table 3', capacity: 2, position: { x: 250, y: 50 }, size: { width: 60, height: 60 }, shape: 'round', section: 'Front' },
      { id: 'T4', name: 'Table 4', capacity: 4, position: { x: 350, y: 50 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Front' },
      { id: 'T5', name: 'Booth 1', capacity: 4, position: { x: 50, y: 160 }, size: { width: 100, height: 60 }, shape: 'rectangle', section: 'Booth' },
      { id: 'T6', name: 'Booth 2', capacity: 4, position: { x: 50, y: 240 }, size: { width: 100, height: 60 }, shape: 'rectangle', section: 'Booth' },
      { id: 'T7', name: 'Booth 3', capacity: 6, position: { x: 50, y: 320 }, size: { width: 120, height: 70 }, shape: 'rectangle', section: 'Booth' },
      { id: 'T8', name: 'Table 8', capacity: 4, position: { x: 200, y: 200 }, size: { width: 80, height: 80 }, shape: 'square', section: 'Center' },
      { id: 'T9', name: 'Table 9', capacity: 4, position: { x: 300, y: 200 }, size: { width: 80, height: 80 }, shape: 'square', section: 'Center' },
      { id: 'T10', name: 'Table 10', capacity: 6, position: { x: 200, y: 300 }, size: { width: 100, height: 80 }, shape: 'rectangle', section: 'Center' },
      { id: 'T11', name: 'Table 11', capacity: 6, position: { x: 320, y: 300 }, size: { width: 100, height: 80 }, shape: 'rectangle', section: 'Center' },
      { id: 'T12', name: 'Grand Table', capacity: 16, position: { x: 450, y: 150 }, size: { width: 200, height: 150 }, shape: 'rectangle', section: 'Private' },
    ],
  },
  'fp-miami': {
    id: 'fp-miami',
    name: 'Miami Beach Floor',
    dimensions: { width: 1000, height: 800 },
    createdAt: '2023-06-01T10:00:00Z',
    tables: [
      { id: 'T1', name: 'Table 1', capacity: 4, position: { x: 50, y: 50 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Indoor' },
      { id: 'T2', name: 'Table 2', capacity: 4, position: { x: 150, y: 50 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Indoor' },
      { id: 'T3', name: 'Table 3', capacity: 6, position: { x: 250, y: 50 }, size: { width: 100, height: 80 }, shape: 'rectangle', section: 'Indoor' },
      { id: 'T4', name: 'Patio 1', capacity: 4, position: { x: 50, y: 200 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Patio' },
      { id: 'T5', name: 'Patio 2', capacity: 4, position: { x: 150, y: 200 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Patio' },
      { id: 'T6', name: 'Patio 3', capacity: 6, position: { x: 250, y: 200 }, size: { width: 100, height: 80 }, shape: 'rectangle', section: 'Patio' },
      { id: 'T7', name: 'Patio 4', capacity: 4, position: { x: 370, y: 200 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Patio' },
      { id: 'T8', name: 'Patio 5', capacity: 4, position: { x: 470, y: 200 }, size: { width: 80, height: 80 }, shape: 'round', section: 'Patio' },
      { id: 'T9', name: 'Beach 1', capacity: 8, position: { x: 50, y: 350 }, size: { width: 140, height: 100 }, shape: 'rectangle', section: 'Beach' },
      { id: 'T10', name: 'Beach 2', capacity: 8, position: { x: 220, y: 350 }, size: { width: 140, height: 100 }, shape: 'rectangle', section: 'Beach' },
      { id: 'T11', name: 'Beach Cabana', capacity: 12, position: { x: 400, y: 350 }, size: { width: 180, height: 120 }, shape: 'rectangle', section: 'Cabana' },
    ],
  },
};

// Waitlist entries for demo
export const waitlistEntries = [
  {
    id: 'w1',
    guestName: 'Sarah Johnson',
    partySize: 4,
    phone: '(415) 555-2345',
    addedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    estimatedWait: 15,
    preferences: 'Patio if available',
  },
  {
    id: 'w2',
    guestName: 'Tom Wilson',
    partySize: 2,
    phone: '(415) 555-3456',
    addedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedWait: 25,
  },
  {
    id: 'w3',
    guestName: 'Lisa Park',
    partySize: 6,
    phone: '(415) 555-4567',
    addedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    estimatedWait: 35,
    notes: 'Birthday party',
  },
];

// Helper function to get location by ID
export function getLocationById(id: string): Location | undefined {
  return locations.find(l => l.id === id);
}

// Helper function to get guest by ID
export function getGuestById(id: string): Guest | undefined {
  return guests.find(g => g.id === id);
}

// Helper function to get reservations for a location and date
export function getReservationsForLocation(locationId: string, date?: string): Reservation[] {
  return reservations.filter(r => {
    if (r.locationId !== locationId) return false;
    if (date) {
      const resDate = r.timestamp.split('T')[0];
      return resDate === date;
    }
    return true;
  });
}

// Helper function to get guest visit history
export function getGuestVisits(guestId: string): VisitHistory[] {
  return visitHistory[guestId] || [];
}
