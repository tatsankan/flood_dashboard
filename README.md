# FloodPulse PRO

FloodPulse PRO is a frontend prototype for a flood risk assessment dashboard aimed at insurance analysts and underwriters. It visualizes property-level flood exposure across Thai regions, combines map-based exploration with portfolio summaries, and presents generated ML-style risk outputs in a compact operational UI.

The project uses fully generated client-side data. There is no backend service or real ML pipeline in this repository.

## What the project does

- Displays flood-risk properties on an interactive Leaflet map
- Lets users switch between supported Thai regions
- Provides KPI summaries and regional stats for the selected portfolio
- Supports property filtering, browsing, and detail inspection in a sidebar
- Shows flood depth, damage, explainability, and sensor-style status data
- Includes a chatbot-style panel for guided interactions

## Main features

- Interactive property markers with risk-based visual encoding
- Region-level navigation for Bangkok, Songkhla, Ayutthaya, Chiang Mai, Nakhon Ratchasima, and Samut Prakan
- Deterministic fake data generation so the same region produces stable results
- Portfolio and property detail views designed for analyst workflows
- Built-in charts and summary components for fast inspection

## Tech stack

- React 19
- TypeScript
- Vite
- Zustand for app state
- Leaflet and React Leaflet for mapping
- Recharts for data visualization
- Lucide React for icons

## Getting started

### Prerequisites

- Node.js 20 or newer recommended
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will start a local development server and print the local URL in the terminal, typically `http://localhost:5173`.

### Build for production

```bash
npm run build
```

The production build output is generated in the `dist/` folder.

### Preview the production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

## Available scripts

- `npm run dev` starts the Vite development server
- `npm run build` runs TypeScript project build checks and creates a production bundle
- `npm run preview` serves the built app locally for validation
- `npm run lint` runs ESLint across the codebase

## Project structure

```text
src/
  components/
    ChatBot/
    Map/
    Sidebar/
    ui/
  data/
  hooks/
  styles/
  types/
  utils/
```

- `src/components` contains the dashboard UI, map, sidebar, and reusable UI primitives
- `src/data` contains region definitions, archetypes, risk drivers, and generated mock data inputs
- `src/hooks` contains app state and filtering logic
- `src/types` defines the shared TypeScript models
- `src/utils` contains formatting, seeded random generation, and risk color helpers

## Data model notes

This repository is built around a generated property risk schema that includes:

- Flood hazard scores and risk bands
- Flood depth estimates across return periods
- Damage and loss estimates by archetype
- Explainability metadata such as top risk drivers and confidence
- Derived insurance-facing values such as premium and payout estimates

The dashboard is intended as a realistic UI prototype, not a source of real flood predictions.

## Development notes

- Map tiles come from OpenStreetMap
- Property and region data are generated locally in the browser
- The app is currently frontend-only and does not require environment variables to run

## Repository

GitHub repository: https://github.com/tatsankan/flood_dashboard
