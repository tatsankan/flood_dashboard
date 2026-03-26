# FloodPulse PRO — Insurance Property Risk Dashboard

## Build Specification for AI-Assisted Development

> **Purpose**: This document is a complete spec for building the FloodPulse PRO dashboard — a flood risk assessment tool licensed to insurance companies in Thailand/Southeast Asia. Use fake/generated data throughout. No ML model or pipeline is needed; all data should be generated client-side to match the ML model output schema defined below.

---

## 1. Product Overview

### What It Is

A web-based SaaS dashboard that displays **property-level flood risk data** on an interactive map. Insurance company underwriters use it to:

- Select a Thai province/region
- See every assessed property plotted on a real map
- Click any property to view its full risk profile, suggested premium, flood hazard data, and damage estimates
- Filter, search, sort, and compare properties
- View portfolio-level summaries and risk distributions

### Who Uses It

Insurance company risk analysts and underwriters. The tone should be **data-dense, professional, and precise** — think Bloomberg terminal meets GIS tool. Monospace fonts for data, serif for labels, muted map beneath vivid risk markers.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18+ (Vite or Next.js) |
| Language | TypeScript |
| Styling | Tailwind CSS (or CSS Modules) |
| Map | Leaflet with OpenStreetMap tiles (react-leaflet) |
| Charts | Recharts |
| State | React Context or Zustand |
| Icons | Lucide React |

---

## 2. ML Model Output Schema (Source of Truth)

Every property in the system is represented by this JSON structure. **Generate fake data that conforms exactly to this schema.** This is the output from our ML prediction pipeline — the dashboard simply displays it.

```json
{
  "property_id": "BKK-000123",
  "address": "123 Sukumvit 50, Bangkok, Thailand",
  "latitude": 13.6951,
  "longitude": 100.5854,
  "property_archetype": "Residential Concrete House",
  "flood_hazard": {
    "flood_risk_score": 78,
    "flood_risk_band": "High",
    "annual_flood_probability": 0.18,
    "flood_depth_cm": {
      "1_in_10_year": 32,
      "1_in_25_year": 55,
      "1_in_50_year": 78,
      "1_in_100_year": 110
    },
    "inundation_duration_hours": {
      "1_in_10_year": 9,
      "1_in_50_year": 21
    },
    "local_drainage_score": 42,
    "historical_flood_frequency_10y": 4,
    "real_time_sensor_status": "Normal"
  },
  "damage_loss": {
    "damage_ratio_by_archetype": {
      "1_in_10_year": 0.8,
      "1_in_25_year": 2.1,
      "1_in_50_year": 4.0,
      "1_in_100_year": 7.2
    },
    "indicative_annual_loss_rate": 0.22
  },
  "explainability": {
    "top_risk_drivers": [
      "Low ground elevation",
      "Poor drainage capacity",
      "Repeated local flood history",
      "High impervious surface runoff"
    ],
    "confidence_score": "Medium",
    "data_quality_flag": "Complete"
  }
}
```

### Schema Field Reference

#### Root Fields

| Field | Type | Description | Fake Data Rules |
|-------|------|-------------|-----------------|
| `property_id` | string | Unique ID, format: `{REGION_CODE}-{6_DIGITS}` | Region codes: `BKK`, `SKA`, `AYA`, `CNX`, `NMA`, `SPK` |
| `address` | string | Thai street address | Generate realistic Thai addresses per region |
| `latitude` | float | WGS84 latitude | Must fall within the selected region's bounding box |
| `longitude` | float | WGS84 longitude | Must fall within the selected region's bounding box |
| `property_archetype` | string | Building classification | One of the archetypes listed below |

#### Property Archetypes (use these exact strings)

- `"Residential Concrete House"`
- `"Residential Wooden House"`
- `"Residential Townhouse"`
- `"Commercial Shophouse"`
- `"Commercial Office Building"`
- `"Commercial Retail/Mall"`
- `"Industrial Warehouse"`
- `"Industrial Factory"`
- `"Agricultural Open Land"`
- `"Agricultural Processing Facility"`

#### `flood_hazard` Object

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `flood_risk_score` | int | 0–100 | Composite risk score from ML model |
| `flood_risk_band` | string | `"Very Low"`, `"Low"`, `"Moderate"`, `"High"`, `"Critical"` | Derived from score: 0–20, 21–40, 41–60, 61–80, 81–100 |
| `annual_flood_probability` | float | 0.01–0.85 | Probability of any flooding in a given year |
| `flood_depth_cm.1_in_10_year` | int | 0–80 | Expected flood depth for 10-yr return period |
| `flood_depth_cm.1_in_25_year` | int | 10–130 | Expected flood depth for 25-yr return period |
| `flood_depth_cm.1_in_50_year` | int | 20–180 | Expected flood depth for 50-yr return period |
| `flood_depth_cm.1_in_100_year` | int | 30–250 | Expected flood depth for 100-yr return period |
| `inundation_duration_hours.1_in_10_year` | int | 0–48 | Hours of flooding for 10-yr event |
| `inundation_duration_hours.1_in_50_year` | int | 0–120 | Hours of flooding for 50-yr event |
| `local_drainage_score` | int | 0–100 | 0 = terrible drainage, 100 = excellent |
| `historical_flood_frequency_10y` | int | 0–10 | Number of flood events in last decade |
| `real_time_sensor_status` | string | `"Normal"`, `"Warning"`, `"Critical"`, `"Offline"` | Current IoT sensor reading near property |

#### `damage_loss` Object

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `damage_ratio_by_archetype.1_in_10_year` | float | 0.1–5.0 | % of property value damaged |
| `damage_ratio_by_archetype.1_in_25_year` | float | 0.5–12.0 | % of property value damaged |
| `damage_ratio_by_archetype.1_in_50_year` | float | 1.0–20.0 | % of property value damaged |
| `damage_ratio_by_archetype.1_in_100_year` | float | 2.0–35.0 | % of property value damaged |
| `indicative_annual_loss_rate` | float | 0.01–2.5 | % of value expected to lose per year |

#### `explainability` Object

| Field | Type | Description |
|-------|------|-------------|
| `top_risk_drivers` | string[] | 2–5 human-readable reasons for the risk score |
| `confidence_score` | string | `"High"`, `"Medium"`, `"Low"` |
| `data_quality_flag` | string | `"Complete"`, `"Partial"`, `"Insufficient"` |

### Additional Derived Fields (compute client-side)

These fields are NOT from the ML model but should be calculated in the frontend for display:

| Field | How to Calculate | Description |
|-------|-----------------|-------------|
| `estimated_property_value` | Based on archetype + randomized range | Used for premium calculation display |
| `suggested_annual_premium` | `property_value × indicative_annual_loss_rate × 1.35` | The 1.35 multiplier is a placeholder margin |
| `max_payout_estimate` | `property_value × damage_ratio_100yr / 100` | Maximum possible claim |

**Estimated property value ranges by archetype:**

| Archetype | Value Range (THB) |
|-----------|------------------|
| Residential Concrete House | 1,500,000 – 8,000,000 |
| Residential Wooden House | 500,000 – 3,000,000 |
| Residential Townhouse | 2,000,000 – 6,000,000 |
| Commercial Shophouse | 3,000,000 – 15,000,000 |
| Commercial Office Building | 10,000,000 – 80,000,000 |
| Commercial Retail/Mall | 20,000,000 – 200,000,000 |
| Industrial Warehouse | 5,000,000 – 50,000,000 |
| Industrial Factory | 15,000,000 – 150,000,000 |
| Agricultural Open Land | 200,000 – 3,000,000 |
| Agricultural Processing Facility | 2,000,000 – 20,000,000 |

---

## 3. Regions Configuration

### Region Data

Generate 40–80 properties per region. Each property's lat/lng must fall within the region's bounding box.

```typescript
interface Region {
  key: string;
  name: string;
  nameTh: string;
  code: string;           // For property_id prefix
  center: [number, number]; // [lat, lng]
  zoom: number;           // Leaflet zoom level
  bbox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  stats: {
    population: string;
    area: string;
    avgElevation: string;
    floodFrequency: string;
    activeSensors: number;
  };
}
```

| Region | Code | Center | Zoom | BBox (minLat, maxLat, minLng, maxLng) |
|--------|------|--------|------|---------------------------------------|
| Songkhla | SKA | 7.0, 100.47 | 11 | 6.55, 7.45, 100.05, 100.89 |
| Bangkok | BKK | 13.75, 100.52 | 12 | 13.60, 13.90, 100.35, 100.70 |
| Ayutthaya | AYA | 14.35, 100.56 | 11 | 14.10, 14.60, 100.25, 100.85 |
| Chiang Mai | CNX | 18.79, 98.98 | 10 | 18.40, 19.20, 98.55, 99.35 |
| Nakhon Ratchasima | NMA | 14.97, 102.10 | 10 | 14.50, 15.40, 101.60, 102.55 |
| Samut Prakan | SPK | 13.60, 100.60 | 12 | 13.48, 13.72, 100.45, 100.75 |

---

## 4. Fake Data Generation

### Strategy

Use a **seeded pseudo-random generator** so the same region always produces the same properties (deterministic). This prevents the map from shuffling on every re-render.

```typescript
// Example: seeded random
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

// Seed per region
const rand = seededRandom(regionKey.charCodeAt(0) * 137);
```

### Generation Rules

For each property:

1. **Position**: Random lat/lng within region bbox
2. **Archetype**: Weighted random — 50% residential types, 22% commercial, 12% industrial, 16% agricultural
3. **Risk score**: Generate 0–100, then derive `flood_risk_band` from score thresholds
4. **Flood depths**: Must increase monotonically (10yr < 25yr < 50yr < 100yr). Generate 10yr first, then multiply by ~1.6, ~2.3, ~3.2 with some randomness
5. **Damage ratios**: Same monotonic rule. Correlate loosely with flood depths
6. **Annual flood probability**: Correlate with risk score. High risk → higher probability
7. **Drainage score**: Inversely correlate with risk score (high risk = low drainage)
8. **Risk drivers**: Pick 3–5 from a pool, weighted by which factors actually scored high
9. **Sensor status**: 70% Normal, 15% Warning, 10% Critical, 5% Offline
10. **Confidence**: 60% High, 30% Medium, 10% Low
11. **Data quality**: 75% Complete, 20% Partial, 5% Insufficient

### Risk Driver Pool

Pick from these based on which factor contributed most:

```typescript
const RISK_DRIVER_POOL = [
  "Low ground elevation",
  "Poor drainage capacity",
  "Repeated local flood history",
  "High impervious surface runoff",
  "Proximity to river/canal",
  "Coastal storm surge exposure",
  "High soil moisture saturation",
  "Upstream dam overflow risk",
  "Inadequate flood barriers",
  "Recent land subsidence detected",
  "High water table level",
  "Deforestation in catchment area",
  "Blocked drainage infrastructure",
  "Low slope gradient",
  "Urban heat island runoff effect",
];
```

---

## 5. Application Layout

### Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Region Selector | Data Source Badges | Live  │
├───────────────────────────────────────────┬──────────────────┤
│ Region Stats Bar (name, population, etc.) │                  │
├───────────────────────────────────────────┤                  │
│ KPI Summary Strip                         │   RIGHT SIDEBAR  │
├───────────────────────────────────────────┤   (property list │
│                                           │    or detail)    │
│           INTERACTIVE MAP                 │                  │
│     (Leaflet + OSM tiles +                │   - Search/filter│
│      property markers)                    │   - Property rows│
│                                           │   - Detail view  │
│                                           │                  │
│     [Legend overlay]                       │                  │
├───────────────────────────────────────────┴──────────────────┤
│ FOOTER (optional)                                            │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

- **Desktop (>1200px)**: Full layout as above, sidebar 400px
- **Tablet (768–1200px)**: Sidebar collapses to overlay panel
- **Mobile (<768px)**: Stack vertically — map on top, list below

---

## 6. Component Specifications

### 6.1 Header

**Location**: Top, sticky, full width, dark background (`#1b1f2b`)

**Contents (left to right):**
- FloodPulse logo/wordmark — "Flood" in `#5ba3d9`, "Pulse" in white
- Divider
- "Property Risk Assessment" label (uppercase, small, muted)
- *Spacer*
- Data source badges:
  - `◉ IoT Live` — purple `#8b5cf6`
  - `◎ SAT-2h` — cyan `#0ea5e9`
  - `◈ ML v3.2` — amber `#f59e0b`
- Divider
- Region selector dropdown (styled select)

### 6.2 Region Stats Bar

**Location**: Below header, light background

**Contents**: Region name + Thai name, then horizontal stats: Population, Area, Avg Elevation, Flood Frequency, Active Sensors

**Typography**: Labels in `IBM Plex Mono` 8px uppercase, values in `IBM Plex Mono` 13px bold

### 6.3 KPI Summary Strip

**Location**: Below region bar, slightly darker background

**Five cards in a row:**

| KPI | Source | Color |
|-----|--------|-------|
| Properties (count) | Count of filtered properties | `#0066cc` |
| Total Exposure | Sum of all `estimated_property_value` | `#e07b28` |
| Premium Pool | Sum of all `suggested_annual_premium` | `#2d8a4e` |
| Potential Loss | Sum of all `max_payout_estimate` | `#d63333` |
| Risk Distribution | Stacked bar showing count per risk band | Multi-color |

### 6.4 Interactive Map (Main Area)

**Implementation**: `react-leaflet` with OpenStreetMap tiles

**Tile styling**: Desaturate tiles (`filter: saturate(0.35) brightness(1.05)`) so markers pop. Add a semi-transparent warm overlay for paper-like feel.

**Markers**: Custom marker per property using Leaflet `divIcon` or SVG markers:

| Archetype Category | Marker Shape |
|-------------------|--------------|
| Residential (all 3) | Triangle ▲ |
| Commercial (all 3) | Square ■ |
| Industrial (both) | Hexagon ⬡ |
| Agricultural (both) | Circle ● |

**Marker color** by `flood_risk_band`:

| Band | Color | Hex |
|------|-------|-----|
| Very Low | Green | `#2d8a4e` |
| Low | Light Green | `#6aab3d` |
| Moderate | Yellow | `#c9a820` |
| High | Orange | `#e07b28` |
| Critical | Red | `#d63333` |

**Marker size**: Base 10px, grow to 14px on hover, 18px when selected. Critical markers should have a pulsing ring animation.

**Marker interactions**:
- **Hover**: Show tooltip with `property_id`, address (truncated), risk band, and suggested premium
- **Click**: Select the property → sidebar switches to detail view, marker grows + gets white border

**Map overlays**:
- Legend (bottom-left): Risk colors + property type shapes
- Drag/zoom hint (top-center, fades after 3s)

### 6.5 Right Sidebar — List View (default)

**Width**: 400px, collapsible with toggle button

**Filter bar (top, sticky)**:
- Search input: filter by `property_id` or address
- Type filter dropdown: All / Residential / Commercial / Industrial / Agricultural
- Risk band filter: All / Very Low / Low / Moderate / High / Critical
- Sort dropdown: Risk Score ↓ / Premium ↓ / Value ↓ / Probability ↓

**Property rows**: Each row shows:
- Risk band color dot (left edge)
- Property type icon
- `property_id` (monospace, bold)
- Address (truncated, muted)
- `flood_risk_band` label (colored)
- `suggested_annual_premium` (right-aligned, accent color, bold)
- Small metadata line: Value, Flood prob, Confidence

**Interaction**: Click a row → map pans/zooms to that property, sidebar switches to detail view

### 6.6 Right Sidebar — Detail View (on property select)

**Trigger**: Click a property marker or list row

**Layout**: Scrollable panel with these sections top-to-bottom:

#### Back Button + Header
- "← Back to list" link
- `property_id` large monospace
- Address, archetype label
- Risk band badge (colored pill)

#### Section 1: ML Model Output (amber border/tint `#f59e0b`)
- Badge: `◈ ML Model Output` with confidence score
- Grid of data cards:
  - **Suggested Annual Premium** (large, spans full width) — `suggested_annual_premium`
  - **Property Value** — `estimated_property_value`
  - **Annual Loss Rate** — `damage_loss.indicative_annual_loss_rate` as %
  - **Max Payout** — `max_payout_estimate`
  - **Flood Probability** — `flood_hazard.annual_flood_probability` as %
  - **Risk Score** — `flood_hazard.flood_risk_score` / 100

#### Section 2: Flood Depth Profile (blue border/tint `#0ea5e9`)
- Badge: `◎ Flood Hazard Profile`
- **Bar chart or table** showing flood depths across return periods:

  ```
  Return Period  │  Depth   │  Duration  │  Damage Ratio
  ───────────────┼──────────┼────────────┼──────────────
  1-in-10 year   │  32 cm   │  9 hrs     │  0.8%
  1-in-25 year   │  55 cm   │  —         │  2.1%
  1-in-50 year   │  78 cm   │  21 hrs    │  4.0%
  1-in-100 year  │  110 cm  │  —         │  7.2%
  ```

- Consider using a **small Recharts BarChart** for flood depths with the 4 return periods as categories, making it visual and scannable.

#### Section 3: IoT & Sensor Data (purple border/tint `#8b5cf6`)
- Badge: `◉ IoT Sensor Data`
- Three metric cards:
  - **Sensor Status**: show `real_time_sensor_status` with colored dot (green/yellow/red/gray)
  - **Drainage Score**: `local_drainage_score` / 100 with a mini progress bar
  - **Flood History**: `historical_flood_frequency_10y` events in 10 years

#### Section 4: Risk Explainability (neutral)
- Badge: `Risk Drivers`
- List of `top_risk_drivers` as styled tags or pill badges
- Confidence indicator: `confidence_score` shown as High ✓✓✓ / Medium ✓✓ / Low ✓
- Data quality flag: `data_quality_flag` with colored indicator

#### Section 5: Property Metadata (subtle background)
- Grid: Archetype, Address, Coordinates, Region

---

## 7. Color System

### Risk Band Colors

```css
--risk-very-low: #2d8a4e;
--risk-low: #6aab3d;
--risk-moderate: #c9a820;
--risk-high: #e07b28;
--risk-critical: #d63333;
```

### Data Source Colors

```css
--source-iot: #8b5cf6;
--source-satellite: #0ea5e9;
--source-ml: #f59e0b;
```

### UI Colors

```css
--bg-primary: #f5f2ec;
--bg-secondary: #eae6dd;
--surface: #ffffff;
--surface-dark: #1b1f2b;
--border: #d9d3c7;
--text: #1b1f2b;
--text-mid: #5a5647;
--text-muted: #8a8478;
--accent: #0066cc;
```

---

## 8. Typography

| Usage | Font | Weight | Size |
|-------|------|--------|------|
| Data values, IDs, numbers | IBM Plex Mono | 600 | 11–16px |
| Labels, descriptions | Libre Franklin | 400–500 | 10–13px |
| Headings, region name | Source Serif 4 | 700 | 16–20px |
| Tiny labels (uppercase) | IBM Plex Mono | 500 | 8–9px |

Load from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Mono:wght@400;500;600&family=Libre+Franklin:wght@400;500;600;700&display=swap
```

---

## 9. State Management

### Global State

```typescript
interface AppState {
  // Region
  selectedRegion: string;          // Region key
  properties: MLModelOutput[];     // Generated for current region

  // Filters
  searchText: string;
  filterType: string;              // "all" | archetype category
  filterRiskBand: string;          // "all" | specific band
  sortBy: "risk" | "premium" | "value" | "probability";

  // Selection
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;

  // UI
  sidebarOpen: boolean;
}
```

### Key Interactions

| User Action | State Change | Side Effects |
|------------|--------------|--------------|
| Change region | Reset all filters, clear selection, regenerate properties | Map pans to new center |
| Click marker | Set `selectedPropertyId` | Sidebar shows detail, marker highlights |
| Click list row | Set `selectedPropertyId` | Map pans to property, marker highlights |
| Hover marker | Set `hoveredPropertyId` | List row highlights, tooltip appears |
| Hover list row | Set `hoveredPropertyId` | Marker grows on map |
| Type in search | Filter `properties` | Map markers update, list updates |
| Change filter | Filter `properties` | Map markers update, list updates |
| Click "Back to list" | Clear `selectedPropertyId` | Sidebar returns to list view |

---

## 10. Project File Structure

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── RegionStatsBar.tsx
│   ├── KPISummary.tsx
│   ├── Map/
│   │   ├── FloodMap.tsx           # Main Leaflet map
│   │   ├── PropertyMarker.tsx     # Custom marker component
│   │   ├── MapLegend.tsx
│   │   └── MarkerTooltip.tsx
│   ├── Sidebar/
│   │   ├── Sidebar.tsx            # Container with toggle
│   │   ├── FilterBar.tsx
│   │   ├── PropertyList.tsx
│   │   ├── PropertyRow.tsx
│   │   └── PropertyDetail/
│   │       ├── PropertyDetail.tsx  # Full detail layout
│   │       ├── MLOutputSection.tsx
│   │       ├── FloodDepthSection.tsx
│   │       ├── SensorSection.tsx
│   │       ├── ExplainabilitySection.tsx
│   │       └── MetadataSection.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── RiskBadge.tsx
│       ├── SensorStatusDot.tsx
│       ├── ProgressBar.tsx
│       └── DataCard.tsx
├── data/
│   ├── regions.ts                  # Region configs
│   ├── generateProperties.ts       # Seeded fake data generator
│   ├── riskDrivers.ts             # Risk driver string pool
│   └── archetypes.ts              # Archetype configs & value ranges
├── hooks/
│   ├── useAppState.ts             # Global state hook
│   └── useFilteredProperties.ts   # Derived filtered/sorted list
├── types/
│   └── index.ts                   # TypeScript interfaces matching ML schema
├── utils/
│   ├── formatting.ts              # Currency formatting, number formatting
│   ├── riskColors.ts              # Color lookup by risk band
│   └── seededRandom.ts            # Deterministic random generator
└── styles/
    └── globals.css
```

---

## 11. TypeScript Interfaces

```typescript
// types/index.ts

export type RiskBand = "Very Low" | "Low" | "Moderate" | "High" | "Critical";
export type ConfidenceScore = "High" | "Medium" | "Low";
export type DataQualityFlag = "Complete" | "Partial" | "Insufficient";
export type SensorStatus = "Normal" | "Warning" | "Critical" | "Offline";

export type PropertyArchetype =
  | "Residential Concrete House"
  | "Residential Wooden House"
  | "Residential Townhouse"
  | "Commercial Shophouse"
  | "Commercial Office Building"
  | "Commercial Retail/Mall"
  | "Industrial Warehouse"
  | "Industrial Factory"
  | "Agricultural Open Land"
  | "Agricultural Processing Facility";

export type ArchetypeCategory =
  | "residential"
  | "commercial"
  | "industrial"
  | "agricultural";

export interface ReturnPeriodValues {
  "1_in_10_year": number;
  "1_in_25_year": number;
  "1_in_50_year": number;
  "1_in_100_year": number;
}

export interface InundationDuration {
  "1_in_10_year": number;
  "1_in_50_year": number;
}

export interface FloodHazard {
  flood_risk_score: number;
  flood_risk_band: RiskBand;
  annual_flood_probability: number;
  flood_depth_cm: ReturnPeriodValues;
  inundation_duration_hours: InundationDuration;
  local_drainage_score: number;
  historical_flood_frequency_10y: number;
  real_time_sensor_status: SensorStatus;
}

export interface DamageLoss {
  damage_ratio_by_archetype: ReturnPeriodValues;
  indicative_annual_loss_rate: number;
}

export interface Explainability {
  top_risk_drivers: string[];
  confidence_score: ConfidenceScore;
  data_quality_flag: DataQualityFlag;
}

export interface MLModelOutput {
  property_id: string;
  address: string;
  latitude: number;
  longitude: number;
  property_archetype: PropertyArchetype;
  flood_hazard: FloodHazard;
  damage_loss: DamageLoss;
  explainability: Explainability;
}

// Derived fields (computed client-side, not from ML model)
export interface PropertyDisplay extends MLModelOutput {
  estimated_property_value: number;
  suggested_annual_premium: number;
  max_payout_estimate: number;
  archetype_category: ArchetypeCategory;
}
```

---

## 12. Key Implementation Notes

### Map Performance
- With 40–80 markers per region, standard Leaflet markers are fine (no clustering needed)
- Use `useMemo` to avoid re-rendering markers when only sidebar state changes
- When a property is selected, use `map.flyTo()` for smooth pan animation

### Sidebar ↔ Map Sync
- Hovering a list row should highlight the corresponding marker on the map (grow + brighten)
- Hovering a map marker should highlight the corresponding list row (background tint)
- This requires shared `hoveredPropertyId` state

### Data Regeneration
- Only regenerate when `selectedRegion` changes
- Use `useMemo` with `[selectedRegion]` dependency
- Filtering/sorting should operate on the already-generated array

### Map Tile Desaturation
- Apply CSS filter to the tile layer: `filter: saturate(0.35) brightness(1.05) contrast(0.95)`
- Add a semi-transparent overlay div on top of tiles but below markers: `background: rgba(245, 242, 236, 0.25)`

### Number Formatting
- All Thai Baht values: `฿` prefix, use K/M/B suffixes (`฿2.4M`, `฿890K`)
- Percentages: one decimal place for rates (`0.22%`), zero decimals for probabilities (`18%`)
- Flood depths: integer + `cm` suffix
- Duration: integer + `hrs` suffix
- Scores: integer `/100`

---

## 13. Animations & Micro-interactions

| Element | Animation | Duration |
|---------|-----------|----------|
| Property rows appearing | Slide in from right, stagger 20ms each | 150ms |
| Detail panel appearing | Fade up | 250ms |
| Map marker hover | Scale 1.0 → 1.4 | 150ms ease |
| Map marker select | Scale 1.0 → 1.8 + white stroke | 200ms ease |
| Critical marker pulse | Ring expanding + fading | 2s infinite |
| KPI numbers | Count-up animation on region change | 800ms |
| Sidebar toggle | Width collapse/expand | 300ms ease |
| Risk distribution bar | Width grow from 0 | 500ms ease |

---

## 14. Accessibility

- All interactive elements focusable via keyboard
- Map markers should have `aria-label` with property ID and risk band
- Color is never the only indicator — always pair with text labels or shapes
- Minimum contrast ratio 4.5:1 for all text
- Screen reader support for KPI values

---

## 15. Future Integration Points

These are NOT needed now but the architecture should make them easy to add later:

1. **Real ML API**: Replace `generateProperties()` with a fetch to `GET /api/v1/properties?region={key}`
2. **WebSocket for sensor updates**: Subscribe to `ws://api/sensors/live` and update `real_time_sensor_status` in real-time
3. **User authentication**: Add auth context wrapping the app, pass JWT to API calls
4. **Multi-tenant**: Region access controlled by tenant's license tier
5. **Export**: "Download PDF Report" button on property detail panel
6. **Comparison mode**: Select 2–3 properties and see them side-by-side

---

## Summary

Build a React + TypeScript dashboard that:
1. Lets users select a Thai province
2. Shows property markers on a real Leaflet/OSM map, color-coded by flood risk
3. Lists properties in a filterable sidebar
4. Shows full ML model output when a property is selected
5. Uses fake data matching the exact ML output schema above
6. Looks professional, data-dense, and polished — not generic

The ML model output schema is the **single source of truth**. Every piece of displayed data should trace back to a field in that schema or to a clearly defined client-side derivation.
