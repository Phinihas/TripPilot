import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for AI itinerary generation in Indian Rupees (INR)
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const params = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({ fallback: true, message: 'No GEMINI_API_KEY provided' });
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

Return ONLY valid JSON with:
{
  "title": "${params.durationDays}-Day ${params.travelStyle} in ${params.destination}",
  "overview": {
    "summary": "...",
    "recommendedStyle": "${params.travelStyle}",
    "weatherExpectation": "...",
    "localCurrencyAdvice": "...",
    "highlights": ["..."],
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
      "theme": "Arrival & Welcome",
      "morning": [{ "id": "1", "timeOfDay": "morning", "title": "...", "location": "...", "description": "...", "durationMinutes": 90, "estimatedCost": 500, "category": "sightseeing", "travelTip": "..." }],
      "afternoon": [...],
      "evening": [...],
      "dayEstimatedCost": 2200,
      "practicalTips": ["..."],
      "recommendedTransport": "..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Server Gemini API error:', error);
    res.status(500).json({ error: error.message || 'Generation failed', fallback: true });
  }
});

// Serve frontend in production
app.use(express.static(path.join(process.cwd(), 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TripPilot AI server listening on port ${PORT}`);
});
