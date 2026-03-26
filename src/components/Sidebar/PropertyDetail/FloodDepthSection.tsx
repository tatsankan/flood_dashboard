import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { PropertyDisplay } from "../../../types";
import { Badge } from "../../ui/Badge";

interface Props {
  property: PropertyDisplay;
}

export const FloodDepthSection: React.FC<Props> = ({ property }) => {
  const depths = property.flood_hazard.flood_depth_cm;
  const durations = property.flood_hazard.inundation_duration_hours;
  const damages = property.damage_loss.damage_ratio_by_archetype;

  const data = [
    {
      period: "1-in-10yr",
      depth: depths["1_in_10_year"],
      duration: durations["1_in_10_year"],
      damage: damages["1_in_10_year"],
    },
    {
      period: "1-in-25yr",
      depth: depths["1_in_25_year"],
      duration: null,
      damage: damages["1_in_25_year"],
    },
    {
      period: "1-in-50yr",
      depth: depths["1_in_50_year"],
      duration: durations["1_in_50_year"],
      damage: damages["1_in_50_year"],
    },
    {
      period: "1-in-100yr",
      depth: depths["1_in_100_year"],
      duration: null,
      damage: damages["1_in_100_year"],
    },
  ];

  const BAR_COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#1e3a5f"];

  return (
    <div className="detail-section flood-section">
      <div className="section-header">
        <Badge label="Flood Hazard Profile" color="#0ea5e9" icon="◎" />
      </div>

      <div style={{ width: "100%", height: 140 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="period"
              tick={{ fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}
            />
            <YAxis
              tick={{ fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}
              unit=" cm"
            />
            <Tooltip
              contentStyle={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                background: "#1b1f2b",
                color: "#fff",
                border: "none",
                borderRadius: 4,
              }}
              formatter={(value: number) => [`${value} cm`, "Depth"]}
            />
            <Bar dataKey="depth" radius={[3, 3, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="flood-table">
        <thead>
          <tr>
            <th>Return Period</th>
            <th>Depth</th>
            <th>Duration</th>
            <th>Damage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.period}>
              <td>{row.period}</td>
              <td>{row.depth} cm</td>
              <td>{row.duration != null ? `${row.duration} hrs` : "—"}</td>
              <td>{row.damage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
