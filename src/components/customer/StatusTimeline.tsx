'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Circle, Loader2 } from 'lucide-react';
import type { JobStatus } from '@/types';

interface StatusTimelineProps {
  currentStatus: JobStatus;
}

const statusSteps = [
  { key: 'pending', label: 'Scheduled', description: 'Your service is confirmed' },
  { key: 'en_route', label: 'En Route', description: 'Plow is heading your way' },
  { key: 'in_progress', label: 'Clearing', description: 'Clearing your driveway' },
  { key: 'completed', label: 'Complete', description: 'Service finished' },
] as const;

const statusOrder: Record<JobStatus, number> = {
  pending: 0,
  en_route: 1,
  in_progress: 2,
  completed: 3,
  cancelled: -1,
};

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = statusOrder[currentStatus];

  return (
    <Card className="glass border-[var(--color-border)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-[var(--color-foreground)]">
          Service Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {statusSteps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <div key={step.key} className="flex gap-4 pb-6 last:pb-0">
                {/* Timeline line and dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCompleted ? 'bg-[var(--color-success)] text-white' : ''}
                      ${isCurrent ? 'bg-[var(--color-teal)] text-white ring-4 ring-[var(--color-teal)]/20' : ''}
                      ${isPending ? 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]' : ''}
                    `}
                  >
                    {isCompleted && <Check className="w-5 h-5" />}
                    {isCurrent && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isPending && <Circle className="w-4 h-4" />}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`
                        w-0.5 flex-1 mt-2 transition-colors duration-300
                        ${index < currentIndex ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}
                      `}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <h4
                    className={`
                      font-medium transition-colors
                      ${isCurrent ? 'text-[var(--color-foreground)]' : ''}
                      ${isCompleted ? 'text-[var(--color-success)]' : ''}
                      ${isPending ? 'text-[var(--color-muted-foreground)]' : ''}
                    `}
                  >
                    {step.label}
                  </h4>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

