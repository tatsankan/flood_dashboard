import React from "react";
import type { PropertyDisplay } from "../../../types";
import { Badge } from "../../ui/Badge";
import { SensorStatusDot } from "../../ui/SensorStatusDot";
import { ProgressBar } from "../../ui/ProgressBar";

interface Props {
  property: PropertyDisplay;
}

export const SensorSection: React.FC<Props> = ({ property }) => {
  const drainageScore = property.flood_hazard.local_drainage_score;
  const drainageColor =
    drainageScore >= 60 ? "#2d8a4e" : drainageScore >= 30 ? "#c9a820" : "#d63333";

  return (
    <div className="detail-section iot-section">
      <div className="section-header">
        <Badge label="IoT Sensor Data" color="#8b5cf6" icon="◉" />
      </div>
      <div className="sensor-grid">
        <div className="sensor-card">
          <span className="sensor-label">Sensor Status</span>
          <SensorStatusDot status={property.flood_hazard.real_time_sensor_status} />
        </div>
        <div className="sensor-card">
          <span className="sensor-label">Drainage Score</span>
          <span className="sensor-value">{drainageScore}/100</span>
          <ProgressBar value={drainageScore} color={drainageColor} />
        </div>
        <div className="sensor-card">
          <span className="sensor-label">Flood History (10yr)</span>
          <span className="sensor-value">
            {property.flood_hazard.historical_flood_frequency_10y} events
          </span>
        </div>
      </div>
    </div>
  );
};
