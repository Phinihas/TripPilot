import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  Users,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Sliders,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Layers,
  Heart
} from 'lucide-react';
import { POPULAR_DESTINATIONS, TRAVEL_INTERESTS } from '../../data/destinations';
import { DestinationInfo } from '../../types/travel';
import { formatINR } from '../../utils/formatters';

interface LandingPageProps {
  onStartPlanning: (destination?: string) => void;
  onExploreDestinations: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreDestinations,
}) => {
  const [activeTab, setActiveTab] = useState<'rajasthan' | 'kerala' | 'ladakh'>('rajasthan');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sampleTrips = {
    rajasthan: {
      destination: 'Jaipur & Udaipur, Rajasthan',
      duration: '7 Days',
      style: 'Royal Heritage Explorer',
      budget: formatINR(42000),
      heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      days: [
        {
          day: 'Day 1',
          title: 'Arrival in Jaipur, Hawa Mahal & Old City Bazaars',
          morning: 'Check in to heritage haveli, sip masala chai, and admire the intricate pink honeycomb façade of Hawa Mahal.',
          afternoon: 'Explore the royal courtyards of City Palace and ancient celestial instruments at Jantar Mantar.',
          evening: 'Sunset views from Nahargarh Fort overlooking Jaipur city lights, followed by traditional Rajasthani Dal Baati Churma.',
          cost: formatINR(1800)
        },
        {
          day: 'Day 2',
          title: 'Amber Fort, Sheesh Mahal & Chokhi Dhani Festivities',
          morning: 'Beat the desert heat with an early visit to Amber Fort. Marvel at the mirror mosaics of Sheesh Mahal.',
          afternoon: 'Photo stop at the floating water palace Jal Mahal, browse artisan hand-block print textile emporiums.',
          evening: 'Immersive cultural celebration at Chokhi Dhani with folk puppet dancers, fire performers, and royal thali.',
          cost: formatINR(2400)
        },
        {
          day: 'Day 3',
          title: 'Scenic Drive to Udaipur & Sunset Cruise on Lake Pichola',
          morning: 'Private AC transfer towards Udaipur, stopping at historic temples along the Aravalli hills.',
          afternoon: 'Arrive at the City of Lakes, check in to lakeside heritage hotel, stroll through Saheliyon-ki-Bari gardens.',
          evening: 'Fairy-tale private sunset boat ride on Lake Pichola with glowing twilight views of Jag Mandir island palace.',
          cost: formatINR(3500)
        }
      ]
    },
    kerala: {
      destination: 'Munnar & Alleppey Backwaters, Kerala',
      duration: '6 Days',
      style: 'Nature & Wellness Retreat',
      budget: formatINR(34000),
      heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      days: [
        {
          day: 'Day 1',
          title: 'Cochin to Misty Munnar Hills & Cheeyappara Falls',
          morning: 'Scenic climb through the Western Ghats with roadside stops at Cheeyappara and Valara waterfalls.',
          afternoon: 'Check in to a boutique plantation cottage nestled inside rolling cardamom and tea slopes.',
          evening: 'Traditional spice market walk and warm cup of freshly plucked orthodox Nilgiri tea with banana fritters.',
          cost: formatINR(1200)
        },
        {
          day: 'Day 2',
          title: 'Eravikulam National Park & Tea Museum Walk',
          morning: 'Early morning trek into Eravikulam National Park to spot endangered Nilgiri Tahr against misty peaks.',
          afternoon: 'Tour the Tata Tea Museum to observe artisan tea manufacturing and sample high-altitude teas.',
          evening: 'Live Kathakali dance and Kalaripayattu martial arts demonstration followed by Malabar fish curry.',
          cost: formatINR(1800)
        },
        {
          day: 'Day 3',
          title: 'Private Thatched Houseboat Cruise in Alleppey',
          morning: 'Transfer down to the Vembanad Lake canals in Alleppey, boarding a private Kerala kettuvallam houseboat.',
          afternoon: 'Slow cruising along tranquil backwaters, waving to local village fishermen, lunch served on banana leaf.',
          evening: 'Sunset reflections on backwater canals, traditional Karimeen Pollichathu dinner cooked fresh by onboard chef.',
          cost: formatINR(4500)
        }
      ]
    },
    ladakh: {
      destination: 'Leh, Pangong Lake & Nubra, Ladakh',
      duration: '7 Days',
      style: 'Himalayan High-Altitude Thrill',
      budget: formatINR(52000),
      heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      days: [
        {
          day: 'Day 1',
          title: 'Arrival in Leh & Complete Acclimatization',
          morning: 'Touch down at Kushok Bakula Rimpochee Airport (3,500m). Check into heated Ladakhi hotel for mandatory rest.',
          afternoon: 'Gentle walk through Leh Main Bazaar, sip soothing ginger honey lemon tea, visit Tibetan prayer wheels.',
          evening: 'Quiet sunset at Shanti Stupa with panoramic vistas of the snow-crowned Stok Kangri mountain range.',
          cost: formatINR(1500)
        },
        {
          day: 'Day 2',
          title: 'Hall of Fame, Magnetic Hill & Sangam Confluence',
          morning: 'Visit the Leh Hall of Fame war museum, experience the gravity-defying phenomenon at Magnetic Hill.',
          afternoon: 'Gaze at the dramatic confluence of the muddy Indus and emerald Zanskar rivers at Nimmu.',
          evening: 'Tour Pathar Sahib Gurudwara and centuries-old Spituk Monastery perched over the Indus valley.',
          cost: formatINR(2200)
        },
        {
          day: 'Day 3',
          title: 'Crossing Khardung La (17,582 ft) to Nubra Valley Dunes',
          morning: 'Cross one of the highest motorable passes in the world with snow photography at the prayer flags.',
          afternoon: 'Descend into lush Nubra Valley, visit the 106-foot golden Buddha statue at Diskit Monastery.',
          evening: 'Ride double-humped Bactrian camels along white sand dunes in Hunder under brilliant Milky Way skies.',
          cost: formatINR(3800)
        }
      ]
    }
  };

  const faqs = [
    {
      q: 'How does TripPilot AI customize trips across India?',
      a: 'TripPilot AI analyzes your destination (from Rajasthan forts and Kerala backwaters to Himalayan passes), exact travel dates, budget in Indian Rupees (₹), preferred pacing, and culinary requirements like pure vegetarian, Jain, or regional thalis.'
    },
    {
      q: 'Can I set my maximum budget in Indian Rupees (₹ / INR)?',
      a: 'Yes! TripPilot AI is configured natively in Indian Rupees (₹). You can specify budgets ranging from ₹15,000 for budget solo backpackers up to ₹5,00,000+ for royal luxury retreats, and the AI balances hotel, transport, and activity allocations accordingly.'
    },
    {
      q: 'Does it take into account travel logistics like trains, cabs, and monsoon seasons?',
      a: 'Yes! It suggests optimal transit methods—such as Vande Bharat express trains, private AC cabs, or flight connections—and provides seasonal weather advice like avoiding heavy monsoon landslides in the hills or extreme summer heat in Rajasthan.'
    },
    {
      q: 'Can I edit the generated itinerary and add custom spots?',
      a: 'Absolutely! You can add custom activities, adjust durations and costs in Rupees, delete suggested items, and regenerate specific days with a single click.'
    },
    {
      q: 'Is my data safely saved on my mobile and desktop?',
      a: 'Yes! All your trips are securely stored in your Firestore database under your authenticated account. You can access, duplicate, and export them as PDF on your smartphone, tablet, or laptop.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-xs hover:border-emerald-500/50 transition">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>India & Global AI Travel Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Intelligent Journeys.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                Realistic In Rupee Budgets.
              </span>{' '}
              Zero Planning Fatigue.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Tell TripPilot AI your dream destination—from royal palaces of Rajasthan and backwaters of Kerala to high Himalayan passes. In seconds, get a realistic, hour-by-hour day plan with curated meals, local cabs, and accurate Rupee budgets.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onStartPlanning()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.03] active:scale-[0.98] btn-hover-effect"
              >
                <Sparkles className="w-5 h-5" />
                <span>Plan My Trip (In Rupees)</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={onExploreDestinations}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base backdrop-blur-md transition card-hover-effect"
              >
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Explore Indian Destinations</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">50,000+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trips Planned</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">28 States</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Across India</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  <span>4.9</span>
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Traveler Rating</p>
              </div>
            </div>
          </div>

          {/* Interactive Planner Teaser Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-emerald-500/25 via-slate-200/50 dark:via-slate-800/60 to-transparent shadow-2xl">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Popular Indian Travel Hubs</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Choose a favorite spot or enter your custom dream holiday</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {POPULAR_DESTINATIONS.slice(0, 5).map(dest => (
                    <button
                      key={dest.id}
                      onClick={() => onStartPlanning(dest.name)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 transition"
                    >
                      {dest.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Input Bar */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Destination</span>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">Jaipur, Rajasthan</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Duration</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
                    <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">7 Days (Flexible)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Budget</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatINR(35000)} / couple</span>
                  </div>
                </div>

                <button
                  onClick={() => onStartPlanning('Jaipur, Rajasthan')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition btn-hover-effect"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sample Itinerary Showcase */}
      <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Living Itineraries in Indian Rupees
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Curated Travel Masterpieces
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
              Explore authentic day-by-day itineraries generated by our travel intelligence model.
            </p>
          </div>

          {/* Destination Selector Tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('rajasthan')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition btn-hover-effect ${
                activeTab === 'rajasthan'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Rajasthan (7 Days • {formatINR(42000)})
            </button>
            <button
              onClick={() => setActiveTab('kerala')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition btn-hover-effect ${
                activeTab === 'kerala'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Kerala Backwaters (6 Days • {formatINR(34000)})
            </button>
            <button
              onClick={() => setActiveTab('ladakh')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition btn-hover-effect ${
                activeTab === 'ladakh'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Ladakh & Pangong (7 Days • {formatINR(52000)})
            </button>
          </div>

          {/* Active Sample Trip Display */}
          {(() => {
            const trip = sampleTrips[activeTab];
            return (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
                {/* Left Hero Card */}
                <div className="relative lg:col-span-4 min-h-[300px] lg:min-h-[460px] overflow-hidden">
                  <img
                    src={trip.heroImage}
                    alt={trip.destination}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-md text-slate-950 text-xs font-bold w-fit mb-2">
                      {trip.style}
                    </span>
                    <h3 className="text-2xl font-bold">{trip.destination}</h3>
                    <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {trip.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <strong className="text-emerald-400">{trip.budget}</strong> total est.
                      </span>
                    </div>

                    <button
                      onClick={() => onStartPlanning(trip.destination.split(',')[0])}
                      className="mt-6 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customize This Itinerary</span>
                    </button>
                  </div>
                </div>

                {/* Right Days Timeline */}
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {trip.days.map((d, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2 hover:border-emerald-500/40 transition card-hover-effect"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                              {d.day}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {d.title}
                            </h4>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            Est. {d.cost}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">Morning</span>
                            <p className="line-clamp-2">{d.morning}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-teal-600 dark:text-teal-400 block mb-0.5">Afternoon</span>
                            <p className="line-clamp-2">{d.afternoon}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400 block mb-0.5">Evening</span>
                            <p className="line-clamp-2">{d.evening}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" /> Realistic Indian transit & temple timings included
                    </span>
                    <button
                      onClick={() => onStartPlanning(trip.destination.split(',')[0])}
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Plan Similar Trip <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Curated Indian Destinations Showcase */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Incredible India Showcase
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Indian Travel Hubs
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Explore majestic forts, tropical coasts, and spiritual river ghats with verified Rupee costs.
              </p>
            </div>
            <button
              onClick={onExploreDestinations}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Explore All Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_DESTINATIONS.slice(0, 8).map(dest => (
              <div
                key={dest.id}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col card-hover-effect"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-xs font-bold">
                    {formatINR(dest.avgDailyCostInr)}/day
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase">
                    {dest.region}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-500 transition">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {dest.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Best: {dest.bestMonths.slice(0, 3).join(', ')}
                    </span>
                    <button
                      onClick={() => onStartPlanning(dest.name)}
                      className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 text-xs font-bold transition btn-hover-effect"
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Loved by Travelers in India
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Real Experiences with TripPilot AI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between card-hover-effect">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "Planning a 6-day family holiday to Munnar and Alleppey was so easy with TripPilot AI. It calculated our houseboat booking and private cab expenses at ₹35,000, which matched our actual spend almost to the rupee!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center text-xs">
                  AK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Aarav Kulkarni</h4>
                  <p className="text-[11px] text-slate-400">Bangalore • Kerala Family Trip</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between card-hover-effect">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "The Ladakh bike trip schedule was incredible. It reminded us about acclimatization on Day 1 in Leh, gave us exact travel times for Khardung La and Nubra, and prevented altitude sickness. Outstanding planning."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-600 font-bold flex items-center justify-center text-xs">
                  RS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Rohan Sharma</h4>
                  <p className="text-[11px] text-slate-400">Delhi • Leh Ladakh Adventure</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between card-hover-effect">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "I was visiting Jaipur and Udaipur with my spouse. Setting the budget to ₹45,000 gave us stunning heritage hotels and palace rooftop dining recommendations. The UPI tips and ASI monument booking links were super helpful."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-xs">
                  PV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pooja Verma</h4>
                  <p className="text-[11px] text-slate-400">Mumbai • Rajasthan Heritage Trip</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Clear Answers
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Plan Your Next Indian Holiday?
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/80 leading-relaxed">
            From the snow mountains of Himachal to the sun-kissed beaches of Goa. Get your personalized, day-by-day itinerary in Indian Rupees in 10 seconds.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartPlanning()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-2xl transition hover:scale-105 active:scale-95 btn-hover-effect"
            >
              Plan Your Trip in Rupees
            </button>
            <button
              onClick={onExploreDestinations}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl border border-white/20 hover:bg-white/10 font-semibold text-base transition btn-hover-effect"
            >
              Browse 28 Indian States & Regions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
