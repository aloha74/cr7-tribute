import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { FPS } from "../../timeline";

export interface ClubBar {
  club: string;
  goals: number;
  color: string;
  note?: string;
}

export const CLUB_BARS: ClubBar[] = [
  { club: "Sporting CP", goals: 5, color: "#2e7d46", note: "where it started" },
  { club: "Man United", goals: 145, color: "#c8102e", note: "the making" },
  { club: "Real Madrid", goals: 450, color: "#e8e6df", note: "the peak" },
  { club: "Juventus", goals: 101, color: "#8a8a8a", note: "the reinvention" },
  { club: "Portugal", goals: 130, color: "#0a6e3c", note: "for country · and counting" },
];

interface GoalsChartProps {
  /** absolute time (s) when the first bar starts drawing */
  at: number;
  sceneStart: number;
  width?: number;
  height?: number;
}

/**
 * Data-storytelling bar chart: bars draw mark-by-mark on the beat, each with a
 * pinned handwritten note. The chart is the plot — no decoration.
 */
export const GoalsChart: React.FC<GoalsChartProps> = ({
  at,
  sceneStart,
  width = 1500,
  height = 560,
}) => {
  const frame = useCurrentFrame();
  const maxGoals = 450;
  const barW = 150;
  const gap = (width - barW * CLUB_BARS.length) / (CLUB_BARS.length - 1);

  return (
    <div style={{ width, height, position: "relative" }}>
      {CLUB_BARS.map((b, i) => {
        const barStart = Math.round((at + i * 1.1) * FPS) - sceneStart;
        const local = frame - barStart;
        const p = spring({
          frame: local,
          fps: FPS,
          config: { damping: 16, mass: 0.9, stiffness: 140 },
        });
        const h = interpolate(p, [0, 1], [0, (b.goals / maxGoals) * (height - 170)], {
          extrapolateRight: "clamp",
        });
        const labelP = spring({
          frame: local - 14,
          fps: FPS,
          config: { damping: 18, stiffness: 160 },
        });
        const value = Math.round(interpolate(p, [0, 1], [0, b.goals], { extrapolateRight: "clamp" }));
        if (local < 0) return null;
        const x = i * (barW + gap);
        return (
          <div key={b.club} style={{ position: "absolute", left: x, bottom: 90, width: barW }}>
            <div
              style={{
                opacity: interpolate(labelP, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 64, color: "#fff", lineHeight: 1 }}>
                {value}
              </div>
              {b.note && (
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: "italic",
                    fontSize: 24,
                    color: "#f5c518",
                    marginTop: 6,
                  }}
                >
                  {b.note}
                </div>
              )}
            </div>
            <div
              style={{
                width: barW,
                height: Math.max(0, h),
                backgroundColor: b.color,
                boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
              }}
            />
            <div
              style={{
                marginTop: 14,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
                textAlign: "center",
              }}
            >
              {b.club}
            </div>
          </div>
        );
      })}
      {/* baseline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 88,
          height: 3,
          backgroundColor: "rgba(255,255,255,0.35)",
        }}
      />
    </div>
  );
};
