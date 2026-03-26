import type { PropertyDisplay } from "../types";
import { formatCurrency, formatProbability, formatPercent, formatScore, formatDepth, formatDuration } from "../utils/formatting";
import { getRiskColor } from "../utils/riskColors";

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
}

export interface QuickAction {
  label: string;
  key: string;
}

export function getWelcomeMessage(property: PropertyDisplay | null): ChatMessage {
  if (!property) {
    return {
      id: "welcome",
      role: "bot",
      text: "Hello! I'm the FloodPulse Risk Advisor. Select a property on the map or from the list, and I can explain its flood risk assessment in detail. 🏠",
    };
  }
  return {
    id: "welcome",
    role: "bot",
    text: `I'm ready to explain the risk assessment for **${property.property_id}** (${property.property_archetype}). What would you like to know?`,
  };
}

export function getQuickActions(property: PropertyDisplay | null): QuickAction[] {
  if (!property) {
    return [
      { label: "How does risk scoring work?", key: "how-scoring" },
      { label: "What data sources are used?", key: "data-sources" },
      { label: "How are premiums calculated?", key: "premium-calc" },
    ];
  }
  return [
    { label: "Explain the risk score", key: "risk-score" },
    { label: "Why this premium?", key: "premium" },
    { label: "What are the risk drivers?", key: "risk-drivers" },
    { label: "Flood depth analysis", key: "flood-depth" },
    { label: "How reliable is this data?", key: "confidence" },
    { label: "What does the loss rate mean?", key: "loss-rate" },
  ];
}

export function getFixedResponse(key: string, property: PropertyDisplay | null): string {
  // General responses (no property selected)
  if (!property) {
    switch (key) {
      case "how-scoring":
        return `**How Risk Scoring Works**\n\nOur ML model assigns each property a **flood risk score from 0 to 100** based on multiple factors:\n\n• **0–20** → Very Low risk\n• **21–40** → Low risk\n• **41–60** → Moderate risk\n• **61–80** → High risk\n• **81–100** → Critical risk\n\nThe score combines elevation data, historical flooding, drainage capacity, proximity to water bodies, and satellite imagery analysis.`;
      case "data-sources":
        return `**Data Sources**\n\nFloodPulse PRO integrates three data streams:\n\n🟣 **IoT Sensors** — Real-time water level, soil moisture, and drainage flow sensors deployed across the region. Updated continuously.\n\n🔵 **Satellite Data** — SAR (Synthetic Aperture Radar) imagery updated every 2 hours. Detects surface water, ground subsidence, and land use changes.\n\n🟡 **ML Model v3.2** — Our proprietary ensemble model trained on 15 years of Thai flood data, incorporating climate projections and urban development patterns.`;
      case "premium-calc":
        return `**Premium Calculation**\n\nThe suggested annual premium is calculated as:\n\n\`Premium = Property Value × Annual Loss Rate × 1.35\`\n\nThe **1.35 multiplier** accounts for:\n• Administrative costs\n• Reinsurance costs\n• Risk margin buffer\n• Claims handling reserves\n\nThe Annual Loss Rate itself comes from the ML model's damage predictions weighted by flood probability.`;
      default:
        return "Please select a property on the map to get a detailed risk explanation.";
    }
  }

  const { flood_hazard, damage_loss, explainability } = property;
  const riskColor = getRiskColor(flood_hazard.flood_risk_band);

  switch (key) {
    case "risk-score":
      return `**Risk Score: ${flood_hazard.flood_risk_score}/100 (${flood_hazard.flood_risk_band})**\n\nThis property scored **${flood_hazard.flood_risk_score}** out of 100 on our composite flood risk index, placing it in the **${flood_hazard.flood_risk_band}** risk band.\n\n${
        flood_hazard.flood_risk_score >= 81
          ? "⚠️ This is a **Critical** risk property. It has a very high likelihood of significant flood damage. Underwriters should apply enhanced scrutiny and consider requiring flood mitigation measures as policy conditions."
          : flood_hazard.flood_risk_score >= 61
          ? "⚠️ This is a **High** risk property. Flood exposure is substantial. The annual flood probability of " + formatProbability(flood_hazard.annual_flood_probability) + " means flooding is expected roughly every " + Math.round(1 / flood_hazard.annual_flood_probability) + " years."
          : flood_hazard.flood_risk_score >= 41
          ? "This property has **Moderate** flood risk. While not in the highest tier, the " + formatProbability(flood_hazard.annual_flood_probability) + " annual probability warrants standard flood coverage provisions."
          : "This property has **relatively low** flood risk. Standard underwriting terms should be appropriate, though periodic reassessment is recommended."
      }\n\nThe drainage score of **${formatScore(flood_hazard.local_drainage_score)}** ${
        flood_hazard.local_drainage_score < 40
          ? "indicates poor local drainage, which significantly worsens flood impact."
          : flood_hazard.local_drainage_score < 60
          ? "shows moderate drainage capability."
          : "indicates good drainage infrastructure, which helps mitigate flood damage."
      }`;

    case "premium":
      return `**Premium Breakdown for ${property.property_id}**\n\n• **Property Value:** ${formatCurrency(property.estimated_property_value)}\n• **Annual Loss Rate:** ${formatPercent(damage_loss.indicative_annual_loss_rate)}\n• **Risk Margin:** ×1.35\n\n**Suggested Premium = ${formatCurrency(property.estimated_property_value)} × ${formatPercent(damage_loss.indicative_annual_loss_rate)} × 1.35 = ${formatCurrency(property.suggested_annual_premium)}**\n\nThis premium should cover the expected annual loss of **${formatCurrency(Math.round(property.estimated_property_value * damage_loss.indicative_annual_loss_rate / 100))}** plus a margin for claims variability and operational costs.\n\nThe **maximum payout estimate** (worst-case 1-in-100yr event) would be **${formatCurrency(property.max_payout_estimate)}**, which is ${formatPercent(damage_loss.damage_ratio_by_archetype["1_in_100_year"])} of property value.`;

    case "risk-drivers":
      return `**Key Risk Drivers for ${property.property_id}**\n\nOur model identified these top factors contributing to the ${flood_hazard.flood_risk_band} risk rating:\n\n${explainability.top_risk_drivers
        .map((d, i) => `${i + 1}. **${d}** — ${getRiskDriverExplanation(d)}`)
        .join("\n\n")}\n\nThese factors are ranked by their contribution weight in the ML model's decision. Addressing any of the top drivers through mitigation could potentially lower the risk score.`;

    case "flood-depth":
      return `**Flood Depth Analysis for ${property.property_id}**\n\nProjected flood depths across return periods:\n\n| Scenario | Depth | Duration | Damage |\n|---|---|---|---|\n| 1-in-10 year | ${formatDepth(flood_hazard.flood_depth_cm["1_in_10_year"])} | ${formatDuration(flood_hazard.inundation_duration_hours["1_in_10_year"])} | ${formatPercent(damage_loss.damage_ratio_by_archetype["1_in_10_year"])} |\n| 1-in-25 year | ${formatDepth(flood_hazard.flood_depth_cm["1_in_25_year"])} | — | ${formatPercent(damage_loss.damage_ratio_by_archetype["1_in_25_year"])} |\n| 1-in-50 year | ${formatDepth(flood_hazard.flood_depth_cm["1_in_50_year"])} | ${formatDuration(flood_hazard.inundation_duration_hours["1_in_50_year"])} | ${formatPercent(damage_loss.damage_ratio_by_archetype["1_in_50_year"])} |\n| 1-in-100 year | ${formatDepth(flood_hazard.flood_depth_cm["1_in_100_year"])} | — | ${formatPercent(damage_loss.damage_ratio_by_archetype["1_in_100_year"])} |\n\n${
        flood_hazard.flood_depth_cm["1_in_100_year"] > 150
          ? "⚠️ The 1-in-100yr depth exceeds **150cm**, which typically means ground-floor complete inundation for most building types. Structural damage risk is very high."
          : flood_hazard.flood_depth_cm["1_in_100_year"] > 80
          ? "The worst-case scenario shows depths that would affect ground-floor contents and potentially structural elements depending on construction type."
          : "Flood depths remain within manageable levels even in extreme scenarios, though water damage to ground-floor contents is still possible."
      }\n\nAs a **${property.property_archetype}**, this building's damage vulnerability follows standard curves for its construction type.`;

    case "confidence":
      return `**Data Confidence Assessment**\n\n• **Model Confidence:** ${explainability.confidence_score} ${
        explainability.confidence_score === "High"
          ? "✓✓✓ — The model has strong input data for this location and high prediction reliability."
          : explainability.confidence_score === "Medium"
          ? "✓✓ — Adequate data coverage, though some input features had gaps that were imputed."
          : "✓ — Limited data availability for this area. Results should be treated as indicative only. On-site inspection recommended."
      }\n\n• **Data Quality:** ${explainability.data_quality_flag} ${
        explainability.data_quality_flag === "Complete"
          ? "— All required data fields have observed values."
          : explainability.data_quality_flag === "Partial"
          ? "— Some data fields were estimated or interpolated from nearby observations."
          : "— Significant data gaps exist. Premium should include an uncertainty loading."
      }\n\n• **Sensor Status:** ${flood_hazard.real_time_sensor_status} ${
        flood_hazard.real_time_sensor_status === "Normal"
          ? "— Nearby IoT sensors are operational and reporting normal water levels."
          : flood_hazard.real_time_sensor_status === "Warning"
          ? "— ⚠️ Nearby sensors detecting elevated water levels. Monitor closely."
          : flood_hazard.real_time_sensor_status === "Critical"
          ? "— 🚨 Critical alert from nearby sensors! Active flooding may be occurring."
          : "— Sensor offline. Real-time monitoring unavailable for this area."
      }\n\n• **Flood History:** ${flood_hazard.historical_flood_frequency_10y} events in the last 10 years${
        flood_hazard.historical_flood_frequency_10y >= 5
          ? " — very frequent flooding, historical data is robust."
          : flood_hazard.historical_flood_frequency_10y >= 2
          ? " — moderate flood history provides reasonable baseline data."
          : " — limited historical events, model relies more on physical characteristics."
      }`;

    case "loss-rate":
      return `**Annual Loss Rate Explained**\n\nThe **indicative annual loss rate** of **${formatPercent(damage_loss.indicative_annual_loss_rate)}** means that, on average, this property is expected to lose **${formatPercent(damage_loss.indicative_annual_loss_rate)} of its value** each year due to flood damage.\n\nIn monetary terms:\n• **Property Value:** ${formatCurrency(property.estimated_property_value)}\n• **Expected Annual Loss:** ${formatCurrency(Math.round(property.estimated_property_value * damage_loss.indicative_annual_loss_rate / 100))}\n\nThis rate is derived from the probability-weighted damage across all return periods:\n• A ${formatProbability(flood_hazard.annual_flood_probability)} chance of flooding causing ${formatPercent(damage_loss.damage_ratio_by_archetype["1_in_10_year"])} – ${formatPercent(damage_loss.damage_ratio_by_archetype["1_in_100_year"])} damage\n\n${
        damage_loss.indicative_annual_loss_rate > 1.5
          ? "⚠️ An annual loss rate above 1.5% is considered **very high** for insurance purposes. This property may require specialized flood cover or risk mitigation conditions."
          : damage_loss.indicative_annual_loss_rate > 0.5
          ? "This loss rate is in the **moderate-to-high** range. Standard flood coverage is appropriate but pricing should reflect the elevated risk."
          : "This loss rate is within **normal parameters** for flood-exposed properties in Thailand."
      }`;

    default:
      return "I don't have information about that. Try selecting one of the suggested questions above!";
  }
}

function getRiskDriverExplanation(driver: string): string {
  const explanations: Record<string, string> = {
    "Low ground elevation":
      "The property sits at a low elevation relative to surrounding terrain and nearby water bodies, making it a natural collection point for floodwater.",
    "Poor drainage capacity":
      "Local drainage infrastructure is insufficient to handle heavy rainfall, leading to surface water accumulation.",
    "Repeated local flood history":
      "Historical records show this location has experienced multiple flood events, indicating a persistent vulnerability.",
    "High impervious surface runoff":
      "High density of paved/concrete surfaces in the area prevents water absorption, increasing runoff volume.",
    "Proximity to river/canal":
      "The property is within the flood plain of a nearby river or canal, exposing it to riverine flooding.",
    "Coastal storm surge exposure":
      "Located in an area vulnerable to tidal surges and coastal storm events.",
    "High soil moisture saturation":
      "Soil in this area maintains high moisture levels, reducing its capacity to absorb additional rainfall.",
    "Upstream dam overflow risk":
      "Located downstream of a reservoir that has historically approached capacity during heavy monsoon seasons.",
    "Inadequate flood barriers":
      "Local flood defenses (levees, walls, pumps) are absent or insufficient for the projected flood levels.",
    "Recent land subsidence detected":
      "Satellite data shows ground-level sinking in this area, increasing relative flood exposure over time.",
    "High water table level":
      "The water table is close to the surface, reducing the ground's ability to absorb rainfall and increasing basement/foundation flood risk.",
    "Deforestation in catchment area":
      "Upstream forest loss has reduced natural water retention, increasing peak flow volumes during rainfall.",
    "Blocked drainage infrastructure":
      "Drainage channels in the vicinity show signs of obstruction or reduced capacity.",
    "Low slope gradient":
      "The terrain is very flat, meaning floodwater drains away slowly once accumulated.",
    "Urban heat island runoff effect":
      "Urban heat island effects intensify local rainfall, while dense urbanization accelerates runoff.",
  };
  return explanations[driver] || "A contributing factor identified by the ML model.";
}
