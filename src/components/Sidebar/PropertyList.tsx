import React from "react";
import { useFilteredProperties } from "../../hooks/useFilteredProperties";
import { PropertyRow } from "./PropertyRow";

export const PropertyList: React.FC = () => {
  const properties = useFilteredProperties();

  return (
    <div className="property-list">
      {properties.length === 0 ? (
        <div className="no-results">No properties match your filters</div>
      ) : (
        properties.map((p, i) => (
          <PropertyRow key={p.property_id} property={p} index={i} />
        ))
      )}
    </div>
  );
};
