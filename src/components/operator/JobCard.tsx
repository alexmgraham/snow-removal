'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Check, MapPin, Clock, AlertTriangle, ChevronRight, ChevronDown, ChevronUp, Home, Ruler, Snowflake } from 'lucide-react';
import type { Job, Customer } from '@/types';
import type { PropertyDetails } from '@/types/property';
import { getPropertyDetails, getDifficultyLabel, getDifficultyColor, formatSaltPreference, formatPileLocation, formatObstacleType } from '@/lib/property-data';
import PropertyPhotos from '@/components/job/PropertyPhotos';
import SpecialInstructions from '@/components/job/SpecialInstructions';

interface JobCardProps {
  job: Job;
  customer: Customer | undefined;
  isActive: boolean;
  onStart: (jobId: string) => void;
  onComplete: (jobId: string, duration: number) => void;
  onSelect: (jobId: string) => void;
}

export default function JobCard({
  job,
  customer,
  isActive,
  onStart,
  onComplete,
  onSelect,
}: JobCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Get property details for this customer
  const property = job.customerId ? getPropertyDetails(job.customerId) : undefined;

  // Timer logic
  useEffect(() => {
    if (job.status === 'in_progress' && job.actualStartTime) {
      const startTime = new Date(job.actualStartTime).getTime();
      setIsRunning(true);

      const interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsRunning(false);
      setElapsedTime(0);
    }
  }, [job.status, job.actualStartTime]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleStart = () => {
    onStart(job.id);
  };

  const handleComplete = () => {
    const durationMinutes = Math.ceil(elapsedTime / 60);
    onComplete(job.id, durationMinutes);
  };

  const statusColors = {
    pending: 'bg-slate-100 text-slate-600 border-slate-200',
    en_route: 'bg-amber-50 text-amber-700 border-amber-200',
    in_progress: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
  };

  const priorityIcon = job.priority === 'urgent' || job.priority === 'high';

  return (
    <Card
      className={`
        glass border transition-all duration-200 cursor-pointer
        ${isActive ? 'border-[var(--color-teal)] ring-2 ring-[var(--color-teal)]/20' : 'border-[var(--color-border)] hover:border-[var(--color-teal)]/50'}
        ${job.status === 'completed' ? 'opacity-75' : ''}
      `}
      onClick={() => onSelect(job.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-[var(--color-foreground)] truncate">
                {customer?.name || 'Unknown Customer'}
              </h4>
              {priorityIcon && (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{job.address.street}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={statusColors[job.status]}
              >
                {job.status === 'in_progress' ? 'Clearing' : job.status.replace('_', ' ')}
              </Badge>

              {property && (
                <Badge className={`${getDifficultyColor(property.difficultyRating)} text-xs`}>
                  {getDifficultyLabel(property.difficultyRating)}
                </Badge>
              )}

              {job.status === 'completed' && job.actualDuration && (
                <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.actualDuration} min
                </span>
              )}

              {property && (
                <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  {property.dimensions.area} sq ft
                </span>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col items-end gap-2">
            {/* Timer display for in-progress jobs */}
            {job.status === 'in_progress' && (
              <div className="font-mono text-2xl font-bold text-[var(--color-teal)] tabular-nums">
                {formatTime(elapsedTime)}
              </div>
            )}

            {/* Action buttons */}
            {job.status === 'pending' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            )}

            {job.status === 'en_route' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90 text-white"
              >
                <Play className="w-4 h-4 mr-1" />
                Arrive
              </Button>
            )}

            {job.status === 'in_progress' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                className="bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white"
              >
                <Check className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}

            {job.status === 'completed' && (
              <div className="w-8 h-8 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
              </div>
            )}

            {property && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-[var(--color-muted-foreground)]"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
              >
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Property Details */}
        {showDetails && property && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3">
            {/* Quick Info Row */}
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 rounded bg-[var(--color-secondary)]/50">
                <div className="text-xs text-[var(--color-muted-foreground)]">Type</div>
                <div className="font-medium capitalize">{property.drivewayType}</div>
              </div>
              <div className="p-2 rounded bg-[var(--color-secondary)]/50">
                <div className="text-xs text-[var(--color-muted-foreground)]">Est. Time</div>
                <div className="font-medium">{property.estimatedClearTime} min</div>
              </div>
              <div className="p-2 rounded bg-[var(--color-secondary)]/50">
                <div className="text-xs text-[var(--color-muted-foreground)]">Salt</div>
                <div className="font-medium text-xs">{formatSaltPreference(property.preferences.saltUsage)}</div>
              </div>
            </div>

            {/* Pile Location */}
            <div className="flex items-center gap-2 text-sm p-2 rounded bg-[var(--color-teal)]/10">
              <MapPin className="w-4 h-4 text-[var(--color-teal)]" />
              <span>
                Pile snow: <strong>{formatPileLocation(property.preferences.pileLocation, property.preferences.customPileLocation)}</strong>
              </span>
            </div>

            {/* Obstacles */}
            {property.obstacles.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-3 h-3" />
                  Watch for:
                </div>
                <div className="flex flex-wrap gap-1">
                  {property.obstacles.map((obs) => (
                    <Badge key={obs.id} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                      {formatObstacleType(obs.type)} ({obs.location})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {(property.preferences.specialInstructions || property.access.accessNotes || property.notes) && (
              <SpecialInstructions
                specialInstructions={property.preferences.specialInstructions}
                accessNotes={property.access.accessNotes}
                notes={property.notes}
                gateCode={property.access.gateCode}
                compact
              />
            )}

            {/* Photos */}
            {property.photos.length > 0 && (
              <PropertyPhotos photos={property.photos} compact />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

