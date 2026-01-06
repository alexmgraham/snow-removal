'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Route, 
  ChevronDown, 
  ChevronUp,
  Navigation,
  Timer
} from 'lucide-react';
import type { Operator, Job, CustomerWithSubscription } from '@/types';
import { 
  optimizeRoute, 
  formatRouteTime, 
  formatDuration,
  type OptimizedRoute 
} from '@/lib/route-optimizer';

interface OperatorRouteCardProps {
  operator: Operator;
  jobs: Job[];
  getCustomerById: (id: string) => CustomerWithSubscription | undefined;
  isExpanded?: boolean;
}

export default function OperatorRouteCard({
  operator,
  jobs,
  getCustomerById,
  isExpanded: defaultExpanded = false,
}: OperatorRouteCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Calculate optimized route with stats
  const optimizedRoute: OptimizedRoute = useMemo(() => {
    return optimizeRoute(operator, jobs);
  }, [operator, jobs]);

  const { stats } = optimizedRoute;
  const activeJobs = optimizedRoute.jobs.filter(
    j => j.status !== 'completed' && j.status !== 'cancelled'
  );

  const statusColors = {
    available: 'bg-[var(--color-success)] text-white',
    busy: 'bg-[var(--color-teal)] text-white',
    offline: 'bg-slate-400 text-white',
  };

  const statusLabels = {
    available: 'Available',
    busy: 'On Job',
    offline: 'Offline',
  };

  const initials = operator.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const getJobStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'in_progress':
        return 'bg-[var(--color-teal)] text-white';
      case 'en_route':
        return 'bg-[var(--color-amber)] text-white';
      case 'pending':
        return 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]';
      default:
        return 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]';
    }
  };

  return (
    <Card className="glass border-[var(--color-border)] overflow-hidden">
      {/* Header with operator info and route summary */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-[var(--color-border)]">
              <AvatarImage src={operator.avatarUrl} alt={operator.name} />
              <AvatarFallback className="bg-[var(--color-secondary)] text-[var(--color-foreground)]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold text-[var(--color-foreground)]">
                {operator.name}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                <Truck className="w-3 h-3" />
                {operator.vehicle.name}
              </div>
            </div>
          </div>
          <Badge className={statusColors[operator.status]}>
            {statusLabels[operator.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Route Stats Summary */}
        {activeJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--color-secondary)]">
                <div className="flex items-center gap-1 text-[var(--color-teal)]">
                  <Timer className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-bold text-[var(--color-foreground)]">
                  {formatDuration(stats.totalTime)}
                </p>
                <p className="text-[10px] text-[var(--color-muted-foreground)]">Total Time</p>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--color-secondary)]">
                <div className="flex items-center gap-1 text-[var(--color-amber)]">
                  <Route className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-bold text-[var(--color-foreground)]">
                  {stats.totalDistance} mi
                </p>
                <p className="text-[10px] text-[var(--color-muted-foreground)]">Distance</p>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--color-secondary)]">
                <div className="flex items-center gap-1 text-[var(--color-primary)]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-bold text-[var(--color-foreground)]">
                  {activeJobs.length}
                </p>
                <p className="text-[10px] text-[var(--color-muted-foreground)]">Jobs</p>
              </div>
            </div>

            {/* Estimated End Time */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-3 rounded-md bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/20">
              <span className="text-xs text-[var(--color-muted-foreground)]">Route ends at</span>
              <span className="text-sm font-medium text-[var(--color-teal)]">
                {formatRouteTime(stats.estimatedEndTime)}
              </span>
            </div>

            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center gap-1 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide job details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {activeJobs.length} job{activeJobs.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>

            {/* Expanded Job List */}
            {isExpanded && (
              <div className="mt-3 space-y-2">
                {optimizedRoute.jobs
                  .filter(j => j.status !== 'completed' && j.status !== 'cancelled')
                  .map((job, index) => {
                    const customer = getCustomerById(job.customerId);
                    return (
                      <div
                        key={job.id}
                        className="relative p-3 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]"
                      >
                        {/* Order number */}
                        <div className="absolute -left-1 -top-1 w-5 h-5 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>

                        <div className="flex items-start justify-between pl-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
                              {customer?.name || 'Unknown'}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{job.address.street}</span>
                            </div>
                          </div>
                          <Badge className={`${getJobStatusColor(job.status)} text-[10px] ml-2`}>
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        {/* Timing info */}
                        <div className="mt-2 pt-2 border-t border-[var(--color-border)] grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[var(--color-teal)]" />
                            <span className="text-xs text-[var(--color-muted-foreground)]">
                              ETA: <span className="font-medium text-[var(--color-foreground)]">
                                {formatRouteTime(job.estimatedArrivalTime)}
                              </span>
                            </span>
                          </div>
                          {job.travelTimeFromPrevious > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Navigation className="w-3 h-3 text-[var(--color-amber)]" />
                              <span className="text-xs text-[var(--color-muted-foreground)]">
                                {job.distanceFromPrevious} mi ({job.travelTimeFromPrevious} min)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Priority tier badge */}
                        <div className="mt-2 flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              job.priorityTier === 'priority' 
                                ? 'border-[var(--color-amber)] text-[var(--color-amber)]' 
                                : job.priorityTier === 'standard'
                                ? 'border-[var(--color-teal)] text-[var(--color-teal)]'
                                : 'border-[var(--color-muted-foreground)] text-[var(--color-muted-foreground)]'
                            }`}
                          >
                            {job.priorityTier}
                          </Badge>
                          <span className="text-xs font-medium text-[var(--color-success)]">
                            ${job.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-sm text-[var(--color-muted-foreground)]">
            No jobs assigned
          </div>
        )}
      </CardContent>
    </Card>
  );
}

