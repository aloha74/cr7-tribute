import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Counter, Slam, WordStagger, Flash } from "../components/Kinetic";
import { Grade, Whip } from "../components/FX";
import { FPS, beatPhase } from "../cue";

/** 250–280s: the kinetic count 0 -> 900+. No report cards. */
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const inWin = t >= 250 && t <= 280;
  if (!inWin) return null;
  // drifting gold particles (pure CSS, always moving)
  const parts = Array.from({ length: 26 });
  return (
    <AbsoluteFill>
      {parts.map((_, i) => {
        const x = (i * 197) % 1920;
        const spd = 0.5 + ((i * 53) % 100) / 120;
        const y = ((t - 250) * 90 * spd + (i * 331) % 1080) % 1180 - 60;
        const o = 0.25 + ((i * 29) % 50) / 100;
        return <div key={i} style={{
          position: "absolute", left: x, top: y, width: 5 + (i % 4), height: 5 + (i % 4),
          borderRadius: "50%", backgroundColor: "#f5c518", opacity: o,
          boxShadow: "0 0 14px rgba(245,197,24,0.8)",
        }} />;
      })}
      <Counter at={250} dur={24} to={900} suffix="+" size={430} until={279} />
      <Flash at={262} durF={3} peak={0.5} />
      <Flash at={270} durF={4} peak={0.7} />
      <Slam at={275} until={279.5} size={120} color="#f3e9d2">{"BÀN THẮNG. VÀ VẪN ĐẾM TIẾP."}</Slam>
      <Whip at={279.7} />
      <Grade />
    </AbsoluteFill>
  );
};
