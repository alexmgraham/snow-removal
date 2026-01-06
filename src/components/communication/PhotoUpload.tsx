'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Upload,
  X,
  Check,
  Image as ImageIcon,
  Clock,
  MapPin,
} from 'lucide-react';

export interface CompletionPhoto {
  id: string;
  url: string;
  type: 'before' | 'after';
  timestamp: string;
  caption?: string;
}

interface PhotoUploadProps {
  jobId: string;
  photos?: CompletionPhoto[];
  onUpload?: (photo: CompletionPhoto) => void;
  readOnly?: boolean;
}

export default function PhotoUpload({
  jobId,
  photos = [],
  onUpload,
  readOnly = false,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<CompletionPhoto | null>(null);

  // Mock photos for demo
  const mockPhotos: CompletionPhoto[] = photos.length > 0 ? photos : [
    {
      id: 'photo-before-1',
      url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&h=300&fit=crop',
      type: 'before',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      caption: 'Driveway before clearing',
    },
    {
      id: 'photo-after-1',
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      type: 'after',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      caption: 'Driveway after clearing',
    },
  ];

  const handleUpload = (type: 'before' | 'after') => {
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newPhoto: CompletionPhoto = {
        id: `photo-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        type,
        timestamp: new Date().toISOString(),
        caption: `${type === 'before' ? 'Before' : 'After'} photo`,
      };
      onUpload?.(newPhoto);
      setIsUploading(false);
    }, 1500);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const beforePhotos = mockPhotos.filter((p) => p.type === 'before');
  const afterPhotos = mockPhotos.filter((p) => p.type === 'after');

  return (
    <>
      <Card className="glass border-[var(--color-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-[var(--color-teal)]" />
            Completion Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Before Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-100 text-slate-600">Before</Badge>
              </span>
              {!readOnly && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpload('before')}
                  disabled={isUploading}
                  className="h-8"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
            {beforePhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {beforePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(photo.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[var(--color-secondary)]/50 rounded-lg flex flex-col items-center justify-center text-[var(--color-muted-foreground)]">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm">No before photos</span>
              </div>
            )}
          </div>

          {/* After Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700">After</Badge>
              </span>
              {!readOnly && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpload('after')}
                  disabled={isUploading}
                  className="h-8"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
            {afterPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {afterPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(photo.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[var(--color-secondary)]/50 rounded-lg flex flex-col items-center justify-center text-[var(--color-muted-foreground)]">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm">No after photos yet</span>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="flex items-center gap-2 p-2 bg-[var(--color-teal)]/10 rounded-lg text-sm">
              <div className="w-4 h-4 border-2 border-[var(--color-teal)] border-t-transparent rounded-full animate-spin" />
              <span className="text-[var(--color-teal)]">Uploading photo...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`
                    ${selectedPhoto.type === 'before' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}
                  `}
                >
                  {selectedPhoto.type === 'before' ? 'Before' : 'After'}
                </Badge>
              </div>
              <p className="font-medium">{selectedPhoto.caption}</p>
              <p className="text-sm text-white/60 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(selectedPhoto.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

