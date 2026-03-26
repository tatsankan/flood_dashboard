import React from "react";
import type { PropertyDisplay } from "../../types";
import { getRiskColor } from "../../utils/riskColors";
import { formatCurrency, formatProbability } from "../../utils/formatting";
import { useAppStore } from "../../hooks/useAppState";
import {
  Home,
  Building2,
  Factory,
  Wheat,
} from "lucide-react";
import type { ArchetypeCategory } from "../../types";

const CATEGORY_ICONS: Record<ArchetypeCategory, React.ReactNode> = {
  residential: <Home size={14} />,
  commercial: <Building2 size={14} />,
  industrial: <Factory size={14} />,
  agricultural: <Wheat size={14} />,
};

interface PropertyRowProps {
  property: PropertyDisplay;
  index: number;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({ property, index }) => {
  const selectProperty = useAppStore((s) => s.selectProperty);
  const setHoveredProperty = useAppStore((s) => s.setHoveredProperty);
  const hoveredPropertyId = useAppStore((s) => s.hoveredPropertyId);
  const isHovered = hoveredPropertyId === property.property_id;
  const color = getRiskColor(property.flood_hazard.flood_risk_band);

  return (
    <div
      className={`property-row ${isHovered ? "hovered" : ""}`}
      onClick={() => selectProperty(property.property_id)}
      onMouseEnter={() => setHoveredProperty(property.property_id)}
      onMouseLeave={() => setHoveredProperty(null)}
      style={{ animationDelay: `${index * 20}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") selectProperty(property.property_id);
      }}
    >
      <div className="row-risk-indicator" style={{ background: color }} />
      <div className="row-icon" style={{ color }}>
        {CATEGORY_ICONS[property.archetype_category]}
      </div>
      <div className="row-content">
        <div className="row-top">
          <span className="row-id">{property.property_id}</span>
          <span className="row-premium">{formatCurrency(property.suggested_annual_premium)}</span>
        </div>
        <div className="row-address">{property.address}</div>
        <div className="row-meta">
          <span className="row-band" style={{ color }}>{property.flood_hazard.flood_risk_band}</span>
          <span className="row-meta-item">{formatCurrency(property.estimated_property_value)}</span>
          <span className="row-meta-item">{formatProbability(property.flood_hazard.annual_flood_probability)}</span>
          <span className="row-meta-item">{property.explainability.confidence_score}</span>
        </div>
      </div>
    </div>
  );
};
