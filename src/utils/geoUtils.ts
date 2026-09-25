/**
 * Geographical coordinates and distance utilities for Indian and global cities
 */

export interface CityLocation {
  name: string;
  city: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
}

export const KNOWN_CITIES: CityLocation[] = [
  // Major Indian Transit Hubs & Origin Cities
  { name: 'Delhi (NCR), India', city: 'Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai, Maharashtra', city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru, Karnataka', city: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad, Telangana', city: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai, Tamil Nadu', city: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata, West Bengal', city: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune, Maharashtra', city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad, Gujarat', city: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225, lng: 72.5714 },
  { name: 'Chandigarh, Punjab', city: 'Chandigarh', state: 'Punjab', country: 'India', lat: 30.7333, lng: 76.7794 },
  { name: 'Kochi (Cochin), Kerala', city: 'Kochi', state: 'Kerala', country: 'India', lat: 9.9312, lng: 76.2673 },
  { name: 'Lucknow, Uttar Pradesh', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', lat: 26.8467, lng: 80.9462 },
  { name: 'Jaipur, Rajasthan', city: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873 },
  { name: 'Goa, India', city: 'Goa', state: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240 },
  { name: 'Manali, Himachal Pradesh', city: 'Manali', state: 'Himachal Pradesh', country: 'India', lat: 32.2432, lng: 77.1892 },
  { name: 'Leh & Ladakh', city: 'Leh', state: 'Ladakh', country: 'India', lat: 34.1526, lng: 77.5771 },
  { name: 'Srinagar, Kashmir', city: 'Srinagar', state: 'Jammu & Kashmir', country: 'India', lat: 34.0837, lng: 74.7973 },
  { name: 'Varanasi, Uttar Pradesh', city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', lat: 25.3176, lng: 82.9739 },
  { name: 'Agra, Uttar Pradesh', city: 'Agra', state: 'Uttar Pradesh', country: 'India', lat: 27.1767, lng: 78.0081 },
  { name: 'Munnar & Alleppey, Kerala', city: 'Munnar', state: 'Kerala', country: 'India', lat: 10.0889, lng: 77.0595 },
  { name: 'Hampi, Karnataka', city: 'Hampi', state: 'Karnataka', country: 'India', lat: 15.3350, lng: 76.4600 },
  { name: 'Udaipur, Rajasthan', city: 'Udaipur', state: 'Rajasthan', country: 'India', lat: 24.5854, lng: 73.7125 },
  { name: 'Shillong, Meghalaya', city: 'Shillong', state: 'Meghalaya', country: 'India', lat: 25.5788, lng: 91.8933 },
  { name: 'Andaman Islands', city: 'Port Blair', state: 'Andaman', country: 'India', lat: 11.6234, lng: 92.7265 },
  { name: 'Darjeeling, West Bengal', city: 'Darjeeling', state: 'West Bengal', country: 'India', lat: 27.0410, lng: 88.2663 },

  // International Hubs
  { name: 'Tokyo, Japan', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Paris, France', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Bali, Indonesia', city: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.0920 },
  { name: 'Dubai, UAE', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
];

/**
 * Calculates Great Circle distance between two lat/lng pairs in kilometers (Haversine formula)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Find coordinates for a city name or closest known city
 */
export function getCityCoordinates(cityName: string): CityLocation {
  const normalized = cityName.toLowerCase();
  const matched = KNOWN_CITIES.find(
    c =>
      normalized.includes(c.city.toLowerCase()) ||
      c.name.toLowerCase().includes(normalized) ||
      (c.state && normalized.includes(c.state.toLowerCase()))
  );

  if (matched) return matched;

  // Default coordinate (Delhi central)
  return {
    name: cityName,
    city: cityName,
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
  };
}

/**
 * Finds the closest city to a given latitude and longitude
 */
export function findNearestCity(lat: number, lng: number): CityLocation {
  let closest = KNOWN_CITIES[0];
  let minDistance = Infinity;

  for (const city of KNOWN_CITIES) {
    const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return closest;
}

export interface TravelRouteInfo {
  startLocation: string;
  destination: string;
  distanceKm: number;
  recommendedTransport: string;
  estimatedTravelTime: string;
  routeHighlights: string;
  flightOption?: { duration: string; estCostInr: number };
  trainOption?: { duration: string; estCostInr: number; name: string };
  roadOption?: { duration: string; estCostInr: number; highway: string };
  startCoords: [number, number];
  destCoords: [number, number];
}

/**
 * Computes realistic travel route options between start and destination
 */
export function computeTravelRoute(startLocationName: string, destinationName: string): TravelRouteInfo {
  const startLoc = getCityCoordinates(startLocationName || 'Delhi (NCR), India');
  const destLoc = getCityCoordinates(destinationName || 'Jaipur, Rajasthan');

  const distance = Math.max(50, calculateDistanceKm(startLoc.lat, startLoc.lng, destLoc.lat, destLoc.lng));

  let recommendedTransport = 'Private AC Cab / Highway Drive';
  let estimatedTravelTime = `${Math.round(distance / 50)} hrs by Road`;
  let routeHighlights = `Direct scenic connection between ${startLoc.city} and ${destLoc.city}.`;

  const roadHours = (distance / 55).toFixed(1);
  const trainHours = (distance / 75).toFixed(1);
  const flightHours = (distance / 650 + 1.5).toFixed(1); // includes airport buffer

  const roadCost = Math.round(distance * 14 + 1000); // Cab cost in INR
  const trainCost = Math.round(distance * 2.2 + 800); // 2AC / 3AC / Vande Bharat in INR
  const flightCost = Math.round(distance * 4.5 + 3200); // Domestic flight in INR

  if (distance < 350) {
    recommendedTransport = 'Private AC Cab / Express Road Trip';
    estimatedTravelTime = `${roadHours} hrs drive`;
    routeHighlights = `Express Highway Corridor (${distance} km). Smooth driving with highway food plazas and fuel halts.`;
  } else if (distance < 900) {
    recommendedTransport = 'Vande Bharat / Superfast Indian Railways';
    estimatedTravelTime = `${trainHours} hrs by Rail`;
    routeHighlights = `Convenient rail transit (${distance} km) with onboard meals and scenic countryside vistas.`;
  } else {
    recommendedTransport = 'Direct / Connecting Flight';
    estimatedTravelTime = `${flightHours} hrs (including airport check-in)`;
    routeHighlights = `Long-range journey (${distance} km). Best reached via flight to maximize holiday time at the destination.`;
  }

  return {
    startLocation: startLoc.name,
    destination: destLoc.name,
    distanceKm: distance,
    recommendedTransport,
    estimatedTravelTime,
    routeHighlights,
    roadOption: {
      duration: `${roadHours} hrs`,
      estCostInr: roadCost,
      highway: `NH ${Math.floor(distance / 20) % 50 + 44} Corridor`,
    },
    trainOption: {
      duration: `${trainHours} hrs`,
      estCostInr: trainCost,
      name: distance < 600 ? 'Vande Bharat / Shatabdi Express' : 'Rajdhani / Superfast Express',
    },
    flightOption: {
      duration: `${flightHours} hrs`,
      estCostInr: flightCost,
    },
    startCoords: [startLoc.lat, startLoc.lng],
    destCoords: [destLoc.lat, destLoc.lng],
  };
}
