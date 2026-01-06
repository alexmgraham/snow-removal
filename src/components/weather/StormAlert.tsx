'use client';

import { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp, Snowflake, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StormAlert as StormAlertType, getAlertColor } from '@/lib/weather-data';

interface StormAlertProps {
  alerts: StormAlertType[];
  dismissible?: boolean;
}

export default function StormAlert({ alerts, dismissible = true }: StormAlertProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const activeAlerts = alerts.filter(
    (alert) => alert.isActive && !dismissedAlerts.has(alert.id)
  );

  if (activeAlerts.length === 0) return null;

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  const toggleExpand = (alertId: string) => {
    setExpandedAlerts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getSeverityIcon = (severity: StormAlertType['severity']) => {
    switch (severity) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'watch':
        return <Snowflake className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-2">
      {activeAlerts.map((alert) => {
        const colors = getAlertColor(alert.severity);
        const isExpanded = expandedAlerts.has(alert.id);

        return (
          <div
            key={alert.id}
            className={`${colors.bg} ${colors.text} border-l-4 ${colors.border} rounded-r-lg shadow-sm overflow-hidden`}
          >
            {/* Alert Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3 flex-1">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center gap-2 flex-wrap">
                    <span className="uppercase text-xs tracking-wider opacity-75">
                      {alert.severity}
                    </span>
                    <span>{alert.title}</span>
                  </div>
                  {!isExpanded && (
                    <p className="text-sm opacity-90 truncate">{alert.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-black/10"
                  onClick={() => toggleExpand(alert.id)}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
                {dismissible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-black/10"
                    onClick={() => handleDismiss(alert.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-0 space-y-3 border-t border-black/10">
                <p className="text-sm">{alert.message}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-75" />
                    <div>
                      <div className="text-xs opacity-75">Valid From</div>
                      <div className="font-medium">{formatTime(alert.startTime)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-75" />
                    <div>
                      <div className="text-xs opacity-75">Until</div>
                      <div className="font-medium">{formatTime(alert.endTime)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-4 h-4 opacity-75" />
                    <div>
                      <div className="text-xs opacity-75">Expected Snow</div>
                      <div className="font-medium">{alert.expectedSnowfall}"</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

