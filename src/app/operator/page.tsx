'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import JobList from '@/components/operator/JobList';
import StatsPanel from '@/components/operator/StatsPanel';
import WeatherCard from '@/components/weather/WeatherCard';
import StormAlert from '@/components/weather/StormAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Snowflake, Route, Calendar } from 'lucide-react';
import { mockJobs, getJobsForOperator } from '@/lib/mock-data';
import { getCurrentWeather, getStormAlerts } from '@/lib/weather-data';
import { optimizeRoute, reorderJobs, OptimizedRoute as OptimizedRouteType } from '@/lib/route-optimizer';
import OptimizedRoutePanel from '@/components/operator/OptimizedRoute';
import type { Job, OperatorStats } from '@/types';

// Dynamic import for the map to avoid SSR issues with Leaflet
const OperatorMap = dynamic(() => import('@/components/maps/OperatorMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[var(--color-secondary)] rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Snowflake className="w-8 h-8 text-[var(--color-amber)] animate-spin" />
        <span className="text-sm text-[var(--color-muted-foreground)]">Loading map...</span>
      </div>
    </div>
  ),
});

export default function OperatorDashboard() {
  const router = useRouter();
  const { role, currentOperator, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRouteType | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Weather data
  const weather = getCurrentWeather();
  const stormAlerts = getStormAlerts();

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (role !== 'operator') {
      router.push('/customer');
    }
  }, [isAuthenticated, role, router]);

  // Load jobs for this operator
  useEffect(() => {
    if (currentOperator) {
      const operatorJobs = getJobsForOperator(currentOperator.id);
      setJobs(operatorJobs);
      // Auto-optimize on load
      const route = optimizeRoute(currentOperator, operatorJobs);
      setOptimizedRoute(route);
    }
  }, [currentOperator]);

  // Calculate stats
  const stats: OperatorStats = useMemo(() => {
    const completedJobs = jobs.filter((j) => j.status === 'completed');
    const totalDuration = completedJobs.reduce(
      (sum, j) => sum + (j.actualDuration || 0),
      0
    );

    return {
      jobsCompletedToday: completedJobs.length,
      totalJobsToday: jobs.length,
      averageTimePerJob:
        completedJobs.length > 0
          ? Math.round(totalDuration / completedJobs.length)
          : 0,
      totalHoursWorked: totalDuration / 60,
    };
  }, [jobs]);

  // Handle job start
  const handleJobStart = useCallback((jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            status: 'in_progress',
            actualStartTime: new Date().toISOString(),
          };
        }
        return job;
      })
    );
  }, []);

  // Handle job complete
  const handleJobComplete = useCallback((jobId: string, duration: number) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            status: 'completed',
            actualEndTime: new Date().toISOString(),
            actualDuration: duration,
          };
        }
        return job;
      })
    );
  }, []);

  // Handle job selection
  const handleJobSelect = useCallback((jobId: string) => {
    setSelectedJobId((prev) => (prev === jobId ? null : jobId));
  }, []);

  // Handle route optimization
  const handleOptimize = useCallback(() => {
    if (!currentOperator) return;
    setIsOptimizing(true);
    // Simulate optimization delay
    setTimeout(() => {
      const route = optimizeRoute(currentOperator, jobs, { priorityWeight: 0.4 });
      setOptimizedRoute(route);
      setIsOptimizing(false);
    }, 500);
  }, [currentOperator, jobs]);

  // Handle route reorder
  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (!currentOperator) return;
    const route = reorderJobs(currentOperator, jobs, fromIndex, toIndex);
    setOptimizedRoute(route);
  }, [currentOperator, jobs]);

  if (!isAuthenticated || role !== 'operator' || !currentOperator) {
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Storm Alerts */}
        {stormAlerts.length > 0 && (
          <div className="mb-6">
            <StormAlert alerts={stormAlerts} />
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
              Good morning, {currentOperator.name.split(' ')[0]}!
            </h1>
            <p className="text-[var(--color-muted-foreground)] flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {today}
            </p>
          </div>
          <WeatherCard weather={weather} compact />
        </div>

        {/* Stats Panel */}
        <div className="mb-6">
          <StatsPanel stats={stats} />
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map Section - 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Route className="w-5 h-5 text-[var(--color-amber)]" />
                  Route Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[400px] md:h-[500px]">
                  <OperatorMap
                    jobs={jobs}
                    operatorLocation={currentOperator.currentLocation}
                    selectedJobId={selectedJobId}
                    onJobSelect={handleJobSelect}
                    routePath={optimizedRoute?.routePath}
                    showRoute={true}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 px-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-[var(--color-muted-foreground)]">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-[var(--color-muted-foreground)]">En Route</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-[var(--color-muted-foreground)]">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[var(--color-muted-foreground)]">Completed</span>
              </div>
            </div>
          </div>

          {/* Job List and Route Panel - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            {/* Optimized Route Panel */}
            {optimizedRoute && (
              <OptimizedRoutePanel
                route={optimizedRoute}
                onOptimize={handleOptimize}
                onReorder={handleReorder}
                isOptimizing={isOptimizing}
              />
            )}

            {/* Job List */}
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-2 border-b border-[var(--color-border)]">
                <CardTitle className="text-lg font-semibold">
                  Today&apos;s Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-[400px] overflow-y-auto">
                <JobList
                  jobs={jobs}
                  selectedJobId={selectedJobId}
                  onJobSelect={handleJobSelect}
                  onJobStart={handleJobStart}
                  onJobComplete={handleJobComplete}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

