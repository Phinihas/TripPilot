export type TravelStyle = 'Relaxed' | 'Balanced' | 'Fast-Paced' | 'Adventure' | 'Luxury' | 'Backpacking' | 'Family-Friendly';
export type BudgetTier = 'Budget' | 'Moderate' | 'Luxury';
export type TripStatus = 'draft' | 'planned' | 'completed' | 'cancelled';

export interface ActivityItem {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  title: string;
  location: string;
  description: string;
  durationMinutes: number;
  estimatedCost: number;
  category: 'sightseeing' | 'food' | 'culture' | 'adventure' | 'shopping' | 'relaxation' | 'transit';
  travelTip?: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  morning: ActivityItem[];
  afternoon: ActivityItem[];
  evening: ActivityItem[];
  dayEstimatedCost: number;
  practicalTips: string[];
  recommendedTransport: string;
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  localTransport: number;
  shopping: number;
  miscellaneous: number;
  total: number;
  dailyAverage: number;
  currency: string;
}

export interface TripOverview {
  summary: string;
  recommendedStyle: string;
  bestTimeToVisit?: string;
  localCurrencyAdvice?: string;
  highlights: string[];
  totalCost: number;
  weatherExpectation?: string;
}

export interface DestinationInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  state?: string;
  image: string;
  tagline: string;
  description: string;
  region: string;
  category: string[];
  avgDailyCostInr: number;
  avgDailyCostUsd?: number;
  bestMonths: string[];
  popularAttractions: string[];
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  startLocation?: string;
  destination: string;
  destinationDetails?: {
    city?: string;
    country?: string;
    image?: string;
    description?: string;
  };
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
  startDate: string;
  endDate: string;
  durationDays: number;
  travelersCount: number;
  travelStyle: TravelStyle;
  budgetTier: BudgetTier;
  maxBudget?: number;
  estimatedCost: number;
  currency: string;
  interests: string[];
  accommodationPreference: string;
  foodPreference: string;
  transportationPreference: string;
  additionalRequirements?: string;
  status: TripStatus;
  isSaved: boolean;
  overview: TripOverview;
  budgetBreakdown: BudgetBreakdown;
  days: DayPlan[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  currency: string;
  bio?: string;
  preferredStyle?: TravelStyle;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateTripParams {
  startLocation?: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelersCount: number;
  travelStyle: TravelStyle;
  budgetTier: BudgetTier;
  maxBudget?: number;
  currency?: string;
  interests: string[];
  accommodationPreference: string;
  foodPreference: string;
  transportationPreference: string;
  additionalRequirements?: string;
}
