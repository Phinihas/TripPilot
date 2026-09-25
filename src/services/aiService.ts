import { GenerateTripParams, Trip, DayPlan, ActivityItem, BudgetBreakdown } from '../types/travel';
import { POPULAR_DESTINATIONS } from '../data/destinations';

export async function generateItinerary(params: GenerateTripParams, userId: string): Promise<Trip> {
  try {
    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...params, currency: 'INR' }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.days && data.days.length > 0 && !data.fallback) {
        return buildTripFromAiData(data, params, userId);
      }
    }
  } catch (error) {
    console.warn('Backend AI generation endpoint failed, utilizing smart engine fallback:', error);
  }

  // Resilient fallback generator if network or backend key is absent
  return generateIntelligentFallbackItinerary(params, userId);
}

function buildTripFromAiData(aiData: any, params: GenerateTripParams, userId: string): Trip {
  const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const matchedDest = POPULAR_DESTINATIONS.find(d =>
    d.name.toLowerCase().includes(params.destination.toLowerCase()) ||
    params.destination.toLowerCase().includes(d.city.toLowerCase())
  );

  const fallbackImage = matchedDest ? matchedDest.image : 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80';

  const duration = Math.max(1, params.durationDays);
  const totalCost = aiData.budgetBreakdown?.total || aiData.overview?.totalCost || (params.maxBudget ? Math.round(params.maxBudget * 0.95) : 35000 * params.travelersCount);

  const budget: BudgetBreakdown = {
    flights: aiData.budgetBreakdown?.flights || Math.round(totalCost * 0.30),
    accommodation: aiData.budgetBreakdown?.accommodation || Math.round(totalCost * 0.32),
    food: aiData.budgetBreakdown?.food || Math.round(totalCost * 0.16),
    activities: aiData.budgetBreakdown?.activities || Math.round(totalCost * 0.10),
    localTransport: aiData.budgetBreakdown?.localTransport || Math.round(totalCost * 0.06),
    shopping: aiData.budgetBreakdown?.shopping || Math.round(totalCost * 0.04),
    miscellaneous: aiData.budgetBreakdown?.miscellaneous || Math.round(totalCost * 0.02),
    total: totalCost,
    dailyAverage: Math.round(totalCost / duration),
    currency: 'INR',
  };

  const days: DayPlan[] = (aiData.days || []).map((day: any, idx: number) => {
    const curDate = new Date(params.startDate);
    curDate.setDate(curDate.getDate() + idx);
    const dateStr = curDate.toISOString().split('T')[0];

    return {
      dayNumber: day.dayNumber || idx + 1,
      date: day.date || dateStr,
      theme: day.theme || `Day ${idx + 1}: Highlights & Exploration`,
      morning: normalizeActivities(day.morning, 'morning'),
      afternoon: normalizeActivities(day.afternoon, 'afternoon'),
      evening: normalizeActivities(day.evening, 'evening'),
      dayEstimatedCost: day.dayEstimatedCost || Math.round((budget.total - budget.flights) / duration),
      practicalTips: Array.isArray(day.practicalTips) ? day.practicalTips : ['Keep UPI payments ready; widely accepted everywhere in India', 'Pre-book monuments online via ASI portal for faster entry'],
      recommendedTransport: day.recommendedTransport || params.transportationPreference || 'Private AC Cab / Metro',
    };
  });

  return {
    id: tripId,
    userId,
    title: aiData.title || `${duration}-Day ${params.travelStyle} Tour of ${params.destination}`,
    startLocation: params.startLocation || 'Delhi (NCR), India',
    destination: params.destination,
    destinationDetails: {
      city: params.destination.split(',')[0].trim(),
      country: params.destination.split(',')[1]?.trim() || 'India',
      image: fallbackImage,
      description: matchedDest?.description || `A curated itinerary customized for ${params.travelStyle} travel.`,
    },
    startDate: params.startDate,
    endDate: params.endDate,
    durationDays: duration,
    travelersCount: params.travelersCount,
    travelStyle: params.travelStyle,
    budgetTier: params.budgetTier,
    maxBudget: params.maxBudget,
    estimatedCost: totalCost,
    currency: 'INR',
    interests: params.interests,
    accommodationPreference: params.accommodationPreference,
    foodPreference: params.foodPreference,
    transportationPreference: params.transportationPreference,
    additionalRequirements: params.additionalRequirements,
    status: 'planned',
    isSaved: false,
    overview: {
      summary: aiData.overview?.summary || aiData.summary || `Experience the best of ${params.destination} across ${duration} thoughtfully paced days.`,
      recommendedStyle: aiData.overview?.recommendedStyle || params.travelStyle,
      highlights: aiData.overview?.highlights || (matchedDest?.popularAttractions.slice(0, 4) || ['Historic Forts & Palaces', 'Authentic Local Cuisine', 'Scenic Sunset Views', 'Cultural Exploration']),
      totalCost,
      weatherExpectation: aiData.overview?.weatherExpectation || 'Pleasant season for city walks and sightseeing. Carry comfortable footwear and light layers.',
      localCurrencyAdvice: aiData.overview?.localCurrencyAdvice || 'UPI (Google Pay, PhonePe, Paytm) works virtually everywhere from street dhabas to luxury hotels. Keep ₹1,000 in cash for small auto fares and temple donations.',
    },
    budgetBreakdown: budget,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeActivities(acts: any[], timeOfDay: 'morning' | 'afternoon' | 'evening'): ActivityItem[] {
  if (!Array.isArray(acts) || acts.length === 0) {
    return [
      {
        id: `act_${Math.random().toString(36).substring(2, 9)}`,
        timeOfDay,
        title: timeOfDay === 'morning' ? 'Heritage Exploration & Breakfast' : timeOfDay === 'afternoon' ? 'Cultural Sightseeing & Traditional Lunch' : 'Scenic Sunset Promenade & Dinner',
        location: 'City Hub',
        description: 'Explore celebrated landmarks, savor authentic regional dishes, and enjoy local heritage aesthetics.',
        durationMinutes: 120,
        estimatedCost: timeOfDay === 'evening' ? 1200 : 600,
        category: timeOfDay === 'evening' ? 'food' : 'culture',
        travelTip: 'Book ASI monument tickets online to skip queue lines.'
      }
    ];
  }

  return acts.map((act, i) => ({
    id: act.id || `act_${timeOfDay}_${i}_${Math.random().toString(36).substring(2, 7)}`,
    timeOfDay,
    title: act.title || 'Sightseeing & Exploration',
    location: act.location || 'Local Landmark',
    description: act.description || 'Enjoy a curated experience tailored to your itinerary preferences.',
    durationMinutes: Number(act.durationMinutes) || 90,
    estimatedCost: Number(act.estimatedCost) || 500,
    category: act.category || (timeOfDay === 'evening' ? 'food' : 'sightseeing'),
    travelTip: act.travelTip || 'UPI and online bookings recommended for smooth entry.',
  }));
}

// High-fidelity algorithmic generator in INR
export function generateIntelligentFallbackItinerary(params: GenerateTripParams, userId: string): Trip {
  const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const matched = POPULAR_DESTINATIONS.find(d =>
    d.name.toLowerCase().includes(params.destination.toLowerCase()) ||
    params.destination.toLowerCase().includes(d.city.toLowerCase())
  );

  const cityName = matched ? matched.city : params.destination.split(',')[0].trim();
  const countryName = matched ? matched.country : params.destination.split(',')[1]?.trim() || 'India';
  const heroImage = matched?.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80';

  const daysCount = Math.max(1, params.durationDays);
  const travelers = params.travelersCount || 1;

  // Realistic INR base cost per person per day
  let dailyBasePerPerson = 3800; // Moderate default in INR
  if (params.budgetTier === 'Budget') dailyBasePerPerson = 2200;
  if (params.budgetTier === 'Luxury') dailyBasePerPerson = 9500;
  if (matched?.avgDailyCostInr) {
    const ratio = params.budgetTier === 'Budget' ? 0.7 : params.budgetTier === 'Luxury' ? 2.4 : 1.0;
    dailyBasePerPerson = Math.round(matched.avgDailyCostInr * ratio);
  }

  const estTravelPerPerson = params.budgetTier === 'Luxury' ? 14000 : params.budgetTier === 'Budget' ? 3500 : 7500;
  const travelTotal = estTravelPerPerson * travelers;
  const onTheGroundTotal = dailyBasePerPerson * daysCount * travelers;
  const calculatedTotal = travelTotal + onTheGroundTotal;
  const finalTotal = params.maxBudget ? Math.min(params.maxBudget, calculatedTotal) : calculatedTotal;

  const budget: BudgetBreakdown = {
    flights: travelTotal,
    accommodation: Math.round(onTheGroundTotal * 0.45),
    food: Math.round(onTheGroundTotal * 0.24),
    activities: Math.round(onTheGroundTotal * 0.15),
    localTransport: Math.round(onTheGroundTotal * 0.08),
    shopping: Math.round(onTheGroundTotal * 0.05),
    miscellaneous: Math.round(onTheGroundTotal * 0.03),
    total: finalTotal,
    dailyAverage: Math.round(finalTotal / daysCount),
    currency: 'INR',
  };

  const highlights = matched?.popularAttractions.slice(0, 4) || [
    `Historic Old Quarter & Heritage Monuments`,
    `Iconic Panoramic Sunset Viewpoint`,
    `Celebrated Culinary & Regional Thali Tasting`,
    `Vibrant Artisan Bazaars & Cultural Gardens`
  ];

  const days: DayPlan[] = [];
  const startDate = new Date(params.startDate);

  for (let i = 0; i < daysCount; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];

    const dayNumber = i + 1;
    const originCity = params.startLocation ? params.startLocation.split(',')[0].trim() : 'Origin';
    let theme = `Day ${dayNumber}: Arrival & Orientation in ${cityName}`;
    if (dayNumber === 1 && params.startLocation) {
      theme = `Day 1: Transit from ${originCity} & Welcome to ${cityName}`;
    } else if (dayNumber === 2) theme = `Day 2: Iconic Heritage & Must-Visit Landmarks`;
    else if (dayNumber === 3) theme = `Day 3: Culinary Discovery & Artisan Bazaars`;
    else if (dayNumber === 4) theme = `Day 4: Nature Escapes & Sunset Panoramas`;
    else if (dayNumber === 5) theme = `Day 5: Cultural Immersion & Hidden Architectural Gems`;
    else if (dayNumber >= 6 && dayNumber < daysCount) theme = `Day ${dayNumber}: Day Excursion & Scenic Countryside`;
    else if (dayNumber === daysCount && daysCount > 1) {
      theme = `Day ${dayNumber}: Souvenir Shopping & Return Journey to ${originCity}`;
    }

    const morningActs: ActivityItem[] = [
      {
        id: `act_${dayNumber}_m1`,
        timeOfDay: 'morning',
        title: dayNumber === 1
          ? `Transit from ${originCity} to ${cityName} & Hotel Check-in`
          : `Morning Visit to ${highlights[i % highlights.length]}`,
        location: dayNumber === 1 ? `${cityName} Central Hub` : highlights[i % highlights.length],
        description: dayNumber === 1
          ? `Begin your journey from ${originCity} via ${params.transportationPreference || 'preferred transit'}. Arrive in ${cityName}, check in to your stay, freshen up with masala chai, and prepare for city exploration.`
          : `Beat the mid-day heat at ${highlights[i % highlights.length]}. Enjoy serene morning lighting for photography.`,
        durationMinutes: 120,
        estimatedCost: dayNumber === 1 ? 0 : Math.round(budget.dailyAverage * 0.12),
        category: 'sightseeing',
        travelTip: 'Wear slip-on shoes for temple and monument visits where footwear must be removed.'
      }
    ];

    const afternoonActs: ActivityItem[] = [
      {
        id: `act_${dayNumber}_a1`,
        timeOfDay: 'afternoon',
        title: `Authentic Regional Lunch & Cultural Walk`,
        location: `${cityName} Heritage Quarter`,
        description: `Indulge in delicious local specialties curated for ${params.foodPreference}. Stroll through historic lanes and textile emporiums.`,
        durationMinutes: 150,
        estimatedCost: Math.round(budget.dailyAverage * 0.18),
        category: 'food',
        travelTip: 'Look for certified heritage restaurants and popular local eateries with high turnover.'
      }
    ];

    const eveningActs: ActivityItem[] = [
      {
        id: `act_${dayNumber}_e1`,
        timeOfDay: 'evening',
        title: `Golden Hour Sunset & Royal Dinner`,
        location: `${cityName} Promenade / Lake View`,
        description: `Watch the dusk sky paint the landscape in amber hues, followed by an atmospheric multi-course dinner matching your ${params.travelStyle} style.`,
        durationMinutes: 120,
        estimatedCost: Math.round(budget.dailyAverage * 0.22),
        category: 'food',
        travelTip: 'Reserve rooftop tables before sunset to catch the twilight skyline lighting.'
      }
    ];

    days.push({
      dayNumber,
      date: dateStr,
      theme,
      morning: morningActs,
      afternoon: afternoonActs,
      evening: eveningActs,
      dayEstimatedCost: Math.round((budget.total - budget.flights) / daysCount),
      practicalTips: [
        `Recommended transport: ${params.transportationPreference}`,
        'UPI digital payments are universally accepted across India.',
        'Keep bottled water and comfortable walking footwear handy.'
      ],
      recommendedTransport: params.transportationPreference || 'Private AC Cab / Rickshaw',
    });
  }

  return {
    id: tripId,
    userId,
    title: `${daysCount}-Day ${params.travelStyle} Tour of ${cityName}`,
    startLocation: params.startLocation || 'Delhi (NCR), India',
    destination: params.destination,
    destinationDetails: {
      city: cityName,
      country: countryName,
      image: heroImage,
      description: matched?.description || `A curated itinerary for ${cityName}, balancing iconic sights with authentic local neighborhood experiences.`,
    },
    startDate: params.startDate,
    endDate: params.endDate,
    durationDays: daysCount,
    travelersCount: travelers,
    travelStyle: params.travelStyle,
    budgetTier: params.budgetTier,
    maxBudget: params.maxBudget,
    estimatedCost: finalTotal,
    currency: 'INR',
    interests: params.interests,
    accommodationPreference: params.accommodationPreference,
    foodPreference: params.foodPreference,
    transportationPreference: params.transportationPreference,
    additionalRequirements: params.additionalRequirements,
    status: 'planned',
    isSaved: false,
    overview: {
      summary: `A personalized ${daysCount}-day itinerary for ${travelers} traveler${travelers > 1 ? 's' : ''} in ${cityName}. Designed for optimal pace and authentic cultural depth, matching your ${params.travelStyle} style and ${params.budgetTier} budget.`,
      recommendedStyle: params.travelStyle,
      highlights,
      totalCost: finalTotal,
      weatherExpectation: matched?.bestMonths.length ? `Best visited in ${matched.bestMonths.join(', ')} with pleasant weather.` : 'Pack comfortable cotton layers or light woolens depending on season.',
      localCurrencyAdvice: 'All transactions can be made seamlessly via UPI (Google Pay, PhonePe, Paytm). Cards accepted at hotels and restaurants.',
    },
    budgetBreakdown: budget,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
