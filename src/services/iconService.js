import React from 'react';

// Lucide Icons (Primary - Tier 1)
import { 
  ShoppingCart, 
  Coffee, 
  Flower2, 
  Pill, 
  Scissors, 
  BookOpen, 
  UtensilsCrossed, 
  Fuel, 
  Building2, 
  Home, 
  Truck, 
  Warehouse,
  // AAC Card icons
  Hand,
  Heart,
  Smile,
  DollarSign,
  Receipt,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Star,
  ThumbsUp,
  MessageCircle,
  Camera,
  Settings,
  Search,
  HelpCircle,
  Info,
  AlertCircle,
  Calendar,
  Utensils,
  Droplets,
  Apple,
  Package,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  PersonStanding
} from 'lucide-react';

// Heroicons (Secondary - Tier 2)
import { 
  ShoppingBagIcon,
  BeakerIcon,
  ScissorsIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  HomeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

// Phosphor Icons (Tertiary - Tier 3)
import { 
  ShoppingCart as PhosphorCart,
  Coffee as PhosphorCoffee,
  Flower as PhosphorFlower,
  Pill as PhosphorPill,
  Scissors as PhosphorScissors,
  Book as PhosphorBook,
  ForkKnife as PhosphorRestaurant,
  GasPump as PhosphorGas,
  Buildings as PhosphorBuilding,
  House as PhosphorHouse,
  Truck as PhosphorTruck,
  Warehouse as PhosphorWarehouse
} from '@phosphor-icons/react';

// Tabler Icons (Quaternary - Tier 4)
import { 
  IconShoppingCart as TablerCart,
  IconCoffee as TablerCoffee,
  IconFlower as TablerFlower,
  IconPill as TablerPill,
  IconScissors as TablerScissors,
  IconBook as TablerBook,
  IconToolsKitchen2 as TablerRestaurant,
  IconGasStation as TablerGas,
  IconBuilding as TablerBuilding,
  IconHome as TablerHome,
  IconTruck as TablerTruck,
  IconBuildings as TablerWarehouse
} from '@tabler/icons-react';

// The ULTIMATE 4-tier fallback icon mapping
const iconMappings = {
  'Grocery': {
    tier1: ShoppingCart,
    tier2: ShoppingBagIcon,
    tier3: PhosphorCart,
    tier4: TablerCart,
    emoji: '🛒'
  },
  'Coffee Shop': {
    tier1: Coffee,
    tier2: BeakerIcon, // Close enough!
    tier3: PhosphorCoffee,
    tier4: TablerCoffee,
    emoji: '☕'
  },
  'Florist': {
    tier1: Flower2,
    tier2: HomeIcon, // Heroicons doesn't have flower, use home as placeholder
    tier3: PhosphorFlower,
    tier4: TablerFlower,
    emoji: '🌸'
  },
  'Pharmacy': {
    tier1: Pill,
    tier2: BeakerIcon,
    tier3: PhosphorPill,
    tier4: TablerPill,
    emoji: '💊'
  },
  'Barber': {
    tier1: Scissors,
    tier2: ScissorsIcon,
    tier3: PhosphorScissors,
    tier4: TablerScissors,
    emoji: '✂️'
  },
  'Bookstore': {
    tier1: BookOpen,
    tier2: BookOpenIcon,
    tier3: PhosphorBook,
    tier4: TablerBook,
    emoji: '📚'
  },
  'Restaurant': {
    tier1: UtensilsCrossed,
    tier2: HomeIcon, // Heroicons limitation
    tier3: PhosphorRestaurant,
    tier4: TablerRestaurant,
    emoji: '🍽️'
  },
  'Gas Station': {
    tier1: Fuel,
    tier2: TruckIcon, // Close enough
    tier3: PhosphorGas,
    tier4: TablerGas,
    emoji: '⛽'
  },
  'Bank': {
    tier1: Building2,
    tier2: BuildingOfficeIcon,
    tier3: PhosphorBuilding,
    tier4: TablerBuilding,
    emoji: '🏦'
  },
  'Real Estate': {
    tier1: Home,
    tier2: HomeIcon,
    tier3: PhosphorHouse,
    tier4: TablerHome,
    emoji: '🏘️'
  },
  'Moving & Storage': {
    tier1: Truck,
    tier2: TruckIcon,
    tier3: PhosphorTruck,
    tier4: TablerTruck,
    emoji: '📦'
  },
  'Storage': {
    tier1: Warehouse,
    tier2: BuildingOfficeIcon,
    tier3: PhosphorWarehouse,
    tier4: TablerWarehouse,
    emoji: '🏪'
  }
};

// Icon selection strategies
export const ICON_STRATEGIES = {
  TIER_1_ONLY: 'tier1',
  TIER_1_AND_2: 'tier1-tier2',
  ALL_TIERS: 'all-tiers',
  RANDOM_TIER: 'random',
  EMOJI_FALLBACK: 'emoji'
};

// The LEGENDARY icon getter with multiple strategies
export const getBusinessIcon = (category, strategy = ICON_STRATEGIES.ALL_TIERS, size = 24) => {
  const mapping = iconMappings[category];
  
  if (!mapping) {
    return React.createElement('span', { 
      className: "text-2xl",
      role: "img",
      "aria-label": category 
    }, '🏪');
  }

  // Strategy: Random tier selection (for fun!)
  if (strategy === ICON_STRATEGIES.RANDOM_TIER) {
    const tiers = ['tier1', 'tier2', 'tier3', 'tier4'];
    const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
    strategy = randomTier;
  }

  // Strategy: Emoji fallback
  if (strategy === ICON_STRATEGIES.EMOJI_FALLBACK) {
    return React.createElement('span', { 
      className: "text-4xl",
      role: "img",
      "aria-label": category 
    }, mapping.emoji);
  }

  // Strategy: Try specific tier
  if (strategy.startsWith('tier')) {
    const IconComponent = mapping[strategy];
    if (IconComponent) {
      return React.createElement(IconComponent, { 
        size: size,
        className: "w-12 h-12 text-gray-700"
      });
    }
  }

  // Strategy: Cascading fallback through all tiers
  const tierPriority = ['tier1', 'tier2', 'tier3', 'tier4'];
  
  // Determine which tiers to try based on strategy
  let tiersToTry = tierPriority;
  if (strategy === ICON_STRATEGIES.TIER_1_ONLY) {
    tiersToTry = ['tier1'];
  } else if (strategy === ICON_STRATEGIES.TIER_1_AND_2) {
    tiersToTry = ['tier1', 'tier2'];
  }

  // Try each tier in order
  for (const tier of tiersToTry) {
    const IconComponent = mapping[tier];
    if (IconComponent) {
      try {
        return React.createElement(IconComponent, { 
          size: size,
          className: "w-12 h-12 text-gray-700"
        });
      } catch (error) {
        console.warn(`Failed to render ${tier} icon for ${category}:`, error);
        continue;
      }
    }
  }

  // Ultimate fallback: emoji
  return React.createElement('span', { 
    className: "text-4xl",
    role: "img",
    "aria-label": category 
  }, mapping.emoji);
};

// Debug function to test all tiers for a category
export const getAllIconsForCategory = (category) => {
  const mapping = iconMappings[category];
  if (!mapping) return null;

  return {
    tier1: mapping.tier1 ? getBusinessIcon(category, 'tier1') : null,
    tier2: mapping.tier2 ? getBusinessIcon(category, 'tier2') : null,
    tier3: mapping.tier3 ? getBusinessIcon(category, 'tier3') : null,
    tier4: mapping.tier4 ? getBusinessIcon(category, 'tier4') : null,
    emoji: mapping.emoji
  };
};

// Get available strategies for a category
export const getAvailableStrategies = (category) => {
  const mapping = iconMappings[category];
  if (!mapping) return [];

  const available = [];
  if (mapping.tier1) available.push('tier1');
  if (mapping.tier2) available.push('tier2');
  if (mapping.tier3) available.push('tier3');
  if (mapping.tier4) available.push('tier4');
  available.push('emoji');

  return available;
};

// Smart text-to-icon mapping for AAC cards
const textToIconMap = {
  // Greetings & Social
  'hello': Hand,
  'hi': Hand,
  'goodbye': Hand,
  'bye': Hand,
  'thank you': Heart,
  'thanks': Heart,
  'please': Hand,
  'sorry': Heart,
  'help': Hand,
  'yes': CheckCircle,
  'no': XCircle,
  'good': ThumbsUp,
  'bad': XCircle,
  'happy': Smile,
  'sad': Heart,
  
  // Money & Shopping
  'money': DollarSign,
  'cost': DollarSign,
  'price': DollarSign,
  'pay': CreditCard,
  'card': CreditCard,
  'cash': DollarSign,
  'receipt': Receipt,
  'buy': ShoppingCart,
  'shopping': ShoppingCart,
  
  // Location & Time
  'where': MapPin,
  'time': Clock,
  'when': Clock,
  'here': MapPin,
  'there': MapPin,
  'go': ArrowRight,
  'come': ArrowRight,
  
  // Food & Drink
  'food': Utensils,
  'eat': Utensils,
  'drink': Coffee,
  'water': Droplets,
  'milk': Droplets,
  'hungry': Utensils,
  'thirsty': Droplets,
  'bread': Package,
  'apple': Apple,
  
  // People & Communication
  'people': Users,
  'person': User,
  'call': Phone,
  'phone': Phone,
  'talk': MessageCircle,
  'speak': MessageCircle,
  'message': MessageCircle,
  
  // Actions
  'look': Search,
  'see': Search,
  'find': Search,
  'take': Hand,
  'give': Hand,
  'get': Hand,
  'need': Hand,
  'want': Heart,
  'like': Heart,
  'love': Heart,
  
  // Transportation
  'car': Car,
  'drive': Car,
  'walk': PersonStanding,
  'bus': Bus,
  'train': Train,
  'plane': Plane,
  'bike': Bike,
  
  // Questions & Help
  'what': HelpCircle,
  'how': HelpCircle,
  'why': HelpCircle,
  'who': User,
  'question': HelpCircle,
  'info': Info,
  'information': Info,
  
  // Time & Calendar
  'today': Calendar,
  'tomorrow': Calendar,
  'day': Calendar,
  'week': Calendar,
  'month': Calendar,
  'year': Calendar,
  
  // Feelings & States
  'good': Smile,
  'great': Star,
  'ok': CheckCircle,
  'fine': CheckCircle,
  'tired': Heart,
  'sick': AlertCircle,
  'hurt': AlertCircle,
  'pain': AlertCircle
};

// Safe icon renderer with comprehensive error handling
const renderIconSafely = (IconComponent, size = 20, className = "w-5 h-5 text-gray-600") => {
  if (!IconComponent || typeof IconComponent !== 'function') {
    return null;
  }
  
  try {
    return React.createElement(IconComponent, { size, className });
  } catch (error) {
    console.warn(`Failed to render icon component:`, error);
    return null;
  }
};

// Dynamic icon validation - checks if icon actually exists
const validateIcon = (IconComponent) => {
  try {
    // Test if we can create a React element
    const testElement = React.createElement(IconComponent, { size: 16 });
    return testElement && typeof IconComponent === 'function';
  } catch (error) {
    return false;
  }
};

// Smart icon getter for AAC card text with robust fallback
export const getIconForText = (text, fallbackEmoji = '💬') => {
  if (!text) {
    return React.createElement('span', { 
      className: "text-2xl",
      role: "img" 
    }, fallbackEmoji);
  }

  const lowerText = text.toLowerCase();
  
  // Try to find exact word matches with validation
  for (const [keyword, IconComponent] of Object.entries(textToIconMap)) {
    if (lowerText.includes(keyword)) {
      // Validate the icon exists and can be rendered
      if (validateIcon(IconComponent)) {
        const iconElement = renderIconSafely(IconComponent, 20, "w-5 h-5 text-gray-600");
        if (iconElement) {
          return iconElement;
        }
      } else {
        console.warn(`Icon for keyword "${keyword}" is invalid or missing, skipping...`);
        // Remove invalid icon from map to prevent future attempts
        delete textToIconMap[keyword];
        continue;
      }
    }
  }

  // Smart emoji fallback - try to extract emoji from original symbol
  if (fallbackEmoji && fallbackEmoji !== '💬') {
    return React.createElement('span', { 
      className: "text-2xl",
      role: "img",
      "aria-label": text 
    }, fallbackEmoji);
  }

  // Ultimate fallback based on text content
  const ultimateFallback = getSmartEmojiFromText(text);
  return React.createElement('span', { 
    className: "text-2xl",
    role: "img",
    "aria-label": text 
  }, ultimateFallback);
};

// Smart emoji selection based on text analysis
const getSmartEmojiFromText = (text) => {
  const lowerText = text.toLowerCase();
  
  // Smart emoji mapping based on common patterns
  const emojiPatterns = {
    // Emotions
    'happy|joy|smile|glad': '😊',
    'sad|cry|tear': '😢', 
    'angry|mad|upset': '😠',
    'love|heart': '❤️',
    'thank|grateful': '🙏',
    
    // Actions
    'help|assist|support': '🙋',
    'buy|shop|purchase': '🛒',
    'eat|food|hungry': '🍽️',
    'drink|thirsty|water': '💧',
    'go|walk|move': '🚶',
    'call|phone': '📞',
    'see|look|watch': '👀',
    'hear|listen': '👂',
    
    // Objects
    'money|pay|cost|price': '💰',
    'car|drive': '🚗',
    'home|house': '🏠',
    'time|clock|when': '⏰',
    'where|location|place': '📍',
    'book|read': '📚',
    'medicine|pill|pharmacy': '💊',
    
    // Questions
    'what|how|why|who': '❓',
    'yes|ok|good|fine': '✅',
    'no|stop|bad': '❌'
  };
  
  for (const [pattern, emoji] of Object.entries(emojiPatterns)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(lowerText)) {
      return emoji;
    }
  }
  
  // Default fallback
  return '💬';
};

// Icon quality scorer (for future ChatGPT integration)
export const scoreIcon = (category, tier) => {
  const mapping = iconMappings[category];
  if (!mapping || !mapping[tier]) return 0;

  // Scoring logic - tier1 gets highest score, emoji gets lowest
  const scores = {
    tier1: 100, // Lucide - highest quality
    tier2: 85,  // Heroicons - very good
    tier3: 75,  // Phosphor - good
    tier4: 65,  // Tabler - decent
    emoji: 50   // Emoji - fallback
  };

  return scores[tier] || 0;
};