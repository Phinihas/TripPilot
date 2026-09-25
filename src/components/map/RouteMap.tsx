import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Car,
  Plane,
  Train,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import L from 'leaflet';
import { formatINR } from '../../utils/formatters';

interface RouteMapProps {
  startLocation: string;
  destination: string;
  travelRoute?: {
    startLocation: string;
    destination: string;
    distanceKm: number;
    recommendedTransport: string;
    estimatedTravelTime: string;
    routeHighlights: string;
    startCoords: [number, number];
    destCoords: [number, number];
    roadOption?: { duration: string; estCostInr: number; highway: string };
    trainOption?: { duration: string; estCostInr: number; name: string };
    flightOption?: { duration: string; estCostInr: number };
  };
  dayDestinations?: string[];
}

export const RouteMap: React.FC<RouteMapProps> = ({
  startLocation,
  destination,
  travelRoute,
  dayDestinations = [],
}) => {
  const [selectedTransit, setSelectedTransit] = useState<'road' | 'train' | 'flight'>('road');
  const [mapViewMode, setMapViewMode] = useState<'map' | 'diagram'>('map');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const distance = travelRoute?.distanceKm || 320;
  const startName = startLocation || travelRoute?.startLocation || 'Delhi (NCR), India';
  const destName = destination || travelRoute?.destination || 'Jaipur, Rajasthan';

  const startCoords: [number, number] = travelRoute?.startCoords || [28.6139, 77.2090];
  const destCoords: [number, number] = travelRoute?.destCoords || [26.9124, 75.7873];

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    startName
  )}&destination=${encodeURIComponent(destName)}&travelmode=driving`;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (mapViewMode !== 'map' || !mapContainerRef.current) return;

    // Cleanup previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom HTML icons
      const createIcon = (color: string, label: string) =>
        L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              background-color: ${color};
              color: white;
              border-radius: 50%;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              border: 3px solid #ffffff;
              font-size: 13px;
              font-weight: bold;
            ">
              ${label}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

      const startIcon = createIcon('#059669', 'A'); // Emerald
      const destIcon = createIcon('#0d9488', 'B'); // Teal

      // Markers
      const startMarker = L.marker(startCoords, { icon: startIcon })
        .addTo(map)
        .bindPopup(`<strong>Origin:</strong> ${startName}<br><span style="font-size:11px;color:#059669;">Starting Hub</span>`);

      const destMarker = L.marker(destCoords, { icon: destIcon })
        .addTo(map)
        .bindPopup(`<strong>Destination:</strong> ${destName}<br><span style="font-size:11px;color:#0d9488;">Trip Target</span>`);

      // Polyline route
      // Create slight midpoint offset curve for visual elegance if not straight
      const midLat = (startCoords[0] + destCoords[0]) / 2 + (destCoords[1] - startCoords[1]) * 0.05;
      const midLng = (startCoords[1] + destCoords[1]) / 2 - (destCoords[0] - startCoords[0]) * 0.05;
      const routePoints: [number, number][] = [startCoords, [midLat, midLng], destCoords];

      const polyline = L.polyline(routePoints, {
        color: '#059669',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 6',
      }).addTo(map);

      // Fit bounds
      const group = L.featureGroup([startMarker, destMarker, polyline]);
      map.fitBounds(group.getBounds(), { padding: [40, 40] });

      // Invalidate size once rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapViewMode, startCoords, destCoords, startName, destName]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([startCoords, destCoords]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm card-hover-effect">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <Navigation className="w-3.5 h-3.5" />
            <span>Interactive Travel Route & Transit</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {startName.split(',')[0]} → {destName.split(',')[0]}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMapViewMode('map')}
              className={`px-3 py-1 rounded-lg transition ${
                mapViewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => setMapViewMode('diagram')}
              className={`px-3 py-1 rounded-lg transition ${
                mapViewMode === 'diagram'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Corridor Flow
            </button>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition btn-hover-effect"
            title="Open Live Turn-by-Turn Navigation in Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Map or Corridor View */}
      {mapViewMode === 'map' ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-[320px] sm:h-[380px] z-10" />

          {/* Quick Floating Map Controls Bar */}
          <div className="absolute top-3 right-3 z-[400] flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
            <button
              onClick={handleRecenter}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
              title="Reset Map Fit to Origin & Destination"
            >
              <LocateFixed className="w-3.5 h-3.5 text-emerald-500" />
              <span>Reset Fit</span>
            </button>
          </div>

          {/* Bottom Map Stats Overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-white/50" />
                <strong className="text-white">{startName.split(',')[0]}</strong>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-400 inline-block ring-2 ring-white/50" />
                <strong className="text-white">{destName.split(',')[0]}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-extrabold">{distance} km</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-medium">{travelRoute?.estimatedTravelTime || '4.5 hrs'}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Corridor Graphic */
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white overflow-hidden min-h-[220px] flex flex-col justify-between border border-slate-800">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-xs">
              <span className="text-slate-400">Total Distance:</span>
              <span className="font-extrabold text-emerald-400">{distance} km</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-xs">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-300">
                Est. Transit: <strong className="text-white">{travelRoute?.estimatedTravelTime || '4.5 hrs'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimal Route Detected</span>
            </div>
          </div>

          <div className="relative z-10 py-8 my-auto">
            <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-emerald-500/60" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30 ring-4 ring-slate-950">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="mt-2 text-xs font-bold text-white max-w-[120px] truncate">
                  {startName.split(',')[0]}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Origin
                </span>
              </div>

              <div className="relative z-10 hidden sm:flex flex-col items-center text-center px-4 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 backdrop-blur-md">
                <span className="text-[11px] text-slate-300 font-medium">
                  {travelRoute?.recommendedTransport?.split('/')[0] || 'Direct Route'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">~{distance} km corridor</span>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/30 ring-4 ring-slate-950">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="mt-2 text-xs font-bold text-white max-w-[120px] truncate">
                  {destName.split(',')[0]}
                </span>
                <span className="text-[10px] text-teal-300 font-semibold uppercase tracking-wider">
                  Destination
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-2 border-t border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{travelRoute?.routeHighlights || 'Direct highway connection with scenic landscapes and dining plazas.'}</span>
          </div>
        </div>
      )}

      {/* Transit Modes Comparison Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Compare Travel Modes from {startName.split(',')[0]}
          </h4>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            All prices in Indian Rupees (₹)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Road Option */}
          <div
            onClick={() => setSelectedTransit('road')}
            className={`p-4 rounded-2xl border cursor-pointer transition card-hover-effect space-y-2 ${
              selectedTransit === 'road'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500/50'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Car className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Private Cab / Road</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {formatINR(travelRoute?.roadOption?.estCostInr || 4500)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {travelRoute?.roadOption?.duration || '4.5 hrs'} drive • Door-to-door convenience via {travelRoute?.roadOption?.highway || 'National Highway'}.
            </p>
          </div>

          {/* Rail Option */}
          <div
            onClick={() => setSelectedTransit('train')}
            className={`p-4 rounded-2xl border cursor-pointer transition card-hover-effect space-y-2 ${
              selectedTransit === 'train'
                ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-500 ring-1 ring-teal-500/50'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Train className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Express Railways</span>
              </div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                {formatINR(travelRoute?.trainOption?.estCostInr || 1400)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {travelRoute?.trainOption?.duration || '3.5 hrs'} • {travelRoute?.trainOption?.name || 'Vande Bharat / Express'}.
            </p>
          </div>

          {/* Flight Option */}
          <div
            onClick={() => setSelectedTransit('flight')}
            className={`p-4 rounded-2xl border cursor-pointer transition card-hover-effect space-y-2 ${
              selectedTransit === 'flight'
                ? 'bg-cyan-50/60 dark:bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500/50'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Plane className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Domestic Flight</span>
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                {formatINR(travelRoute?.flightOption?.estCostInr || 4800)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {travelRoute?.flightOption?.duration || '2.5 hrs'} total • Fastest for inter-state long distances.
            </p>
          </div>
        </div>
      </div>

      {/* Itinerary Logic & Geographical Sequencing Note */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">
            How starting location shapes your day-by-day itinerary:
          </span>
          <p className="leading-relaxed">
            TripPilot AI uses <strong>{startName.split(',')[0]}</strong> as your route origin. Day 1 is dynamically structured with departure transit, estimated arrival times, and relaxed evening exploration. Sightseeing on subsequent days is geographically clustered to minimize back-and-forth travel, and your final day reserves time for return transit back toward your starting hub.
          </p>
        </div>
      </div>
    </div>
  );
};
