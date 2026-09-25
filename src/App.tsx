import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { PlanTripWizard } from './components/plan/PlanTripWizard';
import { ItineraryView } from './components/itinerary/ItineraryView';
import { DestinationDirectory } from './components/destinations/DestinationDirectory';
import { MyTripsPage } from './components/trips/MyTripsPage';
import { ProfileSettingsPage } from './components/profile/ProfileSettingsPage';
import { FeaturesPage, AboutPage, ContactPage } from './components/pages/StaticPages';
import { AuthModal } from './components/auth/AuthModal';
import { Trip } from './types/travel';
import { getTripsByUser, saveTrip, deleteTrip as deleteTripFromDb } from './firebase/firestoreService';
import { generateIntelligentFallbackItinerary } from './services/aiService';

// Initial curated trip to explore immediately (Rajasthan Heritage Tour in Indian Rupees)
const INITIAL_DEMO_TRIP = generateIntelligentFallbackItinerary(
  {
    destination: 'Jaipur, Rajasthan',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationDays: 6,
    travelersCount: 2,
    travelStyle: 'Balanced',
    budgetTier: 'Moderate',
    maxBudget: 42000,
    currency: 'INR',
    interests: ['History', 'Culture', 'Food', 'Nature'],
    accommodationPreference: 'Heritage Havelis & Boutique Hotels',
    foodPreference: 'Authentic Regional Indian Cuisine & Local Thalis',
    transportationPreference: 'Private AC Cab & Chauffeur (Sedan/SUV)',
  },
  'demo_traveler'
);

function MainApp() {
  const { currentUser, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(INITIAL_DEMO_TRIP);
  const [trips, setTrips] = useState<Trip[]>([INITIAL_DEMO_TRIP]);
  const [planInitialDest, setPlanInitialDest] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Load trips from Firestore when user authenticates
  useEffect(() => {
    async function loadUserTrips() {
      if (currentUser) {
        try {
          const userTrips = await getTripsByUser(currentUser.uid);
          if (userTrips.length > 0) {
            setTrips(userTrips);
            if (!selectedTrip || selectedTrip.id === INITIAL_DEMO_TRIP.id) {
              setSelectedTrip(userTrips[0]);
            }
          } else {
            // First time user: save the initial demo trip customized for them
            const firstTrip: Trip = {
              ...INITIAL_DEMO_TRIP,
              id: `trip_${Date.now()}_jaipur`,
              userId: currentUser.uid,
              isSaved: true,
              currency: 'INR',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await saveTrip(firstTrip);
            setTrips([firstTrip]);
            setSelectedTrip(firstTrip);
          }
        } catch (err) {
          console.error('Error loading trips from Firestore:', err);
        }
      }
    }

    if (!authLoading) {
      loadUserTrips();
    }
  }, [currentUser, authLoading]);

  // Handle successful trip generation
  const handleTripGenerated = async (newTrip: Trip) => {
    const tripToSave = {
      ...newTrip,
      userId: currentUser ? currentUser.uid : 'guest',
      isSaved: true,
      currency: 'INR',
    };

    setTrips(prev => [tripToSave, ...prev]);
    setSelectedTrip(tripToSave);
    setCurrentView('itinerary');

    if (currentUser) {
      try {
        await saveTrip(tripToSave);
      } catch (err) {
        console.error('Error saving trip to database:', err);
      }
    }
  };

  // Update trip modifications (e.g. adding activity, toggling favorite)
  const handleUpdateTrip = async (updated: Trip) => {
    setSelectedTrip(updated);
    setTrips(prev => prev.map(t => (t.id === updated.id ? updated : t)));

    if (currentUser) {
      try {
        await saveTrip(updated);
      } catch (err) {
        console.error('Error updating trip in Firestore:', err);
      }
    }
  };

  // Duplicate an existing trip
  const handleDuplicateTrip = async (tripToDup: Trip) => {
    const duplicated: Trip = {
      ...tripToDup,
      id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${tripToDup.title} (Copy)`,
      userId: currentUser ? currentUser.uid : 'guest',
      currency: 'INR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTrips(prev => [duplicated, ...prev]);
    setSelectedTrip(duplicated);
    setCurrentView('itinerary');
    showToast('Trip Duplicated', 'You can now customize this separate copy.', 'success');

    if (currentUser) {
      try {
        await saveTrip(duplicated);
      } catch (err) {
        console.error('Error saving duplicated trip:', err);
      }
    }
  };

  // Delete a trip
  const handleDeleteTrip = async (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(trips.find(t => t.id !== tripId) || null);
    }
    setCurrentView('trips');
    showToast('Trip Deleted', 'The itinerary has been removed.', 'info');

    if (currentUser) {
      try {
        await deleteTripFromDb(tripId);
      } catch (err) {
        console.error('Error deleting trip from Firestore:', err);
      }
    }
  };

  // Navigation handlers
  const handleStartPlanning = (dest?: string) => {
    setPlanInitialDest(dest || '');
    setCurrentView('plan');
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* SaaS Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={view => setCurrentView(view)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Router with Smooth Fade In */}
      <main className="flex-1 animate-fade-in">
        {currentView === 'landing' && (
          <LandingPage
            onStartPlanning={handleStartPlanning}
            onExploreDestinations={() => setCurrentView('destinations')}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            trips={trips}
            onPlanTrip={() => handleStartPlanning()}
            onOpenTrip={trip => {
              setSelectedTrip(trip);
              setCurrentView('itinerary');
            }}
            onViewAllTrips={() => setCurrentView('trips')}
            onExploreDestinations={() => setCurrentView('destinations')}
          />
        )}

        {currentView === 'plan' && (
          <PlanTripWizard
            initialDestination={planInitialDest}
            onTripGenerated={handleTripGenerated}
            onCancel={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'itinerary' && selectedTrip && (
          <ItineraryView
            trip={selectedTrip}
            onUpdateTrip={handleUpdateTrip}
            onRegenerate={() => {
              setPlanInitialDest(selectedTrip.destination);
              setCurrentView('plan');
            }}
            onDuplicate={handleDuplicateTrip}
            onDelete={handleDeleteTrip}
            onBack={() => setCurrentView(currentUser ? 'trips' : 'landing')}
          />
        )}

        {currentView === 'destinations' && (
          <DestinationDirectory
            onSelectDestination={destName => {
              handleStartPlanning(destName);
            }}
          />
        )}

        {currentView === 'trips' && (
          <MyTripsPage
            trips={trips}
            onOpenTrip={trip => {
              setSelectedTrip(trip);
              setCurrentView('itinerary');
            }}
            onDuplicateTrip={handleDuplicateTrip}
            onDeleteTrip={handleDeleteTrip}
            onToggleSave={trip => {
              const updated = { ...trip, isSaved: !trip.isSaved };
              handleUpdateTrip(updated);
            }}
            onPlanNewTrip={() => handleStartPlanning()}
          />
        )}

        {currentView === 'profile' && <ProfileSettingsPage />}

        {currentView === 'features' && (
          <FeaturesPage onPlanTrip={() => handleStartPlanning()} />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Global SaaS Footer */}
      <Footer onNavigate={view => setCurrentView(view)} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
