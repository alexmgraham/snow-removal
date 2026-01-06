'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, Timer, TrendingUp } from 'lucide-react';
import type { OperatorStats } from '@/types';

interface StatsPanelProps {
  stats: OperatorStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const completionRate = stats.totalJobsToday > 0
    ? Math.round((stats.jobsCompletedToday / stats.totalJobsToday) * 100)
    : 0;

  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Jobs Completed */}
      <Card className="glass border-[var(--color-border)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.jobsCompletedToday}
                <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
                  /{stats.totalJobsToday}
                </span>
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Jobs Done</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Time */}
      <Card className="glass border-[var(--color-border)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center">
              <Timer className="w-5 h-5 text-[var(--color-teal)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {stats.averageTimePerJob}
                <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
                  min
                </span>
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Avg Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hours Worked */}
      <Card className="glass border-[var(--color-border)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-amber)]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--color-amber)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {formatHours(stats.totalHoursWorked)}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Hours Today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="glass border-[var(--color-border)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-glacier)]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--color-navy)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {completionRate}
                <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
                  %
                </span>
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

