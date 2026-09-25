import React, { useState } from 'react';
import {
  FolderHeart,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Users,
  Compass,
  MapPin,
  Heart,
  Copy,
  Trash2,
  ArrowRight,
  Filter,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { Trip } from '../../types/travel';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { formatINR } from '../../utils/formatters';

interface MyTripsPageProps {
  trips: Trip[];
  onOpenTrip: (trip: Trip) => void;
  onDuplicateTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onToggleSave: (trip: Trip) => void;
  onPlanNewTrip: () => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({
  trips,
  onOpenTrip,
  onDuplicateTrip,
  onDeleteTrip,
  onToggleSave,
  onPlanNewTrip,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'saved' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_desc' | 'date_asc' | 'budget_desc'>('created_desc');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const filteredTrips = trips
    .filter(trip => {
      // Tab filter
      if (activeTab === 'saved' && !trip.isSaved) return false;
      if (activeTab === 'upcoming' && trip.startDate < today) return false;
      if (activeTab === 'history' && trip.startDate >= today) return false;

      // Search filter
      const matchesSearch =
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === 'budget_desc') {
        return b.estimatedCost - a.estimatedCost;
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in space-y-8">
      {/* Header and Quick Plan CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Itinerary Repository (₹ INR)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            My Travel Trips ({trips.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your AI planned itineraries, saved favorites, and past holiday records.
          </p>
        </div>

        <button
          onClick={onPlanNewTrip}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition btn-hover-effect"
        >
          <Plus className="w-4 h-4" />
          <span>Plan a New Trip</span>
        </button>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition btn-hover-effect ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Trips ({trips.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition btn-hover-effect ${
              activeTab === 'upcoming'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition btn-hover-effect ${
              activeTab === 'saved'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Favorites ({trips.filter(t => t.isSaved).length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition btn-hover-effect ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Trip History
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by city, state, or title..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="created_desc">Newest Created</option>
            <option value="date_asc">Start Date (Earliest)</option>
            <option value="budget_desc">Budget (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeTab === 'saved' ? 'No saved favorites yet' : 'No trips found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            {activeTab === 'saved'
              ? 'Click the heart icon on any generated itinerary to save it to this collection.'
              : 'Create your first personalized travel itinerary with TripPilot AI in under 30 seconds.'}
          </p>
          <button
            onClick={onPlanNewTrip}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition btn-hover-effect"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <div
              key={trip.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition flex flex-col group card-hover-effect"
            >
              {/* Card Image Banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={
                    trip.destinationDetails?.image ||
                    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase">
                    {trip.travelStyle}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold">
                    {trip.durationDays} Days
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleSave(trip);
                    }}
                    className="p-1.5 rounded-xl bg-slate-900/70 backdrop-blur-md text-white hover:text-rose-400 transition"
                    title={trip.isSaved ? 'Remove from saved' : 'Save trip'}
                  >
                    <Heart className={`w-4 h-4 ${trip.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold truncate">{trip.title}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{trip.destination}</span>
                  </div>
                </div>
              </div>

              {/* Card Content & Metrics */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Dates</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {trip.startDate}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(trip.estimatedCost)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Travelers</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {trip.travelersCount} Person{trip.travelersCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Status</span>
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase text-[10px]">
                      {trip.status}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateTrip(trip)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition btn-hover-effect"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTripToDelete(trip)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition btn-hover-effect"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenTrip(trip)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs btn-hover-effect"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!tripToDelete}
        title="Delete Trip?"
        message={`Are you sure you want to delete "${tripToDelete?.title}"? All day schedules and budget allocations will be permanently removed.`}
        confirmLabel="Delete Trip"
        isDestructive={true}
        onConfirm={() => {
          if (tripToDelete) {
            onDeleteTrip(tripToDelete.id);
            setTripToDelete(null);
          }
        }}
        onCancel={() => setTripToDelete(null)}
      />
    </div>
  );
};
