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
1. Create exactly 6 subfolders that are ULTRA-SPECIFIC to ${category} businesses
2. NEVER use these generic names: "Basic Needs", "Social", "Feelings", "Actions", "Questions", "Food & Drink", "Places"
3. Focus on BUSINESS-SPECIFIC activities, products, services, and interactions ONLY
4. Each folder name must be something you can ONLY do at a ${category} business

REQUIRED: All 6 folders must be ${category}-specific like:
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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert AAC specialist creating business-specific communication cards. You understand that users already have generic AAC folders like "Basic Needs", "Social", "Feelings" etc. Your job is to create ONLY ultra-specific folders that are unique to the business type. Think like a customer inside that specific business - what would they need to communicate that's unique to THAT business only? Always respond with valid JSON only.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 1500
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
      },
      {
        name: "Questions",
        icon: "❓",
        description: "Common questions",
        cards: [
          { text: "Where is this?", symbol: "📍" },
          { text: "What time?", symbol: "🕐" },
          { text: "How much?", symbol: "💰" },
          { text: "Do you have?", symbol: "❓" },
          { text: "Can I get?", symbol: "🙋" },
          { text: "Is this available?", symbol: "✅" },
          { text: "When do you close?", symbol: "🚪" },
          { text: "Where do I pay?", symbol: "💳" },
          { text: "Can you help?", symbol: "🤝" },
          { text: "What is this?", symbol: "🤔" },
          { text: "How does this work?", symbol: "⚙️" },
          { text: "Is this the right size?", symbol: "📏" },
          { text: "Do you recommend this?", symbol: "👍" },
          { text: "Can I try this?", symbol: "🔍" },
          { text: "Is this on sale?", symbol: "🏷️" },
          { text: "When will this be ready?", symbol: "⏰" },
          { text: "Can I order this?", symbol: "📋" },
          { text: "Do you deliver?", symbol: "🚛" }
        ]
      },
      {
        name: "Shopping",
        icon: "🛒",
        description: "Shopping activities",
        cards: [
          { text: "I want to buy this", symbol: "🛒" },
          { text: "I'm just looking", symbol: "👁️" },
          { text: "I'll take this", symbol: "✅" },
          { text: "Can I see that?", symbol: "👀" },
          { text: "I need this size", symbol: "📏" },
          { text: "Do you have more colors?", symbol: "🌈" },
          { text: "I'll think about it", symbol: "🤔" },
          { text: "Can I get a bag?", symbol: "🛍️" },
          { text: "Is this the best price?", symbol: "💰" },
          { text: "I have a coupon", symbol: "🎫" },
          { text: "Can I return this?", symbol: "↩️" },
          { text: "I need a receipt", symbol: "🧾" },
          { text: "Do you price match?", symbol: "🏷️" },
          { text: "I'm comparing prices", symbol: "⚖️" },
          { text: "Is this item new?", symbol: "✨" },
          { text: "When did this arrive?", symbol: "📅" },
          { text: "Is this popular?", symbol: "⭐" },
          { text: "I'll come back", symbol: "🔄" }
        ]
      },
      {
        name: "Payment",
        icon: "💳",
        description: "Payment and checkout",
        cards: [
          { text: "I'll pay with card", symbol: "💳" },
          { text: "I'll pay with cash", symbol: "💵" },
          { text: "Can I pay with phone?", symbol: "📱" },
          { text: "Do you take checks?", symbol: "📄" },
          { text: "I need change", symbol: "💰" },
          { text: "Keep the change", symbol: "🙏" },
          { text: "Can I get a receipt?", symbol: "🧾" },
          { text: "I need an itemized receipt", symbol: "📋" },
          { text: "Can I email the receipt?", symbol: "📧" },
          { text: "I have a gift card", symbol: "🎁" },
          { text: "Can I split payment?", symbol: "✂️" },
          { text: "Is there tax?", symbol: "📊" },
          { text: "What's the total?", symbol: "🧮" },
          { text: "Can I pay later?", symbol: "⏰" },
          { text: "Do you have layaway?", symbol: "📦" },
          { text: "I need to cancel", symbol: "❌" },
          { text: "Can I get a refund?", symbol: "💸" },
          { text: "Is this final sale?", symbol: "🔒" }
        ]
      },
      {
        name: "Services",
        icon: "🔧",
        description: "Services and assistance",
        cards: [
          { text: "I need assistance", symbol: "🙋" },
          { text: "Can you show me?", symbol: "👉" },
          { text: "Can you explain this?", symbol: "💬" },
          { text: "I need directions", symbol: "🗺️" },
          { text: "Where is customer service?", symbol: "🏪" },
          { text: "Can you check the back?", symbol: "📦" },
          { text: "Can you order this?", symbol: "📋" },
          { text: "When will it arrive?", symbol: "📅" },
          { text: "Can you call me?", symbol: "📞" },
          { text: "I have a complaint", symbol: "😤" },
          { text: "I have a compliment", symbol: "😊" },
          { text: "Can you gift wrap?", symbol: "🎁" },
          { text: "Do you deliver?", symbol: "🚛" },
          { text: "Can you install this?", symbol: "🔧" },
          { text: "Do you repair?", symbol: "🛠️" },
          { text: "I need a warranty", symbol: "🛡️" },
          { text: "Can you recommend?", symbol: "💡" },
          { text: "Thank you for your help", symbol: "🙏" }
        ]
      },
      {
        name: "Social",
        icon: "👋",
        description: "Social interactions",
        cards: [
          { text: "Good morning", symbol: "🌅" },
          { text: "Good afternoon", symbol: "☀️" },
          { text: "Good evening", symbol: "🌆" },
          { text: "How are you?", symbol: "😊" },
          { text: "Nice weather today", symbol: "🌤️" },
          { text: "Thank you", symbol: "🙏" },
          { text: "You're welcome", symbol: "😊" },
          { text: "Excuse me", symbol: "🙋" },
          { text: "I'm sorry", symbol: "😔" },
          { text: "No problem", symbol: "👌" },
          { text: "Have a good day", symbol: "😊" },
          { text: "See you later", symbol: "👋" },
          { text: "Take care", symbol: "💙" },
          { text: "Nice to meet you", symbol: "🤝" },
          { text: "I appreciate your help", symbol: "🙏" },
          { text: "You've been very helpful", symbol: "⭐" },
          { text: "This place is nice", symbol: "👍" },
          { text: "I'll recommend this place", symbol: "💬" }
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