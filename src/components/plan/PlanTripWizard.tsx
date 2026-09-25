import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Clock,
  Loader2,
  Utensils,
  Hotel,
  Car,
  Navigation,
  Crosshair,
  Shield,
  X
} from 'lucide-react';
import {
  POPULAR_DESTINATIONS,
  TRAVEL_INTERESTS,
  TRAVEL_STYLES,
  ACCOMMODATIONS,
  FOOD_PREFERENCES,
  TRANSPORT_PREFERENCES
} from '../../data/destinations';
import { GenerateTripParams, TravelStyle, BudgetTier, Trip } from '../../types/travel';
import { generateItinerary } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { formatINR } from '../../utils/formatters';
import { computeTravelRoute, findNearestCity, KNOWN_CITIES } from '../../utils/geoUtils';

interface PlanTripWizardProps {
  initialDestination?: string;
  onTripGenerated: (trip: Trip) => void;
  onCancel: () => void;
}

export const PlanTripWizard: React.FC<PlanTripWizardProps> = ({
  initialDestination = '',
  onTripGenerated,
  onCancel
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Start Location & Destination state
  const [startLocation, setStartLocation] = useState('Delhi (NCR), India');
  const [destination, setDestination] = useState(initialDestination || 'Jaipur, Rajasthan');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  // Form State in Indian Rupees (INR)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 2 weeks in future
    return d.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState(6);
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Balanced');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Moderate');
  const [maxBudget, setMaxBudget] = useState<number | undefined>(45000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'History',
    'Culture',
    'Food',
    'Nature'
  ]);
  const [accommodation, setAccommodation] = useState(ACCOMMODATIONS[0]);
  const [foodPref, setFoodPref] = useState(FOOD_PREFERENCES[0]);
  const [transportPref, setTransportPref] = useState(TRANSPORT_PREFERENCES[0]);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Calculate End Date
  const calculateEndDate = (start: string, days: number): string => {
    const d = new Date(start);
    d.setDate(d.getDate() + days - 1);
    return d.toISOString().split('T')[0];
  };

  const endDate = calculateEndDate(startDate, durationDays);

  // Dynamic route calculation
  const travelRoute = computeTravelRoute(startLocation, destination);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Location request handler with transparent permission
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation unsupported', 'Please select your starting location manually.', 'info');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestCity(latitude, longitude);
        setStartLocation(nearest.name);
        setLocating(false);
        setLocationModalOpen(false);
        showToast('Starting Location Set', `Identified closest hub: ${nearest.city}`, 'success');
      },
      error => {
        setLocating(false);
        setLocationModalOpen(false);
        console.warn('Geolocation permission declined or error:', error.message);
        showToast(
          'Location Access Not Granted',
          'You can easily type or pick your starting city manually.',
          'info'
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Form validations
  const validateStep1 = () => {
    if (!startLocation.trim()) {
      setErrorMsg('Please specify a starting location or city');
      return false;
    }
    if (!destination.trim()) {
      setErrorMsg('Please specify a destination');
      return false;
    }
    const today = new Date().toISOString().split('T')[0];
    if (startDate < today) {
      setErrorMsg('Travel start date cannot be in the past');
      return false;
    }
    if (durationDays < 1 || durationDays > 30) {
      setErrorMsg('Duration must be between 1 and 30 days');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep2 = () => {
    if (travelersCount < 1 || travelersCount > 50) {
      setErrorMsg('Please specify between 1 and 50 travelers');
      return false;
    }
    if (maxBudget && maxBudget < 5000) {
      setErrorMsg('Maximum budget should be at least ₹5,000');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setErrorMsg('');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep(prev => prev - 1);
  };

  const handleGenerate = async () => {
    setErrorMsg('');
    setLoading(true);
    setLoadingStage(0);

    const stages = [
      'Contacting TripPilot AI Engine...',
      `Calculating travel route from ${startLocation.split(',')[0]} to ${destination.split(',')[0]} (${travelRoute.distanceKm} km)...`,
      'Analyzing seasonal weather, peak times & Indian Railways / flight routes...',
      'Clustering landmarks & scheduling day-by-day exploration...',
      'Calculating comprehensive 7-tier budget model in Indian Rupees...'
    ];

    const timer = setInterval(() => {
      setLoadingStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1200);

    const params: GenerateTripParams = {
      startLocation: startLocation.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      durationDays,
      travelersCount,
      travelStyle,
      budgetTier,
      maxBudget,
      currency: 'INR',
      interests: selectedInterests,
      accommodationPreference: accommodation,
      foodPreference: foodPref,
      transportationPreference: transportPref,
      additionalRequirements: additionalRequirements.trim(),
    };

    try {
      const userId = currentUser?.uid || 'guest_traveler';
      const trip = await generateItinerary(params, userId);

      // Attach computed route to trip
      trip.startLocation = startLocation.trim();
      trip.travelRoute = travelRoute;

      clearInterval(timer);
      showToast('Itinerary Generated!', `Your personalized trip to ${trip.destination} is ready.`, 'success');
      onTripGenerated(trip);
    } catch (err: any) {
      clearInterval(timer);
      console.error('Trip generation error:', err);
      setErrorMsg(err.message || 'Failed to generate itinerary. You can retry with the same settings.');
      showToast('Generation issue', 'Could not complete generation. Please retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadingSteps = [
    'Connecting with travel intelligence model...',
    `Calculating route from ${startLocation.split(',')[0]} to ${destination.split(',')[0]}...`,
    'Analyzing transit options, monuments & timings...',
    'Balancing costs in Indian Rupees (₹) against your budget...',
    'Polishing travel tips, street food picks & UPI advice...'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Itinerary Architect (₹ INR)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Plan a New Journey
          </h1>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition ${
                  currentStep === step
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                    : currentStep > step
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > step ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-6 sm:w-10 h-0.5 mx-1 transition ${
                    currentStep > step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Content & Summary Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Area */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          {/* STEP 1: Starting Location, Destination & Dates */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Where are you starting from & where to?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  TripPilot considers starting distance, travel transit times, and road/rail options.
                </p>
              </div>

              {/* STARTING LOCATION INPUT */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-500" />
                    <span>Starting Origin / Current Location</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setLocationModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Use My Location</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={startLocation}
                    onChange={e => setStartLocation(e.target.value)}
                    placeholder="e.g. Delhi (NCR), India or Mumbai or Bengaluru"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold text-slate-400">Quick Origins:</span>
                  {['Delhi (NCR), India', 'Mumbai, Maharashtra', 'Bengaluru, Karnataka', 'Hyderabad, Telangana', 'Kolkata, West Bengal'].map(origin => (
                    <button
                      key={origin}
                      type="button"
                      onClick={() => setStartLocation(origin)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                        startLocation === origin
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {origin.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* DESTINATION INPUT */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>Destination City & State / Country</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Jaipur, Rajasthan or Munnar, Kerala or Goa"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400">Popular Destinations:</span>
                  {POPULAR_DESTINATIONS.slice(0, 6).map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDestination(d.name)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition btn-hover-effect ${
                        destination === d.name
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {d.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Route & Distance Preview Badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Est. Route Distance: <strong className="text-slate-900 dark:text-white">{travelRoute.distanceKm} km</strong> • {travelRoute.estimatedTravelTime}
                  </span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                  {travelRoute.recommendedTransport.split('/')[0]}
                </span>
              </div>

              {/* Dates & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-500" />
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Trip Duration
                  </label>
                  <div className="flex items-center gap-2">
                    {[3, 5, 7, 10, 14].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDurationDays(days)}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition btn-hover-effect ${
                          durationDays === days
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-[11px] text-slate-400">
                      Calculated end date: <strong className="text-slate-700 dark:text-slate-300">{endDate}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Travelers, Style & Budget (INR) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Travelers, Style & Budget (in ₹ Rupees)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  How do you want this journey to be paced and budgeted?
                </p>
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Number of Travelers
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { count: 1, label: 'Solo Traveler' },
                    { count: 2, label: 'Couple / Pair' },
                    { count: 3, label: 'Small Group (3)' },
                    { count: 4, label: 'Family / Crew (4)' },
                  ].map(t => (
                    <button
                      key={t.count}
                      type="button"
                      onClick={() => setTravelersCount(t.count)}
                      className={`p-3 rounded-2xl border text-center transition btn-hover-effect ${
                        travelersCount === t.count
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-medium'
                      }`}
                    >
                      <Users className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <div className="text-sm font-bold">{t.count}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Travel Style & Pacing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TRAVEL_STYLES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTravelStyle(s.id as TravelStyle)}
                      className={`p-3.5 rounded-2xl border text-left transition btn-hover-effect ${
                        travelStyle === s.id
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{s.label}</span>
                        {travelStyle === s.id && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Tier & Maximum Budget in INR */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Budget Tier (Indian Rupees)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Budget', 'Moderate', 'Luxury'] as BudgetTier[]).map(tier => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          setBudgetTier(tier);
                          if (tier === 'Budget') setMaxBudget(22000);
                          else if (tier === 'Moderate') setMaxBudget(45000);
                          else setMaxBudget(125000);
                        }}
                        className={`p-3 rounded-2xl border text-center transition btn-hover-effect ${
                          budgetTier === tier
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-sm block">{tier}</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {tier === 'Budget' ? '₹15K-25K' : tier === 'Moderate' ? '₹40K-70K' : '₹1L-2.5L+'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Total Target Budget in Rupees
                    </label>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatINR(maxBudget || 45000)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={300000}
                    step={2500}
                    value={maxBudget || 45000}
                    onChange={e => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹10,000 (Solo / Backpacker)</span>
                    <span>₹75,000 (Family Comfort)</span>
                    <span>₹3,00,000+ (Royal Heritage)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interests & Experiences */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  What excites you most?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select interests to prioritize monuments, temples, cuisines, or adventure trails.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TRAVEL_INTERESTS.map(interest => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-2xl border text-left transition flex items-start justify-between btn-hover-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold">{interest.label}</div>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {isSelected ? 'Prioritized in AI' : 'Tap to select'}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Preferences & Requirements */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Lodging, Dining & Transit Preferences
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fine-tune your stay, regional food preference, and local transport mode.
                </p>
              </div>

              {/* Accommodation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-emerald-500" />
                  <span>Accommodation Style</span>
                </label>
                <select
                  value={accommodation}
                  onChange={e => setAccommodation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ACCOMMODATIONS.map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Food */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-teal-500" />
                  <span>Culinary & Food Vibe (Veg/Non-Veg/Regional)</span>
                </label>
                <select
                  value={foodPref}
                  onChange={e => setFoodPref(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {FOOD_PREFERENCES.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transportation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-cyan-500" />
                  <span>Local Transportation Preference</span>
                </label>
                <select
                  value={transportPref}
                  onChange={e => setTransportPref(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {TRANSPORT_PREFERENCES.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Special Notes or Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  value={additionalRequirements}
                  onChange={e => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Pure vegetarian dining only, early morning temple darshan required, avoiding steep stairs for senior citizens..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Wizard Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition btn-hover-effect"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm btn-hover-effect"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition disabled:opacity-50 btn-hover-effect"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Architecting Trip in Rupees...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Itinerary</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Live Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Trip Configuration</span>
            </h4>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Starting From</span>
                <span className="font-bold text-slate-900 dark:text-white text-right max-w-[170px] truncate">
                  {startLocation.split(',')[0]}
                </span>
              </div>

              <div className="flex items-start justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-slate-900 dark:text-white text-right max-w-[170px] truncate">
                  {destination || 'Not selected'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Route Distance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {travelRoute.distanceKm} km ({travelRoute.estimatedTravelTime})
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Dates</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {startDate} ({durationDays}d)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Travelers</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {travelersCount} person{travelersCount > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Style & Pace</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {travelStyle}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Budget Target</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(maxBudget || 45000)} ({budgetTier})
                </span>
              </div>

              <div className="pt-1">
                <span className="text-slate-400 block mb-1.5">Selected Interests</span>
                <div className="flex flex-wrap gap-1">
                  {selectedInterests.map(i => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Route and transit suggestions adapt to your starting city: cab/drive for nearby destinations, and flights/rail for longer routes.
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Location Permission Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">Detect Starting City</h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Why does TripPilot need your location?
              </p>
              <p>
                We determine your nearest starting city only once to calculate route distances, transportation options (train, cab, or flight), and travel times.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>We do NOT continuously track, share, or store your GPS coordinates.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Select Manually
              </button>
              <button
                type="button"
                onClick={handleDetectCurrentLocation}
                disabled={locating}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow btn-hover-effect disabled:opacity-50"
              >
                {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                <span>Allow & Detect City</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-white">
          <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center space-y-6 shadow-2xl">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight">Crafting Your Master Plan in Rupees</h3>
              <p className="text-xs text-slate-400 mt-1">
                Routing from {startLocation.split(',')[0]} to {destination}...
              </p>
            </div>

            <div className="space-y-2 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {loadingSteps.map((step, idx) => {
                const isCurrent = idx === loadingStage;
                const isDone = idx < loadingStage;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {isDone ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={isCurrent ? 'font-bold text-white' : isDone ? 'text-slate-300' : 'text-slate-500'}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
