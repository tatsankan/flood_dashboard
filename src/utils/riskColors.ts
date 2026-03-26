import type { RiskBand, SensorStatus } from "../types";

export const RISK_COLORS: Record<RiskBand, string> = {
  "Very Low": "#2d8a4e",
  Low: "#6aab3d",
  Moderate: "#c9a820",
  High: "#e07b28",
  Critical: "#d63333",
};

export const SENSOR_COLORS: Record<SensorStatus, string> = {
  Normal: "#2d8a4e",
  Warning: "#c9a820",
  Critical: "#d63333",
  Offline: "#8a8478",
};

export function getRiskColor(band: RiskBand): string {
  return RISK_COLORS[band];
}

export function getSensorColor(status: SensorStatus): string {
  return SENSOR_COLORS[status];
}
