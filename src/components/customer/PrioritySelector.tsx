'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Clock, Leaf, ArrowRight } from 'lucide-react';
import type { PriorityTier, PricingTier } from '@/types';
import { pricingTiers } from '@/lib/mock-data';

interface PrioritySelectorProps {
  currentTier: PriorityTier;
  onTierChange: (tier: PriorityTier, price: number) => void;
  baseETA: number; // base ETA in minutes
}

export default function PrioritySelector({
  currentTier,
  onTierChange,
  baseETA,
}: PrioritySelectorProps) {
  const [selectedTier, setSelectedTier] = useState<PriorityTier>(currentTier);
  const [isChanging, setIsChanging] = useState(false);

  const handleTierSelect = (tier: PricingTier) => {
    setSelectedTier(tier.id);
  };

  const handleConfirm = () => {
    const tier = pricingTiers.find((t) => t.id === selectedTier);
    if (tier) {
      setIsChanging(true);
      // Simulate API call
      setTimeout(() => {
        onTierChange(selectedTier, tier.price);
        setIsChanging(false);
      }, 500);
    }
  };

  const getIcon = (tierId: PriorityTier) => {
    switch (tierId) {
      case 'economy':
        return <Leaf className="w-5 h-5" />;
      case 'standard':
        return <Clock className="w-5 h-5" />;
      case 'priority':
        return <Zap className="w-5 h-5" />;
    }
  };

  const getEstimatedTime = (tier: PricingTier) => {
    const adjustedETA = Math.round(baseETA * tier.etaModifier);
    if (adjustedETA < 60) {
      return `~${adjustedETA} min`;
    }
    const hours = Math.floor(adjustedETA / 60);
    const mins = adjustedETA % 60;
    return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
  };

  return (
    <Card className="glass border-[var(--color-border)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-[var(--color-foreground)]">
          Change Service Priority
        </CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Adjust your service timing and price
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {pricingTiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const isCurrent = currentTier === tier.id;

          return (
            <div
              key={tier.id}
              onClick={() => handleTierSelect(tier)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/5' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-teal)]/50'
                }
              `}
            >
              {/* Current badge */}
              {isCurrent && (
                <Badge 
                  className="absolute -top-2 right-3 bg-[var(--color-navy)] text-white text-xs"
                >
                  Current
                </Badge>
              )}

              <div className="flex items-start justify-between gap-4">
                {/* Left side - Info */}
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${tier.id === 'economy' ? 'bg-green-100 text-green-600' : ''}
                      ${tier.id === 'standard' ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]' : ''}
                      ${tier.id === 'priority' ? 'bg-[var(--color-amber)]/10 text-[var(--color-amber)]' : ''}
                    `}
                  >
                    {getIcon(tier.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[var(--color-foreground)]">
                        {tier.name}
                      </h4>
                      {tier.discount && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          Save {tier.discount}%
                        </Badge>
                      )}
                      {tier.surcharge && (
                        <Badge variant="secondary" className="bg-[var(--color-amber)]/10 text-[var(--color-amber)] text-xs">
                          +{tier.surcharge}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-2">
                      {tier.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                      <Clock className="w-3 h-3" />
                      <span>ETA: {getEstimatedTime(tier)}</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Price */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[var(--color-foreground)]">
                      ${tier.price}
                    </span>
                  </div>
                  {tier.originalPrice && tier.originalPrice !== tier.price && (
                    <span className="text-sm text-[var(--color-muted-foreground)] line-through">
                      ${tier.originalPrice}
                    </span>
                  )}
                </div>

                {/* Selection indicator */}
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected 
                      ? 'border-[var(--color-teal)] bg-[var(--color-teal)]' 
                      : 'border-[var(--color-border)]'
                    }
                  `}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              {/* Features (expanded when selected) */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <ul className="grid grid-cols-2 gap-2">
                    {tier.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]"
                      >
                        <Check className="w-3 h-3 text-[var(--color-success)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {/* Confirm button */}
        {selectedTier !== currentTier && (
          <Button
            onClick={handleConfirm}
            disabled={isChanging}
            className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white"
          >
            {isChanging ? (
              'Updating...'
            ) : (
              <>
                Confirm Change
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

