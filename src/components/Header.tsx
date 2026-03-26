import React from "react";
import { useAppStore } from "../hooks/useAppState";
import { REGIONS } from "../data/regions";

export const Header: React.FC = () => {
  const selectedRegion = useAppStore((s) => s.selectedRegion);
  const setRegion = useAppStore((s) => s.setRegion);

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">
          <span style={{ color: "#5ba3d9" }}>Flood</span>
          <span style={{ color: "#ffffff" }}>Pulse</span>
          <span style={{ color: "#5ba3d9", fontSize: 10, marginLeft: 2, fontWeight: 400 }}>PRO</span>
        </span>
        <span className="header-divider" />
        <span className="header-label">Property Risk Assessment</span>
      </div>
      <div className="header-right">
        <span className="source-badge" style={{ color: "#8b5cf6" }}>
          ◉ IoT Live
        </span>
        <span className="source-badge" style={{ color: "#0ea5e9" }}>
          ◎ SAT-2h
        </span>
        <span className="source-badge" style={{ color: "#f59e0b" }}>
          ◈ ML v3.2
        </span>
        <span className="header-divider" />
        <select
          className="region-select"
          value={selectedRegion}
          onChange={(e) => setRegion(e.target.value)}
        >
          {REGIONS.map((r) => (
            <option key={r.key} value={r.key}>
              {r.name} ({r.nameTh})
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};
