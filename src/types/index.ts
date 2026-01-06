export type UserRole = 'customer' | 'operator' | 'owner';

export type JobStatus = 'pending' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';

export type PriorityTier = 'economy' | 'standard' | 'priority';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  coordinates: Coordinates;
  avatarUrl?: string;
}

export interface Operator {
  id: string;
  name: string;
  phone: string;
  vehicle: Vehicle;
  avatarUrl?: string;
  currentLocation: Coordinates;
  status: 'available' | 'busy' | 'offline';
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'plow_truck' | 'skid_steer' | 'atv';
  licensePlate: string;
}

export interface Job {
  id: string;
  customerId: string;
  operatorId: string | null;
  status: JobStatus;
  address: Address;
  coordinates: Coordinates;
  scheduledDate: string;
  estimatedArrival: string | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  estimatedDuration: number; // in minutes
  actualDuration: number | null; // in minutes
  notes: string;
  priority: 'normal' | 'high' | 'urgent';
  priorityTier: PriorityTier;
  price: number;
}

export interface RoutePoint {
  coordinates: Coordinates;
  timestamp: number;
}

export interface ETAEstimate {
  minutes: number;
  arrivalTime: string;
  distance: number; // in miles
  jobsAhead: number;
}

export interface OperatorStats {
  jobsCompletedToday: number;
  totalJobsToday: number;
  averageTimePerJob: number; // in minutes
  totalHoursWorked: number;
}

export interface FleetStats {
  totalOperators: number;
  activeOperators: number;
  offlineOperators: number;
  totalJobsToday: number;
  completedJobsToday: number;
  inProgressJobs: number;
  pendingJobs: number;
  totalRevenueToday: number;
  averageCompletionTime: number;
}

export interface PricingTier {
  id: PriorityTier;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  surcharge?: number;
  etaModifier: number; // multiplier for ETA (0.5 = half time, 2 = double time)
  features: string[];
}

export interface AppState {
  role: UserRole | null;
  currentCustomer: Customer | null;
  currentOperator: Operator | null;
  setRole: (role: UserRole | null) => void;
  logout: () => void;
}
