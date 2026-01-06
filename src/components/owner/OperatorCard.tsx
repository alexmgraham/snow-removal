'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Truck, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import type { Operator, Job } from '@/types';
import { getCustomerById } from '@/lib/mock-data';

interface OperatorCardProps {
  operator: Operator;
  jobs: Job[];
  isSelected: boolean;
  onSelect: (operatorId: string) => void;
}

export default function OperatorCard({
  operator,
  jobs,
  isSelected,
  onSelect,
}: OperatorCardProps) {
  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const inProgressJob = jobs.find((j) => j.status === 'in_progress');
  const pendingJobs = jobs.filter((j) => j.status === 'pending' || j.status === 'en_route');
  
  const currentCustomer = inProgressJob ? getCustomerById(inProgressJob.customerId) : null;
  
  const totalEarnings = jobs
    .filter((j) => j.status === 'completed' || j.status === 'in_progress')
    .reduce((sum, j) => sum + j.price, 0);

  const statusColors = {
    available: 'bg-[var(--color-success)] text-white',
    busy: 'bg-[var(--color-teal)] text-white',
    offline: 'bg-slate-400 text-white',
  };

  const statusLabels = {
    available: 'Available',
    busy: 'On Job',
    offline: 'Offline',
  };

  const initials = operator.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Card
      onClick={() => onSelect(operator.id)}
      className={`
        glass border cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-[var(--color-teal)] ring-2 ring-[var(--color-teal)]/20' 
          : 'border-[var(--color-border)] hover:border-[var(--color-teal)]/50'
        }
      `}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-[var(--color-border)]">
              <AvatarImage src={operator.avatarUrl} alt={operator.name} />
              <AvatarFallback className="bg-[var(--color-secondary)] text-[var(--color-foreground)]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-[var(--color-foreground)]">
                {operator.name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                <Truck className="w-3 h-3" />
                {operator.vehicle.name}
              </div>
            </div>
          </div>
          <Badge className={statusColors[operator.status]}>
            {statusLabels[operator.status]}
          </Badge>
        </div>

        {/* Current Job */}
        {inProgressJob && currentCustomer && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--color-teal)]/5 border border-[var(--color-teal)]/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[var(--color-teal)] animate-pulse" />
              <span className="text-xs font-medium text-[var(--color-teal)]">Currently Clearing</span>
            </div>
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              {currentCustomer.name}
            </p>
            <div className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
              <MapPin className="w-3 h-3" />
              {inProgressJob.address.street}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-[var(--color-secondary)]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
            </div>
            <p className="text-lg font-bold text-[var(--color-foreground)]">
              {completedJobs.length}
            </p>
            <p className="text-[10px] text-[var(--color-muted-foreground)]">Done</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-[var(--color-secondary)]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-[var(--color-amber)]" />
            </div>
            <p className="text-lg font-bold text-[var(--color-foreground)]">
              {pendingJobs.length}
            </p>
            <p className="text-[10px] text-[var(--color-muted-foreground)]">Pending</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-[var(--color-secondary)]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-[10px] text-green-600 font-bold">$</span>
            </div>
            <p className="text-lg font-bold text-[var(--color-foreground)]">
              {totalEarnings}
            </p>
            <p className="text-[10px] text-[var(--color-muted-foreground)]">Earned</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
          <span>{operator.vehicle.licensePlate}</span>
          <span className="capitalize">{operator.vehicle.type.replace('_', ' ')}</span>
        </div>
      </CardContent>
    </Card>
  );
}

