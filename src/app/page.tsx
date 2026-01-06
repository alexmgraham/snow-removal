'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Snowflake, User, Truck, Building2, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import type { UserRole } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const { setRole, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'customer') router.push('/customer');
      else if (role === 'operator') router.push('/operator');
      else if (role === 'owner') router.push('/owner');
    }
  }, [isAuthenticated, role, router]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'customer') router.push('/customer');
    else if (selectedRole === 'operator') router.push('/operator');
    else if (selectedRole === 'owner') router.push('/owner');
  };

  return (
    <div className="min-h-screen gradient-bg snow-pattern relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-teal-light)] rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-frost)] rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--color-amber)] rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo and Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--color-navy)] shadow-xl mb-6">
            <Snowflake className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-deep-navy)] tracking-tight mb-3">
            SnowClear
          </h1>
          <p className="text-xl text-[var(--color-muted-foreground)] max-w-md mx-auto">
            Smart snow removal tracking for modern neighborhoods
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          {/* Customer Card */}
          <Card 
            className="group cursor-pointer glass border-[var(--color-border)] hover:border-[var(--color-teal)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => handleRoleSelect('customer')}
          >
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-glacier)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-2xl text-[var(--color-deep-navy)]">
                I&apos;m a Customer
              </CardTitle>
              <CardDescription className="text-base">
                Track your plow in real-time and see when they&apos;ll arrive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)] mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
                  Live plow location tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
                  Choose your priority tier
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
                  Service status updates
                </li>
              </ul>
              <div className="flex items-center gap-2 text-[var(--color-teal)] font-medium group-hover:gap-3 transition-all">
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Operator Card */}
          <Card 
            className="group cursor-pointer glass border-[var(--color-border)] hover:border-[var(--color-amber)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => handleRoleSelect('operator')}
          >
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-amber)] to-[var(--color-amber-bright)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-2xl text-[var(--color-deep-navy)]">
                I&apos;m an Operator
              </CardTitle>
              <CardDescription className="text-base">
                Manage routes and track job completion times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)] mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)]" />
                  Route map overview
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)]" />
                  Job time tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)]" />
                  Performance metrics
                </li>
              </ul>
              <div className="flex items-center gap-2 text-[var(--color-amber)] font-medium group-hover:gap-3 transition-all">
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Owner Card */}
          <Card 
            className="group cursor-pointer glass border-[var(--color-border)] hover:border-[var(--color-navy)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => handleRoleSelect('owner')}
          >
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-deep-navy)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-2xl text-[var(--color-deep-navy)]">
                I&apos;m an Owner
              </CardTitle>
              <CardDescription className="text-base">
                Monitor your entire fleet and business performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)] mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-navy)]" />
                  Fleet status overview
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-navy)]" />
                  Revenue tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-navy)]" />
                  Operator management
                </li>
              </ul>
              <div className="flex items-center gap-2 text-[var(--color-navy)] font-medium group-hover:gap-3 transition-all">
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-sm text-[var(--color-muted-foreground)] animate-in fade-in duration-700 delay-300">
          Demo mode • Using simulated data
        </p>
      </div>
    </div>
  );
}
