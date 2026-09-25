import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate-itinerary', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const params = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ fallback: true, message: 'No GEMINI_API_KEY provided' }));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const prompt = `You are TripPilot AI, an elite Indian and international travel architect. Create a realistic, highly personalized, day-by-day travel itinerary in JSON format for this trip request.
IMPORTANT: All costs and budgets MUST be in Indian Rupees (INR - ₹) with realistic pricing for India and international destinations.

Starting Origin: ${params.startLocation || 'Delhi (NCR), India'}
Destination: ${params.destination}
Dates: ${params.startDate} to ${params.endDate} (${params.durationDays} days)
Number of Travelers: ${params.travelersCount}
Budget Tier: ${params.budgetTier} ${params.maxBudget ? `(User Target budget: ₹${params.maxBudget.toLocaleString('en-IN')})` : ''}
Travel Style: ${params.travelStyle}
Interests: ${(params.interests || []).join(', ')}
Accommodation Preference: ${params.accommodationPreference}
Food Preference: ${params.foodPreference}
Transport Preference: ${params.transportationPreference}
Additional Requirements: ${params.additionalRequirements || 'None'}

Key Geographic and Routing Instructions:
1. Day 1 MUST account for travel from the Starting Origin (${params.startLocation || 'Delhi'}) to ${params.destination}. Account for realistic travel time, recommended transit (flight, Vande Bharat/rail, or highway cab), arrival, hotel check-in, and lighter initial exploration.
2. Group and order attractions geographically each day so travelers visit places in logical proximity rather than wasting hours crossing back and forth across the city.
3. The final day should reserve time for souvenir shopping and return transit towards the Starting Origin.
4. Provide practical local travel tips including UPI payment advice, best visiting times, and attire guidelines.

Return ONLY valid JSON matching this schema:
{
  "title": "${params.durationDays}-Day ${params.travelStyle} Tour of ${params.destination}",
  "overview": {
    "summary": "Detailed 2-3 sentence overview of this trip tailored to their style and pace.",
    "recommendedStyle": "${params.travelStyle}",
    "weatherExpectation": "Seasonal weather guidance and attire recommendation.",
    "localCurrencyAdvice": "UPI payment tips (Google Pay/PhonePe/Paytm), cash notes advice, and card acceptance.",
    "highlights": ["Iconic Monument / Fort", "Authentic Culinary Experience", "Scenic Sunset Spot", "Cultural Experience"],
    "totalCost": 35000
  },
  "budgetBreakdown": {
    "flights": 10000,
    "accommodation": 12000,
    "food": 6000,
    "activities": 4000,
    "localTransport": 2000,
    "shopping": 1500,
    "miscellaneous": 1000,
    "total": 36500,
    "dailyAverage": 5200
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "${params.startDate}",
      "theme": "Arrival, Orientation & Sunset Aarti/View",
      "morning": [
        {
          "id": "act_d1_m1",
          "timeOfDay": "morning",
          "title": "Arrival & Check-in",
          "location": "${params.destination} Central Area",
          "description": "Arrive, unpack, refresh with hot beverage, and prepare for city exploration.",
          "durationMinutes": 90,
          "estimatedCost": 0,
          "category": "transit",
          "travelTip": "Keep electronic booking vouchers on phone."
        }
      ],
      "afternoon": [
        {
          "id": "act_d1_a1",
          "timeOfDay": "afternoon",
          "title": "Heritage Walking Tour & Regional Lunch",
          "location": "Historic Quarter",
          "description": "Familiarize yourself with neighborhood vibes, historic architecture, and local flavors.",
          "durationMinutes": 120,
          "estimatedCost": 800,
          "category": "culture",
          "travelTip": "Wear comfortable walking footwear."
        }
      ],
      "evening": [
        {
          "id": "act_d1_e1",
          "timeOfDay": "evening",
          "title": "Golden Hour Sunset & Royal Dinner",
          "location": "Panoramic Rooftop Bistro",
          "description": "Savor authentic regional dishes with ambient twilight views.",
          "durationMinutes": 120,
          "estimatedCost": 1500,
          "category": "food",
          "travelTip": "Book ahead if traveling on weekends."
        }
      ],
      "dayEstimatedCost": 2300,
      "practicalTips": ["Use UPI for cashless payments", "Stay hydrated with bottled water"],
      "recommendedTransport": "${params.transportationPreference || 'Private AC Cab / Rickshaw'}"
    }
  ]
}

Ensure all ${params.durationDays} days are generated with morning, afternoon, and evening activities with realistic costs in INR.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            });

            const responseText = response.text || '{}';
            const parsed = JSON.parse(responseText);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(parsed));
          } catch (err: any) {
            console.error('Gemini itinerary generation error:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Generation failed', fallback: true }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
