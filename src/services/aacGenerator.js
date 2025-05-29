import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

const generateAACPrompt = (businessName, category, address) => {
  let examples = '';
  
  if (category === 'Coffee Shop') {
    examples = '- "Espresso Drinks", "Milk Alternatives", "Pastry Selection", "Temperature Preferences", "Coffee Bean Types", "Brew Methods"';
  } else if (category === 'Florist') {
    examples = '- "Wedding Flowers", "Funeral Arrangements", "Seasonal Blooms", "Vase Styles", "Delivery Instructions", "Flower Preservation"';
  } else if (category === 'Pharmacy') {
    examples = '- "Prescription Pickup", "Dosage Questions", "Side Effects", "Insurance Coverage", "Medication Timing", "Health Monitoring"';
  } else if (category === 'Grocery') {
    examples = '- "Fresh Produce", "Meat Counter", "Bakery Items", "Frozen Foods", "Organic Options", "Store Brand Products"';
  } else if (category === 'Barber') {
    examples = '- "Haircut Lengths", "Beard Trimming", "Hair Washing", "Styling Products", "Appointment Booking", "Special Occasions"';
  } else if (category === 'Bookstore') {
    examples = '- "Fiction Genres", "Non-Fiction Topics", "Children\'s Books", "Book Recommendations", "Special Orders", "Reading Events"';
  }

  return `You are creating AAC cards for "${businessName}" - a ${category} business.

CRITICAL RULES:
1. Create exactly 4 subfolders that are ULTRA-SPECIFIC to ${category} businesses
2. NEVER use these generic names: "Basic Needs", "Social", "Feelings", "Actions", "Questions", "Food & Drink", "Places"
3. Focus on BUSINESS-SPECIFIC activities, products, services, and interactions ONLY
4. Each folder name must be something you can ONLY do at a ${category} business

REQUIRED: All 4 folders must be ${category}-specific like:
${examples}

FORBIDDEN: Do NOT create any folder that could exist in a general AAC app. Every folder must be 100% specific to what happens inside a ${category}.

Example of GOOD ${category} folders: highly specific to the business operations, products, and services.
Example of BAD folders: anything generic like greetings, basic needs, emotions, etc.

Return JSON with exactly this structure:
{
  "subfolders": [
    {
      "name": "SPECIFIC NAME",
      "icon": "🔤", 
      "description": "Brief description",
      "cards": [{"text": "phrase", "symbol": "🔤"}]
    }
  ]
}

IMPORTANT: Each subfolder needs exactly 8 cards (not more, not less). Make them VERY specific to ${category} businesses.

CARD RULES:
- Exactly 4 cards should be single words (like "Turkey", "Help", "Fresh", "Receipt")
- Exactly 4 cards should be short phrases (like "I need help", "How much?", "Is this fresh?")
- Mix single words and phrases within each folder for variety`;
};

const parseAACResponse = (response) => {
  try {
    // Clean the response to handle potential formatting issues
    let cleanedResponse = response.trim();
    
    // Remove any markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to find the JSON object if response has extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    
    // Validate the structure
    if (!parsed.subfolders || !Array.isArray(parsed.subfolders)) {
      throw new Error('Invalid response format');
    }
    
    return parsed.subfolders;
  } catch (error) {
    console.error('Failed to parse AAC response:', error);
    console.error('Raw response:', response);
    return null;
  }
};

export const generateAACCards = async (businessName, category, address) => {
  try {
    console.log(`Generating AAC cards for ${businessName} (${category})`);
    
    const prompt = generateAACPrompt(businessName, category, address);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert AAC specialist creating business-specific communication cards. You understand that users already have generic AAC folders like "Basic Needs", "Social", "Feelings" etc. Your job is to create ONLY ultra-specific folders that are unique to the business type. Think like a customer inside that specific business - what would they need to communicate that's unique to THAT business only? CRITICAL: Always respond with valid JSON only. Do not include any explanatory text, markdown formatting, or code blocks. Return only the raw JSON object.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseContent = completion.choices[0].message.content;
    const subfolders = parseAACResponse(responseContent);
    
    if (!subfolders) {
      throw new Error('Failed to parse AAC cards from OpenAI response');
    }
    
    console.log(`Generated ${subfolders.length} subfolders for ${businessName}`);
    return subfolders;
    
  } catch (error) {
    console.error('Error generating AAC cards:', error);
    
    // Fallback to a basic structure if OpenAI fails
    return [
      {
        name: "Basic Communication",
        icon: "💬",
        description: "Essential communication",
        cards: [
          { text: "Hello", symbol: "👋" },
          { text: "Help", symbol: "🙋" },
          { text: "Thank you", symbol: "🙏" },
          { text: "How much?", symbol: "💰" },
          { text: "Receipt", symbol: "🧾" },
          { text: "Card", symbol: "💳" },
          { text: "Goodbye", symbol: "👋" },
          { text: "Perfect", symbol: "👍" }
        ]
      },
      {
        name: "Questions",
        icon: "❓",
        description: "Common questions",
        cards: [
          { text: "Where?", symbol: "📍" },
          { text: "When?", symbol: "🕐" },
          { text: "Do you have?", symbol: "❓" },
          { text: "Can I get?", symbol: "🙋" },
          { text: "Available?", symbol: "✅" },
          { text: "Fresh?", symbol: "🌿" },
          { text: "What time?", symbol: "🚪" },
          { text: "How much?", symbol: "💰" }
        ]
      },
      {
        name: "Shopping",
        icon: "🛒",
        description: "Shopping activities",
        cards: [
          { text: "Buy", symbol: "🛒" },
          { text: "Looking", symbol: "👁️" },
          { text: "I'll take this", symbol: "✅" },
          { text: "Can I see?", symbol: "👀" },
          { text: "Size", symbol: "📏" },
          { text: "Colors", symbol: "🌈" },
          { text: "Think about it", symbol: "🤔" },
          { text: "Bag", symbol: "🛍️" }
        ]
      },
      {
        name: "Payment",
        icon: "💳",
        description: "Payment and checkout",
        cards: [
          { text: "Card", symbol: "💳" },
          { text: "Cash", symbol: "💵" },
          { text: "Can I pay?", symbol: "📱" },
          { text: "Change", symbol: "💰" },
          { text: "Receipt", symbol: "🧾" },
          { text: "Total", symbol: "🧮" },
          { text: "Pay later?", symbol: "⏰" },
          { text: "Refund", symbol: "💸" }
        ]
      }
    ];
  }
};

// Cache for generated cards to avoid re-generating
const cardCache = new Map();

// Clear cache function for debugging
export const clearCache = () => {
  cardCache.clear();
  console.log('AAC card cache cleared');
};

export const getCachedOrGenerateCards = async (businessName, category, address) => {
  const cacheKey = `${businessName}-${category}-${address}`;
  
  if (cardCache.has(cacheKey)) {
    console.log(`Using cached cards for ${businessName}`);
    return cardCache.get(cacheKey);
  }
  
  const cards = await generateAACCards(businessName, category, address);
  cardCache.set(cacheKey, cards);
  
  return cards;
};