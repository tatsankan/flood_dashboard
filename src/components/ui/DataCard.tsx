import React from "react";

interface DataCardProps {
  label: string;
  value: string;
  accent?: string;
  large?: boolean;
}

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  accent = "#1b1f2b",
  large = false,
}) => (
  <div
    style={{
      background: "#f5f2ec",
      borderRadius: 6,
      padding: large ? "12px 16px" : "8px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <span
      style={{
        fontSize: 9,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "#8a8478",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: large ? 20 : 14,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        color: accent,
      }}
    >
      {value}
    </span>
  </div>
);
