import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { PAPER, PaperDefs, GrainOverlay } from "../components/Paper";
import { Rise, Slam, Flash, Scrim } from "../components/Kinetic";
import { HITS } from "../timeline";

/** Epilogue (280–300): the answer. Triumphant, then silence. */
export const Epilogue: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (t < 279.7 || t > 300) return null;
  // slow pull-back
  const pull = interpolate(Math.min(1, Math.max(0, (t - 280) / 20)), [0, 1], [1.1, 1]);
  // drifting gold dust
  const dust = [...Array(40)].map((_, i) => ({
    x: (i * 467) % 1920, y: (i * 823 + t * 24) % 1080, s: 2 + (i % 4),
    o: 0.25 + 0.35 * Math.sin(t * 1.5 + i),
  }));
  return (
    <AbsoluteFill style={{ backgroundColor: "#080604", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -60, transform: `scale(${pull})` }}>
        <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
          <PaperDefs id="epi" />
          <rect width={1920} height={1080} fill="#0a0806" />
          <circle cx={960} cy={540} r={620} fill="url(#epi-glow)" opacity={0.28} />
          {dust.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={PAPER.gold} opacity={Math.max(0, d.o)} />
          ))}
          <GrainOverlay id="epi" />
        </svg>
      </div>

      <Slam at={280} until={285.8} size={150} color={PAPER.gold}>130+ FOR PORTUGAL.</Slam>
      <Rise at={282.5} until={285.8} size={52}>The most international goals in men's football history.</Rise>

      {t >= 286 && (
        <Rise at={286} until={291.8} size={84} color="#f3e9d2" style={{ bottom: 420 }}>
          It was <b>never talent.</b>
        </Rise>
      )}
      {t >= 292 && (
        <Rise at={292} until={295.8} size={60} color="#f3e9d2" style={{ bottom: 260 }}>
          It was what he did <b>when nobody was watching.</b>
        </Rise>
      )}

      {t >= 296 && (
        <>
          <Slam at={296} size={130} color={PAPER.gold} style={{ alignItems: "flex-start", paddingTop: 300 }}>
            900+. AND STILL COUNTING.
          </Slam>
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center",
            fontFamily: "'Inter', sans-serif", fontSize: 27, color: "rgba(243,233,210,0.75)", lineHeight: 1.7,
            opacity: interpolate(Math.min(1, (t - 296.5) / 1.5), [0, 1], [0, 1]),
          }}>
            Footage: “All 48 goals of Cristiano Ronaldo, in 35 league matches for Real Madrid (2014–15)”<br />
            CC BY 3.0 · Wikimedia Commons · Music composed in code · Paper, 3D &amp; type built in code
          </div>
        </>
      )}

      <Scrim opacity={0.2} />
      <Flash at={HITS.finalHit} peak={0.7} />
    </AbsoluteFill>
  );
};
