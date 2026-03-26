import React from "react";
import { RISK_COLORS } from "../../utils/riskColors";
import type { RiskBand } from "../../types";

const BANDS: { band: RiskBand; label: string }[] = [
  { band: "Very Low", label: "Very Low (0–20)" },
  { band: "Low", label: "Low (21–40)" },
  { band: "Moderate", label: "Moderate (41–60)" },
  { band: "High", label: "High (61–80)" },
  { band: "Critical", label: "Critical (81–100)" },
];

const SHAPES = [
  { label: "Residential", shape: "▲" },
  { label: "Commercial", shape: "■" },
  { label: "Industrial", shape: "⬡" },
  { label: "Agricultural", shape: "●" },
];

export const MapLegend: React.FC = () => {
  return (
    <div className="map-legend">
      <div className="legend-title">Risk Level</div>
      {BANDS.map(({ band, label }) => (
        <div key={band} className="legend-item">
          <span
            className="legend-dot"
            style={{ background: RISK_COLORS[band] }}
          />
          <span className="legend-label">{label}</span>
        </div>
      ))}
      <div className="legend-title" style={{ marginTop: 8 }}>
        Property Type
      </div>
      {SHAPES.map(({ label, shape }) => (
        <div key={label} className="legend-item">
          <span className="legend-shape">{shape}</span>
          <span className="legend-label">{label}</span>
        </div>
      ))}
    </div>
  );
};
