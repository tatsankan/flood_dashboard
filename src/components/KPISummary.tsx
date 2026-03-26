import React from "react";
import { useFilteredProperties } from "../hooks/useFilteredProperties";
import { formatCurrency } from "../utils/formatting";
import { RISK_COLORS } from "../utils/riskColors";
import type { RiskBand } from "../types";

const BANDS: RiskBand[] = ["Very Low", "Low", "Moderate", "High", "Critical"];

export const KPISummary: React.FC = () => {
  const properties = useFilteredProperties();

  const totalExposure = properties.reduce((s, p) => s + p.estimated_property_value, 0);
  const premiumPool = properties.reduce((s, p) => s + p.suggested_annual_premium, 0);
  const potentialLoss = properties.reduce((s, p) => s + p.max_payout_estimate, 0);

  const bandCounts = BANDS.map((band) => ({
    band,
    count: properties.filter((p) => p.flood_hazard.flood_risk_band === band).length,
  }));
  const maxCount = Math.max(properties.length, 1);

  return (
    <div className="kpi-strip">
      <div className="kpi-card">
        <span className="kpi-label">Properties</span>
        <span className="kpi-value" style={{ color: "#0066cc" }}>
          {properties.length}
        </span>
      </div>
      <div className="kpi-card">
        <span className="kpi-label">Total Exposure</span>
        <span className="kpi-value" style={{ color: "#e07b28" }}>
          {formatCurrency(totalExposure)}
        </span>
      </div>
      <div className="kpi-card">
        <span className="kpi-label">Premium Pool</span>
        <span className="kpi-value" style={{ color: "#2d8a4e" }}>
          {formatCurrency(premiumPool)}
        </span>
      </div>
      <div className="kpi-card">
        <span className="kpi-label">Potential Loss</span>
        <span className="kpi-value" style={{ color: "#d63333" }}>
          {formatCurrency(potentialLoss)}
        </span>
      </div>
      <div className="kpi-card kpi-distribution">
        <span className="kpi-label">Risk Distribution</span>
        <div className="kpi-bar-stack">
          {bandCounts.map(({ band, count }) => (
            <div
              key={band}
              className="kpi-bar-segment"
              style={{
                width: `${(count / maxCount) * 100}%`,
                background: RISK_COLORS[band],
              }}
              title={`${band}: ${count}`}
            />
          ))}
        </div>
        <div className="kpi-bar-legend">
          {bandCounts.map(({ band, count }) => (
            <span key={band} style={{ color: RISK_COLORS[band], fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}>
              {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
