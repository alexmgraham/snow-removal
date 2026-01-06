'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Operator, Job, Coordinates } from '@/types';
import { MAP_CENTER, MAP_ZOOM, getCustomerById } from '@/lib/mock-data';
import { useTheme } from '@/context/ThemeContext';
import 'leaflet/dist/leaflet.css';

// Map tile URLs
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Create operator marker icon
const createOperatorIcon = (status: Operator['status'], isSelected: boolean) => {
  const colors = {
    available: { bg: '#10b981', border: '#059669' },
    busy: { bg: '#0891b2', border: '#0e7490' },
    offline: { bg: '#94a3b8', border: '#64748b' },
  };

  const { bg, border } = colors[status];
  const size = isSelected ? 44 : 36;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${bg}, ${border});
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${bg}66;
        ${isSelected ? 'transform: scale(1.1);' : ''}
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="${size * 0.6}" height="${size * 0.6}">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
      ${status === 'busy' ? `
        <div style="
          position: absolute;
          top: -4px;
          left: -4px;
          width: ${size + 8}px;
          height: ${size + 8}px;
          border: 2px solid ${bg};
          border-radius: 14px;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0.5;
        "></div>
      ` : ''}
    `,
    className: 'operator-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Create job marker icon
const createJobIcon = (status: Job['status']) => {
  const colors: Record<Job['status'], { bg: string; border: string }> = {
    pending: { bg: '#94a3b8', border: '#64748b' },
    en_route: { bg: '#f59e0b', border: '#d97706' },
    in_progress: { bg: '#0891b2', border: '#0e7490' },
    completed: { bg: '#10b981', border: '#059669' },
    cancelled: { bg: '#ef4444', border: '#dc2626' },
  };

  const { bg, border } = colors[status];

  return L.divIcon({
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: ${bg};
        border: 2px solid ${border};
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      "></div>
    `,
    className: 'job-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

interface MapControllerProps {
  center: Coordinates;
  zoom: number;
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();
  useMemo(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center, map, zoom]);
  return null;
}

interface FleetMapProps {
  operators: Operator[];
  jobs: Job[];
  selectedOperatorId: string | null;
  onOperatorSelect: (operatorId: string) => void;
  className?: string;
}

export default function FleetMap({
  operators,
  jobs,
  selectedOperatorId,
  onOperatorSelect,
  className = '',
}: FleetMapProps) {
  const { theme } = useTheme();
  const tileUrl = theme === 'dark' ? DARK_TILES : LIGHT_TILES;
  
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${className}`}>
      <MapContainer
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={MAP_ZOOM}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          key={theme}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapController center={MAP_CENTER} zoom={MAP_ZOOM} />

        {/* Job markers */}
        {jobs.map((job) => {
          const customer = getCustomerById(job.customerId);
          
          return (
            <Marker
              key={job.id}
              position={[job.coordinates.lat, job.coordinates.lng]}
              icon={createJobIcon(job.status)}
            >
              <Popup>
                <div className="min-w-[150px]">
                  <div className="font-medium text-gray-900">{customer?.name}</div>
                  <div className="text-xs text-gray-600">{job.address.street}</div>
                  <div className="mt-1">
                    <span
                      className={`
                        inline-block px-2 py-0.5 rounded-full text-[10px] font-medium
                        ${job.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                        ${job.status === 'in_progress' ? 'bg-cyan-100 text-cyan-700' : ''}
                        ${job.status === 'en_route' ? 'bg-amber-100 text-amber-700' : ''}
                        ${job.status === 'pending' ? 'bg-gray-100 text-gray-600' : ''}
                      `}
                    >
                      {job.status.replace('_', ' ')}
                    </span>
                    <span className="ml-2 text-[10px] text-gray-500">${job.price}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Operator markers */}
        {operators.map((operator) => {
          const isSelected = selectedOperatorId === operator.id;
          
          return (
            <Marker
              key={operator.id}
              position={[operator.currentLocation.lat, operator.currentLocation.lng]}
              icon={createOperatorIcon(operator.status, isSelected)}
              eventHandlers={{
                click: () => onOperatorSelect(operator.id),
              }}
            >
              <Popup>
                <div className="min-w-[140px]">
                  <div className="font-semibold text-gray-900">{operator.name}</div>
                  <div className="text-xs text-gray-600">{operator.vehicle.name}</div>
                  <div className="mt-1">
                    <span
                      className={`
                        inline-block px-2 py-0.5 rounded-full text-[10px] font-medium
                        ${operator.status === 'available' ? 'bg-green-100 text-green-700' : ''}
                        ${operator.status === 'busy' ? 'bg-cyan-100 text-cyan-700' : ''}
                        ${operator.status === 'offline' ? 'bg-gray-100 text-gray-600' : ''}
                      `}
                    >
                      {operator.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

