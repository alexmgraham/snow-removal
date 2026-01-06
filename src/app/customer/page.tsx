'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import ETACard from '@/components/customer/ETACard';
import StatusTimeline from '@/components/customer/StatusTimeline';
import PrioritySelector from '@/components/customer/PrioritySelector';
import WeatherCard from '@/components/weather/WeatherCard';
import StormAlert from '@/components/weather/StormAlert';
import ForecastWidget from '@/components/weather/ForecastWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Snowflake, Settings2 } from 'lucide-react';
import { 
  mockJobs, 
  mockOperators, 
  getJobForCustomer, 
  calculateETA,
  pricingTiers,
} from '@/lib/mock-data';
import { getCurrentWeather, getStormAlerts, getForecast } from '@/lib/weather-data';
import type { Job, Operator, ETAEstimate, PriorityTier } from '@/types';

// Dynamic import for the map to avoid SSR issues with Leaflet
const CustomerMap = dynamic(() => import('@/components/maps/CustomerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[var(--color-secondary)] rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Snowflake className="w-8 h-8 text-[var(--color-teal)] animate-spin" />
        <span className="text-sm text-[var(--color-muted-foreground)]">Loading map...</span>
      </div>
    </div>
  ),
});

export default function CustomerDashboard() {
  const router = useRouter();
  const { role, currentCustomer, isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [showPrioritySelector, setShowPrioritySelector] = useState(false);
  
  // Weather data
  const weather = getCurrentWeather();
  const stormAlerts = getStormAlerts();
  const forecast = getForecast();

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (role !== 'customer') {
      router.push(role === 'operator' ? '/operator' : '/owner');
    }
  }, [isAuthenticated, role, router]);

  // Load job and operator data
  useEffect(() => {
    if (currentCustomer) {
      const customerJob = getJobForCustomer(currentCustomer.id);
      if (customerJob) {
        setJob(customerJob);
        if (customerJob.operatorId) {
          const jobOperator = mockOperators.find((o) => o.id === customerJob.operatorId);
          if (jobOperator) {
            setOperator(jobOperator);
          }
        }
      }
    }
  }, [currentCustomer]);

  // Handle priority tier change
  const handleTierChange = useCallback((newTier: PriorityTier, newPrice: number) => {
    if (job) {
      setJob({
        ...job,
        priorityTier: newTier,
        price: newPrice,
      });
      setShowPrioritySelector(false);
    }
  }, [job]);

  // Calculate ETA
  const eta: ETAEstimate | null = useMemo(() => {
    if (!job || !operator || !currentCustomer) return null;
    
    // Count jobs ahead in queue
    const operatorJobs = mockJobs.filter((j) => j.operatorId === operator.id);
    const jobsAhead = operatorJobs.filter(
      (j) => j.status === 'in_progress' || 
             (j.status === 'en_route' && j.id !== job.id)
    ).length;

    const { minutes: baseMinutes, distance } = calculateETA(
      operator.currentLocation,
      currentCustomer.coordinates,
      jobsAhead
    );

    // Apply priority tier modifier
    const tier = pricingTiers.find((t) => t.id === job.priorityTier);
    const modifier = tier?.etaModifier || 1;
    const minutes = Math.round(baseMinutes * modifier);

    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + minutes);

    return {
      minutes,
      arrivalTime: arrivalTime.toISOString(),
      distance,
      jobsAhead,
    };
  }, [job, operator, currentCustomer]);

  // Get base ETA for priority selector
  const baseETA = useMemo(() => {
    if (!job || !operator || !currentCustomer) return 60;
    
    const operatorJobs = mockJobs.filter((j) => j.operatorId === operator.id);
    const jobsAhead = operatorJobs.filter(
      (j) => j.status === 'in_progress' || 
             (j.status === 'en_route' && j.id !== job.id)
    ).length;

    const { minutes } = calculateETA(
      operator.currentLocation,
      currentCustomer.coordinates,
      jobsAhead
    );

    return minutes;
  }, [job, operator, currentCustomer]);

  if (!isAuthenticated || role !== 'customer' || !currentCustomer) {
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const currentTier = pricingTiers.find((t) => t.id === job?.priorityTier);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Welcome back, {currentCustomer.name.split(' ')[0]}!
          </h1>
          <p className="text-[var(--color-muted-foreground)] flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {today}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="h-[400px] md:h-[500px]">
              {operator && (
                <CustomerMap
                  homeLocation={currentCustomer.coordinates}
                  operatorLocation={operator.currentLocation}
                  className="h-full"
                />
              )}
            </div>

            {/* Address Card */}
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--color-teal)]" />
                  Service Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--color-foreground)]">
                      {currentCustomer.address.street}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {currentCustomer.address.city}, {currentCustomer.address.state} {currentCustomer.address.zip}
                    </p>
                  </div>
                  {job && (
                    <Badge
                      variant="secondary"
                      className={`
                        ${job.priorityTier === 'priority' ? 'bg-[var(--color-amber)]/10 text-[var(--color-amber)]' : ''}
                        ${job.priorityTier === 'standard' ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]' : ''}
                        ${job.priorityTier === 'economy' ? 'bg-green-100 text-green-700' : ''}
                      `}
                    >
                      {currentTier?.name || 'Standard'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Priority Selector (when shown) */}
            {showPrioritySelector && job && (
              <PrioritySelector
                currentTier={job.priorityTier}
                onTierChange={handleTierChange}
                baseETA={baseETA}
              />
            )}
          </div>

          {/* Sidebar - ETA and Status */}
          <div className="space-y-6">
            {/* ETA Card */}
            {eta && operator && (
              <ETACard
                eta={eta}
                operatorName={operator.name}
                vehicleName={operator.vehicle.name}
              />
            )}

            {/* Current Plan Card */}
            {job && currentTier && (
              <Card className="glass border-[var(--color-border)]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                      Current Service
                    </span>
                    <Badge
                      variant="secondary"
                      className={`
                        ${job.priorityTier === 'priority' ? 'bg-[var(--color-amber)]/10 text-[var(--color-amber)]' : ''}
                        ${job.priorityTier === 'standard' ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]' : ''}
                        ${job.priorityTier === 'economy' ? 'bg-green-100 text-green-700' : ''}
                      `}
                    >
                      {currentTier.name}
                    </Badge>
                  </div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-3xl font-bold text-[var(--color-foreground)]">
                      ${job.price}
                    </span>
                    {currentTier.discount && (
                      <span className="text-sm text-green-600 font-medium">
                        Save {currentTier.discount}%
                      </span>
                    )}
                    {currentTier.surcharge && (
                      <span className="text-sm text-[var(--color-amber)] font-medium">
                        +{currentTier.surcharge}% rush
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPrioritySelector(!showPrioritySelector)}
                  >
                    <Settings2 className="w-4 h-4 mr-2" />
                    {showPrioritySelector ? 'Hide Options' : 'Change Priority'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Status Timeline */}
            {job && <StatusTimeline currentStatus={job.status} />}

            {/* Weather Note */}
            <Card className="glass border-[var(--color-border)]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-frost)] to-[var(--color-ice)] flex items-center justify-center flex-shrink-0">
                    <Snowflake className="w-5 h-5 text-[var(--color-navy)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-foreground)] text-sm">
                      Winter Storm Advisory
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                      Heavy snowfall expected. Service times may be adjusted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
