import React from 'react';
import {
  Compass,
  Calendar,
  Sparkles,
  DollarSign,
  Heart,
  ArrowRight,
  MapPin,
  Clock,
  TrendingUp,
  FolderHeart,
  PlusCircle,
  Users
} from 'lucide-react';
import { Trip } from '../../types/travel';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';

interface DashboardProps {
  trips: Trip[];
  onPlanTrip: () => void;
  onOpenTrip: (trip: Trip) => void;
  onViewAllTrips: () => void;
  onExploreDestinations: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  trips,
  onPlanTrip,
  onOpenTrip,
  onViewAllTrips,
  onExploreDestinations,
}) => {
  const { currentUser, userProfile } = useAuth();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingTrips = trips
    .filter(t => t.startDate >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const nextTrip = upcomingTrips[0] || trips[0];

  const savedTrips = trips.filter(t => t.isSaved);
  const totalBudgetManaged = trips.reduce((sum, t) => sum + (t.estimatedCost || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl card-hover-effect">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TripPilot Intelligence Dashboard</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {getTimeGreeting()},{' '}
              {userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Traveler'}!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your vacation command center. Plan new journeys in Indian Rupees, monitor travel budgets, and explore curated destination guides across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onPlanTrip}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition hover:scale-105 active:scale-95 btn-hover-effect"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan a Trip (₹)</span>
            </button>
            <button
              onClick={onExploreDestinations}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition btn-hover-effect"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore Indian Hubs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards in INR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between card-hover-effect">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Trips Planned</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {trips.length}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">All synchronized</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between card-hover-effect">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Upcoming Trips</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1 block">
              {upcomingTrips.length}
            </span>
            <span className="text-[11px] text-slate-400">Scheduled ahead</span>
          </div>
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between card-hover-effect">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Budget Managed</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1 block">
              {formatINR(totalBudgetManaged)}
            </span>
            <span className="text-[11px] text-slate-400">Across all itineraries</span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <span className="text-xl font-extrabold">₹</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between card-hover-effect">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Saved Favorites</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">
              {savedTrips.length}
            </span>
            <span className="text-[11px] text-slate-400">Bookmarked trips</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Next Upcoming Trip Spotlight Card */}
      {nextTrip && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 card-hover-effect">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                Next Upcoming Holiday
              </span>
            </div>
            <button
              onClick={() => onOpenTrip(nextTrip)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 btn-hover-effect"
            >
              <span>View Full Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 h-56 rounded-2xl overflow-hidden relative">
              <img
                src={
                  nextTrip.destinationDetails?.image ||
                  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
                }
                alt={nextTrip.destination}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold">
                {nextTrip.travelStyle}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {nextTrip.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{nextTrip.destination}</span>
                  <span>•</span>
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <span>{nextTrip.startDate} ({nextTrip.durationDays} Days)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {nextTrip.overview?.summary}
              </p>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Budget</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatINR(nextTrip.estimatedCost)}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Travelers</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {nextTrip.travelersCount} Person{nextTrip.travelersCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Days Planned</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {nextTrip.days.length} Days
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onOpenTrip(nextTrip)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs btn-hover-effect"
                >
                  Explore Day-by-Day Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trips Grid & Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Trip Plans
          </h3>
          <button
            onClick={onViewAllTrips}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 btn-hover-effect"
          >
            <span>View All ({trips.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-6">
            <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">No trips planned yet.</p>
            <button
              onClick={onPlanTrip}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow btn-hover-effect"
            >
              Plan Your First Trip in Rupees
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map(trip => (
              <div
                key={trip.id}
                onClick={() => onOpenTrip(trip)}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between group card-hover-effect"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                      {trip.durationDays} Days • {trip.travelStyle}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(trip.estimatedCost)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-500 transition line-clamp-1">
                    {trip.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{trip.destination}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Starts: {trip.startDate}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
