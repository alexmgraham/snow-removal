'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import FleetStatsPanel from '@/components/owner/FleetStatsPanel';
import OperatorCard from '@/components/owner/OperatorCard';
import JobDispatchPanel from '@/components/owner/JobDispatchPanel';
import WeatherCard from '@/components/weather/WeatherCard';
import StormAlert from '@/components/weather/StormAlert';
import ForecastWidget from '@/components/weather/ForecastWidget';
import AutoDispatchIndicator from '@/components/weather/AutoDispatchIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Snowflake, Map, Users, DollarSign, TrendingUp, CloudSnow, BarChart3, Palette, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { 
  mockOperators, 
  mockJobs, 
  getFleetStats, 
  getJobsForOperator,
  getCustomerById,
  pricingTiers,
} from '@/lib/mock-data';
import { 
  getCurrentWeather, 
  getStormAlerts, 
  getForecast, 
  getAutoDispatchStatus 
} from '@/lib/weather-data';
import type { FleetStats, Job } from '@/types';

// Dynamic import for the map
const FleetMap = dynamic(() => import('@/components/maps/FleetMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[var(--color-secondary)] rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Snowflake className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <span className="text-sm text-[var(--color-muted-foreground)]">Loading map...</span>
      </div>
    </div>
  ),
});

export default function OwnerDashboard() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);
  const [stats, setStats] = useState<FleetStats | null>(null);

  // Weather data
  const weather = getCurrentWeather();
  const stormAlerts = getStormAlerts();
  const forecast = getForecast();
  const autoDispatch = getAutoDispatchStatus();

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (role !== 'owner') {
      router.push(role === 'customer' ? '/customer' : '/operator');
    }
  }, [isAuthenticated, role, router]);

  // Load stats
  useEffect(() => {
    setStats(getFleetStats());
  }, []);

  const handleOperatorSelect = useCallback((operatorId: string) => {
    setSelectedOperatorId((prev) => (prev === operatorId ? null : operatorId));
  }, []);

  // Get jobs breakdown by priority tier
  const tierBreakdown = pricingTiers.map((tier) => {
    const tierJobs = mockJobs.filter((j) => j.priorityTier === tier.id);
    const completed = tierJobs.filter((j) => j.status === 'completed').length;
    const revenue = tierJobs
      .filter((j) => j.status === 'completed' || j.status === 'in_progress')
      .reduce((sum, j) => sum + j.price, 0);
    return {
      tier,
      total: tierJobs.length,
      completed,
      revenue,
    };
  });

  if (!isAuthenticated || role !== 'owner' || !stats) {
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
            <StormAlert alerts={stormAlerts} dismissible={false} />
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
              Fleet Overview
            </h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              {today} • Real-time fleet status and performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AutoDispatchIndicator status={autoDispatch} compact />
            <WeatherCard weather={weather} compact />
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <Link href="/owner/customers">
            <Card className="glass border-[var(--color-border)] hover:border-[var(--color-teal)] transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center group-hover:bg-[var(--color-teal)] transition-colors">
                  <Users className="w-5 h-5 text-[var(--color-teal)] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-foreground)] text-sm">Customers</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Manage</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-teal)] transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/owner/operators">
            <Card className="glass border-[var(--color-border)] hover:border-[var(--color-amber)] transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-amber)]/10 flex items-center justify-center group-hover:bg-[var(--color-amber)] transition-colors">
                  <Truck className="w-5 h-5 text-[var(--color-amber)] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-foreground)] text-sm">Operators</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Manage</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-amber)] transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/owner/reports">
            <Card className="glass border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                  <BarChart3 className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-foreground)] text-sm">Reports</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Analytics</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/owner/pricing">
            <Card className="glass border-[var(--color-border)] hover:border-emerald-500 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <DollarSign className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-foreground)] text-sm">Pricing</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Configure</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-emerald-500 transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/owner/branding">
            <Card className="glass border-[var(--color-border)] hover:border-violet-500 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
                  <Palette className="w-5 h-5 text-violet-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-foreground)] text-sm">Branding</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Customize</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-violet-500 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Panel */}
        <div className="mb-6">
          <FleetStatsPanel stats={stats} />
        </div>

        {/* Job Dispatch Section */}
        <div className="mb-6">
          <JobDispatchPanel />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Map className="w-5 h-5 text-[var(--color-primary)]" />
                  Live Fleet Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-[400px]">
                  <FleetMap
                    operators={mockOperators}
                    jobs={mockJobs}
                    selectedOperatorId={selectedOperatorId}
                    onOperatorSelect={handleOperatorSelect}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 px-2">
              <div className="space-y-2">
                <span className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Operators</span>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[var(--color-success)]" />
                    <span className="text-sm text-[var(--color-muted-foreground)]">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[var(--color-teal)]" />
                    <span className="text-sm text-[var(--color-muted-foreground)]">On Job</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-400" />
                    <span className="text-sm text-[var(--color-muted-foreground)]">Offline</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Jobs</span>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                    <span className="text-sm text-[var(--color-muted-foreground)]">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-teal)]" />
                    <span className="text-sm text-[var(--color-muted-foreground)]">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
                    <span className="text-sm text-[var(--color-muted-foreground)]">Done</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue by Tier */}
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Revenue by Service Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {tierBreakdown.map(({ tier, total, completed, revenue }) => (
                    <div
                      key={tier.id}
                      className={`
                        p-4 rounded-xl border
                        ${tier.id === 'economy' ? 'bg-green-50 border-green-200' : ''}
                        ${tier.id === 'standard' ? 'bg-[var(--color-secondary)] border-[var(--color-border)]' : ''}
                        ${tier.id === 'priority' ? 'bg-[var(--color-amber)]/5 border-[var(--color-amber)]/20' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-foreground)]">
                          {tier.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`
                            text-xs
                            ${tier.id === 'economy' ? 'bg-green-100 text-green-700' : ''}
                            ${tier.id === 'standard' ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]' : ''}
                            ${tier.id === 'priority' ? 'bg-[var(--color-amber)]/10 text-[var(--color-amber)]' : ''}
                          `}
                        >
                          ${tier.price}/job
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-muted-foreground)]">Jobs</span>
                          <span className="font-medium">{completed}/{total}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-muted-foreground)]">Revenue</span>
                          <span className="font-medium text-green-600">${revenue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operators List - 1 column */}
          <div className="space-y-4">
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-2 border-b border-[var(--color-border)]">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--color-teal)]" />
                  Operators
                  <Badge variant="secondary" className="ml-auto">
                    {mockOperators.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {mockOperators.map((operator) => (
                  <OperatorCard
                    key={operator.id}
                    operator={operator}
                    jobs={getJobsForOperator(operator.id)}
                    isSelected={selectedOperatorId === operator.id}
                    onSelect={handleOperatorSelect}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Auto-Dispatch Status */}
            <AutoDispatchIndicator status={autoDispatch} />

            {/* Weather Forecast */}
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CloudSnow className="w-5 h-5 text-[var(--color-teal)]" />
                  Weather Outlook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ForecastWidget forecast={forecast} compact />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass border-[var(--color-border)]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[var(--color-teal)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-foreground)] text-sm">
                      Performance Insight
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                      Priority tier jobs generating {Math.round((tierBreakdown[2].revenue / stats.totalRevenueToday) * 100)}% of today&apos;s revenue. Consider promoting this tier.
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

