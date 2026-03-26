import React, { useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { PropertyDisplay, ArchetypeCategory } from "../../types";
import { getRiskColor } from "../../utils/riskColors";
import { formatCurrency } from "../../utils/formatting";
import { useAppStore } from "../../hooks/useAppState";

const SHAPES: Record<ArchetypeCategory, string> = {
  residential: "polygon(50% 0%, 0% 100%, 100% 100%)", // triangle
  commercial: "none", // square (default)
  industrial: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", // hexagon
  agricultural: "circle(50%)", // circle
};

function createMarkerIcon(
  category: ArchetypeCategory,
  color: string,
  isSelected: boolean,
  isHovered: boolean,
  isCritical: boolean
): L.DivIcon {
  const baseSize = isSelected ? 18 : isHovered ? 14 : 10;
  const shape = category === "commercial" ? "" : `clip-path: ${SHAPES[category]};`;
  const borderRadius = category === "commercial" ? "2px" : category === "agricultural" ? "50%" : "0";
  const border = isSelected ? "border: 2px solid #fff; box-shadow: 0 0 8px rgba(0,0,0,0.5);" : "";
  const pulse = isCritical && !isSelected
    ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${baseSize + 12}px;height:${baseSize + 12}px;border-radius:50%;border:2px solid ${color};animation:pulse 2s infinite;"></div>`
    : "";

  const html = `
    <div style="position:relative;width:${baseSize}px;height:${baseSize}px;">
      ${pulse}
      <div style="
        width:${baseSize}px;
        height:${baseSize}px;
        background:${color};
        ${shape}
        border-radius:${borderRadius};
        ${border}
        transition: all 0.15s ease;
        position:relative;
        z-index:1;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-marker",
    iconSize: [baseSize + 14, baseSize + 14],
    iconAnchor: [(baseSize + 14) / 2, (baseSize + 14) / 2],
  });
}

interface PropertyMarkerProps {
  property: PropertyDisplay;
}

export const PropertyMarker: React.FC<PropertyMarkerProps> = React.memo(
  ({ property }) => {
    const selectedPropertyId = useAppStore((s) => s.selectedPropertyId);
    const hoveredPropertyId = useAppStore((s) => s.hoveredPropertyId);
    const selectProperty = useAppStore((s) => s.selectProperty);
    const setHoveredProperty = useAppStore((s) => s.setHoveredProperty);

    const isSelected = selectedPropertyId === property.property_id;
    const isHovered = hoveredPropertyId === property.property_id;
    const isCritical = property.flood_hazard.flood_risk_band === "Critical";
    const color = getRiskColor(property.flood_hazard.flood_risk_band);

    const icon = useMemo(
      () =>
        createMarkerIcon(
          property.archetype_category,
          color,
          isSelected,
          isHovered,
          isCritical
        ),
      [property.archetype_category, color, isSelected, isHovered, isCritical]
    );

    return (
      <Marker
        position={[property.latitude, property.longitude]}
        icon={icon}
        zIndexOffset={isSelected ? 1000 : isHovered ? 500 : 0}
        eventHandlers={{
          click: () => selectProperty(property.property_id),
          mouseover: () => setHoveredProperty(property.property_id),
          mouseout: () => setHoveredProperty(null),
        }}
        aria-label={`${property.property_id} - ${property.flood_hazard.flood_risk_band} risk`}
      >
        <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
            <div style={{ fontWeight: 600 }}>{property.property_id}</div>
            <div style={{ color: "#5a5647", fontSize: 10, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {property.address}
            </div>
            <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ color }}>{property.flood_hazard.flood_risk_band}</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(property.suggested_annual_premium)}</span>
            </div>
          </div>
        </Tooltip>
      </Marker>
    );
  }
);
