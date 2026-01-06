'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Coordinates } from '@/types';
import { MAP_CENTER, MAP_ZOOM } from '@/lib/mock-data';
import { useTheme } from '@/context/ThemeContext';
import 'leaflet/dist/leaflet.css';

// Map tile URLs
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Custom icons
const createIcon = (color: string, isHome: boolean = false) => {
  const size = isHome ? 40 : 36;
  const svg = isHome
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}">
        <path d="M12 2L2 12h3v9h6v-6h2v6h6v-9h3L12 2z"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>`;

  return L.divIcon({
    html: `<div class="relative flex items-center justify-center">
      ${svg}
      ${!isHome ? '<div class="absolute w-full h-full animate-ping rounded-full bg-amber-400/40"></div>' : ''}
    </div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const homeIcon = createIcon('#0891b2', true); // teal-600
const plowIcon = createIcon('#f59e0b', false); // amber-500

// Component to handle map centering
function MapController({ center, zoom }: { center: Coordinates; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center, map, zoom]);
  return null;
}

interface CustomerMapProps {
  homeLocation: Coordinates;
  operatorLocation: Coordinates;
  className?: string;
}

export default function CustomerMap({
  homeLocation,
  operatorLocation,
  className = '',
}: CustomerMapProps) {
  const { theme } = useTheme();
  const tileUrl = theme === 'dark' ? DARK_TILES : LIGHT_TILES;
  
  // Use operator location directly from parent (which handles the simulation)
  const currentPlowPos = operatorLocation;

  // Calculate center between home and plow
  const center = useMemo(
    () => ({
      lat: (homeLocation.lat + currentPlowPos.lat) / 2,
      lng: (homeLocation.lng + currentPlowPos.lng) / 2,
    }),
    [homeLocation, currentPlowPos]
  );

  // Generate route line from current plow position to home
  const routeLine = useMemo(() => {
    return [
      [currentPlowPos.lat, currentPlowPos.lng] as [number, number],
      [homeLocation.lat, homeLocation.lng] as [number, number],
    ];
  }, [currentPlowPos, homeLocation]);

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${className}`}>
      <MapContainer
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={MAP_ZOOM}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          key={theme}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapController center={center} zoom={MAP_ZOOM} />

        {/* Route line */}
        <Polyline
          positions={routeLine}
          pathOptions={{
            color: '#0891b2',
            weight: 4,
            opacity: 0.6,
            dashArray: '10, 10',
          }}
        />

        {/* Home marker */}
        <Marker position={[homeLocation.lat, homeLocation.lng]} icon={homeIcon}>
          <Popup>
            <div className="font-medium">Your Home</div>
            <div className="text-sm text-gray-500">Service scheduled</div>
          </Popup>
        </Marker>

        {/* Plow marker */}
        <Marker position={[currentPlowPos.lat, currentPlowPos.lng]} icon={plowIcon}>
          <Popup>
            <div className="font-medium">Snow Plow</div>
            <div className="text-sm text-gray-500">En route to your location</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

