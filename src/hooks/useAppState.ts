import { create } from "zustand";
import type { PropertyDisplay } from "../types";
import { REGIONS } from "../data/regions";
import { generateProperties } from "../data/generateProperties";

interface AppState {
  selectedRegion: string;
  properties: PropertyDisplay[];
  searchText: string;
  filterType: string;
  filterRiskBand: string;
  sortBy: "risk" | "premium" | "value" | "probability";
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
  sidebarOpen: boolean;

  setRegion: (key: string) => void;
  setSearchText: (text: string) => void;
  setFilterType: (type: string) => void;
  setFilterRiskBand: (band: string) => void;
  setSortBy: (sort: "risk" | "premium" | "value" | "probability") => void;
  selectProperty: (id: string | null) => void;
  setHoveredProperty: (id: string | null) => void;
  toggleSidebar: () => void;
}

function getRegionAndProperties(key: string) {
  const region = REGIONS.find((r) => r.key === key) || REGIONS[0];
  return { selectedRegion: region.key, properties: generateProperties(region) };
}

const initial = getRegionAndProperties("bangkok");

export const useAppStore = create<AppState>((set) => ({
  ...initial,
  searchText: "",
  filterType: "all",
  filterRiskBand: "all",
  sortBy: "risk",
  selectedPropertyId: null,
  hoveredPropertyId: null,
  sidebarOpen: true,

  setRegion: (key) =>
    set({
      ...getRegionAndProperties(key),
      searchText: "",
      filterType: "all",
      filterRiskBand: "all",
      sortBy: "risk",
      selectedPropertyId: null,
      hoveredPropertyId: null,
    }),

  setSearchText: (searchText) => set({ searchText }),
  setFilterType: (filterType) => set({ filterType }),
  setFilterRiskBand: (filterRiskBand) => set({ filterRiskBand }),
  setSortBy: (sortBy) => set({ sortBy }),
  selectProperty: (selectedPropertyId) => set({ selectedPropertyId }),
  setHoveredProperty: (hoveredPropertyId) => set({ hoveredPropertyId }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
