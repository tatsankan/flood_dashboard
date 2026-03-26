import type { PropertyArchetype, ArchetypeCategory } from "../types";

export interface ArchetypeConfig {
  name: PropertyArchetype;
  category: ArchetypeCategory;
  valueRange: [number, number];
}

export const ARCHETYPES: ArchetypeConfig[] = [
  { name: "Residential Concrete House", category: "residential", valueRange: [1_500_000, 8_000_000] },
  { name: "Residential Wooden House", category: "residential", valueRange: [500_000, 3_000_000] },
  { name: "Residential Townhouse", category: "residential", valueRange: [2_000_000, 6_000_000] },
  { name: "Commercial Shophouse", category: "commercial", valueRange: [3_000_000, 15_000_000] },
  { name: "Commercial Office Building", category: "commercial", valueRange: [10_000_000, 80_000_000] },
  { name: "Commercial Retail/Mall", category: "commercial", valueRange: [20_000_000, 200_000_000] },
  { name: "Industrial Warehouse", category: "industrial", valueRange: [5_000_000, 50_000_000] },
  { name: "Industrial Factory", category: "industrial", valueRange: [15_000_000, 150_000_000] },
  { name: "Agricultural Open Land", category: "agricultural", valueRange: [200_000, 3_000_000] },
  { name: "Agricultural Processing Facility", category: "agricultural", valueRange: [2_000_000, 20_000_000] },
];

// Weighted selection: 50% residential (3 types), 22% commercial (3 types), 12% industrial (2), 16% agricultural (2)
export const ARCHETYPE_WEIGHTS: number[] = [
  0.167, 0.167, 0.166, // residential (50%)
  0.073, 0.073, 0.074, // commercial (22%)
  0.06, 0.06,           // industrial (12%)
  0.08, 0.08,           // agricultural (16%)
];

export function getCategoryFromArchetype(archetype: PropertyArchetype): ArchetypeCategory {
  if (archetype.startsWith("Residential")) return "residential";
  if (archetype.startsWith("Commercial")) return "commercial";
  if (archetype.startsWith("Industrial")) return "industrial";
  return "agricultural";
}
