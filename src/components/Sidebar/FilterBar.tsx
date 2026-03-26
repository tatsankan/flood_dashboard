import React from "react";
import { useAppStore } from "../../hooks/useAppState";
import { Search } from "lucide-react";

export const FilterBar: React.FC = () => {
  const searchText = useAppStore((s) => s.searchText);
  const filterType = useAppStore((s) => s.filterType);
  const filterRiskBand = useAppStore((s) => s.filterRiskBand);
  const sortBy = useAppStore((s) => s.sortBy);
  const setSearchText = useAppStore((s) => s.setSearchText);
  const setFilterType = useAppStore((s) => s.setFilterType);
  const setFilterRiskBand = useAppStore((s) => s.setFilterRiskBand);
  const setSortBy = useAppStore((s) => s.setSortBy);

  return (
    <div className="filter-bar">
      <div className="search-input-wrapper">
        <Search size={14} className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search ID or address..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="filter-row">
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="agricultural">Agricultural</option>
        </select>
        <select
          className="filter-select"
          value={filterRiskBand}
          onChange={(e) => setFilterRiskBand(e.target.value)}
        >
          <option value="all">All Risk</option>
          <option value="Very Low">Very Low</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "risk" | "premium" | "value" | "probability")}
        >
          <option value="risk">Risk Score ↓</option>
          <option value="premium">Premium ↓</option>
          <option value="value">Value ↓</option>
          <option value="probability">Probability ↓</option>
        </select>
      </div>
    </div>
  );
};
