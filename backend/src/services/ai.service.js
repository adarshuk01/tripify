const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const buildTripPrompt = (tripData) => {
  const {
    destination, startingLocation, numberOfPeople, travelMode,
    budget, duration, preferences, travelParty, lunchStop, dinnerStop
  } = tripData;
  const prefsText = preferences && preferences.length > 0 ? preferences.join(', ') : 'general sightseeing';
  const driveStops = (travelMode === 'Car' || travelMode === 'Bike')
    ? `\n- Starting location: ${startingLocation || 'Not specified'}\n- Preferred lunch stop: ${lunchStop || 'Any good restaurant'}\n- Preferred dinner stop: ${dinnerStop || 'Any good restaurant'}`
    : '';

  const enc = encodeURIComponent;

  return `You are an expert travel planner specialising in Indian and international travel. Generate a detailed, realistic ${duration}-day travel itinerary.

TRIP DETAILS:
- Destination: ${destination}
- Travel party: ${travelParty} (${numberOfPeople} people)
- Travel mode: ${travelMode}
- Budget level: ${budget}
- Duration: ${duration} days
- Preferences/interests: ${prefsText}${driveStops}

IMPORTANT CURRENCY RULES:
- ALL costs, prices, and budgets MUST be shown in Indian Rupees (₹) only — never use USD ($).
- Example cost formats: "₹500–1,000 per person", "₹2,500/night", "₹150–300"
- Be realistic for the ${budget} budget category in Indian context.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "destination": "${destination}",
  "summary": "2-3 sentence overview",
  "totalEstimatedCost": "₹XX,XXX estimated for ${numberOfPeople} people for ${duration} days",
  "bestTimeToVisit": "best season/months",
  "travelTips": ["tip1", "tip2", "tip3"],
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "place": "Exact place name",
          "description": "Brief description",
          "time": "9:00 AM",
          "duration": "1-2 hours",
          "cost": "₹200-500 per person",
          "mapsLink": "https://www.google.com/maps/search/?api=1&query=${enc(destination)}+Place+Name",
          "imageQuery": "place name ${destination} photography",
          "type": "sightseeing"
        }
      ],
      "foodStops": [
        {
          "name": "Restaurant name",
          "cuisine": "Local/South Indian/etc",
          "type": "Breakfast",
          "priceRange": "₹150-400 per person",
          "mapsLink": "https://www.google.com/maps/search/?api=1&query=Restaurant+Name+${enc(destination)}",
          "imageQuery": "restaurant name ${destination} food"
        }
      ],
      "hotel": {
        "name": "Hotel name",
        "price": "₹X,XXX per night",
        "rating": "4.5",
        "description": "Brief description",
        "mapsLink": "https://www.google.com/maps/search/?api=1&query=Hotel+Name+${enc(destination)}",
        "amenities": ["WiFi", "Pool", "Restaurant"],
        "imageQuery": "hotel name ${destination} exterior"
      }
    }
  ]
}

Generate exactly ${duration} days. Be specific and realistic for ${destination} with ${budget} budget. Use real place names in ${destination}. ALL monetary values in Indian Rupees (₹).`;
};

const generateItinerary = async (tripData) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

  const prompt = buildTripPrompt(tripData);

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner. Always respond with valid JSON only, no markdown, no code blocks, just pure JSON. Use Indian Rupees (₹) for ALL costs and prices.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 60000,
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from AI');

    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    if (err.response) {
      throw new Error(`GROQ API error: ${err.response.data?.error?.message || err.response.statusText}`);
    }
    if (err instanceof SyntaxError) {
      throw new Error('Failed to parse AI response as JSON');
    }
    throw err;
  }
};

module.exports = { generateItinerary };
