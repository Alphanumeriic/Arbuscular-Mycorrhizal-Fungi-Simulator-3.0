# README.md

## Overview

This is a full-stack TypeScript application called "MycoColonize" - an interactive 3D educational simulation of Arbuscular Mycorrhizal Fungi (AMF) and their symbiotic relationships with plant root systems. The application demonstrates the biological processes of fungal spore germination, hyphal growth, and nutrient exchange between fungi and plants.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Graphics**: React Three Fiber (@react-three/fiber) with Three.js for WebGL rendering
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state management
- **Build Tool**: Vite with React plugin and GLSL shader support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Development**: Hot module replacement via Vite middleware

### Project Structure
- `client/` - Frontend React application
- `server/` - Backend Express.js API
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files (Drizzle)

## Key Components

### 3D Simulation Engine
- **AMFSimulation**: Main simulation orchestrator managing the animation loop
- **Scene3D**: Environmental setup with soil layers and lighting
- **RootSystem**: 3D visualization of plant root networks
- **FungalNetwork**: Hyphal network rendering with dynamic growth
- **SporeSystem**: Instanced mesh rendering for fungal spores
- **NutrientFlow**: Particle system for visualizing nutrient exchange

### Educational Interface
- **SimulationControls**: Interactive controls for simulation parameters
- **EducationalPanel**: Contextual learning content about AMF biology
- **Interface**: Game-like controls with audio feedback

### Simulation Logic
- **Growth Algorithm**: Biological simulation of spore germination and hyphal development
- **Nutrient Exchange**: Modeling of phosphorus and carbon trading between organisms
- **Type System**: Comprehensive TypeScript interfaces for simulation entities

## Data Flow

### Simulation Loop
1. **Frame Update**: React Three Fiber's `useFrame` drives the animation loop
2. **State Management**: Zustand stores manage simulation state (spores, hyphae, roots, nutrients)
3. **Growth Processing**: Algorithms update entity positions and states based on biological rules
4. **Rendering**: Three.js renders the 3D scene with dynamic geometries and materials
5. **UI Synchronization**: React components reflect simulation state changes

### User Interactions
1. **Control Input**: UI controls modify simulation parameters
2. **State Updates**: Zustand actions update global simulation state
3. **Visual Feedback**: 3D scene and UI components respond to state changes
4. **Audio Feedback**: Sound effects provide user interaction feedback

## External Dependencies

### Core Libraries
- **Three.js Ecosystem**: @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **UI Framework**: Complete Radix UI component suite with shadcn/ui customizations
- **Database**: Drizzle ORM with Neon PostgreSQL adapter
- **State Management**: Zustand with middleware for subscriptions
- **Query Management**: TanStack React Query for server state

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development with HMR and optimized builds
- **ESBuild**: Backend bundling for production
- **PostCSS**: CSS processing with Tailwind

### Educational Features
- **Font Loading**: Inter font with @fontsource integration
- **Asset Management**: GLTF/GLB model support and audio file handling
- **Responsive Design**: Mobile-friendly responsive layouts

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Production Configuration
- **Environment Variables**: DATABASE_URL for PostgreSQL connection
- **Static Assets**: Express serves built frontend from dist/public
- **API Routes**: All backend routes prefixed with `/api`

### Development Workflow
- **Hot Reloading**: Vite middleware provides instant frontend updates
- **Database Development**: `db:push` command synchronizes schema changes
- **Type Safety**: Shared schema ensures frontend/backend type consistency

The application emphasizes educational value by making complex biological processes visually accessible through interactive 3D simulation, while maintaining scientific accuracy in the underlying biological models.
