'use client';

import { useMemo } from 'react';
import JobCard from './JobCard';
import type { Job, Customer } from '@/types';
import { getCustomerById } from '@/lib/mock-data';

interface JobListProps {
  jobs: Job[];
  selectedJobId: string | null;
  onJobSelect: (jobId: string) => void;
  onJobStart: (jobId: string) => void;
  onJobComplete: (jobId: string, duration: number) => void;
}

export default function JobList({
  jobs,
  selectedJobId,
  onJobSelect,
  onJobStart,
  onJobComplete,
}: JobListProps) {
  // Sort jobs: in_progress first, then en_route, then pending by priority, then completed
  const sortedJobs = useMemo(() => {
    const statusOrder: Record<Job['status'], number> = {
      in_progress: 0,
      en_route: 1,
      pending: 2,
      completed: 3,
      cancelled: 4,
    };

    const priorityOrder: Record<Job['priority'], number> = {
      urgent: 0,
      high: 1,
      normal: 2,
    };

    return [...jobs].sort((a, b) => {
      // First by status
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Then by priority (for pending jobs)
      if (a.status === 'pending' && b.status === 'pending') {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return 0;
    });
  }, [jobs]);

  // Group jobs by status for headers
  const activeJobs = sortedJobs.filter(
    (j) => j.status === 'in_progress' || j.status === 'en_route'
  );
  const pendingJobs = sortedJobs.filter((j) => j.status === 'pending');
  const completedJobs = sortedJobs.filter((j) => j.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-teal)] animate-pulse" />
            Active
          </h3>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                customer={getCustomerById(job.customerId)}
                isActive={selectedJobId === job.id}
                onStart={onJobStart}
                onComplete={onJobComplete}
                onSelect={onJobSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pending Jobs */}
      {pendingJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
            Up Next ({pendingJobs.length})
          </h3>
          <div className="space-y-3">
            {pendingJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                customer={getCustomerById(job.customerId)}
                isActive={selectedJobId === job.id}
                onStart={onJobStart}
                onComplete={onJobComplete}
                onSelect={onJobSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
            Completed ({completedJobs.length})
          </h3>
          <div className="space-y-3">
            {completedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                customer={getCustomerById(job.customerId)}
                isActive={selectedJobId === job.id}
                onStart={onJobStart}
                onComplete={onJobComplete}
                onSelect={onJobSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {sortedJobs.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted-foreground)]">
          <p className="text-lg font-medium">No jobs assigned</p>
          <p className="text-sm mt-1">Check back later for new assignments</p>
        </div>
      )}
    </div>
  );
}

