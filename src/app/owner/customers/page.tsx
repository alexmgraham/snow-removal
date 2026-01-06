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
  Users, 
  Plus, 
  ArrowLeft, 
  Search,
  Edit2,
  Trash2,
  MapPin,
  Mail,
  Phone,
  ToggleLeft,
  ToggleRight,
  X
} from 'lucide-react';
import type { CustomerWithSubscription, Address, Coordinates } from '@/types';

export default function CustomersPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const { 
    customers, 
    isLoaded, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer,
    toggleSubscription,
    getJobsForCustomer
  } = useManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerWithSubscription | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: 'Truckee',
    state: 'CA',
    zip: '96161',
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

  // Filter customers by search
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.street.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const activeSubscriptions = customers.filter(c => c.subscription?.active).length;
  const totalMRR = customers
    .filter(c => c.subscription?.active)
    .reduce((sum, c) => sum + (c.subscription?.seasonalPrice || 0), 0);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      street: '',
      city: 'Truckee',
      state: 'CA',
      zip: '96161',
    });
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleEdit = (customer: CustomerWithSubscription) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      street: customer.address.street,
      city: customer.address.city,
      state: customer.address.state,
      zip: customer.address.zip,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const address: Address = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
    };

    // Simple coordinate generation for demo (Truckee area)
    const coordinates: Coordinates = {
      lat: 39.3280 + (Math.random() - 0.5) * 0.02,
      lng: -120.1833 + (Math.random() - 0.5) * 0.02,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address,
        coordinates,
      });
    } else {
      addCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address,
        coordinates,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    setDeleteConfirm(null);
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
              <div className="w-10 h-10 rounded-lg bg-[var(--color-teal)] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Customer Management
            </h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              {customers.length} customers • {activeSubscriptions} active subscriptions
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Total Customers</p>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">{customers.length}</p>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Active Subscriptions</p>
              <p className="text-2xl font-bold text-[var(--color-teal)]">{activeSubscriptions}</p>
            </CardContent>
          </Card>
          <Card className="glass border-[var(--color-border)]">
            <CardContent className="p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Seasonal Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalMRR.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
          />
        </div>

        {/* Customer List */}
        <Card className="glass border-[var(--color-border)]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left p-4 text-sm font-medium text-[var(--color-muted-foreground)]">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-[var(--color-muted-foreground)]">Contact</th>
                    <th className="text-left p-4 text-sm font-medium text-[var(--color-muted-foreground)]">Address</th>
                    <th className="text-left p-4 text-sm font-medium text-[var(--color-muted-foreground)]">Subscription</th>
                    <th className="text-left p-4 text-sm font-medium text-[var(--color-muted-foreground)]">Jobs</th>
                    <th className="text-right p-4 text-sm font-medium text-[var(--color-muted-foreground)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => {
                    const jobs = getJobsForCustomer(customer.id);
                    return (
                      <tr key={customer.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-secondary)]/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={customer.avatarUrl} 
                              alt={customer.name}
                              className="w-10 h-10 rounded-full bg-[var(--color-secondary)]"
                            />
                            <div>
                              <p className="font-medium text-[var(--color-foreground)]">{customer.name}</p>
                              <p className="text-xs text-[var(--color-muted-foreground)]">
                                ${customer.totalSpent?.toLocaleString() || 0} total
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="text-sm text-[var(--color-foreground)] flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {customer.email}
                            </p>
                            <p className="text-sm text-[var(--color-muted-foreground)] flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-[var(--color-foreground)] flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {customer.address.street}
                          </p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">
                            {customer.address.city}, {customer.address.state}
                          </p>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleSubscription(customer.id)}
                            className="flex items-center gap-2"
                          >
                            {customer.subscription?.active ? (
                              <>
                                <ToggleRight className="w-6 h-6 text-[var(--color-teal)]" />
                                <Badge className="bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                                  Seasonal
                                </Badge>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-6 h-6 text-[var(--color-muted-foreground)]" />
                                <Badge variant="secondary">Per-service</Badge>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-[var(--color-foreground)]">{jobs.length} jobs</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {deleteConfirm === customer.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(customer.id)}
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
                                onClick={() => setDeleteConfirm(customer.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetForm} />
          <Card className="relative z-10 w-full max-w-lg glass border-[var(--color-border)]">
            <CardHeader>
              <CardTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">ZIP</label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white">
                    {editingCustomer ? 'Save Changes' : 'Add Customer'}
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

