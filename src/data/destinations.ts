import { DestinationInfo } from '../types/travel';

export const POPULAR_DESTINATIONS: DestinationInfo[] = [
  // --- North India ---
  {
    id: 'jaipur-rajasthan',
    name: 'Jaipur, Rajasthan',
    city: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    tagline: 'The Royal Pink City of majestic hill forts and opulent palaces',
    description: 'Immerse yourself in royal Rajput history with the honeycomb façade of Hawa Mahal, the formidable Amber Fort, City Palace museums, and vibrant bazaars loaded with gemstone jewelry and block-print textiles.',
    region: 'North India',
    category: ['History', 'Culture', 'Shopping', 'Food', 'Luxury'],
    avgDailyCostInr: 3200,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['Amber Fort & Sheesh Mahal', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Chokhi Dhani Cultural Village']
  },
  {
    id: 'manali-himachal',
    name: 'Manali, Himachal Pradesh',
    city: 'Manali',
    country: 'India',
    state: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Snow-capped Himalayan peaks, pine forests, and thrilling alpine adventures',
    description: 'Nestled on the banks of the Beas River, Manali offers paragliding in Solang Valley, snow adventures towards Rohtang Pass, cedar-scented Old Manali bohemian cafes, and natural hot water sulphur springs at Vashisht.',
    region: 'North India',
    category: ['Adventure', 'Nature', 'Culture', 'Budget travel'],
    avgDailyCostInr: 2800,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'May', 'Jun'],
    popularAttractions: ['Solang Valley Snow Sports', 'Old Manali Bohemian Cafes', 'Hadimba Devi Temple', 'Jogini Waterfalls', 'Atal Tunnel']
  },
  {
    id: 'leh-ladakh',
    name: 'Leh & Ladakh',
    city: 'Leh',
    country: 'India',
    state: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    tagline: 'High-altitude cold desert with azure lakes and cliff-hanging gompas',
    description: 'A mystical realm of turquoise Pangong Tso lake, double-humped Bactrian camels in Nubra Valley sand dunes, thrilling high-mountain passes like Khardung La, and peaceful centuries-old Buddhist monasteries.',
    region: 'North India',
    category: ['Adventure', 'Nature', 'Culture', 'Photography'],
    avgDailyCostInr: 4500,
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    popularAttractions: ['Pangong Tso Lake', 'Nubra Valley & Hunder Dunes', 'Khardung La Pass', 'Thiksey Monastery', 'Magnetic Hill']
  },
  {
    id: 'srinagar-kashmir',
    name: 'Srinagar & Gulmarg, Kashmir',
    city: 'Srinagar',
    country: 'India',
    state: 'Jammu & Kashmir',
    image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Paradise on Earth with wooden houseboats and alpine snowfields',
    description: 'Gliding along serene Dal Lake in colorful shikaras, staying in hand-carved cedarwood houseboats, strolling through terraced Mughal Gardens, and taking the highest cable car (Gulmarg Gondola) to snow-clad peaks.',
    region: 'North India',
    category: ['Nature', 'Romantic', 'Culture', 'Luxury', 'Adventure'],
    avgDailyCostInr: 4200,
    bestMonths: ['Apr', 'May', 'Jun', 'Oct', 'Dec', 'Jan'],
    popularAttractions: ['Dal Lake Shikara & Floating Market', 'Gulmarg Gondola Phase 2', 'Nishat & Shalimar Mughal Gardens', 'Betaab Valley Pahalgam', 'Shankaracharya Temple']
  },
  {
    id: 'varanasi-uttar-pradesh',
    name: 'Varanasi, Uttar Pradesh',
    city: 'Varanasi',
    country: 'India',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    tagline: 'The ancient spiritual heart of India along the sacred river Ganga',
    description: 'One of the world’s oldest continuously inhabited cities. Experience sunrise boat rides along 84 ghats, the hypnotic evening Ganga Aarti ceremony at Dashashwamedh, sacred Kashi Vishwanath temple, and tranquil Sarnath.',
    region: 'North India',
    category: ['Culture', 'History', 'Budget travel', 'Food'],
    avgDailyCostInr: 2100,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['Dashashwamedh Ghat Evening Aarti', 'Sunrise Boat Ride on Ganges', 'Kashi Vishwanath Corridor', 'Assi Ghat Subah-e-Banaras', 'Sarnath Deer Park']
  },
  {
    id: 'agra-uttar-pradesh',
    name: 'Agra, Uttar Pradesh',
    city: 'Agra',
    country: 'India',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Home of the timeless white marble wonder — Taj Mahal',
    description: 'Witness the ethereal beauty of the Taj Mahal at dawn, explore the formidable sandstone walls of the UNESCO-listed Agra Fort, and visit the ghost city of Fatehpur Sikri while tasting royal Mughal petha treats.',
    region: 'North India',
    category: ['History', 'Culture', 'Food'],
    avgDailyCostInr: 2600,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['Taj Mahal Sunrise Experience', 'Agra Fort Mughal Citadel', 'Mehtab Bagh Sunset View', 'Fatehpur Sikri Royal Complex', 'Kinari Bazaar Petha Tasting']
  },

  // --- South India ---
  {
    id: 'goa-india',
    name: 'Goa (North & South)',
    city: 'Goa',
    country: 'India',
    state: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Sun-kissed Arabian Sea beaches, Portuguese Latin quarters & vibrant nightlife',
    description: 'Golden sand shores from lively Baga and Anjuna in the North to peaceful Palolem and Agonda in the South. Savor authentic Goan fish curry, tour centuries-old spice plantations, and admire pastel colonial villas of Fontainhas.',
    region: 'South India',
    category: ['Beaches', 'Nightlife', 'Food', 'Culture', 'Relaxation'],
    avgDailyCostInr: 3600,
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['Palolem & Agonda Pristine Beaches', 'Fontainhas Latin Quarter', 'Dudhsagar Waterfalls Trek', 'Fort Aguada & Chapora Fort', 'Basilica of Bom Jesus']
  },
  {
    id: 'kerala-munnar-alleppey',
    name: 'Munnar & Alleppey, Kerala',
    city: 'Munnar & Alleppey',
    country: 'India',
    state: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    tagline: 'God’s Own Country: Rolling tea hills and tranquil houseboat backwaters',
    description: 'A rejuvenating blend of misty emerald tea estates in Munnar, Ayurvedic holistic wellness, and slow cruising on traditional thatched houseboats along palm-fringed canals in Alleppey and Kumarakom.',
    region: 'South India',
    category: ['Nature', 'Relaxation', 'Food', 'Culture'],
    avgDailyCostInr: 3400,
    bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['Alleppey Backwaters Houseboat Cruise', 'Munnar Tea Gardens & Museum', 'Eravikulam National Park (Nilgiri Tahr)', 'Mattupetty Dam & Eco Point', 'Traditional Kathakali & Kalaripayattu']
  },
  {
    id: 'hampi-karnataka',
    name: 'Hampi, Karnataka',
    city: 'Hampi',
    country: 'India',
    state: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c27?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Surreal boulder-strewn landscapes and ancient Vijayanagara ruins',
    description: 'A UNESCO World Heritage marvel featuring monolithic stone chariots, musical pillars, magnificent Dravidian temples, and breathtaking sunsets from Matanga Hill overlooking the Tungabhadra River.',
    region: 'South India',
    category: ['History', 'Culture', 'Adventure', 'Photography', 'Budget travel'],
    avgDailyCostInr: 2200,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    popularAttractions: ['Vijaya Vittala Temple & Stone Chariot', 'Virupaksha Ancient Temple', 'Matanga Hill Panoramic Sunset', 'Lotus Mahal & Elephant Stables', 'Coracle Boat Ride on Tungabhadra']
  },
  {
    id: 'ooty-tamil-nadu',
    name: 'Ooty & Coonoor, Tamil Nadu',
    city: 'Ooty',
    country: 'India',
    state: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Queen of the Nilgiris with historic mountain toy trains and aromatic tea slopes',
    description: 'Ride the iconic UNESCO Nilgiri Mountain Railway, walk through botanical rose gardens, breathe fresh eucalyptus mountain air, and gaze at sweeping valley drops from Dolphin’s Nose.',
    region: 'South India',
    category: ['Nature', 'Family-Friendly', 'Relaxation', 'Food'],
    avgDailyCostInr: 2900,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Apr', 'May', 'Jun'],
    popularAttractions: ['Nilgiri Mountain Toy Train', 'Ooty Botanical & Rose Gardens', 'Doddabetta Peak Viewpoint', 'Dolphin’s Nose Coonoor', 'Pykara Lake & Waterfalls']
  },

  // --- West India ---
  {
    id: 'udaipur-rajasthan',
    name: 'Udaipur, Rajasthan',
    city: 'Udaipur',
    country: 'India',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    tagline: 'The romantic City of Lakes with glowing white palaces on the water',
    description: 'Celebrated as the Venice of the East, Udaipur offers fairy-tale boat rides on Lake Pichola, the grand City Palace complex, evening folk performances at Bagore Ki Haveli, and royal heritage rooftop dining.',
    region: 'West India',
    category: ['Romantic', 'Culture', 'History', 'Luxury'],
    avgDailyCostInr: 3800,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['City Palace Complex', 'Lake Pichola Sunset Boat Cruise', 'Jag Mandir Island Palace', 'Saheliyon-ki-Bari Fountains', 'Bagore Ki Haveli Folk Show']
  },
  {
    id: 'mumbai-maharashtra',
    name: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    country: 'India',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    tagline: 'The Maximum City of Bollywood dreams, Victorian Gothic architecture & coastal energy',
    description: 'Stroll along Marine Drive Queen’s Necklace at dusk, stand before the Gateway of India, take a boat to Elephanta Caves, browse Kala Ghoda art galleries, and taste world-famous Bombay street chaat and vada pav.',
    region: 'West India',
    category: ['Food', 'Culture', 'Shopping', 'Nightlife', 'History'],
    avgDailyCostInr: 4500,
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['Gateway of India & Taj Mahal Palace', 'Marine Drive Promenade', 'Elephanta Rock-cut Caves', 'Colaba Causeway & Kala Ghoda', 'Bandra Bandstand & Sea Link']
  },

  // --- East & Northeast India ---
  {
    id: 'shillong-meghalaya',
    name: 'Shillong & Cherrapunji, Meghalaya',
    city: 'Shillong & Cherrapunji',
    country: 'India',
    state: 'Meghalaya',
    image: 'https://images.unsplash.com/photo-1626014303757-658a5099395d?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Abode of Clouds: Living root bridges, roaring waterfalls & crystal-clear rivers',
    description: 'Trek to the ancient living root bridges hand-woven by the Khasi tribe in Nongriat, gaze at the thundering Nohkalikai Falls, boat on the glass-transparent waters of the Umngot River in Dawki, and explore deep limestone caves.',
    region: 'East India',
    category: ['Adventure', 'Nature', 'Culture'],
    avgDailyCostInr: 3300,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    popularAttractions: ['Double Decker Living Root Bridge', 'Nohkalikai Falls (India’s tallest plunge)', 'Dawki Umngot Transparent River', 'Mawsmai Limestone Caves', 'Elephant Falls']
  },
  {
    id: 'andaman-islands',
    name: 'Andaman & Nicobar Islands',
    city: 'Havelock & Port Blair',
    country: 'India',
    state: 'Andaman and Nicobar',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Tropical paradise of turquoise lagoons, bioluminescent beaches & coral reefs',
    description: 'Sink your feet into powder-white sand at Radhanagar Beach (voted Asia’s best beach), snorkel among vibrant corals at Elephant Beach, kayak through mangroves, and honor history at the Cellular Jail.',
    region: 'Islands',
    category: ['Beaches', 'Adventure', 'Nature', 'Romantic', 'Luxury'],
    avgDailyCostInr: 5800,
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    popularAttractions: ['Radhanagar Beach Sunset (Havelock)', 'Elephant Beach Snorkeling & Water Sports', 'Cellular Jail Light & Sound Show', 'Neil Island Natural Rock Bridge', 'Scuba Diving at Coral Reefs']
  },
  {
    id: 'darjeeling-west-bengal',
    name: 'Darjeeling, West Bengal',
    city: 'Darjeeling',
    country: 'India',
    state: 'West Bengal',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Champagne of teas and golden sunrise views of Mt. Kanchenjunga',
    description: 'Wake up early to catch the morning sun painting Mt. Kanchenjunga in gold from Tiger Hill, ride the heritage Himalayan Railway toy train, and sip world-renowned single-estate muscatel teas at lush plantation bungalows.',
    region: 'East India',
    category: ['Nature', 'Culture', 'Food', 'Family-Friendly'],
    avgDailyCostInr: 2800,
    bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov', 'Dec'],
    popularAttractions: ['Tiger Hill Sunrise over Kanchenjunga', 'Darjeeling Himalayan Toy Train', 'Batasia Loop & War Memorial', 'Happy Valley Tea Estate', 'Peace Pagoda & Japanese Temple']
  },

  // --- International Highlights ---
  {
    id: 'tokyo-japan',
    name: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Futuristic metropolis blending neon skylines with ancient shrines',
    description: 'From Shibuya crossing to serene Meiji Jingu, Tokyo delivers unmatched culinary excellence, world-class bullet trains, and sensory wonders.',
    region: 'International',
    category: ['Culture', 'Food', 'Shopping', 'History'],
    avgDailyCostInr: 11500,
    bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov'],
    popularAttractions: ['Senso-ji Temple', 'Shibuya Sky Observation', 'Tsukiji Market', 'Akihabara', 'Shinjuku Gyoen']
  },
  {
    id: 'bali-indonesia',
    name: 'Bali, Indonesia',
    city: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Tropical sanctuary of emerald rice terraces, surf beaches, and holistic retreats',
    description: 'Island of the Gods featuring spiritual wellness in Ubud, thrilling surf in Uluwatu, and dramatic cliffside sea temples.',
    region: 'International',
    category: ['Beaches', 'Nature', 'Adventure', 'Relaxation'],
    avgDailyCostInr: 6200,
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    popularAttractions: ['Tegallalang Rice Terraces', 'Uluwatu Temple Sunset', 'Mount Batur Sunrise Hike', 'Seminyak Beach']
  },
  {
    id: 'dubai-uae',
    name: 'Dubai, UAE',
    city: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Futuristic desert oasis of architectural marvels and luxury living',
    description: 'Scale the world’s tallest tower, shop in sprawling designer malls, experience desert safaris with dune bashing, and relax at opulent resorts.',
    region: 'International',
    category: ['Luxury', 'Shopping', 'Food', 'Adventure'],
    avgDailyCostInr: 18500,
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    popularAttractions: ['Burj Khalifa Observation Deck', 'The Dubai Mall', 'Palm Jumeirah', 'Desert Safari Dunes']
  }
];

export const TRAVEL_INTERESTS = [
  { id: 'Adventure', label: 'Adventure', icon: 'Compass', color: 'from-amber-500 to-orange-600' },
  { id: 'Beaches', label: 'Beaches & Islands', icon: 'Palmtree', color: 'from-cyan-500 to-blue-600' },
  { id: 'History', label: 'Forts & Heritage', icon: 'Landmark', color: 'from-amber-600 to-yellow-700' },
  { id: 'Culture', label: 'Culture & Temples', icon: 'Sparkles', color: 'from-purple-500 to-pink-600' },
  { id: 'Food', label: 'Food & Street Eats', icon: 'Utensils', color: 'from-rose-500 to-red-600' },
  { id: 'Shopping', label: 'Bazaars & Shopping', icon: 'ShoppingBag', color: 'from-pink-500 to-rose-600' },
  { id: 'Nature', label: 'Himalayas & Nature', icon: 'Trees', color: 'from-emerald-500 to-teal-600' },
  { id: 'Nightlife', label: 'Nightlife & Cafes', icon: 'Music', color: 'from-indigo-500 to-purple-600' },
  { id: 'Luxury', label: 'Royal Palaces & Luxury', icon: 'Crown', color: 'from-yellow-400 to-amber-600' },
  { id: 'Budget travel', label: 'Budget & Backpacking', icon: 'Wallet', color: 'from-green-500 to-emerald-600' },
];

export const TRAVEL_STYLES = [
  { id: 'Balanced', label: 'Balanced Explorer', desc: 'Mix of top sights, hidden gems, and leisure' },
  { id: 'Relaxed', label: 'Slow & Relaxed', desc: 'Leisurely pace with maximum 2-3 activities per day' },
  { id: 'Fast-Paced', label: 'High Energy', desc: 'See as much as possible, packed full itineraries' },
  { id: 'Adventure', label: 'Thrill & Outdoors', desc: 'Trekking, water sports, high passes, rafting' },
  { id: 'Luxury', label: 'Royal & Heritage Comfort', desc: 'Heritage havelis, luxury resorts, private cabs' },
  { id: 'Backpacking', label: 'Backpacker / Local', desc: 'Homestays, hostel vibes, trains, local dhabas' },
  { id: 'Family-Friendly', label: 'Family & Comfort', desc: 'Comfortable road transfers, child-friendly spots' },
];

export const ACCOMMODATIONS = [
  'Heritage Havelis & Boutique Hotels',
  '4-Star & 5-Star Luxury Resorts',
  'Authentic Homestays & Backwater Houseboats',
  'Cozy Mountain Cottages & Tea Estate Bungalows',
  'Budget Guesthouses & Youth Hostels (Zostel-style)',
  'Beach Shacks & Luxury Glamping Tents'
];

export const FOOD_PREFERENCES = [
  'Authentic Regional Indian Cuisine & Local Thalis',
  'Pure Vegetarian & Jain Friendly',
  'Celebrated Street Food & Night Bazaars',
  'Fine Dining & Royal Mughal/Rajput Feasts',
  'Coastal Seafood & Konkani/Malabar Delicacies',
  'Mix of North & South Indian and Continental'
];

export const TRANSPORT_PREFERENCES = [
  'Private AC Cab & Chauffeur (Sedan/SUV)',
  'Indian Railways (Vande Bharat & Express Trains)',
  'Self-Drive Rental Car / Himalayan Motorbike (Royal Enfield)',
  'Local Auto-Rickshaws & Metro Transit',
  'Scenic Luxury Trains & Houseboats'
];
