import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useAppStore } from "../../hooks/useAppState";
import { useFilteredProperties } from "../../hooks/useFilteredProperties";
import { REGIONS } from "../../data/regions";
import { PropertyMarker } from "./PropertyMarker";
import { MapLegend } from "./MapLegend";
import "leaflet/dist/leaflet.css";

function MapController() {
  const map = useMap();
  const selectedRegion = useAppStore((s) => s.selectedRegion);
  const selectedPropertyId = useAppStore((s) => s.selectedPropertyId);
  const properties = useAppStore((s) => s.properties);
  const prevRegion = useRef(selectedRegion);

  useEffect(() => {
    if (selectedRegion !== prevRegion.current) {
      const region = REGIONS.find((r) => r.key === selectedRegion);
      if (region) {
        map.flyTo(region.center, region.zoom, { duration: 1.2 });
      }
      prevRegion.current = selectedRegion;
    }
  }, [selectedRegion, map]);

  useEffect(() => {
    if (selectedPropertyId) {
      const prop = properties.find((p) => p.property_id === selectedPropertyId);
      if (prop) {
        map.flyTo([prop.latitude, prop.longitude], Math.max(map.getZoom(), 14), {
          duration: 0.8,
        });
      }
    }
  }, [selectedPropertyId, properties, map]);

  return null;
}

export const FloodMap: React.FC = () => {
  const selectedRegion = useAppStore((s) => s.selectedRegion);
  const region = REGIONS.find((r) => r.key === selectedRegion) || REGIONS[0];
  const filteredProperties = useFilteredProperties();

  const markers = useMemo(
    () =>
      filteredProperties.map((p) => (
        <PropertyMarker key={p.property_id} property={p} />
      )),
    [filteredProperties]
  );

  return (
    <div className="map-container">
      <MapContainer
        center={region.center}
        zoom={region.zoom}
        className="leaflet-map"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          className="desaturated-tiles"
        />
        <MapController />
        {markers}
      </MapContainer>
      <div className="map-overlay" />
      <MapLegend />
    </div>
  );
};
