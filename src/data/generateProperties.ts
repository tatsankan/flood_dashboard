import type { PropertyDisplay, RiskBand, SensorStatus, ConfidenceScore, DataQualityFlag } from "../types";
import type { Region } from "../types";
import { seededRandom } from "../utils/seededRandom";
import { ARCHETYPES, ARCHETYPE_WEIGHTS, getCategoryFromArchetype } from "./archetypes";
import { RISK_DRIVER_POOL } from "./riskDrivers";

const THAI_STREETS: Record<string, string[]> = {
  BKK: [
    "Sukhumvit", "Silom", "Sathorn", "Ratchadaphisek", "Phahonyothin",
    "Lat Phrao", "Rama IV", "Charoen Krung", "Petchaburi", "Wireless",
    "Thonglor", "Ekkamai", "Asoke", "Nana", "Pratunam",
  ],
  SKA: [
    "Kanjanavanich", "Ramwithi", "Niphat Uthit", "Phetkasem", "Saiburi",
    "Ranot", "Hat Yai Nai", "Songkhla-Ranot", "Chalerm Prakiat", "Nakhon Nok",
  ],
  AYA: [
    "Rojana", "U-Thong", "Chee Kun", "Khlong Sra Bua", "Naresuan",
    "Phra Nakhon Si", "Bang Pa-in", "Ayothaya", "Si Sanphet", "Dusit",
  ],
  CNX: [
    "Nimmanhemin", "Huay Kaew", "Chang Klan", "Tha Phae", "Chiang Mai-Lamphun",
    "Suthep", "Mahidol", "Chotana", "Superhighway", "Canal",
  ],
  NMA: [
    "Mittraphap", "Chomphon", "Suranarai", "Ratchasima-Khon Kaen", "Assadang",
    "Pho Klang", "Manat", "Chang Phueak", "Yommarat", "Jomsurangyard",
  ],
  SPK: [
    "Sukhumvit", "Theparak", "Si Nakarin", "Bang Na-Trat", "Srinakarin",
    "Phraeksa", "Paknam", "Samrong", "Poochaosamingprai", "Kingkaew",
  ],
};

function pickWeighted(rand: () => number, weights: number[]): number {
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return i;
  }
  return weights.length - 1;
}

function getRiskBand(score: number): RiskBand {
  if (score <= 20) return "Very Low";
  if (score <= 40) return "Low";
  if (score <= 60) return "Moderate";
  if (score <= 80) return "High";
  return "Critical";
}

function pickFrom<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randRange(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(randRange(rand, min, max + 1));
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function generateProperties(region: Region): PropertyDisplay[] {
  const seed = region.key.split("").reduce((s, c) => s + c.charCodeAt(0), 0) * 137;
  const rand = seededRandom(seed);
  const count = randInt(rand, 40, 80);
  const streets = THAI_STREETS[region.code] || THAI_STREETS.BKK;
  const properties: PropertyDisplay[] = [];

  for (let i = 0; i < count; i++) {
    const archetypeIdx = pickWeighted(rand, ARCHETYPE_WEIGHTS);
    const archetype = ARCHETYPES[archetypeIdx];

    const lat = randRange(rand, region.bbox.minLat, region.bbox.maxLat);
    const lng = randRange(rand, region.bbox.minLng, region.bbox.maxLng);

    const street = pickFrom(streets, rand);
    const num = randInt(rand, 1, 999);
    const soi = randInt(rand, 1, 50);
    const address = `${num}/${soi} ${street}, ${region.name}, Thailand`;

    const propertyId = `${region.code}-${String(i + 1).padStart(6, "0")}`;

    // Risk score 0-100
    const floodRiskScore = randInt(rand, 0, 100);
    const floodRiskBand = getRiskBand(floodRiskScore);

    // Flood probability correlated with risk score
    const baseProbability = (floodRiskScore / 100) * 0.7 + rand() * 0.15;
    const annualFloodProbability = clamp(parseFloat(baseProbability.toFixed(2)), 0.01, 0.85);

    // Flood depths (monotonically increasing)
    const depth10 = clamp(randInt(rand, 0, 80), 0, 80);
    const depth25 = clamp(Math.round(depth10 * (1.4 + rand() * 0.4)), 10, 130);
    const depth50 = clamp(Math.round(depth25 * (1.2 + rand() * 0.4)), 20, 180);
    const depth100 = clamp(Math.round(depth50 * (1.2 + rand() * 0.4)), 30, 250);

    // Inundation durations
    const duration10 = clamp(randInt(rand, 0, 48), 0, 48);
    const duration50 = clamp(Math.round(duration10 * (1.5 + rand() * 1.5)), 0, 120);

    // Drainage inversely correlated with risk
    const drainageScore = clamp(randInt(rand, 100 - floodRiskScore - 20, 100 - floodRiskScore + 20), 0, 100);

    // Historical flood frequency
    const histFreq = clamp(Math.round((floodRiskScore / 100) * 8 + (rand() - 0.5) * 4), 0, 10);

    // Sensor status
    const sensorRoll = rand();
    let sensorStatus: SensorStatus = "Normal";
    if (sensorRoll > 0.95) sensorStatus = "Offline";
    else if (sensorRoll > 0.85) sensorStatus = "Critical";
    else if (sensorRoll > 0.70) sensorStatus = "Warning";

    // Damage ratios (monotonically increasing, correlated with depths)
    const dr10 = clamp(parseFloat((0.1 + rand() * 4.9 * (depth10 / 80)).toFixed(1)), 0.1, 5.0);
    const dr25 = clamp(parseFloat((dr10 * (1.5 + rand())).toFixed(1)), 0.5, 12.0);
    const dr50 = clamp(parseFloat((dr25 * (1.3 + rand() * 0.7)).toFixed(1)), 1.0, 20.0);
    const dr100 = clamp(parseFloat((dr50 * (1.2 + rand() * 0.8)).toFixed(1)), 2.0, 35.0);

    // Annual loss rate
    const annualLossRate = clamp(
      parseFloat((annualFloodProbability * dr10 * 0.5 + rand() * 0.5).toFixed(2)),
      0.01,
      2.5
    );

    // Risk drivers: pick 3-5
    const driverCount = randInt(rand, 3, 5);
    const shuffled = [...RISK_DRIVER_POOL].sort(() => rand() - 0.5);
    const topRiskDrivers = shuffled.slice(0, driverCount);

    // Confidence
    const confRoll = rand();
    let confidenceScore: ConfidenceScore = "High";
    if (confRoll > 0.9) confidenceScore = "Low";
    else if (confRoll > 0.6) confidenceScore = "Medium";

    // Data quality
    const dqRoll = rand();
    let dataQualityFlag: DataQualityFlag = "Complete";
    if (dqRoll > 0.95) dataQualityFlag = "Insufficient";
    else if (dqRoll > 0.75) dataQualityFlag = "Partial";

    // Estimated property value
    const [minVal, maxVal] = archetype.valueRange;
    const estimatedPropertyValue = Math.round(randRange(rand, minVal, maxVal));

    // Derived
    const suggestedAnnualPremium = Math.round(estimatedPropertyValue * (annualLossRate / 100) * 1.35);
    const maxPayoutEstimate = Math.round(estimatedPropertyValue * (dr100 / 100));

    properties.push({
      property_id: propertyId,
      address,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      property_archetype: archetype.name,
      flood_hazard: {
        flood_risk_score: floodRiskScore,
        flood_risk_band: floodRiskBand,
        annual_flood_probability: annualFloodProbability,
        flood_depth_cm: {
          "1_in_10_year": depth10,
          "1_in_25_year": depth25,
          "1_in_50_year": depth50,
          "1_in_100_year": depth100,
        },
        inundation_duration_hours: {
          "1_in_10_year": duration10,
          "1_in_50_year": duration50,
        },
        local_drainage_score: drainageScore,
        historical_flood_frequency_10y: histFreq,
        real_time_sensor_status: sensorStatus,
      },
      damage_loss: {
        damage_ratio_by_archetype: {
          "1_in_10_year": dr10,
          "1_in_25_year": dr25,
          "1_in_50_year": dr50,
          "1_in_100_year": dr100,
        },
        indicative_annual_loss_rate: annualLossRate,
      },
      explainability: {
        top_risk_drivers: topRiskDrivers,
        confidence_score: confidenceScore,
        data_quality_flag: dataQualityFlag,
      },
      estimated_property_value: estimatedPropertyValue,
      suggested_annual_premium: suggestedAnnualPremium,
      max_payout_estimate: maxPayoutEstimate,
      archetype_category: getCategoryFromArchetype(archetype.name),
    });
  }

  return properties;
}
