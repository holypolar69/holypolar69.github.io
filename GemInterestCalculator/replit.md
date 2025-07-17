# EXP Interest Calculator

## Overview

This is a React-based web application that calculates gem earnings with EXP's 0.10% daily interest rate compounded hourly. The application features a game-like interface styled after Pet Simulator 99, with animated elements and a playful UI design.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 17, 2025
- Updated EXP logo to use actual branded image (rainbow skull design)
- Enhanced input fields with shorthand number support (1b = 1 billion, 1m = 1 million, 1k = 1 thousand)
- Improved input field styling with better contrast and focus states
- Removed "fellow gem collectors" text from Discord button
- Added "polar" credit at bottom in subtle styling
- Fixed port configuration and duplicate function name conflicts
- Added smooth scrolling to results section after calculation to improve user experience
- Changed time duration from hours to days for better usability
- Removed shorthand number support from time input (kept for gems only)
- Made input labels brighter for better visibility
- Removed auto-calculation feature - users must now click "Calculate My Gems!" button for results
- Redesigned layout for better mobile responsiveness and desktop visual appeal
- Centered layout with proper spacing and mobile-first design
- Improved button sizing and grid layout for time duration options
- Removed gem icon from input field to reduce visual clutter
- Fixed number formatting display positioning
- Enhanced smoothness with improved animations and transitions
- Added loading states and micro-interactions for better user feedback
- Improved button hover effects and card animations

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Animations**: Framer Motion for smooth, interactive animations
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with TanStack Query for server state
- **Type Safety**: Full TypeScript implementation across frontend and backend

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **API Design**: RESTful API with /api prefix
- **Development**: Hot reloading with Vite dev server integration

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations
└── components.json  # shadcn/ui configuration
```

## Key Components

### Frontend Components
- **Calculator Page**: Main interest calculation interface with time period selection
- **ExpLogo**: Animated EXP logo component with rainbow gradient
- **FloatingGems**: Decorative animated gem elements
- **UI Library**: Complete shadcn/ui component set (buttons, inputs, cards, etc.)
- **Sound System**: Web Audio API integration for interactive sound effects

### Backend Components
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Registration**: Centralized API route management
- **Vite Integration**: Development server with HMR support
- **Error Handling**: Centralized error handling middleware

### Database Schema
- **Users Table**: Basic user management with username/password
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Zod Validation**: Schema validation for API inputs

## Data Flow

1. **User Input**: User enters starting gem amount and selects time period
2. **Calculation**: Frontend calculates compound interest using formula: `Final = Gems × (1 + 0.001/24)^Hours`
3. **Animation**: Results are animated with progressive number counting
4. **Sound Feedback**: Audio cues provide interactive feedback
5. **State Management**: TanStack Query manages API state and caching

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database connection driver
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **@radix-ui/***: UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration tool
- **@replit/vite-plugin-***: Replit-specific development plugins

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Setup**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Session Configuration**: PostgreSQL-backed sessions for user management

### Scripts
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Push database schema changes

The application is designed as a single-page application with a game-like interface, focusing on user experience with smooth animations and interactive elements. The backend provides a foundation for future features like user accounts and data persistence.