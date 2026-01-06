import type { Job, Coordinates, Operator } from '@/types';
import type { PropertyDetails } from '@/types/property';
import { getPropertyDetails } from './property-data';

export interface OptimizedJob extends Job {
  order: number;
  estimatedArrivalTime: Date;
  estimatedDepartureTime: Date;
  distanceFromPrevious: number; // miles
  travelTimeFromPrevious: number; // minutes
}

export interface RouteStats {
  totalJobs: number;
  totalDistance: number; // miles
  totalTravelTime: number; // minutes
  totalServiceTime: number; // minutes
  totalTime: number; // minutes
  estimatedEndTime: Date;
}

export interface OptimizedRoute {
  operatorId: string;
  jobs: OptimizedJob[];
  stats: RouteStats;
  routePath: Coordinates[];
}

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (from: Coordinates, to: Coordinates): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate travel time based on distance (assuming 20 mph average in residential areas)
export const estimateTravelTime = (distanceMiles: number): number => {
  return (distanceMiles / 20) * 60; // minutes
};

// Get priority weight (higher = more urgent)
const getPriorityWeight = (job: Job): number => {
  const priorityWeights: Record<string, number> = {
    urgent: 100,
    high: 50,
    normal: 10,
  };
  
  const tierWeights: Record<string, number> = {
    priority: 80,
    standard: 20,
    economy: 5,
  };
  
  return (priorityWeights[job.priority] || 10) + (tierWeights[job.priorityTier] || 20);
};

// Get estimated service time for a job
const getServiceTime = (job: Job): number => {
  const property = getPropertyDetails(job.customerId);
  if (property) {
    return property.estimatedClearTime;
  }
  return job.estimatedDuration || 15;
};

// Nearest neighbor algorithm with priority weighting
export const optimizeRoute = (
  operator: Operator,
  jobs: Job[],
  options: {
    priorityWeight?: number; // 0-1, how much to weight priority vs distance
    startTime?: Date;
  } = {}
): OptimizedRoute => {
  const { priorityWeight = 0.3, startTime = new Date() } = options;
  
  // Filter to only jobs that need to be done
  const pendingJobs = jobs.filter(
    (j) => j.status === 'pending' || j.status === 'en_route'
  );
  
  // Keep completed and in-progress jobs at their position
  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const inProgressJobs = jobs.filter((j) => j.status === 'in_progress');
  
  if (pendingJobs.length === 0) {
    return createEmptyRoute(operator, [...completedJobs, ...inProgressJobs], startTime);
  }

  const optimizedOrder: Job[] = [];
  const remaining = [...pendingJobs];
  let currentLocation = operator.currentLocation;
  let currentTime = new Date(startTime);

  // If there's an in-progress job, it's first (already started)
  if (inProgressJobs.length > 0) {
    const inProgress = inProgressJobs[0];
    optimizedOrder.push(inProgress);
    currentLocation = inProgress.coordinates;
    currentTime = new Date(currentTime.getTime() + getServiceTime(inProgress) * 60000);
  }

  // Greedy algorithm: pick best next job based on combined score
  while (remaining.length > 0) {
    let bestIndex = -1;
    let bestScore = -Infinity;

    remaining.forEach((job, index) => {
      const distance = calculateDistance(currentLocation, job.coordinates);
      const travelTime = estimateTravelTime(distance);
      const priority = getPriorityWeight(job);

      // Normalize distance (inverse, so closer is better)
      const maxDistance = 5; // miles
      const normalizedDistance = Math.max(0, 1 - distance / maxDistance);

      // Normalize priority (0-1)
      const maxPriority = 180; // max possible priority weight
      const normalizedPriority = priority / maxPriority;

      // Combined score
      const score =
        normalizedDistance * (1 - priorityWeight) +
        normalizedPriority * priorityWeight;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    if (bestIndex >= 0) {
      const selectedJob = remaining.splice(bestIndex, 1)[0];
      optimizedOrder.push(selectedJob);
      currentLocation = selectedJob.coordinates;
      
      const travelTime = estimateTravelTime(
        calculateDistance(currentLocation, selectedJob.coordinates)
      );
      const serviceTime = getServiceTime(selectedJob);
      currentTime = new Date(
        currentTime.getTime() + (travelTime + serviceTime) * 60000
      );
    }
  }

  // Build optimized jobs with timing info
  return buildOptimizedRoute(operator, optimizedOrder, completedJobs, startTime);
};

// Build the final route with timing information
const buildOptimizedRoute = (
  operator: Operator,
  orderedJobs: Job[],
  completedJobs: Job[],
  startTime: Date
): OptimizedRoute => {
  const optimizedJobs: OptimizedJob[] = [];
  const routePath: Coordinates[] = [operator.currentLocation];
  
  let currentLocation = operator.currentLocation;
  let currentTime = new Date(startTime);
  let totalDistance = 0;
  let totalTravelTime = 0;
  let totalServiceTime = 0;

  orderedJobs.forEach((job, index) => {
    const distance = calculateDistance(currentLocation, job.coordinates);
    const travelTime = estimateTravelTime(distance);
    const serviceTime = getServiceTime(job);

    const arrivalTime = new Date(currentTime.getTime() + travelTime * 60000);
    const departureTime = new Date(arrivalTime.getTime() + serviceTime * 60000);

    optimizedJobs.push({
      ...job,
      order: index + 1,
      estimatedArrivalTime: arrivalTime,
      estimatedDepartureTime: departureTime,
      distanceFromPrevious: Math.round(distance * 10) / 10,
      travelTimeFromPrevious: Math.round(travelTime),
    });

    routePath.push(job.coordinates);
    totalDistance += distance;
    totalTravelTime += travelTime;
    totalServiceTime += serviceTime;
    currentLocation = job.coordinates;
    currentTime = departureTime;
  });

  return {
    operatorId: operator.id,
    jobs: optimizedJobs,
    stats: {
      totalJobs: optimizedJobs.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalTravelTime: Math.round(totalTravelTime),
      totalServiceTime: Math.round(totalServiceTime),
      totalTime: Math.round(totalTravelTime + totalServiceTime),
      estimatedEndTime: currentTime,
    },
    routePath,
  };
};

// Create empty route for when there are no pending jobs
const createEmptyRoute = (
  operator: Operator,
  jobs: Job[],
  startTime: Date
): OptimizedRoute => {
  return {
    operatorId: operator.id,
    jobs: jobs.map((job, index) => ({
      ...job,
      order: index + 1,
      estimatedArrivalTime: new Date(startTime),
      estimatedDepartureTime: new Date(startTime),
      distanceFromPrevious: 0,
      travelTimeFromPrevious: 0,
    })),
    stats: {
      totalJobs: 0,
      totalDistance: 0,
      totalTravelTime: 0,
      totalServiceTime: 0,
      totalTime: 0,
      estimatedEndTime: startTime,
    },
    routePath: [operator.currentLocation],
  };
};

// Reorder jobs manually (for drag-and-drop)
export const reorderJobs = (
  operator: Operator,
  jobs: Job[],
  fromIndex: number,
  toIndex: number,
  startTime: Date = new Date()
): OptimizedRoute => {
  const pendingJobs = jobs.filter(
    (j) => j.status === 'pending' || j.status === 'en_route'
  );
  const completedJobs = jobs.filter((j) => j.status === 'completed');
  
  // Reorder
  const reordered = [...pendingJobs];
  const [removed] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, removed);

  return buildOptimizedRoute(operator, reordered, completedJobs, startTime);
};

// Format time for display
export const formatRouteTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format duration for display
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

