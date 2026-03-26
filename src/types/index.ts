export type RiskBand = "Very Low" | "Low" | "Moderate" | "High" | "Critical";
export type ConfidenceScore = "High" | "Medium" | "Low";
export type DataQualityFlag = "Complete" | "Partial" | "Insufficient";
export type SensorStatus = "Normal" | "Warning" | "Critical" | "Offline";

export type PropertyArchetype =
  | "Residential Concrete House"
  | "Residential Wooden House"
  | "Residential Townhouse"
  | "Commercial Shophouse"
  | "Commercial Office Building"
  | "Commercial Retail/Mall"
  | "Industrial Warehouse"
  | "Industrial Factory"
  | "Agricultural Open Land"
  | "Agricultural Processing Facility";

export type ArchetypeCategory =
  | "residential"
  | "commercial"
  | "industrial"
  | "agricultural";

export interface ReturnPeriodValues {
  "1_in_10_year": number;
  "1_in_25_year": number;
  "1_in_50_year": number;
  "1_in_100_year": number;
}

export interface InundationDuration {
  "1_in_10_year": number;
  "1_in_50_year": number;
}

export interface FloodHazard {
  flood_risk_score: number;
  flood_risk_band: RiskBand;
  annual_flood_probability: number;
  flood_depth_cm: ReturnPeriodValues;
  inundation_duration_hours: InundationDuration;
  local_drainage_score: number;
  historical_flood_frequency_10y: number;
  real_time_sensor_status: SensorStatus;
}

export interface DamageLoss {
  damage_ratio_by_archetype: ReturnPeriodValues;
  indicative_annual_loss_rate: number;
}

export interface Explainability {
  top_risk_drivers: string[];
  confidence_score: ConfidenceScore;
  data_quality_flag: DataQualityFlag;
}

export interface MLModelOutput {
  property_id: string;
  address: string;
  latitude: number;
  longitude: number;
  property_archetype: PropertyArchetype;
  flood_hazard: FloodHazard;
  damage_loss: DamageLoss;
  explainability: Explainability;
}

export interface PropertyDisplay extends MLModelOutput {
  estimated_property_value: number;
  suggested_annual_premium: number;
  max_payout_estimate: number;
  archetype_category: ArchetypeCategory;
}

export interface Region {
  key: string;
  name: string;
  nameTh: string;
  code: string;
  center: [number, number];
  zoom: number;
  bbox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  stats: {
    population: string;
    area: string;
    avgElevation: string;
    floodFrequency: string;
    activeSensors: number;
  };
}
