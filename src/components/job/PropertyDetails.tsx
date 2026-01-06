'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  Ruler,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Snowflake,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { PropertyDetails as PropertyDetailsType } from '@/types/property';
import {
  getDifficultyLabel,
  getDifficultyColor,
  formatObstacleType,
  formatSaltPreference,
  formatPileLocation,
} from '@/lib/property-data';
import PropertyPhotos from './PropertyPhotos';
import SpecialInstructions from './SpecialInstructions';

interface PropertyDetailsProps {
  property: PropertyDetailsType;
  compact?: boolean;
  showPhotos?: boolean;
}

export default function PropertyDetails({
  property,
  compact = false,
  showPhotos = true,
}: PropertyDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  const difficultyColor = getDifficultyColor(property.difficultyRating);
  const difficultyLabel = getDifficultyLabel(property.difficultyRating);

  if (compact && !isExpanded) {
    return (
      <div
        className="flex items-center justify-between p-3 bg-[var(--color-secondary)]/50 rounded-lg cursor-pointer hover:bg-[var(--color-secondary)] transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-3">
          <Home className="w-4 h-4 text-[var(--color-muted-foreground)]" />
          <div className="text-sm">
            <span className="font-medium capitalize">{property.drivewayType}</span>
            <span className="text-[var(--color-muted-foreground)]">
              {' '}
              • {property.dimensions.area} sq ft
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${difficultyColor} text-xs`}>{difficultyLabel}</Badge>
          <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)]" />
        </div>
      </div>
    );
  }

  return (
    <Card className="glass border-[var(--color-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-[var(--color-teal)]" />
            Property Details
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${difficultyColor} text-xs`}>{difficultyLabel}</Badge>
            {compact && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsExpanded(false)}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driveway Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[var(--color-secondary)]/50">
            <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Type</div>
            <div className="font-medium capitalize">{property.drivewayType}</div>
            <div className="text-xs text-[var(--color-muted-foreground)] capitalize">
              {property.drivewayShape} shape
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-secondary)]/50">
            <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Dimensions</div>
            <div className="font-medium">
              {property.dimensions.length}&apos; × {property.dimensions.width}&apos;
            </div>
            <div className="text-xs text-[var(--color-muted-foreground)]">
              {property.dimensions.area} sq ft
            </div>
          </div>
        </div>

        {/* Slope Info */}
        {property.dimensions.isSloped && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-sm">
            {property.dimensions.slopeDirection === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>
              <strong className="capitalize">{property.dimensions.slopeGrade}</strong> slope{' '}
              {property.dimensions.slopeDirection}hill
            </span>
          </div>
        )}

        {/* Obstacles */}
        {property.obstacles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Obstacles ({property.obstacles.length})
            </div>
            <div className="space-y-1">
              {property.obstacles.map((obstacle) => (
                <div
                  key={obstacle.id}
                  className="flex items-start justify-between p-2 rounded bg-[var(--color-secondary)]/50 text-sm"
                >
                  <div>
                    <span className="font-medium">{formatObstacleType(obstacle.type)}</span>
                    {obstacle.description && (
                      <span className="text-[var(--color-muted-foreground)]">
                        {' '}
                        - {obstacle.description}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[var(--color-muted-foreground)]">
                    {obstacle.location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 p-2 rounded bg-[var(--color-secondary)]/50">
            <Snowflake className="w-4 h-4 text-[var(--color-teal)]" />
            <span>{formatSaltPreference(property.preferences.saltUsage)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-[var(--color-secondary)]/50">
            <MapPin className="w-4 h-4 text-[var(--color-glacier)]" />
            <span>
              Pile:{' '}
              {formatPileLocation(
                property.preferences.pileLocation,
                property.preferences.customPileLocation
              )}
            </span>
          </div>
        </div>

        {/* Clear Paths */}
        <div className="flex flex-wrap gap-2">
          {property.preferences.clearSidewalk && (
            <Badge variant="outline" className="text-xs">
              Sidewalk
            </Badge>
          )}
          {property.preferences.clearPathToMailbox && (
            <Badge variant="outline" className="text-xs">
              Path to Mailbox
            </Badge>
          )}
          {property.preferences.clearPathToDoor && (
            <Badge variant="outline" className="text-xs">
              Path to Door
            </Badge>
          )}
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-teal)]/10 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-teal)]" />
            <span>Estimated Clear Time</span>
          </div>
          <span className="font-semibold text-[var(--color-teal)]">
            {property.estimatedClearTime} min
          </span>
        </div>

        {/* Special Instructions */}
        {(property.preferences.specialInstructions ||
          property.access.accessNotes ||
          property.notes) && (
          <SpecialInstructions
            specialInstructions={property.preferences.specialInstructions}
            accessNotes={property.access.accessNotes}
            notes={property.notes}
            gateCode={property.access.gateCode}
          />
        )}

        {/* Photos */}
        {showPhotos && property.photos.length > 0 && (
          <PropertyPhotos photos={property.photos} />
        )}
      </CardContent>
    </Card>
  );
}

