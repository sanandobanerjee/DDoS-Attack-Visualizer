"use client";

import { DDoSAttack } from "@/types/attacks";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapComponentProps {
  attacks: DDoSAttack[];
}

export default function MapComponent({ attacks }: MapComponentProps) {
  const recentAttacks = attacks.slice(0, 100);

  const lngLatToXY = (lng: number, lat: number): [number, number] => {
    // Simple equirectangular projection for markers
    // react-simple-maps handles its own projection internally
    return [lng, lat];
  };

  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      <ComposableMap projection="geoEquirectangular">
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#0f2a47" />
            <stop offset="100%" stopColor="#061527" />
          </linearGradient>
        </defs>

        {/* Ocean background */}
        <rect x="-180" y="-90" width="360" height="180" fill="#0f172a" />
        <rect x="-180" y="-90" width="360" height="180" fill="url(#waterGradient)" />

        {/* Render world countries with accurate coastlines */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#1e4d2e",
                    stroke: "#2a6b3e",
                    strokeWidth: 0.75,
                    outline: "none",
                    opacity: 0.75,
                  },
                  hover: {
                    fill: "#2a6b3e",
                    stroke: "#3a8b4e",
                    strokeWidth: 0.75,
                    outline: "none",
                    opacity: 0.85,
                    cursor: "pointer",
                  },
                  pressed: {
                    fill: "#1e4d2e",
                    stroke: "#2a6b3e",
                    strokeWidth: 0.75,
                    outline: "none",
                    opacity: 0.75,
                  },
                }}
              />
            ))
          }
        </Geographies>

        {/* Attack flow lines */}
        {recentAttacks.slice(0, 30).map((attack) => (
          <Line
            key={`line-${attack.id}`}
            from={[attack.source.lng, attack.source.lat]}
            to={[attack.target.lng, attack.target.lat]}
            stroke="#ef4444"
            strokeWidth={0.5}
            strokeOpacity={0.35}
            strokeDasharray="2,1"
          />
        ))}

        {/* Attack markers */}
        {recentAttacks.map((attack) => {
          const radius = Math.max(1.5, Math.min(4, attack.magnitude / 30));

          return (
            <g key={attack.id}>
              {/* Source - Red attack origin */}
              <Marker coordinates={[attack.source.lng, attack.source.lat]}>
                <circle
                  r={radius + 1}
                  fill="#ef4444"
                  opacity="0.2"
                  strokeWidth={0}
                />
                <circle
                  r={radius}
                  fill="#ef4444"
                  opacity="0.9"
                  strokeWidth={0}
                />
              </Marker>
              {/* Target - Yellow attack destination */}
              <Marker coordinates={[attack.target.lng, attack.target.lat]}>
                <circle
                  r={radius}
                  fill="#fbbf24"
                  opacity="0.7"
                  strokeWidth={0}
                />
              </Marker>
            </g>
          );
        })}
      </ComposableMap>
    </div>
  );
}