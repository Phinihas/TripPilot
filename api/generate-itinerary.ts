import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const params = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ fallback: true, message: 'No GEMINI_API_KEY configured' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are TripPilot AI, a master Indian and global travel architect. Generate a realistic, day-by-day travel itinerary in JSON format:
IMPORTANT: All costs and budgets MUST be in Indian Rupees (INR - ₹).
Starting Origin: ${params.startLocation || 'Delhi (NCR), India'}
Destination: ${params.destination}
Dates: ${params.startDate} to ${params.endDate} (${params.durationDays} days)
Number of Travelers: ${params.travelersCount}
Budget Tier: ${params.budgetTier} ${params.maxBudget ? `(User Target budget: ₹${params.maxBudget.toLocaleString('en-IN')})` : ''}
Travel Style: ${params.travelStyle}
Interests: ${(params.interests || []).join(', ')}
Accommodation: ${params.accommodationPreference}
Food: ${params.foodPreference}
Transport: ${params.transportationPreference}
Additional Requirements: ${params.additionalRequirements || 'None'}

Key Geographic and Routing Instructions:
1. Day 1 MUST account for travel from Starting Origin (${params.startLocation || 'Delhi'}) to ${params.destination}. Account for realistic transit time, arrival check-in, and light orientation.
2. Group attractions geographically each day so places close to each other are visited sequentially.
3. Final day should account for souvenir shopping and return transit towards the Starting Origin.

Return ONLY valid JSON matching this schema:
{
  "title": "${params.durationDays}-Day ${params.travelStyle} in ${params.destination}",
  "overview": {
    "summary": "Detailed, enticing summary of the trip experience...",
    "recommendedStyle": "${params.travelStyle}",
    "weatherExpectation": "Current seasonal weather expectations",
    "localCurrencyAdvice": "Practical tips on UPI payments and cash needs in INR (₹)",
    "highlights": ["Landmark 1", "Landmark 2", "Landmark 3", "Landmark 4"],
    "totalCost": 45000
  },
  "budgetBreakdown": {
    "flights": 10000,
    "accommodation": 15000,
    "food": 8000,
    "activities": 5000,
    "localTransport": 3500,
    "shopping": 2000,
    "miscellaneous": 1500,
    "total": 45000,
    "dailyAverage": 7500
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "${params.startDate}",
      "theme": "Arrival from ${params.startLocation || 'Origin'} & Welcome to ${params.destination}",
      "morning": [
        {
          "id": "act_d1_m1",
          "timeOfDay": "morning",
          "title": "Transit to ${params.destination} & Check-in",
          "location": "${params.destination} Central Area",
          "description": "Travel from ${params.startLocation || 'Origin'} via ${params.transportationPreference}. Arrive, check into your stay, and freshen up with masala chai.",
          "durationMinutes": 180,
          "estimatedCost": 0,
          "category": "transit",
          "travelTip": "Keep ID proofs ready for hotel check-in."
        }
      ],
      "afternoon": [
        {
          "id": "act_d1_a1",
          "timeOfDay": "afternoon",
          "title": "Local Lunch & Orientation Stroll",
          "location": "Old City Bazaars",
          "description": "Sample authentic local dishes and take a leisurely walk around the historic quarter.",
          "durationMinutes": 120,
          "estimatedCost": 750,
          "category": "food",
          "travelTip": "Try local specialties recommended by the chef."
        }
      ],
      "evening": [
        {
          "id": "act_d1_e1",
          "timeOfDay": "evening",
          "title": "Sunset View & Welcome Dinner",
          "location": "City Viewpoint",
          "description": "Enjoy the golden hour glow over the skyline followed by an atmospheric traditional dinner.",
          "durationMinutes": 120,
          "estimatedCost": 1200,
          "category": "dining",
          "travelTip": "Arrive 30 minutes before sunset for the best photo spots."
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(200).json({ fallback: true });
    }

    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Gemini Vercel API generation error:', error);
    return res.status(200).json({ fallback: true, error: error.message });
  }
}
