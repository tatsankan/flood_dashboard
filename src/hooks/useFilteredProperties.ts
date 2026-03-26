import { useMemo } from "react";
import { useAppStore } from "./useAppState";
import type { PropertyDisplay } from "../types";
import { getCategoryFromArchetype } from "../data/archetypes";

export function useFilteredProperties(): PropertyDisplay[] {
  const properties = useAppStore((s) => s.properties);
  const searchText = useAppStore((s) => s.searchText);
  const filterType = useAppStore((s) => s.filterType);
  const filterRiskBand = useAppStore((s) => s.filterRiskBand);
  const sortBy = useAppStore((s) => s.sortBy);

  return useMemo(() => {
    let filtered = properties;

    if (searchText) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.property_id.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(
        (p) => getCategoryFromArchetype(p.property_archetype) === filterType
      );
    }

    if (filterRiskBand !== "all") {
      filtered = filtered.filter(
        (p) => p.flood_hazard.flood_risk_band === filterRiskBand
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "risk":
          return b.flood_hazard.flood_risk_score - a.flood_hazard.flood_risk_score;
        case "premium":
          return b.suggested_annual_premium - a.suggested_annual_premium;
        case "value":
          return b.estimated_property_value - a.estimated_property_value;
        case "probability":
          return b.flood_hazard.annual_flood_probability - a.flood_hazard.annual_flood_probability;
        default:
          return 0;
      }
    });

    return sorted;
  }, [properties, searchText, filterType, filterRiskBand, sortBy]);
}
