'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Route,
  Clock,
  MapPin,
  Sparkles,
  GripVertical,
  ArrowRight,
  Timer,
  Truck,
  CheckCircle,
} from 'lucide-react';
import {
  OptimizedRoute as OptimizedRouteType,
  OptimizedJob,
  formatRouteTime,
  formatDuration,
} from '@/lib/route-optimizer';
import { getCustomerById } from '@/lib/mock-data';

interface OptimizedRouteProps {
  route: OptimizedRouteType;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

export default function OptimizedRoutePanel({
  route,
  onReorder,
  onOptimize,
  isOptimizing = false,
}: OptimizedRouteProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && index !== draggedIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && onReorder) {
      onReorder(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const pendingJobs = route.jobs.filter(
    (j) => j.status === 'pending' || j.status === 'en_route' || j.status === 'in_progress'
  );

  return (
    <Card className="glass border-[var(--color-border)]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Route className="w-5 h-5 text-[var(--color-amber)]" />
            Optimized Route
          </CardTitle>
          {onOptimize && (
            <Button
              size="sm"
              onClick={onOptimize}
              disabled={isOptimizing}
              className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {isOptimizing ? 'Optimizing...' : 'Optimize'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="p-2 rounded-lg bg-[var(--color-secondary)]/50 text-center">
            <div className="text-xs text-[var(--color-muted-foreground)]">Jobs</div>
            <div className="font-bold text-lg">{route.stats.totalJobs}</div>
          </div>
          <div className="p-2 rounded-lg bg-[var(--color-secondary)]/50 text-center">
            <div className="text-xs text-[var(--color-muted-foreground)]">Distance</div>
            <div className="font-bold text-lg">{route.stats.totalDistance} mi</div>
          </div>
          <div className="p-2 rounded-lg bg-[var(--color-secondary)]/50 text-center">
            <div className="text-xs text-[var(--color-muted-foreground)]">Total Time</div>
            <div className="font-bold text-lg">{formatDuration(route.stats.totalTime)}</div>
          </div>
        </div>

        {/* Estimated End */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-teal)]/10 text-sm">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-[var(--color-teal)]" />
            <span>Estimated Finish</span>
          </div>
          <span className="font-semibold text-[var(--color-teal)]">
            {formatRouteTime(route.stats.estimatedEndTime)}
          </span>
        </div>

        {/* Job List */}
        <div className="space-y-2">
          <div className="text-xs text-[var(--color-muted-foreground)] flex items-center justify-between">
            <span>Route Order</span>
            {onReorder && <span>Drag to reorder</span>}
          </div>

          <div className="space-y-1">
            {pendingJobs.map((job, index) => {
              const customer = getCustomerById(job.customerId);
              const isInProgress = job.status === 'in_progress';
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;

              return (
                <div
                  key={job.id}
                  draggable={!isInProgress && !!onReorder}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg border transition-all
                    ${isInProgress 
                      ? 'bg-[var(--color-teal)]/10 border-[var(--color-teal)]' 
                      : 'bg-[var(--color-secondary)]/50 border-transparent'
                    }
                    ${isDragging ? 'opacity-50 scale-95' : ''}
                    ${isDragOver ? 'border-[var(--color-amber)] border-dashed' : ''}
                    ${!isInProgress && onReorder ? 'cursor-grab active:cursor-grabbing' : ''}
                  `}
                >
                  {/* Drag Handle */}
                  {onReorder && !isInProgress && (
                    <GripVertical className="w-4 h-4 text-[var(--color-muted-foreground)] flex-shrink-0" />
                  )}

                  {/* Order Number */}
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${isInProgress 
                        ? 'bg-[var(--color-teal)] text-white' 
                        : 'bg-[var(--color-muted-foreground)]/20'
                      }
                    `}
                  >
                    {isInProgress ? <Truck className="w-3 h-3" /> : job.order}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {customer?.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{job.address.street}</span>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="text-right text-xs flex-shrink-0">
                    <div className="font-medium">
                      {formatRouteTime(job.estimatedArrivalTime)}
                    </div>
                    <div className="text-[var(--color-muted-foreground)]">
                      {job.travelTimeFromPrevious > 0 && (
                        <span>{job.travelTimeFromPrevious} min away</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Jobs Summary */}
        {route.jobs.filter((j) => j.status === 'completed').length > 0 && (
          <div className="pt-2 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
              <CheckCircle className="w-4 h-4" />
              <span>
                {route.jobs.filter((j) => j.status === 'completed').length} jobs completed
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

