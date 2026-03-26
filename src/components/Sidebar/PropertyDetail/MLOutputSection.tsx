import React from "react";
import type { PropertyDisplay } from "../../../types";
import { Badge } from "../../ui/Badge";
import { DataCard } from "../../ui/DataCard";
import { formatCurrency, formatPercent, formatProbability, formatScore } from "../../../utils/formatting";

interface Props {
  property: PropertyDisplay;
}

export const MLOutputSection: React.FC<Props> = ({ property }) => {
  return (
    <div className="detail-section ml-section">
      <div className="section-header">
        <Badge label="ML Model Output" color="#f59e0b" icon="◈" />
        <span className="confidence-label">
          Confidence: {property.explainability.confidence_score}
        </span>
      </div>
      <div className="detail-grid full-width">
        <DataCard
          label="Suggested Annual Premium"
          value={formatCurrency(property.suggested_annual_premium)}
          accent="#f59e0b"
          large
        />
      </div>
      <div className="detail-grid cols-2">
        <DataCard
          label="Property Value"
          value={formatCurrency(property.estimated_property_value)}
        />
        <DataCard
          label="Annual Loss Rate"
          value={formatPercent(property.damage_loss.indicative_annual_loss_rate)}
          accent="#d63333"
        />
        <DataCard
          label="Max Payout"
          value={formatCurrency(property.max_payout_estimate)}
          accent="#d63333"
        />
        <DataCard
          label="Flood Probability"
          value={formatProbability(property.flood_hazard.annual_flood_probability)}
          accent="#0066cc"
        />
        <DataCard
          label="Risk Score"
          value={formatScore(property.flood_hazard.flood_risk_score)}
          accent="#e07b28"
        />
      </div>
    </div>
  );
};
