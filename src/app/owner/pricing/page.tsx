'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useManagement } from '@/context/ManagementContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ArrowLeft, 
  RotateCcw,
  Check,
  Zap,
  Clock,
  Leaf,
  Edit2,
  Save,
  X
} from 'lucide-react';
import type { PricingTier, PriorityTier } from '@/types';

export default function PricingPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const { pricingTiers, isLoaded, updatePricingTier, resetPricing } = useManagement();
  
  const [editingTier, setEditingTier] = useState<PriorityTier | null>(null);
  const [editValues, setEditValues] = useState<Partial<PricingTier>>({});
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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

  const getTierIcon = (tierId: PriorityTier) => {
    switch (tierId) {
      case 'economy': return <Leaf className="w-6 h-6" />;
      case 'standard': return <Clock className="w-6 h-6" />;
      case 'priority': return <Zap className="w-6 h-6" />;
    }
  };

  const getTierColor = (tierId: PriorityTier) => {
    switch (tierId) {
      case 'economy': return 'bg-green-100 text-green-600 border-green-200';
      case 'standard': return 'bg-[var(--color-teal)]/10 text-[var(--color-teal)] border-[var(--color-teal)]/20';
      case 'priority': return 'bg-[var(--color-amber)]/10 text-[var(--color-amber)] border-[var(--color-amber)]/20';
    }
  };

  const handleEdit = (tier: PricingTier) => {
    setEditingTier(tier.id);
    setEditValues({
      price: tier.price,
      description: tier.description,
      features: [...tier.features],
    });
  };

  const handleSave = (tierId: PriorityTier) => {
    updatePricingTier(tierId, editValues);
    setEditingTier(null);
    setEditValues({});
    setSaveMessage('Pricing updated successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleCancel = () => {
    setEditingTier(null);
    setEditValues({});
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(editValues.features || [])];
    newFeatures[index] = value;
    setEditValues({ ...editValues, features: newFeatures });
  };

  const handleReset = () => {
    resetPricing();
    setSaveMessage('Pricing reset to defaults');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  if (!isAuthenticated || role !== 'owner' || !isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              Pricing Configuration
            </h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              Adjust service tier pricing and features
            </p>
          </div>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-[var(--color-border)]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="mb-6 p-3 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
            {saveMessage}
          </div>
        )}

        {/* Pricing Tiers */}
        <div className="grid gap-6">
          {pricingTiers.map((tier) => {
            const isEditing = editingTier === tier.id;
            
            return (
              <Card 
                key={tier.id} 
                className={`glass border-2 transition-all ${
                  isEditing 
                    ? 'border-[var(--color-teal)] ring-2 ring-[var(--color-teal)]/20' 
                    : 'border-[var(--color-border)]'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getTierColor(tier.id)}`}>
                        {getTierIcon(tier.id)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{tier.name}</CardTitle>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.description || ''}
                            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                            className="mt-1 w-full px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-teal)]"
                          />
                        ) : (
                          <CardDescription>{tier.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSave(tier.id)}
                            className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(tier)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-2">
                        Price per Service
                      </label>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[var(--color-foreground)]">$</span>
                          <input
                            type="number"
                            value={editValues.price || 0}
                            onChange={(e) => setEditValues({ ...editValues, price: parseInt(e.target.value) || 0 })}
                            className="w-32 px-3 py-2 text-2xl font-bold rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
                          />
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-[var(--color-foreground)]">${tier.price}</span>
                          {tier.originalPrice && tier.originalPrice !== tier.price && (
                            <span className="text-lg text-[var(--color-muted-foreground)] line-through">
                              ${tier.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        {tier.discount && (
                          <Badge className="bg-green-100 text-green-700">
                            Save {tier.discount}%
                          </Badge>
                        )}
                        {tier.surcharge && (
                          <Badge className="bg-[var(--color-amber)]/10 text-[var(--color-amber)]">
                            +{tier.surcharge}% rush fee
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {tier.etaModifier}x ETA
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-2">
                        Features
                      </label>
                      <ul className="space-y-2">
                        {(isEditing ? editValues.features : tier.features)?.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className="flex-1 px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-teal)]"
                              />
                            ) : (
                              <span className="text-sm text-[var(--color-foreground)]">{feature}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Preview Section */}
        <Card className="glass border-[var(--color-border)] mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Customer Preview</CardTitle>
            <CardDescription>How pricing appears to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-4 rounded-xl border-2 ${
                    tier.id === 'standard' 
                      ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/5' 
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {tier.id === 'standard' && (
                    <Badge className="mb-2 bg-[var(--color-teal)] text-white">Most Popular</Badge>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTierColor(tier.id)}`}>
                      {getTierIcon(tier.id)}
                    </div>
                    <h4 className="font-semibold text-[var(--color-foreground)]">{tier.name}</h4>
                  </div>
                  <p className="text-2xl font-bold text-[var(--color-foreground)] mb-1">${tier.price}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{tier.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

