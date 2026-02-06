# Project Nexus - Campus Super-App

A comprehensive, AI-powered campus management platform built for the AI Fusion Hackathon 2026. Project Nexus integrates all aspects of campus life into a unified, intelligent ecosystem.

## Live Demo

The application is ready to deploy and use immediately. Simply run `npm run dev` to start the development server.

## Features Overview

### Core Pillars (All Implemented)

#### 1. The Daily Pulse
Real-time campus information at your fingertips:
- **Live Mess Menu**: Daily meal displays with ratings and nutritional tracking
- **AI Mail Summarizer**: Automatically summarizes lengthy campus emails into actionable one-liners using NLP
  - Intelligent categorization (academic/events/urgent)
  - Priority scoring and sentiment analysis
  - Tag extraction and searchable archives
- **Campus Announcements**: Latest updates and emergency alerts
- **Real-time Notifications**: Stay informed about campus events

#### 2. The Student Exchange
Complete marketplace and collaboration hub:
- **Lost & Found**: Report and find missing items with smart matching
- **Buy/Sell Marketplace**: Trade textbooks, electronics, furniture, cycles
  - Category-based filtering
  - Price recommendations
  - User ratings and verification
- **Travel Sharing (Cab-Pool)**: Coordinate rides to common destinations
  - Cost-splitting calculator
  - Route optimization
  - Real-time passenger matching
  - Safety features

#### 3. The Explorer's Guide
Discover local ecosystem around campus:
- **Nearby Hub**: Curated directory of Rupnagar/Ropar attractions, eateries, and hidden spots
  - AI-powered recommendations
  - User ratings and reviews
  - Vibe tags (study-friendly/date-spot/budget)
  - Category filtering (restaurants, cafes, attractions, shops)
- **Smart Discovery**: Personalized recommendations based on preferences

#### 4. The Academic Cockpit
Command center for academic success:
- **Live Timetable**: Customizable personal schedule with real-time updates
  - Multi-day views
  - Room locations
  - Conflict detection
- **LMS Lite**: Learning Management System
  - Assignment tracking
  - Grade viewing
  - Performance analytics
- **AI Academic Intelligence**:
  - Smart study schedule generator
  - Performance trend analysis
  - Personalized insights and recommendations
  - GPA calculator

## AI/ML Features (2+ Required)

### 1. Mail Summarizer (Primary AI Feature)
- **NLP-based email parsing** to extract key information
- **Automatic categorization** using keyword analysis
- **Priority scoring** based on content urgency
- **Tag extraction** for easy filtering
- **Sentiment analysis** for tone detection

### 2. Recommendation Engine (Secondary AI Feature)
- **Smart place recommendations** based on ratings and popularity
- **Personalized suggestions** using collaborative filtering
- **Study schedule optimization** based on assignment deadlines
- **Performance prediction** and trend analysis
- **Academic insights** from historical grade data

## Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend & Database
- **Supabase** (PostgreSQL)
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & Authorization

### Security Features
- Email/password authentication
- Row Level Security policies on all tables
- Secure data handling
- User role management

## Database Schema

The application uses a comprehensive database schema with the following tables:
- `profiles` - User information and roles
- `mess_menu` - Daily meal data
- `mail_summaries` - AI-processed email summaries
- `announcements` - Campus notifications
- `lost_found` - Lost and found items
- `marketplace` - Buy/sell listings
- `travel_sharing` - Ride-sharing trips
- `nearby_places` - Local attractions and businesses
- `place_reviews` - User reviews
- `courses` - Course information
- `timetable` - Class schedules
- `assignments` - Course assignments
- `grades` - Student grades

All tables have proper RLS policies ensuring data security and privacy.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Environment variables are pre-configured in `.env`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to the URL shown in the terminal

### Demo Accounts

You can create a new account using the sign-up form, or use the following test credentials if set up:
- Email: student@example.com
- Password: demo123

## Usage Guide

### First Time Setup
1. Register with your email and password
2. Complete your profile (name, department, year)
3. Start exploring the four core modules

### Daily Pulse
- Check today's mess menu
- Paste long emails to get AI-generated summaries
- View campus announcements

### Student Exchange
- Browse marketplace listings by category
- Report lost items or claim found items
- Create or join travel sharing trips

### Explorer's Guide
- Discover nearby restaurants, cafes, and attractions
- Filter by category and vibe tags
- Add new places and rate existing ones

### Academic Cockpit
- View your weekly timetable
- Track assignment deadlines
- Check grades and performance analytics

## Key Differentiators

1. **AI Integration**: Not just decorative - AI powers real functionality like email summarization and smart recommendations
2. **Unified Experience**: All campus services in one place with consistent design
3. **Real-time Updates**: Live data synchronization across all modules
4. **Security First**: Comprehensive RLS policies protecting user data
5. **Mobile Responsive**: Works seamlessly on all device sizes
6. **Professional Design**: Production-ready UI with modern aesthetics

## Innovation Highlights

- **Cross-module Intelligence**: Data from one module informs others (e.g., timetable data can suggest study locations)
- **Predictive Analytics**: AI predicts assignment workload and suggests optimal study schedules
- **Smart Matching**: Lost & found items use intelligent matching algorithms
- **Personalization**: Recommendations adapt to user behavior and preferences
- **Community-Driven**: User ratings and reviews create a collaborative ecosystem

## Architecture

The application follows a modular architecture:
- `/src/components/modules/` - Core feature modules
- `/src/contexts/` - React contexts for state management
- `/src/lib/` - Utility functions and Supabase client
- `/src/components/` - Reusable UI components

Each module is self-contained with its own state management and database interactions.

## Deployment

Build for production:
```bash
npm run build
```

The optimized build will be in the `dist/` folder, ready for deployment to any static hosting service.

## Future Enhancements

- Push notifications for important updates
- Mobile app using React Native
- Integration with campus ERP systems
- Advanced analytics dashboard
- Voice-based navigation
- AR campus navigation
- Social features (student networking, clubs)
- Wellness tracking
- IoT device integration

## Support

For any issues or questions, please contact the development team or create an issue in the repository.

## License

Built for AI Fusion Hackathon 2026 - IIT Ropar

---

**Project Nexus** - Where AI meets everyday campus life. Think beyond features. Build an ecosystem.
