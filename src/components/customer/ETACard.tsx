'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Truck } from 'lucide-react';
import type { ETAEstimate } from '@/types';

interface ETACardProps {
  eta: ETAEstimate;
  operatorName: string;
  vehicleName: string;
}

export default function ETACard({ eta, operatorName, vehicleName }: ETACardProps) {
  const [displayMinutes, setDisplayMinutes] = useState(eta.minutes);

  // Simulate countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayMinutes((prev) => {
        if (prev <= 1) return eta.minutes; // Reset for demo
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [eta.minutes]);

  const formatArrivalTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + displayMinutes);
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <Card className="glass border-[var(--color-border)] overflow-hidden">
      {/* Main ETA Display */}
      <div className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-deep-navy)] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-white/70 uppercase tracking-wider">
            Estimated Arrival
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--color-amber)] animate-pulse" />
            En Route
          </div>
        </div>

        <div className="flex items-end gap-3 mb-2">
          <span className="text-6xl font-bold tracking-tight">{displayMinutes}</span>
          <span className="text-2xl font-medium text-white/70 pb-2">min</span>
        </div>

        <p className="text-white/60 text-sm">
          Arriving around {formatArrivalTime()}
        </p>
      </div>

      {/* Details */}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center">
            <Truck className="w-5 h-5 text-[var(--color-amber)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-foreground)]">{operatorName}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">{vehicleName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[var(--color-teal)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              {eta.distance} miles away
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {eta.jobsAhead} {eta.jobsAhead === 1 ? 'stop' : 'stops'} before yours
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center">
            <Clock className="w-5 h-5 text-[var(--color-glacier)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              ~15 min service time
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Based on your driveway size
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

