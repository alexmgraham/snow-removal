'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useManagement } from '@/context/ManagementContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Plus, 
  ArrowLeft, 
  Search,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  X,
  Check
} from 'lucide-react';
import type { OperatorWithSchedule, Vehicle, WeeklySchedule, Coordinates } from '@/types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function OperatorsPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const { 
    operators, 
    zones,
    isLoaded, 
    addOperator, 
    updateOperator, 
    deleteOperator,
    assignZone,
    updateSchedule,
    getJobsForOperator
  } = useManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOperator, setEditingOperator] = useState<OperatorWithSchedule | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleName: '',
    vehicleType: 'plow_truck' as Vehicle['type'],
    licensePlate: '',
    zoneId: '',
  });

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

  // Filter operators by search
  const filteredOperators = operators.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const activeOperators = operators.filter(o => o.status === 'available' || o.status === 'busy').length;
  const busyOperators = operators.filter(o => o.status === 'busy').length;

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      vehicleName: '',
      vehicleType: 'plow_truck',
      licensePlate: '',
      zoneId: '',
    });
    setEditingOperator(null);
    setShowForm(false);
  };

  const handleEdit = (operator: OperatorWithSchedule) => {
    setEditingOperator(operator);
    setFormData({
      name: operator.name,
      phone: operator.phone,
      vehicleName: operator.vehicle.name,
      vehicleType: operator.vehicle.type,
      licensePlate: operator.vehicle.licensePlate,
      zoneId: operator.zoneId || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicle: Vehicle = {
      id: editingOperator?.vehicle.id || `veh-${Date.now()}`,
      name: formData.vehicleName,
      type: formData.vehicleType,
      licensePlate: formData.licensePlate,
    };

    // Simple coordinate generation for demo (Truckee area)
    const currentLocation: Coordinates = {
      lat: 39.3280 + (Math.random() - 0.5) * 0.02,
      lng: -120.1833 + (Math.random() - 0.5) * 0.02,
    };

    if (editingOperator) {
      updateOperator(editingOperator.id, {
        name: formData.name,
        phone: formData.phone,
        vehicle,
        zoneId: formData.zoneId || undefined,
      });
    } else {
      addOperator({
        name: formData.name,
        phone: formData.phone,
        vehicle,
        currentLocation,
        status: 'available',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        zoneId: formData.zoneId || undefined,
        schedule: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteOperator(id);
    setDeleteConfirm(null);
  };

  const handleScheduleToggle = (operatorId: string, day: keyof WeeklySchedule) => {
    const operator = operators.find(o => o.id === operatorId);
    if (operator?.schedule) {
      updateSchedule(operatorId, {
        ...operator.schedule,
        [day]: !operator.schedule[day],
      });
    }
  };

  const getStatusColor = (status: OperatorWithSchedule['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'busy': return 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]';
      case 'offline': return 'bg-slate-100 text-slate-600';
    }
  };

  if (!isAuthenticated || role !== 'owner' || !isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <div className="w-10 h-10 rounded-lg bg-[var(--color-amber)] flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              Operator Management
            </h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              {operators.length} operators • {activeOperators} active
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Operator
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Total Operators</p>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">{operators.length}</p>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Available</p>
              <p className="text-2xl font-bold text-green-600">{operators.filter(o => o.status === 'available').length}</p>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">On Job</p>
              <p className="text-2xl font-bold text-[var(--color-teal)]">{busyOperators}</p>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Service Zones</p>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">{zones.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            placeholder="Search operators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
          />
        </div>

        {/* Operator Cards */}
        <div className="grid gap-4">
          {filteredOperators.map((operator) => {
            const zone = zones.find(z => z.id === operator.zoneId);
            const jobs = getJobsForOperator(operator.id);
            const todayJobs = jobs.filter(j => j.scheduledDate === new Date().toISOString().split('T')[0]);

            return (
              <Card key={operator.id} className="glass border-[var(--color-border)]">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Operator Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <img 
                        src={operator.avatarUrl} 
                        alt={operator.name}
                        className="w-12 h-12 rounded-full bg-[var(--color-secondary)]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-foreground)]">{operator.name}</h3>
                          <Badge className={getStatusColor(operator.status)}>
                            {operator.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--color-muted-foreground)] flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {operator.phone}
                        </p>
                      </div>
                    </div>

                    {/* Vehicle & Zone */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <div>
                        <p className="text-xs text-[var(--color-muted-foreground)]">Vehicle</p>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">{operator.vehicle.name}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{operator.vehicle.licensePlate}</p>
                      </div>

                      <div>
                        <p className="text-xs text-[var(--color-muted-foreground)]">Zone</p>
                        <select
                          value={operator.zoneId || ''}
                          onChange={(e) => assignZone(operator.id, e.target.value || undefined)}
                          className="text-sm font-medium text-[var(--color-foreground)] bg-transparent border-none focus:outline-none cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {zones.map(z => (
                            <option key={z.id} value={z.id}>{z.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-xs text-[var(--color-muted-foreground)]">Today</p>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">{todayJobs.length} jobs</p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-1">
                      {editingSchedule === operator.id ? (
                        <>
                          {DAYS.map((day, i) => (
                            <button
                              key={day}
                              onClick={() => handleScheduleToggle(operator.id, day)}
                              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                                operator.schedule?.[day] 
                                  ? 'bg-[var(--color-teal)] text-white' 
                                  : 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]'
                              }`}
                            >
                              {DAY_LABELS[i]}
                            </button>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSchedule(null)}
                            className="h-8 w-8 p-0 ml-1"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 mr-2">
                            {DAYS.map((day, i) => (
                              <div
                                key={day}
                                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                                  operator.schedule?.[day] 
                                    ? 'bg-[var(--color-teal)]/20 text-[var(--color-teal)]' 
                                    : 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]'
                                }`}
                              >
                                {DAY_LABELS[i][0]}
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSchedule(operator.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(operator)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {deleteConfirm === operator.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(operator.id)}
                            className="h-8 text-xs"
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(operator.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetForm} />
          <Card className="relative z-10 w-full max-w-lg glass border-[var(--color-border)]">
            <CardHeader>
              <CardTitle>{editingOperator ? 'Edit Operator' : 'Add New Operator'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Vehicle Name</label>
                    <input
                      type="text"
                      required
                      value={formData.vehicleName}
                      onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                      placeholder="e.g., Plow Truck #5"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Vehicle Type</label>
                    <select
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as Vehicle['type'] })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                    >
                      <option value="plow_truck">Plow Truck</option>
                      <option value="skid_steer">Skid Steer</option>
                      <option value="atv">ATV</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">License Plate</label>
                    <input
                      type="text"
                      required
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Service Zone</label>
                    <select
                      value={formData.zoneId}
                      onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                    >
                      <option value="">No zone assigned</option>
                      {zones.map(z => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white">
                    {editingOperator ? 'Save Changes' : 'Add Operator'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

