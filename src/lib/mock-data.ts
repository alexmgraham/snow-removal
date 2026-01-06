import type { Customer, Operator, Job, Coordinates, RoutePoint, PricingTier, FleetStats } from '@/types';

// Base coordinates for the mock area (Truckee, CA area)
const BASE_LAT = 39.3280;
const BASE_LNG = -120.1833;

// Helper to generate coordinates near the base
const nearbyCoords = (latOffset: number, lngOffset: number): Coordinates => ({
  lat: BASE_LAT + latOffset,
  lng: BASE_LNG + lngOffset,
});

// Pricing tiers
export const pricingTiers: PricingTier[] = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Flexible timing - get cleared when we can',
    price: 35,
    originalPrice: 45,
    discount: 22,
    etaModifier: 2.0, // Double the wait time
    features: [
      'Cleared within 4-6 hours',
      'No guaranteed time slot',
      'Save $10 per service',
      'Perfect for work-from-home days',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Regular service at normal priority',
    price: 45,
    etaModifier: 1.0, // Normal wait time
    features: [
      'Cleared within 2-3 hours',
      'Standard route priority',
      'Real-time tracking',
      'Most popular choice',
    ],
  },
  {
    id: 'priority',
    name: 'Priority',
    description: 'Skip the line - first to be cleared',
    price: 75,
    originalPrice: 45,
    surcharge: 67,
    etaModifier: 0.3, // Much faster
    features: [
      'Cleared within 30-60 minutes',
      'Jump to front of queue',
      'Dedicated operator dispatch',
      'Ideal for early commuters',
    ],
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    phone: '(530) 555-0123',
    address: {
      street: '11542 Deerfield Drive',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(0.008, 0.012),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'cust-002',
    name: 'James Chen',
    email: 'jchen@email.com',
    phone: '(530) 555-0456',
    address: {
      street: '10789 Donner Pass Road',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(0.005, 0.008),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
  {
    id: 'cust-003',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(530) 555-0789',
    address: {
      street: '12456 Ski Run Boulevard',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(-0.003, 0.015),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
  {
    id: 'cust-004',
    name: 'Michael Thompson',
    email: 'mthompson@email.com',
    phone: '(530) 555-0321',
    address: {
      street: '10234 Snowshoe Way',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(0.012, 0.005),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  {
    id: 'cust-005',
    name: 'Lisa Park',
    email: 'lisa.park@email.com',
    phone: '(530) 555-0654',
    address: {
      street: '11891 Ponderosa Lane',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(-0.006, 0.002),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  },
  {
    id: 'cust-006',
    name: 'David Williams',
    email: 'dwilliams@email.com',
    phone: '(530) 555-0987',
    address: {
      street: '10567 Tahoe Timber Trail',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(0.002, -0.008),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  {
    id: 'cust-007',
    name: 'Jennifer Adams',
    email: 'jadams@email.com',
    phone: '(530) 555-0147',
    address: {
      street: '12033 Northwoods Boulevard',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(-0.009, 0.018),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
  },
  {
    id: 'cust-008',
    name: 'Robert Kim',
    email: 'rkim@email.com',
    phone: '(530) 555-0258',
    address: {
      street: '11678 Sierra Pines Drive',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    },
    coordinates: nearbyCoords(0.015, 0.01),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
  },
];

export const mockOperators: Operator[] = [
  {
    id: 'op-001',
    name: 'Tom Bradley',
    phone: '(530) 555-1001',
    vehicle: {
      id: 'veh-001',
      name: 'Plow Truck #1',
      type: 'plow_truck',
      licensePlate: 'CA-SNOW-01',
    },
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    currentLocation: nearbyCoords(0.003, 0.006),
    status: 'busy',
  },
  {
    id: 'op-002',
    name: 'Maria Santos',
    phone: '(530) 555-1002',
    vehicle: {
      id: 'veh-002',
      name: 'Plow Truck #2',
      type: 'plow_truck',
      licensePlate: 'CA-SNOW-02',
    },
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    currentLocation: nearbyCoords(-0.005, 0.012),
    status: 'busy',
  },
  {
    id: 'op-003',
    name: 'Carlos Rivera',
    phone: '(530) 555-1003',
    vehicle: {
      id: 'veh-003',
      name: 'Plow Truck #3',
      type: 'plow_truck',
      licensePlate: 'CA-SNOW-03',
    },
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    currentLocation: nearbyCoords(0.01, -0.005),
    status: 'available',
  },
  {
    id: 'op-004',
    name: 'Jessica Wong',
    phone: '(530) 555-1004',
    vehicle: {
      id: 'veh-004',
      name: 'Skid Steer #1',
      type: 'skid_steer',
      licensePlate: 'CA-SNOW-04',
    },
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    currentLocation: nearbyCoords(-0.008, 0.003),
    status: 'offline',
  },
];

// Generate jobs for today
const today = new Date();
const formatTime = (hours: number, minutes: number): string => {
  const d = new Date(today);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

// Generate relative time from now (for realistic demos at any time of day)
const relativeTime = (minutesAgo: number): string => {
  return new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
};

export const mockJobs: Job[] = [
  {
    id: 'job-001',
    customerId: 'cust-001',
    operatorId: 'op-001',
    status: 'completed',
    address: mockCustomers[0].address,
    coordinates: mockCustomers[0].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(6, 30),
    actualStartTime: formatTime(6, 28),
    actualEndTime: formatTime(6, 42),
    estimatedDuration: 15,
    actualDuration: 14,
    notes: 'Regular driveway',
    priority: 'normal',
    priorityTier: 'standard',
    price: 45,
  },
  {
    id: 'job-002',
    customerId: 'cust-002',
    operatorId: 'op-001',
    status: 'completed',
    address: mockCustomers[1].address,
    coordinates: mockCustomers[1].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(6, 50),
    actualStartTime: formatTime(6, 48),
    actualEndTime: formatTime(7, 5),
    estimatedDuration: 15,
    actualDuration: 17,
    notes: 'Long driveway with turnaround',
    priority: 'normal',
    priorityTier: 'priority',
    price: 75,
  },
  {
    id: 'job-003',
    customerId: 'cust-003',
    operatorId: 'op-001',
    status: 'in_progress',
    address: mockCustomers[2].address,
    coordinates: mockCustomers[2].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(7, 15),
    actualStartTime: relativeTime(8), // Started 8 minutes ago for realistic demo
    actualEndTime: null,
    estimatedDuration: 20,
    actualDuration: null,
    notes: 'Corner lot - extra sidewalk',
    priority: 'normal',
    priorityTier: 'standard',
    price: 45,
  },
  {
    id: 'job-004',
    customerId: 'cust-004',
    operatorId: 'op-001',
    status: 'en_route',
    address: mockCustomers[3].address,
    coordinates: mockCustomers[3].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(7, 40),
    actualStartTime: null,
    actualEndTime: null,
    estimatedDuration: 15,
    actualDuration: null,
    notes: '',
    priority: 'normal',
    priorityTier: 'standard',
    price: 45,
  },
  {
    id: 'job-005',
    customerId: 'cust-005',
    operatorId: 'op-001',
    status: 'pending',
    address: mockCustomers[4].address,
    coordinates: mockCustomers[4].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(8, 0),
    actualStartTime: null,
    actualEndTime: null,
    estimatedDuration: 15,
    actualDuration: null,
    notes: '',
    priority: 'normal',
    priorityTier: 'economy',
    price: 35,
  },
  {
    id: 'job-006',
    customerId: 'cust-006',
    operatorId: 'op-001',
    status: 'pending',
    address: mockCustomers[5].address,
    coordinates: mockCustomers[5].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(8, 20),
    actualStartTime: null,
    actualEndTime: null,
    estimatedDuration: 18,
    actualDuration: null,
    notes: 'Has basketball hoop - be careful',
    priority: 'high',
    priorityTier: 'priority',
    price: 75,
  },
  {
    id: 'job-007',
    customerId: 'cust-007',
    operatorId: 'op-002',
    status: 'in_progress',
    address: mockCustomers[6].address,
    coordinates: mockCustomers[6].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(7, 0),
    actualStartTime: relativeTime(12), // Started 12 minutes ago for realistic demo
    actualEndTime: null,
    estimatedDuration: 15,
    actualDuration: null,
    notes: '',
    priority: 'normal',
    priorityTier: 'standard',
    price: 45,
  },
  {
    id: 'job-008',
    customerId: 'cust-008',
    operatorId: 'op-002',
    status: 'pending',
    address: mockCustomers[7].address,
    coordinates: mockCustomers[7].coordinates,
    scheduledDate: today.toISOString().split('T')[0],
    estimatedArrival: formatTime(7, 20),
    actualStartTime: null,
    actualEndTime: null,
    estimatedDuration: 15,
    actualDuration: null,
    notes: 'Elderly homeowner - extra care',
    priority: 'urgent',
    priorityTier: 'priority',
    price: 75,
  },
];

// Calculate fleet stats
export const getFleetStats = (): FleetStats => {
  const activeOperators = mockOperators.filter((o) => o.status === 'busy').length;
  const availableOperators = mockOperators.filter((o) => o.status === 'available').length;
  const offlineOperators = mockOperators.filter((o) => o.status === 'offline').length;
  
  const todayJobs = mockJobs.filter(
    (j) => j.scheduledDate === today.toISOString().split('T')[0]
  );
  const completedJobs = todayJobs.filter((j) => j.status === 'completed');
  const inProgressJobs = todayJobs.filter((j) => j.status === 'in_progress');
  const pendingJobs = todayJobs.filter((j) => j.status === 'pending' || j.status === 'en_route');
  
  const totalRevenue = todayJobs
    .filter((j) => j.status === 'completed' || j.status === 'in_progress')
    .reduce((sum, j) => sum + j.price, 0);
  
  const avgTime = completedJobs.length > 0
    ? completedJobs.reduce((sum, j) => sum + (j.actualDuration || 0), 0) / completedJobs.length
    : 0;

  return {
    totalOperators: mockOperators.length,
    activeOperators: activeOperators + availableOperators,
    offlineOperators,
    totalJobsToday: todayJobs.length,
    completedJobsToday: completedJobs.length,
    inProgressJobs: inProgressJobs.length,
    pendingJobs: pendingJobs.length,
    totalRevenueToday: totalRevenue,
    averageCompletionTime: Math.round(avgTime),
  };
};

// Generate a simulated route for the plow
export const generatePlowRoute = (
  start: Coordinates,
  end: Coordinates,
  steps: number = 20
): RoutePoint[] => {
  const route: RoutePoint[] = [];
  const now = Date.now();

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    // Add some randomness to make it look more realistic
    const jitter = {
      lat: (Math.random() - 0.5) * 0.0005,
      lng: (Math.random() - 0.5) * 0.0005,
    };

    route.push({
      coordinates: {
        lat: start.lat + (end.lat - start.lat) * progress + jitter.lat,
        lng: start.lng + (end.lng - start.lng) * progress + jitter.lng,
      },
      timestamp: now + i * 30000, // 30 seconds between each point
    });
  }

  return route;
};

// Calculate ETA based on current position and destination
export const calculateETA = (
  currentPos: Coordinates,
  destination: Coordinates,
  jobsAhead: number
): { minutes: number; distance: number } => {
  // Simple distance calculation (Haversine formula approximation)
  const R = 3959; // Earth's radius in miles
  const dLat = ((destination.lat - currentPos.lat) * Math.PI) / 180;
  const dLng = ((destination.lng - currentPos.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((currentPos.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Estimate time: ~20 mph average in residential + 15 min per job ahead
  const travelMinutes = (distance / 20) * 60;
  const jobTime = jobsAhead * 15;
  const minutes = Math.round(travelMinutes + jobTime);

  return { minutes, distance: Math.round(distance * 10) / 10 };
};

// Get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find((c) => c.id === id);
};

// Get operator by ID
export const getOperatorById = (id: string): Operator | undefined => {
  return mockOperators.find((o) => o.id === id);
};

// Get jobs for an operator
export const getJobsForOperator = (operatorId: string): Job[] => {
  return mockJobs.filter((j) => j.operatorId === operatorId);
};

// Get job for a customer
export const getJobForCustomer = (customerId: string): Job | undefined => {
  return mockJobs.find(
    (j) => j.customerId === customerId && j.scheduledDate === today.toISOString().split('T')[0]
  );
};

// Map center coordinates
export const MAP_CENTER: Coordinates = {
  lat: BASE_LAT,
  lng: BASE_LNG,
};

export const MAP_ZOOM = 14;
