# TripPilot AI ✈️ — Intelligent Travel Planning SaaS

> **TripPilot AI** is a commercial-grade, full-stack AI travel planning web application built to transform travel dreams into personalized, day-by-day itineraries, interactive route maps, and granular budget breakdowns formatted in **Indian Rupees (₹ / INR)**.

**Developed by Phinihas Gandi**

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Project Architecture](#-project-architecture)
5. [Folder & Directory Structure](#-folder--directory-structure)
6. [Frontend Implementation](#-frontend-implementation)
7. [Backend & Server Architecture](#-backend--server-architecture)
8. [Database & Schema (Firestore)](#-database--schema-firestore)
9. [Authentication Flow (Firebase Auth)](#-authentication-flow-firebase-auth)
10. [AI Integration (Gemini 3.8 Flash)](#-ai-integration-gemini-38-flash)
11. [Map & Location Integration](#-map--location-integration)
12. [API Structure & Endpoints](#-api-structure--endpoints)
13. [Budget Calculation Engine](#-budget-calculation-engine)
14. [User Trips Lifecycle & Persistence](#-user-trips-lifecycle--persistence)
15. [Environment Variables](#-environment-variables)
16. [Installation & Setup](#-installation--setup)
17. [Running the Application](#-running-the-application)
18. [Testing & Verification](#-testing--verification)
19. [Deployment Instructions](#-deployment-instructions)
20. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🌟 Project Overview

Planning a trip often involves juggling dozens of browser tabs, comparing distances, estimating taxi and train fares, deciphering hotel costs, and assembling itineraries that end up either overpacked or chaotic. 

**TripPilot AI** solves this by unifying:
1. **Starting Origin & Destination Routing:** Understanding where the traveler starts (e.g., Delhi, Mumbai, Bengaluru) and calculating real-world distances, travel times, and multimodal transit (Road/Cab, Vande Bharat/Express Rail, Domestic Flight).
2. **AI-Powered Itinerary Synthesis:** Generating realistically paced morning, afternoon, and evening activities with entry costs, local tips, and geographic clustering.
3. **Dedicated 7-Tier Budget Modeling:** Allocating total costs into Flights/Rail, Hotels, Dining, Activities, Local Cabs/Auto, Bazaar Shopping, and Miscellaneous in Indian Rupees (`₹`).
4. **Interactive Mapping:** Powered by Leaflet and OpenStreetMap for real-time visualization of origin-to-destination corridors without expensive third-party map API keys.
5. **Secure Cloud Persistence:** Powered by Firebase Authentication and Google Cloud Firestore with comprehensive row-level security rules.

---

## 🚀 Key Features

* **Authentic Indian & Global Destinations:** Pre-curated rich catalog of iconic Indian locations across states (Jaipur, Varanasi, Goa, Kerala Backwaters, Ladakh, Hampi, Darjeeling, etc.) alongside major international destinations (Tokyo, Paris, Bali, Dubai).
* **Location-Aware Route Planning:**
  * One-click location detection using browser Geolocation API with clear, transparent privacy explanations.
  * Instant manual origin selection with quick-select buttons for major Indian metropolitan hubs.
  * Haversine distance engine computing travel duration and costs for Cab, Rail (Vande Bharat/Rajdhani), and Domestic Flights.
* **Interactive Route Map:**
  * Real OpenStreetMap rendering with Leaflet.
  * Custom origin and destination markers with route polylines.
  * Seamless switcher between Interactive Map and Route Corridor Flow.
  * Turn-by-turn navigation shortcut to Google Maps.
* **Intelligent Day-by-Day Itineraries:**
  * Day 1 automatically reserves transit time from the origin city, airport/railway check-in, and light evening exploration.
  * Subsequent days cluster sightseeing landmarks geographically to minimize travel fatigue.
  * Final day schedules local shopping, packing, and return transit towards origin.
* **Interactive Itinerary Customizer:**
  * Add custom activities with title, timing, category, duration, and cost in ₹ INR.
  * Delete activities with dynamic recalculation of daily and total trip expenditure.
* **7-Tier Budget Architect:**
  * Flights / Rail transit
  * Hotels & Accommodation
  * Food & Regional Dining
  * Activities & Monuments
  * Local Cabs & Rickshaws
  * Bazaar Shopping
  * Miscellaneous Reserve
* **Dark / Light Mode:**
  * Modern Tailwind CSS theme toggle with system preference detection and `localStorage` persistence.
* **User Management & Trip Hub:**
  * Google Sign-In and Email/Password authentication.
  * Save, edit, duplicate, search, filter, and delete trips with confirmation dialogs.
  * Printable itinerary summary.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | Component-based, type-safe reactive UI |
| **Build Tooling** | Vite 8 + TSX | Fast dev server, optimized production bundling |
| **Styling** | Tailwind CSS v4 | Utility-first styling with `@custom-variant dark` |
| **Icons & Visuals** | Lucide React | Clean, modern iconography |
| **Interactive Maps** | Leaflet + OpenStreetMap | Client-side map rendering without external API keys |
| **AI Model & SDK** | Google Gemini (`@google/genai`) | Server-side `gemini-3.8-flash` model integration |
| **Backend Server** | Node.js + Express 4 | Server-side proxy handling AI requests safely |
| **Authentication** | Firebase Authentication | Google OAuth popup + Email/Password authentication |
| **Database** | Google Cloud Firestore | NoSQL document storage with security rules |

---

## 🏛️ Project Architecture

```
                       ┌──────────────────────────────────────────────┐
                       │               User Browser                   │
                       │    (React 19 + Tailwind CSS + Leaflet Map)   │
                       └──────────────┬───────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────────┐           ┌───────────────────────┐
        │  Firebase Auth &      │           │    Express Server     │
        │  Cloud Firestore      │           │  (Port 3000 / Proxy)  │
        │  (Client-side SDK)    │           └───────────┬───────────┘
        └───────────────────────┘                       │
                                                        ▼
                                            ┌───────────────────────┐
                                            │ Google GenAI SDK      │
                                            │ (gemini-3.8-flash)    │
                                            └───────────────────────┘
```

1. **Client Tier:** The single-page application is served via Vite/Express. User actions (saving trips, viewing profile, bookmarking favorites) communicate directly with Firebase Firestore using authenticated user tokens.
2. **Backend API Tier:** The `/api/generate-itinerary` endpoint lives inside `server.ts` (and dev Vite middleware). The frontend never sees or handles `GEMINI_API_KEY`.
3. **Data Security Tier:** Firestore rules (`firestore.rules`) enforce strict authorization where users can only read and write their own documents matching `request.auth.uid == userId`.

---

## 📂 Folder & Directory Structure

```
├── .env.example                     # Environment template (GEMINI_API_KEY, APP_URL)
├── firebase-applet-config.json      # Provisioned Firebase web project configuration
├── firebase-blueprint.json          # Firestore entity and path schema definitions
├── firestore.rules                  # Strict production Firestore security rules
├── index.html                       # HTML5 entry with synced metadata
├── metadata.json                    # Project configuration and capabilities
├── package.json                     # Project scripts and dependencies
├── server.ts                        # Production Express server running API routes
├── tsconfig.json                    # TypeScript configuration with bundler resolution
├── vite.config.ts                   # Vite configuration with embedded dev AI middleware
└── src/
    ├── main.tsx                     # Application entry point & Leaflet CSS
    ├── App.tsx                      # Main routing state manager & view switcher
    ├── index.css                    # Tailwind CSS imports and custom animations
    ├── types/
    │   └── travel.ts                # TypeScript interfaces (Trip, DayPlan, Budget, Route)
    ├── data/
    │   └── destinations.ts          # Curated Indian & International travel destinations
    ├── context/
    │   ├── AuthContext.tsx          # Firebase authentication provider & session sync
    │   └── ThemeContext.tsx         # Dark / Light mode provider & DOM modifier
    ├── firebase/
    │   ├── config.ts                # Firebase app, auth, and Firestore initialization
    │   └── firestoreService.ts      # Cloud CRUD operations for trips and user profile
    ├── services/
    │   └── aiService.ts             # Client API caller with intelligent fallback generator
    ├── utils/
    │   ├── formatters.ts            # Indian Rupee (₹) formatters (e.g. ₹1,25,000)
    │   └── geoUtils.ts              # Haversine distance, city coordinates & route options
    └── components/
        ├── auth/
        │   └── AuthModal.tsx        # Sign In / Sign Up / Forgot Password modal
        ├── common/
        │   ├── Navbar.tsx           # Global responsive navigation header
        │   ├── Footer.tsx           # Footer with "Developed by Phinihas Gandi"
        │   ├── Toast.tsx            # Alert notification toast system
        │   └── ConfirmationModal.tsx# Deletion & destructive action confirmation
        ├── dashboard/
        │   └── Dashboard.tsx        # User dashboard with metrics, quick actions & trips
        ├── destinations/
        │   └── DestinationDirectory.tsx # Destination search, region filter & card directory
        ├── itinerary/
        │   └── ItineraryView.tsx    # Comprehensive day-by-day viewer, editor & budget
        ├── map/
        │   └── RouteMap.tsx         # Interactive Leaflet OpenStreetMap route visualizer
        ├── plan/
        │   └── PlanTripWizard.tsx   # 4-step trip planning wizard with validation
        ├── profile/
        │   └── ProfileSettingsPage.tsx # User profile, travel style preferences & bio
        └── trips/
            └── MyTripsPage.tsx      # All saved trips with search, filter tabs & sorting
```

---

## 🎨 Frontend Implementation

* **Component-Driven Design:** Built with modern React 19 functional components utilizing hooks (`useState`, `useEffect`, `useCallback`, `useContext`, `useRef`).
* **Strict Type Safety:** All entities (Trips, DayPlans, ActivityItems, BudgetBreakdown, UserProfile) are strictly typed in `src/types/travel.ts`.
* **Tailwind CSS v4 Theming:** Complete dark mode support via Tailwind's `@custom-variant dark (&:where(.dark, .dark *));`. All modals, cards, badges, inputs, and dropdowns adapt cleanly between light and dark themes.
* **Indian Rupee Formatting:** Specialized formatting function `formatINR(amount)` formats numbers to Indian numbering standards (e.g., `₹1,500`, `₹25,000`, `₹1,25,000`).
* **Fluid Micro-Animations:** Custom CSS animations (`animate-fade-in`, `animate-slide-up`, `card-hover-effect`, `btn-hover-effect`) provide premium SaaS fluidity without bloat.

---

## 🖥️ Backend & Server Architecture

The backend provides a secure intermediary between the client and Google's Gemini AI:

1. **Development Mode:** `vite.config.ts` includes a custom Vite plugin (`geminiApiPlugin`) that intercepts POST requests to `/api/generate-itinerary`. This enables instant hot reload without running a separate backend process.
2. **Production Mode:** `server.ts` uses Express to serve the static frontend bundle from `dist/` and handles the `/api/generate-itinerary` endpoint with `@google/genai`.
3. **Environment Security:** The server reads `process.env.GEMINI_API_KEY` internally. The client never receives or stores the API key.

---

## 🗄️ Database & Schema (Firestore)

Cloud Firestore is used to persist user profiles and created trips.

### Collections Structure

#### 1. `/users/{userId}`
Stores user profile information.
* `userId` (string, document ID): Firebase Auth UID
* `email` (string): User email address
* `displayName` (string): User's full name
* `photoURL` (string, optional): Profile avatar image URL
* `currency` (string): Default currency (`INR`)
* `preferredStyle` (string): Default travel pace (`Relaxed`, `Balanced`, `Fast-Paced`, etc.)
* `bio` (string, optional): Short travel bio
* `createdAt` (string, ISO timestamp)
* `updatedAt` (string, ISO timestamp)

#### 2. `/users/{userId}/trips/{tripId}`
Stores itineraries belonging to a user.
* `id` (string): Unique trip ID
* `userId` (string): Owner's UID
* `title` (string): Itinerary title
* `startLocation` (string): Starting origin (e.g. `Delhi (NCR), India`)
* `destination` (string): Target destination (e.g. `Jaipur, Rajasthan`)
* `travelRoute` (object): Route metrics (distanceKm, transport options, coordinates)
* `startDate` & `endDate` (string): Travel date range
* `durationDays` (number): Number of days
* `travelersCount` (number): Number of travelers
* `travelStyle` (string): Pace and focus
* `budgetTier` (string): `Budget`, `Moderate`, or `Luxury`
* `maxBudget` (number, optional): User cap in INR
* `estimatedCost` (number): Total calculated cost in INR
* `currency` (string): `INR`
* `overview` (object): Summary, highlights, weather tips, UPI advice
* `budgetBreakdown` (object): 7 category allocations
* `days` (array): Array of DayPlan objects with morning, afternoon, evening activities
* `isSaved` (boolean): Saved state flag
* `status` (string): `draft`, `planned`, `completed`, `cancelled`
* `createdAt` & `updatedAt` (string, ISO timestamps)

### Firestore Security Rules
Security rules defined in `firestore.rules` enforce:
* Default deny on all unmatched paths.
* Read/write access on `/users/{userId}` only when `request.auth.uid == userId`.
* Read/write access on `/users/{userId}/trips/{tripId}` only when `request.auth.uid == userId` and incoming `userId` matches auth token.

---

## 🔐 Authentication Flow (Firebase Auth)

1. **Sign-In Methods Supported:**
   * **Google One-Click Sign-In:** Utilizes `signInWithPopup(auth, googleProvider)`.
   * **Email & Password Sign-Up:** Uses `createUserWithEmailAndPassword`.
   * **Email & Password Login:** Uses `signInWithEmailAndPassword`.
   * **Password Reset:** Uses `sendPasswordResetEmail`.
   * **Guest / Demo Mode:** Allows users to test the planner before signing in.
2. **Session Persistence:** Managed automatically by Firebase Auth SDK across browser reloads.
3. **Data Synchronization:** On auth state change (`onAuthStateChanged`), the user's Firestore profile is fetched or created automatically via `createUserProfile()`.

---

## 🧠 AI Integration (Gemini 3.8 Flash)

The application utilizes Google's **Gemini 3.8 Flash** (`@google/genai`) to generate hyper-realistic itineraries:

1. **Prompt Design:**
   * Receives traveler count, travel style, budget, interests, accommodation, food preferences, and both **Starting Origin** and **Destination**.
   * Forces structured JSON output via `responseMimeType: 'application/json'`.
   * Enforces all pricing strictly in Indian Rupees (`₹`).
   * Explicitly instructs the model to structure Day 1 for transit from the starting origin and cluster attractions geographically each day.
2. **Resilient Fallback Engine:**
   * If `GEMINI_API_KEY` is not configured or network failures occur, `src/services/aiService.ts` contains an algorithmic generator that produces fully populated, realistic day-by-day plans in INR tailored to the destination and travel preferences.

---

## 🗺️ Map & Location Integration

* **Privacy-First Geolocation:**
  * Browser geolocation is only requested when the user clicks "Use My Location".
  * A clear modal explains that location is only used once to find the closest transit hub.
  * Coordinates are never continuously tracked or stored.
* **Manual Hub Picker:**
  * Quick-select buttons for Delhi (NCR), Mumbai, Bengaluru, Hyderabad, Kolkata, Chennai, etc.
* **Haversine Distance Engine (`src/utils/geoUtils.ts`):**
  * Computes Great Circle distance between coordinates of origin and destination.
  * Dynamically computes travel duration and INR cost for:
    * **Road / Private Cab:** `~₹14/km` + tolls
    * **Railways (Vande Bharat / 2AC):** `~₹2.2/km`
    * **Domestic Flights:** `~₹4.5/km` + base fare
* **Interactive Leaflet Map (`src/components/map/RouteMap.tsx`):**
  * Renders OpenStreetMap tiles with custom SVG markers.
  * Automatically fits bounds to display both origin and destination.
  * Offers quick reset and direct Google Maps navigation shortcut.

---

## 📡 API Structure & Endpoints

### `POST /api/generate-itinerary`

Generates an AI-powered travel plan.

#### Request Body
```json
{
  "startLocation": "Delhi (NCR), India",
  "destination": "Jaipur, Rajasthan",
  "startDate": "2026-10-10",
  "endDate": "2026-10-15",
  "durationDays": 6,
  "travelersCount": 2,
  "travelStyle": "Balanced",
  "budgetTier": "Moderate",
  "maxBudget": 45000,
  "currency": "INR",
  "interests": ["History", "Culture", "Food", "Nature"],
  "accommodationPreference": "Mid-Range Boutique Heritage Hotel",
  "foodPreference": "Local Authentic Specialties & Street Food",
  "transportationPreference": "Private AC Cab & City Metro",
  "additionalRequirements": "Include sunset views and local sweet shops"
}
```

#### Response Body
```json
{
  "title": "6-Day Balanced Tour of Jaipur, Rajasthan",
  "overview": {
    "summary": "Experience the royal heritage of Jaipur with balanced cultural discovery and comfortable pacing.",
    "recommendedStyle": "Balanced",
    "weatherExpectation": "Pleasant mornings and evenings.",
    "localCurrencyAdvice": "UPI accepted universally; keep small cash for auto rickshaws.",
    "highlights": ["Amber Fort", "City Palace", "Hawa Mahal", "Nahargarh Sunset"],
    "totalCost": 42000
  },
  "budgetBreakdown": {
    "flights": 9500,
    "accommodation": 14000,
    "food": 7500,
    "activities": 4500,
    "localTransport": 3500,
    "shopping": 2000,
    "miscellaneous": 1000,
    "total": 42000,
    "dailyAverage": 7000,
    "currency": "INR"
  },
  "days": [ ... ]
}
```

---

## 💰 Budget Calculation Engine

The budget system allocates total trip spending realistically:

1. **Tier Multipliers:**
   * **Budget:** ₹2,200/day/person base ground cost
   * **Moderate:** ₹3,800/day/person base ground cost
   * **Luxury:** ₹9,500/day/person base ground cost
2. **Transit Allocation:**
   * Inter-city transit (Flights/Rail) estimated from route distance.
3. **Category Breakdown:**
   * **Accommodation:** ~45% of on-the-ground budget
   * **Food & Dining:** ~24%
   * **Activities & Monuments:** ~15%
   * **Local Transit (Cabs/Auto):** ~8%
   * **Bazaar Shopping:** ~5%
   * **Miscellaneous:** ~3%
4. **Dynamic Custom Activity Balancing:** Adding or deleting custom activities in the itinerary automatically recalculates daily totals and updates the global trip budget.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# GEMINI_API_KEY: Required for Gemini AI itinerary generation
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: Base host URL (automatically provided in Cloud Run)
APP_URL="http://localhost:3000"
```

---

## 📦 Installation & Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/trippilot-ai.git
   cd trippilot-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env
   ```

---

## 🏃 Running the Application

### Development Mode
Runs Vite development server with proxy middleware on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Server
Compiles the TypeScript frontend and starts the Express production server:
```bash
npm run build
npm start
```

---

## 🧪 Testing & Verification

* **Type Checking & Linting:**
  ```bash
  npm run lint
  ```
* **Build Verification:**
  ```bash
  npm run build
  ```
* **End-to-End Functional Checks:**
  1. Open the landing page and click **"Plan a Trip"**.
  2. Test location detection or choose a quick city (e.g., Delhi).
  3. Pick a destination (e.g., Jaipur, Rajasthan).
  4. Complete the 4-step wizard and click **"Generate Master Plan"**.
  5. Inspect the Interactive Leaflet Map and compare transit modes.
  6. Add a custom activity to Day 2 and verify budget recalculation in ₹ INR.
  7. Toggle Dark/Light mode and confirm all elements retain contrast.

---

## 🚢 Deployment Instructions

### Deploy to Google Cloud Run
```bash
# Build production Docker container
docker build -t gcr.io/[PROJECT_ID]/trippilot-ai:latest .

# Deploy container
gcloud run deploy trippilot-ai \
  --image gcr.io/[PROJECT_ID]/trippilot-ai:latest \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_KEY"
```

### Deploy to Vercel / Netlify / Render
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Start Command:** `npm start`
* Configure `GEMINI_API_KEY` in your provider's environment settings.

---

## ❓ Troubleshooting & FAQs

#### Q1: Why are prices showing in INR (₹)?
TripPilot AI is configured to display Indian Rupees (`₹ / INR`) with standard Indian numbering (`₹1,500`, `₹25,000`, `₹1,25,000`) for realistic travel planning across India and international destinations.

#### Q2: What happens if GEMINI_API_KEY is not set?
The application gracefully falls back to its built-in intelligent itinerary engine. Users will still receive comprehensive, day-by-day plans, route calculations, and budget models without crashes.

#### Q3: Does the app track my GPS location?
No. Location permission is requested only once to identify your closest transit hub, strictly when you click "Use My Location". No continuous location tracking occurs.

---

## 👤 Author & Attribution

* **Developer:** Phinihas Gandi
* **Project:** TripPilot AI SaaS Web Application
* **License:** Apache-2.0
