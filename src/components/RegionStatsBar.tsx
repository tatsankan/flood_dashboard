import React from "react";
import { useAppStore } from "../hooks/useAppState";
import { REGIONS } from "../data/regions";

export const RegionStatsBar: React.FC = () => {
  const selectedRegion = useAppStore((s) => s.selectedRegion);
  const region = REGIONS.find((r) => r.key === selectedRegion) || REGIONS[0];

  const stats = [
    { label: "Population", value: region.stats.population },
    { label: "Area", value: region.stats.area },
    { label: "Avg Elevation", value: region.stats.avgElevation },
    { label: "Flood Frequency", value: region.stats.floodFrequency },
    { label: "Active Sensors", value: String(region.stats.activeSensors) },
  ];

  return (
    <div className="region-stats-bar">
      <div className="region-name">
        <span className="region-name-en">{region.name}</span>
        <span className="region-name-th">{region.nameTh}</span>
      </div>
      <div className="region-stats">
        {stats.map((s) => (
          <div key={s.label} className="region-stat">
            <span className="region-stat-label">{s.label}</span>
            <span className="region-stat-value">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
