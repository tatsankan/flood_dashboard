import React from "react";
import type { PropertyDisplay } from "../../../types";
import { Badge } from "../../ui/Badge";

interface Props {
  property: PropertyDisplay;
}

const CONFIDENCE_DISPLAY: Record<string, string> = {
  High: "✓✓✓",
  Medium: "✓✓",
  Low: "✓",
};

const DQ_COLOR: Record<string, string> = {
  Complete: "#2d8a4e",
  Partial: "#c9a820",
  Insufficient: "#d63333",
};

export const ExplainabilitySection: React.FC<Props> = ({ property }) => {
  const { top_risk_drivers, confidence_score, data_quality_flag } =
    property.explainability;

  return (
    <div className="detail-section explain-section">
      <div className="section-header">
        <Badge label="Risk Drivers" color="#5a5647" />
      </div>
      <div className="risk-drivers">
        {top_risk_drivers.map((driver) => (
          <span key={driver} className="risk-driver-tag">
            {driver}
          </span>
        ))}
      </div>
      <div className="explain-meta">
        <div className="explain-item">
          <span className="explain-label">Confidence</span>
          <span className="explain-value">
            {confidence_score}{" "}
            <span style={{ color: "#c9a820" }}>{CONFIDENCE_DISPLAY[confidence_score]}</span>
          </span>
        </div>
        <div className="explain-item">
          <span className="explain-label">Data Quality</span>
          <span className="explain-value" style={{ color: DQ_COLOR[data_quality_flag] }}>
            {data_quality_flag}
          </span>
        </div>
      </div>
    </div>
  );
};
