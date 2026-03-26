import React from "react";

interface BadgeProps {
  label: string;
  color: string;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, icon }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 10,
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color,
      background: `${color}18`,
      border: `1px solid ${color}40`,
    }}
  >
    {icon && <span>{icon}</span>}
    {label}
  </span>
);
