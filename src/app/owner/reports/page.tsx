'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useManagement } from '@/context/ManagementContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  ArrowLeft, 
  Download,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type DateRange = '7d' | '30d' | '90d';

export default function ReportsPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const { customers, operators, jobs, pricingTiers, isLoaded } = useManagement();
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  // Redirect if not owner
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (role !== 'owner') {
      router.push(role === 'customer' ? '/customer' : '/operator');
    }
  }, [isAuthenticated, role, router]);

  // Generate mock historical data for charts
  const revenueData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Generate realistic-looking revenue data
      const baseRevenue = 800 + Math.random() * 600;
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.6 : 1;
      const revenue = Math.round(baseRevenue * weekendMultiplier);
      const jobCount = Math.round(revenue / 280);
      
      data.push({
        date: dateStr,
        revenue,
        jobs: jobCount,
      });
    }
    return data;
  }, [dateRange]);

  // Jobs by status
  const jobStatusData = useMemo(() => {
    const completed = jobs.filter(j => j.status === 'completed').length;
    const inProgress = jobs.filter(j => j.status === 'in_progress').length;
    const pending = jobs.filter(j => j.status === 'pending' || j.status === 'en_route').length;
    
    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'In Progress', value: inProgress, color: '#0891b2' },
      { name: 'Pending', value: pending, color: '#64748b' },
    ];
  }, [jobs]);

  // Revenue by tier
  const tierRevenueData = useMemo(() => {
    return pricingTiers.map(tier => {
      const tierJobs = jobs.filter(j => j.priorityTier === tier.id);
      const revenue = tierJobs.reduce((sum, j) => sum + j.price, 0);
      return {
        name: tier.name,
        revenue,
        jobs: tierJobs.length,
        color: tier.id === 'economy' ? '#22c55e' : tier.id === 'standard' ? '#0891b2' : '#f59e0b',
      };
    });
  }, [jobs, pricingTiers]);

  // Top customers by spend
  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 5);
  }, [customers]);

  // Key metrics
  const metrics = useMemo(() => {
    const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
    const totalJobs = revenueData.reduce((sum, d) => sum + d.jobs, 0);
    const avgJobValue = totalJobs > 0 ? Math.round(totalRevenue / totalJobs) : 0;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const completionRate = jobs.length > 0 ? Math.round((completedJobs / jobs.length) * 100) : 0;
    
    return {
      totalRevenue,
      totalJobs,
      avgJobValue,
      completionRate,
    };
  }, [revenueData, jobs]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Revenue', 'Jobs'];
    const rows = revenueData.map(d => [d.date, d.revenue, d.jobs]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated || role !== 'owner' || !isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Link */}
        <Link 
          href="/owner" 
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-navy)] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Reports & Analytics
            </h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              Business performance insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
              {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-[var(--color-teal)] text-white'
                      : 'bg-[var(--color-background)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button 
              onClick={exportToCSV}
              variant="outline"
              className="border-[var(--color-border)]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Total Revenue</p>
                  <p className="text-2xl font-bold text-[var(--color-foreground)]">
                    ${metrics.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[var(--color-teal)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Total Jobs</p>
                  <p className="text-2xl font-bold text-[var(--color-foreground)]">{metrics.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-amber)]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[var(--color-amber)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Avg Job Value</p>
                  <p className="text-2xl font-bold text-[var(--color-foreground)]">${metrics.avgJobValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Completion Rate</p>
                  <p className="text-2xl font-bold text-[var(--color-foreground)]">{metrics.completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Over Time */}
          <Card className="glass border-[var(--color-border)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`$${value ?? 0}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0891b2" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Jobs by Status */}
          <Card className="glass border-[var(--color-border)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Jobs by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue by Tier */}
          <Card className="glass border-[var(--color-border)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Revenue by Service Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tierRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value, name) => [
                        name === 'revenue' ? `$${value ?? 0}` : (value ?? 0),
                        name === 'revenue' ? 'Revenue' : 'Jobs'
                      ]}
                    />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {tierRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card className="glass border-[var(--color-border)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--color-teal)]" />
                Top Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div 
                    key={customer.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-secondary)]/50"
                  >
                    <span className="w-6 h-6 rounded-full bg-[var(--color-teal)] text-white text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <img 
                      src={customer.avatarUrl} 
                      alt={customer.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[var(--color-foreground)] text-sm">{customer.name}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{customer.address.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${customer.totalSpent?.toLocaleString() || 0}</p>
                      {customer.subscription?.active && (
                        <Badge className="bg-[var(--color-teal)]/10 text-[var(--color-teal)] text-xs">
                          Seasonal
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

