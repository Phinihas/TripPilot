import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Heart,
  Share2,
  Printer,
  Copy,
  Trash2,
  RotateCw,
  Sparkles,
  MapPin,
  Compass,
  Utensils,
  Plane,
  Hotel,
  Car,
  ShoppingBag,
  Info,
  CheckCircle,
  Plus,
  X,
  ChevronRight,
  TrendingDown,
  Layers,
  Edit3
} from 'lucide-react';
import { Trip, DayPlan, ActivityItem, BudgetBreakdown } from '../../types/travel';
import { saveTrip, deleteTrip } from '../../firebase/firestoreService';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { formatINR } from '../../utils/formatters';
import { RouteMap } from '../map/RouteMap';
import { computeTravelRoute } from '../../utils/geoUtils';

interface ItineraryViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  onRegenerate: () => void;
  onDuplicate: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  onBack: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onUpdateTrip,
  onRegenerate,
  onDuplicate,
  onDelete,
  onBack,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'route' | 'budget' | 'overview'>('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(trip.isSaved);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Activity Modal State (Costs in INR)
  const [addActivityModal, setAddActivityModal] = useState<{
    isOpen: boolean;
    dayIndex: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening';
  }>({
    isOpen: false,
    dayIndex: 0,
    timeOfDay: 'morning',
  });

  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCost, setNewCost] = useState(800);
  const [newDuration, setNewDuration] = useState(90);

  const activeDay = trip.days[selectedDayIndex] || trip.days[0];

  const handleToggleSave = async () => {
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);
    const updatedTrip = { ...trip, isSaved: nextSavedState, updatedAt: new Date().toISOString() };
    onUpdateTrip(updatedTrip);

    if (currentUser) {
      setSaving(true);
      try {
        await saveTrip(updatedTrip);
        showToast(
          nextSavedState ? 'Saved to My Trips!' : 'Removed from Favorites',
          'Updated in your cloud account.',
          'success'
        );
      } catch (err) {
        console.error('Save trip error:', err);
        showToast('Error syncing save state', 'Please check your connection.', 'error');
      } finally {
        setSaving(false);
      }
    } else {
      showToast('Saved in session', 'Sign in with Google to sync your trips permanently.', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'Share your itinerary with travel companions.', 'info');
  };

  // Add custom activity to the active day
  const handleAddActivity = () => {
    if (!newTitle.trim()) return;

    const newAct: ActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timeOfDay: addActivityModal.timeOfDay,
      title: newTitle.trim(),
      location: newLocation.trim() || trip.destination,
      description: newDescription.trim() || 'Custom itinerary event.',
      durationMinutes: newDuration || 60,
      estimatedCost: newCost || 0,
      category: addActivityModal.timeOfDay === 'evening' ? 'food' : 'sightseeing',
    };

    const updatedDays = [...trip.days];
    const targetDay = { ...updatedDays[addActivityModal.dayIndex] };

    if (addActivityModal.timeOfDay === 'morning') {
      targetDay.morning = [...targetDay.morning, newAct];
    } else if (addActivityModal.timeOfDay === 'afternoon') {
      targetDay.afternoon = [...targetDay.afternoon, newAct];
    } else {
      targetDay.evening = [...targetDay.evening, newAct];
    }

    targetDay.dayEstimatedCost += newCost;
    updatedDays[addActivityModal.dayIndex] = targetDay;

    const updatedTrip: Trip = {
      ...trip,
      days: updatedDays,
      estimatedCost: trip.estimatedCost + newCost,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTrip(updatedTrip);
    if (currentUser) {
      saveTrip(updatedTrip).catch(console.error);
    }

    showToast('Activity added', `Added to Day ${addActivityModal.dayIndex + 1} (${formatINR(newCost)})`, 'success');
    setAddActivityModal({ isOpen: false, dayIndex: 0, timeOfDay: 'morning' });
    setNewTitle('');
    setNewLocation('');
    setNewDescription('');
    setNewCost(800);
    setNewDuration(90);
  };

  // Remove an activity from a day
  const handleDeleteActivity = (
    dayIdx: number,
    timeOfDay: 'morning' | 'afternoon' | 'evening',
    actId: string
  ) => {
    const updatedDays = [...trip.days];
    const targetDay = { ...updatedDays[dayIdx] };

    let removedCost = 0;
    if (timeOfDay === 'morning') {
      const item = targetDay.morning.find(a => a.id === actId);
      removedCost = item?.estimatedCost || 0;
      targetDay.morning = targetDay.morning.filter(a => a.id !== actId);
    } else if (timeOfDay === 'afternoon') {
      const item = targetDay.afternoon.find(a => a.id === actId);
      removedCost = item?.estimatedCost || 0;
      targetDay.afternoon = targetDay.afternoon.filter(a => a.id !== actId);
    } else {
      const item = targetDay.evening.find(a => a.id === actId);
      removedCost = item?.estimatedCost || 0;
      targetDay.evening = targetDay.evening.filter(a => a.id !== actId);
    }

    targetDay.dayEstimatedCost = Math.max(0, targetDay.dayEstimatedCost - removedCost);
    updatedDays[dayIdx] = targetDay;

    const updatedTrip: Trip = {
      ...trip,
      days: updatedDays,
      estimatedCost: Math.max(0, trip.estimatedCost - removedCost),
      updatedAt: new Date().toISOString(),
    };

    onUpdateTrip(updatedTrip);
    if (currentUser) {
      saveTrip(updatedTrip).catch(console.error);
    }
    showToast('Activity removed', undefined, 'info');
  };

  const budget = trip.budgetBreakdown;
  const budgetMax = trip.maxBudget || budget.total * 1.15;
  const budgetRemaining = budgetMax - budget.total;

  const budgetCategories = [
    { label: 'Flights / Railways', amount: budget.flights, icon: Plane, color: 'bg-blue-500' },
    { label: 'Hotels & Lodging', amount: budget.accommodation, icon: Hotel, color: 'bg-emerald-500' },
    { label: 'Dining & Food', amount: budget.food, icon: Utensils, color: 'bg-amber-500' },
    { label: 'Activities & Monuments', amount: budget.activities, icon: Sparkles, color: 'bg-purple-500' },
    { label: 'Local Cabs & Auto', amount: budget.localTransport, icon: Car, color: 'bg-teal-500' },
    { label: 'Bazaar Shopping', amount: budget.shopping, icon: ShoppingBag, color: 'bg-pink-500' },
    { label: 'Miscellaneous', amount: budget.miscellaneous, icon: Layers, color: 'bg-slate-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in space-y-8">
      {/* Top Navigation & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1.5 w-fit btn-hover-effect"
        >
          ← Back to Trips
        </button>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition btn-hover-effect ${
              isSaved
                ? 'border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-rose-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved in Account' : 'Save Trip'}</span>
          </button>

          <button
            onClick={() => onDuplicate(trip)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition btn-hover-effect"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition btn-hover-effect"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Regenerate AI</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition btn-hover-effect"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition btn-hover-effect"
            title="Share Itinerary"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs transition btn-hover-effect"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Overview Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl min-h-[260px] sm:min-h-[300px] flex flex-col justify-end card-hover-effect">
        {trip.destinationDetails?.image && (
          <img
            src={trip.destinationDetails.image}
            alt={trip.destination}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/90 text-slate-950 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              {trip.travelStyle} Style
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              {trip.budgetTier} Budget
            </span>
            <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 text-xs font-semibold backdrop-blur-md border border-cyan-500/30">
              {trip.status.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-3xl">
            {trip.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
            {trip.overview?.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>{trip.startDate} to {trip.endDate} ({trip.durationDays} Days)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-extrabold text-base">{formatINR(trip.estimatedCost)}</span>
              <span className="text-slate-400">Total Est.</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{trip.travelersCount} Traveler{trip.travelersCount > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'itinerary'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Day-by-Day Itinerary
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'budget'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Budget & Costs in Rupees (₹)
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Highlights & Practical UPI Tips
          </button>
        </div>
      </div>

      {/* TAB 1: ITINERARY TIMELINE */}
      {activeTab === 'itinerary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Day Selector Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Trip Schedule ({trip.days.length} Days)
            </h4>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {trip.days.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`shrink-0 lg:w-full p-3 rounded-2xl text-left border transition card-hover-effect ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={isSelected ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                        Day {day.dayNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">{day.date}</span>
                    </div>
                    <div className="text-xs font-semibold truncate mt-1">{day.theme}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Est. {formatINR(day.dayEstimatedCost)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Plan Detailed Timeline */}
          <div className="lg:col-span-9 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                      Day {activeDay.dayNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{activeDay.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {activeDay.theme}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Day Estimated Spend</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(activeDay.dayEstimatedCost)}
                  </div>
                </div>
              </div>

              {/* Transit & Practical Advice for the day */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <Car className="w-4 h-4 text-emerald-500" />
                  <span>Transit Route: {activeDay.recommendedTransport}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <Info className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{activeDay.practicalTips?.join(' • ')}</span>
                </div>
              </div>

              {/* MORNING ACTIVITIES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Morning Activities</span>
                  </h4>
                  <button
                    onClick={() =>
                      setAddActivityModal({
                        isOpen: true,
                        dayIndex: selectedDayIndex,
                        timeOfDay: 'morning',
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline btn-hover-effect"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activeDay.morning.map(act => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onDelete={() => handleDeleteActivity(selectedDayIndex, 'morning', act.id)}
                    />
                  ))}
                </div>
              </div>

              {/* AFTERNOON ACTIVITIES */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Afternoon Exploration</span>
                  </h4>
                  <button
                    onClick={() =>
                      setAddActivityModal({
                        isOpen: true,
                        dayIndex: selectedDayIndex,
                        timeOfDay: 'afternoon',
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline btn-hover-effect"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activeDay.afternoon.map(act => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onDelete={() => handleDeleteActivity(selectedDayIndex, 'afternoon', act.id)}
                    />
                  ))}
                </div>
              </div>

              {/* EVENING ACTIVITIES */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Evening & Dining</span>
                  </h4>
                  <button
                    onClick={() =>
                      setAddActivityModal({
                        isOpen: true,
                        dayIndex: selectedDayIndex,
                        timeOfDay: 'evening',
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline btn-hover-effect"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activeDay.evening.map(act => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onDelete={() => handleDeleteActivity(selectedDayIndex, 'evening', act.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUDGET & BREAKDOWN IN RUPEES */}
      {activeTab === 'budget' && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Budget Highlights Cards in INR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm card-hover-effect">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Estimated Cost</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatINR(budget.total)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For {trip.travelersCount} traveler{trip.travelersCount > 1 ? 's' : ''}</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm card-hover-effect">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Average</span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatINR(budget.dailyAverage)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per day across {trip.durationDays} days</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm card-hover-effect">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Budget Ceiling</span>
              <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">
                {formatINR(budgetMax)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allocated budget ceiling</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm card-hover-effect">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Cushion</span>
              <div
                className={`text-3xl font-extrabold mt-1 ${
                  budgetRemaining >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-500'
                }`}
              >
                {budgetRemaining >= 0 ? `+${formatINR(budgetRemaining)}` : `-${formatINR(Math.abs(budgetRemaining))}`}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {budgetRemaining >= 0 ? 'Comfortable surplus' : 'Slightly over target budget'}
              </p>
            </div>
          </div>

          {/* Visual Budget Progress Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-900 dark:text-white">Rupee Allocation Across 7 Categories</span>
              <span className="text-slate-400">100% of Trip Spend</span>
            </div>

            {/* Segmented bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
              {budgetCategories.map((cat, i) => {
                const percent = Math.max(1, (cat.amount / budget.total) * 100);
                return (
                  <div
                    key={i}
                    style={{ width: `${percent}%` }}
                    className={`${cat.color} h-full transition-all`}
                    title={`${cat.label}: ${formatINR(cat.amount)} (${Math.round(percent)}%)`}
                  />
                );
              })}
            </div>

            {/* Category breakdown cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {budgetCategories.map((cat, idx) => {
                const percent = Math.round((cat.amount / budget.total) * 100);
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between card-hover-effect"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${cat.color} text-white shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{cat.label}</div>
                        <div className="text-[11px] text-slate-400">{percent}% of total budget</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatINR(cat.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OVERVIEW & PRACTICAL TIPS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 card-hover-effect">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>Itinerary Highlights</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {(trip.overview?.highlights || []).map((h, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 card-hover-effect">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-teal-500" />
              <span>Local Etiquette & UPI Payments</span>
            </h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs mb-1">
                  Weather & Packing
                </span>
                <p className="text-xs leading-relaxed">
                  {trip.overview?.weatherExpectation || 'Pleasant weather expected. Bring comfortable walking sneakers and modest cotton attire for temples.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs mb-1">
                  UPI Payments & Cash Guidance
                </span>
                <p className="text-xs leading-relaxed">
                  {trip.overview?.localCurrencyAdvice || 'UPI (Google Pay, PhonePe, Paytm) works virtually everywhere in India. Carry ₹1,000-₹2,000 cash for small auto-rickshaw rides and shoe-minding stalls at temples.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs mb-1">
                  Traveler Preferences Honored
                </span>
                <p className="text-xs leading-relaxed">
                  Staying at <strong>{trip.accommodationPreference}</strong> • Dining vibe: <strong>{trip.foodPreference}</strong> • Transit: <strong>{trip.transportationPreference}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Trip?"
        message="Are you sure you want to permanently delete this itinerary? This action cannot be undone."
        confirmLabel="Delete Trip"
        isDestructive={true}
        onConfirm={() => {
          setDeleteModalOpen(false);
          onDelete(trip.id);
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Add Activity Modal (Costs in Rupees) */}
      {addActivityModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base">
                Add Activity to Day {addActivityModal.dayIndex + 1} ({addActivityModal.timeOfDay})
              </h3>
              <button
                onClick={() => setAddActivityModal({ isOpen: false, dayIndex: 0, timeOfDay: 'morning' })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activity Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Evening Ganga Aarti or Amber Fort Light Show"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location or Landmark
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                placeholder="e.g. Dashashwamedh Ghat"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notes & Description
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Details, entrance fees, or photography tips..."
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Est. Cost (₹ INR)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={newCost}
                  onChange={e => setNewCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  min={15}
                  step={15}
                  value={newDuration}
                  onChange={e => setNewDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddActivityModal({ isOpen: false, dayIndex: 0, timeOfDay: 'morning' })}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddActivity}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow btn-hover-effect"
              >
                Add to Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Activity Sub-Component Card
const ActivityCard: React.FC<{
  activity: ActivityItem;
  onDelete: () => void;
}> = ({ activity, onDelete }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex items-start justify-between gap-4 group card-hover-effect">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h5 className="font-bold text-sm text-slate-900 dark:text-white">
            {activity.title}
          </h5>
          <span className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            {activity.location}
          </span>
          <span className="text-[11px] text-slate-400">
            • {activity.durationMinutes} mins
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {activity.description}
        </p>

        {activity.travelTip && (
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Tip: {activity.travelTip}</span>
          </div>
        )}
      </div>

      <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {formatINR(activity.estimatedCost)}
        </span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
          title="Remove activity"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
