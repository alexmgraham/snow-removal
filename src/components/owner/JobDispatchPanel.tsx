'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  MapPin, 
  User, 
  Truck,
  ChevronDown,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useManagement } from '@/context/ManagementContext';
import OperatorRouteCard from './OperatorRouteCard';
import type { Job, OperatorWithSchedule } from '@/types';

export default function JobDispatchPanel() {
  const { 
    jobs, 
    operators, 
    getCustomerById, 
    assignJob, 
    getJobsForOperator,
    getUnassignedJobs 
  } = useManagement();

  // Get unassigned jobs that need dispatch
  const unassignedJobs = useMemo(() => {
    return getUnassignedJobs().sort((a, b) => {
      // Sort by priority tier (priority first), then by priority level
      const tierOrder = { priority: 0, standard: 1, economy: 2 };
      const priorityOrder = { urgent: 0, high: 1, normal: 2 };
      
      const tierDiff = (tierOrder[a.priorityTier] ?? 2) - (tierOrder[b.priorityTier] ?? 2);
      if (tierDiff !== 0) return tierDiff;
      
      return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    });
  }, [getUnassignedJobs]);

  // Get available operators (not offline)
  const availableOperators = useMemo(() => {
    return operators.filter(op => op.status !== 'offline');
  }, [operators]);

  const getPriorityBadgeColor = (tier: Job['priorityTier']) => {
    switch (tier) {
      case 'priority':
        return 'bg-[var(--color-amber)] text-white';
      case 'standard':
        return 'bg-[var(--color-teal)] text-white';
      case 'economy':
        return 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]';
    }
  };

  const handleAssignJob = (jobId: string, operatorId: string) => {
    assignJob(jobId, operatorId);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--color-primary)]/10">
            <ClipboardList className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Job Dispatch</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Assign jobs to operators and view route times
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {unassignedJobs.length} unassigned
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Unassigned Jobs Queue - Left Column */}
        <div className="lg:col-span-1">
          <Card className="glass border-[var(--color-border)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--color-amber)]" />
                Dispatch Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {unassignedJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[var(--color-success)] mb-2" />
                  <p className="text-sm font-medium text-[var(--color-foreground)]">All jobs assigned!</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">No pending jobs in queue</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {unassignedJobs.map((job) => {
                    const customer = getCustomerById(job.customerId);
                    return (
                      <div
                        key={job.id}
                        className="p-3 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors"
                      >
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                              <span className="text-sm font-medium text-[var(--color-foreground)] truncate">
                                {customer?.name || 'Unknown Customer'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-[var(--color-muted-foreground)]">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{job.address.street}</span>
                            </div>
                          </div>
                          <Badge className={`${getPriorityBadgeColor(job.priorityTier)} text-[10px] ml-2`}>
                            {job.priorityTier}
                          </Badge>
                        </div>

                        {/* Job details */}
                        <div className="flex items-center justify-between mb-3 text-xs text-[var(--color-muted-foreground)]">
                          <span>~{job.estimatedDuration} min</span>
                          <span className="font-medium text-[var(--color-success)]">${job.price}</span>
                        </div>

                        {/* Operator Assignment Dropdown */}
                        <div className="relative">
                          <select
                            className="w-full px-3 py-2 text-sm rounded-md bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignJob(job.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          >
                            <option value="" disabled>
                              Assign to operator...
                            </option>
                            {availableOperators.map((op) => {
                              const opJobs = getJobsForOperator(op.id);
                              const pendingCount = opJobs.filter(
                                j => j.status !== 'completed' && j.status !== 'cancelled'
                              ).length;
                              return (
                                <option key={op.id} value={op.id}>
                                  {op.name} ({pendingCount} jobs)
                                </option>
                              );
                            })}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Operator Routes - Right Column (2 cols) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
              Operator Routes
            </h3>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              ({availableOperators.length} active)
            </span>
          </div>

          {availableOperators.length === 0 ? (
            <Card className="glass border-[var(--color-border)]">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Truck className="w-10 h-10 text-[var(--color-muted-foreground)] mb-2" />
                <p className="text-sm font-medium text-[var(--color-foreground)]">No operators online</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  Operators need to be online to receive jobs
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {availableOperators.map((operator) => {
                const operatorJobs = getJobsForOperator(operator.id);
                return (
                  <OperatorRouteCard
                    key={operator.id}
                    operator={operator}
                    jobs={operatorJobs}
                    getCustomerById={getCustomerById}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

