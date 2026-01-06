'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, Truck, CheckCircle2, Clock, DollarSign, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import type { FleetStats } from '@/types';

interface FleetStatsPanelProps {
  stats: FleetStats;
}

export default function FleetStatsPanel({ stats }: FleetStatsPanelProps) {
  const completionRate = stats.totalJobsToday > 0
    ? Math.round((stats.completedJobsToday / stats.totalJobsToday) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {/* Active Operators */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--color-success)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.activeOperators}
                <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
                  /{stats.totalOperators}
                </span>
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.offlineOperators}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Offline</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[var(--color-teal)] animate-spin" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.inProgressJobs}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">In Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-amber)]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--color-amber)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.pendingJobs}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.completedJobsToday}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avg Time */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-glacier)]/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[var(--color-navy)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.averageCompletionTime}
                <span className="text-sm font-normal text-[var(--color-muted-foreground)]">m</span>
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Avg Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                ${stats.totalRevenueToday}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="glass border-[var(--color-border)] col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--color-teal)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {completionRate}
                <span className="text-sm font-normal text-[var(--color-muted-foreground)]">%</span>
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

