import React from "react";
import type { RiskBand } from "../../types";
import { getRiskColor } from "../../utils/riskColors";

interface RiskBadgeProps {
  band: RiskBand;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ band }) => {
  const color = getRiskColor(band);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 11,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        color: "#fff",
        background: color,
      }}
    >
      {band}
    </span>
  );
};
