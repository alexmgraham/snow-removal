'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Truck, TrendingDown, TrendingUp } from 'lucide-react';
import type { ETAEstimate } from '@/types';

interface ETACardProps {
  eta: ETAEstimate;
  operatorName: string;
  vehicleName: string;
}

export default function ETACard({ eta, operatorName, vehicleName }: ETACardProps) {
  // Smooth animated display of minutes
  const [displayMinutes, setDisplayMinutes] = useState(eta.minutes);
  const [isUpdating, setIsUpdating] = useState(false);
  const [changeDirection, setChangeDirection] = useState<'up' | 'down' | null>(null);
  const [showChange, setShowChange] = useState(false);
  const prevMinutes = useRef(eta.minutes);

  // Animate when ETA changes
  useEffect(() => {
    if (eta.minutes !== prevMinutes.current) {
      const diff = eta.minutes - prevMinutes.current;
      const isSignificantChange = Math.abs(diff) > 2;
      
      setIsUpdating(true);
      
      // Show direction indicator for significant changes (like priority changes)
      if (isSignificantChange) {
        setChangeDirection(diff < 0 ? 'down' : 'up');
        setShowChange(true);
      }
      
      // Small delay for visual feedback
      const timeout = setTimeout(() => {
        setDisplayMinutes(eta.minutes);
        setIsUpdating(false);
        prevMinutes.current = eta.minutes;
      }, 150);
      
      // Hide the change indicator after a bit
      const hideChangeTimeout = setTimeout(() => {
        setShowChange(false);
        setChangeDirection(null);
      }, 2000);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(hideChangeTimeout);
      };
    }
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
          <span 
            className={`text-6xl font-bold tracking-tight transition-all duration-300 ${
              isUpdating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
            } ${showChange && changeDirection === 'down' ? 'text-green-400' : ''}
            ${showChange && changeDirection === 'up' ? 'text-amber-400' : ''}`}
          >
            {displayMinutes}
          </span>
          <span className="text-2xl font-medium text-white/70 pb-2">min</span>
          
          {/* Change indicator for priority changes */}
          {showChange && changeDirection && (
            <div 
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium animate-pulse
                ${changeDirection === 'down' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}
            >
              {changeDirection === 'down' ? (
                <>
                  <TrendingDown className="w-3 h-3" />
                  Faster
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3" />
                  Slower
                </>
              )}
            </div>
          )}
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
            <p className={`text-sm font-medium text-[var(--color-foreground)] transition-opacity duration-300 ${isUpdating ? 'opacity-70' : 'opacity-100'}`}>
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

