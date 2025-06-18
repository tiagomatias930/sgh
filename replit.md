# Hospital Pediátrico de Luanda - Website and Content Management System

## Overview

This is a full-stack web application for Hospital Pediátrico de Luanda (Luanda Pediatric Hospital), featuring a public-facing website with a content management system for hospital news and updates. The application is built with a modern React frontend and Express.js backend, using PostgreSQL for data storage and Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Authentication**: Simple session-based authentication for admin panel
- **Middleware**: Express session management with PostgreSQL session store

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Public Website Features
- **Landing Page**: Hospital information, services, and contact details
- **News Section**: Display of published hospital news and updates
- **Services Information**: Detailed information about hospital services
- **Contact Form**: Patient inquiry form (backend implementation pending)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Panel Features
- **Authentication**: Username/password login system
- **Content Management**: Create, edit, publish, and delete news posts
- **Rich Text Editor**: Custom markdown-based editor for post content
- **Media Management**: Image URL support for posts
- **Post Categories**: Categorization system (campanha, tecnologia, evento, noticia)
- **Draft/Published States**: Control over post visibility

### Shared Components
- **Schema Definitions**: Type-safe database schemas shared between frontend and backend
- **Type Safety**: Full TypeScript integration across the stack
- **Component Library**: Reusable UI components with consistent styling

## Data Flow

### Public Content Flow
1. Public users access the landing page
2. News content is fetched from `/api/posts` endpoint
3. Only published posts are displayed to public users
4. Individual posts accessible via `/api/posts/:id`

### Admin Content Flow
1. Admin authenticates via `/api/login` with username/password
2. Session-based authentication maintains admin state
3. Admin can access full CRUD operations via `/api/admin/posts`
4. Real-time updates to content via TanStack Query cache invalidation

### Authentication Flow
- Simple username/password authentication (admin/admin123)
- Session stored in PostgreSQL sessions table
- Session-based middleware protects admin routes
- Automatic logout functionality available

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI components, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: Neon PostgreSQL, Drizzle ORM
- **Authentication**: Express session, bcrypt for password hashing
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Database Tools**: Drizzle Kit for migrations and schema management
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit environment
- **Database**: PostgreSQL 16 module in Replit
- **Development Server**: Vite dev server with HMR
- **Port Configuration**: Development server on port 5000

### Production Build Process
1. Frontend build: `vite build` creates optimized static assets
2. Backend build: `esbuild` bundles server code for production
3. Static files served from `dist/public` directory
4. Production server runs compiled JavaScript from `dist/index.js`

### Production Configuration
- **Server**: Express serves both API and static files
- **Database**: PostgreSQL with connection pooling via Neon
- **Sessions**: PostgreSQL-backed session storage
- **Environment**: Production environment variables for database and sessions

### Replit Integration
- **Autoscale Deployment**: Configured for Replit's autoscale deployment target
- **Environment Modules**: nodejs-20, web, postgresql-16
- **Port Mapping**: Local port 5000 mapped to external port 80
- **Workflows**: Automated development workflow with parallel task execution

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Implementado sistema de dupla base de dados com Google Apps Script como principal
  - Adicionada classe GoogleAppsScriptStorage para integração com Google Apps Script
  - URL do Google Apps Script: https://script.google.com/macros/s/AKfycbxqNmSmyjrp-x50uWAtv48pwbmuG38vyyVjg1oP845qv9xlhZmmGwgy2TnxQesZHZ0WTw/exec
  - Variável USE_GOOGLE_SCRIPT=1 define Google Apps Script como base principal
  - Interface admin permite alternar entre PostgreSQL e Google Apps Script
  - Inicialização automática do banco de dados Google Apps Script com coleções users e posts
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```