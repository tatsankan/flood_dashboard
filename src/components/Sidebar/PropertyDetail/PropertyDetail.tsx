import React from "react";
import { useAppStore } from "../../../hooks/useAppState";
import { RiskBadge } from "../../ui/RiskBadge";
import { MLOutputSection } from "./MLOutputSection";
import { FloodDepthSection } from "./FloodDepthSection";
import { SensorSection } from "./SensorSection";
import { ExplainabilitySection } from "./ExplainabilitySection";
import { MetadataSection } from "./MetadataSection";
import { ArrowLeft } from "lucide-react";

export const PropertyDetail: React.FC = () => {
  const selectedPropertyId = useAppStore((s) => s.selectedPropertyId);
  const properties = useAppStore((s) => s.properties);
  const selectProperty = useAppStore((s) => s.selectProperty);

  const property = properties.find((p) => p.property_id === selectedPropertyId);
  if (!property) return null;

  return (
    <div className="property-detail">
      <button className="back-button" onClick={() => selectProperty(null)}>
        <ArrowLeft size={14} />
        Back to list
      </button>

      <div className="detail-header">
        <span className="detail-id">{property.property_id}</span>
        <span className="detail-address">{property.address}</span>
        <div className="detail-header-row">
          <span className="detail-archetype">{property.property_archetype}</span>
          <RiskBadge band={property.flood_hazard.flood_risk_band} />
        </div>
      </div>

      <MLOutputSection property={property} />
      <FloodDepthSection property={property} />
      <SensorSection property={property} />
      <ExplainabilitySection property={property} />
      <MetadataSection property={property} />
    </div>
  );
};
