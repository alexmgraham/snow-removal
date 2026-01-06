'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import JobList from '@/components/operator/JobList';
import StatsPanel from '@/components/operator/StatsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Snowflake, Route, Calendar } from 'lucide-react';
import { mockJobs, getJobsForOperator } from '@/lib/mock-data';
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
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Good morning, {currentOperator.name.split(' ')[0]}!
          </h1>
          <p className="text-[var(--color-muted-foreground)] flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {today}
          </p>
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

          {/* Job List - 2 columns */}
          <div className="lg:col-span-2">
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-2 border-b border-[var(--color-border)]">
                <CardTitle className="text-lg font-semibold">
                  Today&apos;s Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-[600px] overflow-y-auto">
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

