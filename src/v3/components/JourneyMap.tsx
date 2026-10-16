import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { FPS } from "../../timeline";

interface Stop {
  name: string;
  year: string;
  x: number;
  y: number;
  /** label nudges to avoid line collisions */
  ndx?: number;
  ndy?: number;
  ydy?: number;
}

const STOPS: Stop[] = [
  { name: "Funchal", year: "1985", x: 180, y: 560 },
  { name: "Lisbon", year: "2002", x: 330, y: 470 },
  { name: "Manchester", year: "2003", x: 620, y: 180, ydy: 26 },
  { name: "Madrid", year: "2009", x: 450, y: 430, ndy: -30 },
  { name: "Turin", year: "2018", x: 800, y: 330 },
];

const LEG_PATHS = [
  "M 180 560 Q 240 520 330 470",
  "M 330 470 Q 480 340 620 180",
  "M 620 180 Q 560 300 450 430",
  "M 450 430 Q 620 400 800 330",
];

interface JourneyMapProps {
  at: number;
  sceneStart: number;
  /** seconds per leg */
  legTime?: number;
  /** how many stops to show (default all) */
  count?: number;
}

/**
 * Paper-collage journey map: stylized landmasses, a dashed path that draws
 * itself leg by leg, city dots popping in with year stamps. The map is the story.
 */
export const JourneyMap: React.FC<JourneyMapProps> = ({ at, sceneStart, legTime = 2.2, count }) => {
  const frame = useCurrentFrame();
  const t0 = Math.round(at * FPS) - sceneStart;
  const stops = count ? STOPS.slice(0, count) : STOPS;

  // legs draw one by one
  const totalLegs = stops.length - 1;

  return (
    <svg width={1500} height={700} viewBox="0 0 1500 700" style={{ overflow: "visible" }}>
      {/* paper landmasses (stylized) */}
      <g fill="#2b2620" stroke="#4a4238" strokeWidth={2}>
        <path d="M 220 380 L 560 360 L 600 480 L 520 600 L 280 590 L 200 480 Z" opacity={0.9} />
        <path d="M 560 100 L 720 90 L 740 260 L 640 300 L 560 240 Z" opacity={0.9} />
        <path d="M 780 260 L 900 250 L 920 420 L 860 520 L 790 470 L 760 340 Z" opacity={0.9} />
        <ellipse cx={180} cy={560} rx={34} ry={22} opacity={0.9} />
      </g>
      {/* travel legs */}
      {LEG_PATHS.slice(0, totalLegs).map((d, li) => {
        const legStart = t0 + li * legTime * FPS;
        const dp = interpolate(frame, [legStart, legStart + legTime * FPS], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <g key={li}>
            <path d={d} fill="none" stroke="#f5c518" strokeWidth={7} strokeLinecap="round"
              strokeDasharray="20 16" pathLength={100} opacity={0.25} />
            <path d={d} fill="none" stroke="#f5c518" strokeWidth={7} strokeLinecap="round"
              pathLength={100} strokeDasharray="100" strokeDashoffset={100 - dp * 100}
              style={{ filter: "drop-shadow(0 0 12px rgba(245,197,24,0.8))" }} />
          </g>
        );
      })}
      {/* stops */}
      {stops.map((s, i) => {
        const popAt = t0 + i * legTime * FPS;
        const p = spring({ frame: frame - popAt, fps: FPS, config: { damping: 12, stiffness: 200 } });
        if (frame < popAt) return null;
        const r = interpolate(p, [0, 1], [0, 16], { extrapolateRight: "clamp" });
        return (
          <g key={s.name}>
            <circle cx={s.x} cy={s.y} r={r + 10} fill="none" stroke="#f5c518" strokeWidth={3} opacity={0.6} />
            <circle cx={s.x} cy={s.y} r={r} fill="#f5c518" />
            <text
              x={s.x + (s.ndx ?? 0)}
              y={s.y - 34 + (s.ndy ?? 0)}
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="'Inter', sans-serif"
              fontWeight={800}
              fontSize={30}
              letterSpacing={2}
            >
              {s.name.toUpperCase()}
            </text>
            <text
              x={s.x}
              y={s.y + 52 + (s.ydy ?? 0)}
              textAnchor="middle"
              fill="#f5c518"
              fontFamily="'Anton', sans-serif"
              fontSize={34}
            >
              {s.year}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
