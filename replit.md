# replit.md

## Overview

This is a Laravel 10 web application with a React frontend using Inertia.js for seamless single-page application functionality. The project appears to be a property rental or real estate platform with multi-role support (admin, staff, landlord, tenant). It features property listings, bookings, user management, and transaction processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Framework
- **Laravel 10** - PHP MVC framework handling routing, authentication, database operations, and API endpoints
- **Laravel Sanctum** - Token-based API authentication with cookie-based session authentication for SPAs
- **Laravel Breeze** - Provides authentication scaffolding (login, registration, password reset)

### Frontend Architecture
- **React 18** with JSX - Component-based UI library
- **Inertia.js** - Bridges Laravel backend with React frontend, eliminating the need for a separate API layer
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vite** - Build tool and development server with hot module replacement

### Key Frontend Libraries
- **Framer Motion** - Animation library for React components
- **Lucide React & React Icons** - Icon libraries
- **Headless UI** - Unstyled accessible UI components
- **Ziggy** - Exposes Laravel routes to JavaScript for client-side route generation

### Application Structure
- **Role-based layouts**: AdminLayout, StaffLayout, SidebarLayout for different user types
- **Page components**: Dashboard, Properties, Bookings, Users management pages
- **Shared components**: PropertyCard, InputLabel, InputError, PrimaryButton

### Authentication Flow
- Axios configured with `withCredentials: true` for Sanctum cookie-based authentication
- Guest layout for unauthenticated pages (login, register, password reset)
- Protected routes using Inertia middleware

### Build Configuration
- Vite configured for Replit environment with custom HMR settings using `REPLIT_DEV_DOMAIN`
- Production builds output to `public/build/` directory
- PostCSS with Tailwind and Autoprefixer

## External Dependencies

### PHP Dependencies (Composer)
- **guzzlehttp/guzzle** - HTTP client for external API calls
- **inertiajs/inertia-laravel** - Server-side Inertia adapter
- **laravel/sanctum** - SPA authentication
- **tightenco/ziggy** - Laravel route sharing with JavaScript

### Database
- Uses Laravel Eloquent ORM with migrations
- Database configuration likely in `.env` (supports MySQL, PostgreSQL, SQLite)

### Development Tools
- **Laravel Pint** - PHP code style fixer
- **PHPUnit** - Testing framework
- **Faker** - Test data generation
- **Laravel Sail** - Docker development environment (optional)

### Frontend Build Tools
- Node.js with npm for package management
- Vite dev server runs on port 5173 with WebSocket HMR