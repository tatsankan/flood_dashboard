import React from "react";
import type { SensorStatus } from "../../types";
import { getSensorColor } from "../../utils/riskColors";

interface SensorStatusDotProps {
  status: SensorStatus;
  showLabel?: boolean;
}

export const SensorStatusDot: React.FC<SensorStatusDotProps> = ({ status, showLabel = true }) => {
  const color = getSensorColor(status);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          boxShadow: status === "Critical" ? `0 0 6px ${color}` : undefined,
        }}
      />
      {showLabel && (
        <span
          style={{
            fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            color,
          }}
        >
          {status}
        </span>
      )}
    </span>
  );
};
