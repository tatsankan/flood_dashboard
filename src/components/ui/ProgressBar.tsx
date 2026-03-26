import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "#0066cc",
  height = 6,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: height / 2,
        background: "#d9d3c7",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: height / 2,
          background: color,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
};
