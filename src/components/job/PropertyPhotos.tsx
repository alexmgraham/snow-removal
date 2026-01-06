'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import type { PropertyPhoto } from '@/types/property';

interface PropertyPhotosProps {
  photos: PropertyPhoto[];
  compact?: boolean;
}

export default function PropertyPhotos({ photos, compact = false }: PropertyPhotosProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const PhotoTypeLabel = ({ type }: { type: PropertyPhoto['type'] }) => {
    const labels: Record<PropertyPhoto['type'], string> = {
      driveway: 'Driveway',
      obstacle: 'Obstacle',
      overview: 'Overview',
      access: 'Access',
    };
    return (
      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
        {labels[type]}
      </span>
    );
  };

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.slice(0, 3).map((photo, index) => (
          <div
            key={photo.id}
            className="relative min-w-[80px] h-[60px] rounded overflow-hidden cursor-pointer group"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
        {photos.length > 3 && (
          <div className="min-w-[80px] h-[60px] rounded bg-[var(--color-secondary)] flex items-center justify-center text-sm text-[var(--color-muted-foreground)]">
            +{photos.length - 3}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Camera className="w-4 h-4 text-[var(--color-muted-foreground)]" />
          Property Photos ({photos.length})
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />
              <PhotoTypeLabel type={photo.type} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="w-6 h-6" />
          </Button>

          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedIndex].url}
              alt={photos[selectedIndex].caption}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <p className="font-medium">{photos[selectedIndex].caption}</p>
              <p className="text-sm text-white/60 mt-1">
                {selectedIndex + 1} of {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

