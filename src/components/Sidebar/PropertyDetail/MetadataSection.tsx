import React from "react";
import type { PropertyDisplay } from "../../../types";
import { useAppStore } from "../../../hooks/useAppState";
import { REGIONS } from "../../../data/regions";

interface Props {
  property: PropertyDisplay;
}

export const MetadataSection: React.FC<Props> = ({ property }) => {
  const selectedRegion = useAppStore((s) => s.selectedRegion);
  const region = REGIONS.find((r) => r.key === selectedRegion);

  return (
    <div className="detail-section metadata-section">
      <div className="metadata-grid">
        <div className="metadata-item">
          <span className="metadata-label">Archetype</span>
          <span className="metadata-value">{property.property_archetype}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Address</span>
          <span className="metadata-value">{property.address}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Coordinates</span>
          <span className="metadata-value">
            {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
          </span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Region</span>
          <span className="metadata-value">
            {region ? `${region.name} (${region.nameTh})` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};
