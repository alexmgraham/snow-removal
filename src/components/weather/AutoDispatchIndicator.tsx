'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Snowflake, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AutoDispatchTrigger } from '@/lib/weather-data';

interface AutoDispatchIndicatorProps {
  status: AutoDispatchTrigger;
  compact?: boolean;
}

export default function AutoDispatchIndicator({ status, compact = false }: AutoDispatchIndicatorProps) {
  const percentage = Math.min((status.currentAccumulation / status.threshold) * 100, 100);
  
  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'TBD';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        status.isTriggered 
          ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' 
          : 'bg-[var(--color-secondary)]'
      }`}>
        {status.isTriggered ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Truck className="w-4 h-4 text-[var(--color-muted-foreground)]" />
        )}
        <span className="text-sm font-medium">
          {status.isTriggered ? 'Fleet Deployed' : `${percentage.toFixed(0)}% to dispatch`}
        </span>
      </div>
    );
  }

  return (
    <Card className={`glass border-[var(--color-border)] ${
      status.isTriggered ? 'ring-2 ring-[var(--color-success)]' : ''
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Truck className={`w-5 h-5 ${status.isTriggered ? 'text-[var(--color-success)]' : 'text-[var(--color-amber)]'}`} />
          Auto-Dispatch Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          status.isTriggered 
            ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' 
            : 'bg-[var(--color-amber)]/10 text-[var(--color-amber)]'
        }`}>
          {status.isTriggered ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Fleet Deployed</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Monitoring</span>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">Accumulation Progress</span>
            <span className="font-medium">
              {status.currentAccumulation.toFixed(1)}" / {status.threshold}"
            </span>
          </div>
          <div className="h-3 bg-[var(--color-secondary)] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                status.isTriggered 
                  ? 'bg-[var(--color-success)]' 
                  : percentage > 70 
                    ? 'bg-[var(--color-amber)]' 
                    : 'bg-[var(--color-teal)]'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-secondary)]/50">
            <Snowflake className="w-4 h-4 text-[var(--color-teal)]" />
            <div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Threshold</div>
              <div className="font-semibold">{status.threshold}" snow</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-secondary)]/50">
            <Clock className="w-4 h-4 text-[var(--color-amber)]" />
            <div>
              <div className="text-xs text-[var(--color-muted-foreground)]">
                {status.isTriggered ? 'Dispatched At' : 'Est. Trigger'}
              </div>
              <div className="font-semibold">{formatTime(status.nextDispatchTime)}</div>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-[var(--color-muted-foreground)] italic">
          {status.message}
        </p>
      </CardContent>
    </Card>
  );
}

