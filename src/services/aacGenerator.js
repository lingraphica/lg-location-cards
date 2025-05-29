import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

const generateAACPrompt = (businessName, category, address) => {
  return `You are creating AAC cards for "${businessName}" - a ${category} business.

CRITICAL: Create exactly 2 subfolders that are SPECIFIC to ${category} businesses.

For a ${category} business, create 2 subfolders like:
${category === 'Coffee Shop' ? '- "Ordering Drinks" and "Customization"' : ''}
${category === 'Florist' ? '- "Flower Types" and "Arrangements"' : ''}
${category === 'Pharmacy' ? '- "Prescriptions" and "Over-the-Counter"' : ''}
${category === 'Grocery' ? '- "Shopping Items" and "Store Help"' : ''}
${category === 'Barber' ? '- "Haircut Styles" and "Services"' : ''}
${category === 'Bookstore' ? '- "Book Types" and "Finding Books"' : ''}

DO NOT create generic folders!

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

IMPORTANT: Each subfolder needs exactly 18 cards (not more, not less). Make them VERY specific to ${category} businesses.`;
};

const parseAACResponse = (response) => {
  try {
    const parsed = JSON.parse(response);
    
    // Validate the structure
    if (!parsed.subfolders || !Array.isArray(parsed.subfolders)) {
      throw new Error('Invalid response format');
    }
    
    return parsed.subfolders;
  } catch (error) {
    console.error('Failed to parse AAC response:', error);
    return null;
  }
};

export const generateAACCards = async (businessName, category, address) => {
  try {
    console.log(`Generating AAC cards for ${businessName} (${category})`);
    
    const prompt = generateAACPrompt(businessName, category, address);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AAC communication expert. Always respond with valid JSON only. BE SPECIFIC TO THE BUSINESS TYPE."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
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
        name: "Basic Needs",
        icon: "💬",
        description: "Essential communication",
        cards: [
          { text: "Hello", symbol: "👋" },
          { text: "Thank you", symbol: "🙏" },
          { text: "I need help", symbol: "🙋" },
          { text: "How much does this cost?", symbol: "💰" },
          { text: "Where is the bathroom?", symbol: "🚻" },
          { text: "Can you help me?", symbol: "❓" },
          { text: "What time do you close?", symbol: "🕐" },
          { text: "Can I pay with card?", symbol: "💳" },
          { text: "Can I get a receipt?", symbol: "🧾" },
          { text: "Goodbye", symbol: "👋" },
          { text: "I'm looking for something", symbol: "👀" },
          { text: "Do you have this?", symbol: "📦" },
          { text: "I want to buy this", symbol: "🛒" },
          { text: "Is this available?", symbol: "✅" },
          { text: "I'll come back later", symbol: "↩️" },
          { text: "That's perfect", symbol: "👍" },
          { text: "I'm just looking", symbol: "👁️" },
          { text: "Have a good day", symbol: "😊" }
        ]
      }
    ];
  }
};

// Cache for generated cards to avoid re-generating
const cardCache = new Map();

export const getCachedOrGenerateCards = async (businessName, category, address) => {
  const cacheKey = `${businessName}-${category}`;
  
  if (cardCache.has(cacheKey)) {
    console.log(`Using cached cards for ${businessName}`);
    return cardCache.get(cacheKey);
  }
  
  const cards = await generateAACCards(businessName, category, address);
  cardCache.set(cacheKey, cards);
  
  return cards;
};