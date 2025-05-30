# AAC Location Cards - Project Overview

## 🎯 Project Description
An innovative React-based AAC (Augmentative and Alternative Communication) device that combines location services with AI-generated communication cards. Users can access location-specific communication options and personalized AAC cards based on nearby businesses.

## 🏗️ Core Architecture
- **Frontend**: React with Tailwind CSS, 6x4 grid layout for AAC cards
- **Location Services**: Browser geolocation + Google Maps/Places API integration
- **AI Integration**: OpenAI API for generating contextual AAC cards
- **Voice Support**: Text-to-speech for accessibility
- **Real Business Data**: Google Places API for authentic local business information

## ✨ Key Features
- **Location-Aware Communication**: Cards adapt to user's physical location
- **Real Business Integration**: Shows actual nearby businesses with photos and info
- **AI-Generated Content**: Contextual communication cards for each business type
- **Voice Output**: Speaks card text for enhanced accessibility
- **Demo Mode**: Toggle between real location and downtown Portland for presentations
- **Custom Photo Support**: Users can personalize cards with their own images

## 🎨 User Experience
1. **Main Board**: 6x4 grid with talk folders (I Want, I Need, etc.)
2. **✨ Button**: Opens location overlay with nearby business categories
3. **Business Folders**: Show emoji icons with real business categories
4. **AI Subfolders**: 4 communication categories per business (8 cards each)
5. **Photo Integration**: Real Google Places photos in business info cards
6. **Custom Demo**: Bella's Flowers folder showcases photo personalization

---

# Project Session Notes

## Latest Session - Business Photo Integration & Demo Mode

### 🖼️ Business Photo Integration
- **Fixed Google Places API photo extraction** - resolved `photo_reference` being undefined issue
- **Implemented photo display** in business info cards with real Google Places photos
- **Added cache-busting** to prevent photo URLs from expiring (token-based URLs)
- **Enhanced photo sizing** for custom folders (wider photos: `w-24 h-16` vs `w-12 h-12`)
- **Maintained emoji folder icons** while showing real photos in business details section

### 🌺 Custom Bella's Flowers Demo
- **Created mock flower shop** in 4th folder slot with photo support structure
- **Designed 4 subcategories**: Occasions, Flower Types, Services, Colors
- **Planned 32 custom photos** for full personalization demo
- **Updated folder styling** for photos without white background borders

### 🏙️ Demo Mode Feature
- **Added downtown Portland toggle** - checkbox in header for demo presentations
- **Smart location switching** - uses Portland coordinates (45.5152, -122.6784) when enabled
- **Real API data** - still calls Google Places API with Portland location for authentic results
- **Visual feedback** - shows active demo mode status with location indicator

### 🔧 Technical Improvements
- **Cache-busting URLs** with timestamp and business ID parameters
- **Enhanced photo error handling** with fallback to icons
- **Improved state management** for location switching
- **Debugging tools** added for photo URL generation troubleshooting

### 📝 Photo Requirements for Bella's Flowers
Ready for manual photo collection:
- 1 main folder photo (flower shop storefront)
- 4 subfolder photos (occasions, types, services, colors)
- 32 individual card photos (8 per subcategory)

### 🐛 Known Issues
- Portland demo mode photos sometimes unstable (cache-related)
- Working on more aggressive cache-busting solutions

---
*Last updated: Session with photo integration and demo mode*