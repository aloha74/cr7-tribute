import React from "react";
import { AbsoluteFill, Video, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { PAPER, PaperDefs, PaperFigure, POSES, GrainOverlay } from "../components/Paper";
import { Rise, Slam, Scrim, Flash } from "../components/Kinetic";
import { ActTransition } from "../components/ActTransition";

/* ---------- 250–265: Euro 2016 — leading from the sideline ---------- */
const ShotEuro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 250;
  // urging gesture: arm pumps at 12fps
  const urge = Math.floor(frame / 7.5) % 2 === 0 ? { ...POSES.sideline, armF: 95 } : { ...POSES.sideline, armF: 45 };
  return (
    <>
    <div style={{ position: "absolute", inset: -80, transform: `scale(${interpolate(t, [0, 15], [1, 1.07])})` }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="euro" />
        <rect width={1920} height={1080} fill="url(#euro-nightsky)" />
        {/* stadium glow */}
        <ellipse cx={960} cy={1080} rx={1100} ry={500} fill="#1c2b42" filter="url(#euro-torn-sm)" />
        {/* pitch strip */}
        <rect y={760} width={1920} height={320} fill="#2c5a34" filter="url(#euro-torn-sm)" />
        {/* tiny players */}
        {[500, 700, 1100, 1300].map((x, i) => (
          <g key={i} transform={`translate(${x + Math.sin(t * 2 + i) * 30} 880)`}>
            <circle r={16} fill="#e8b98a" />
            <rect x={-14} y={14} width={28} height={44} fill={i % 2 ? "#b03a2e" : "#274b63"} />
          </g>
        ))}
        {/* the sideline leader — bigger, front */}
        <PaperFigure id="euro" x={960} y={1010} scale={2.2} pose={urge} shirt={"#b03a2e"} shorts={"#274b63"} />
        {/* motion arcs from his urging arm */}
        {[0, 1, 2].map((i) => {
          const p = ((t * 1.4 + i / 3) % 1);
          return <path key={i} d={`M 1120 ${760 - p * 60} q 120 -60 220 -20`} fill="none"
            stroke={PAPER.gold} strokeWidth={7} opacity={(1 - p) * 0.7} strokeLinecap="round" />;
        })}
        {/* trophy, small, glowing */}
        <g transform="translate(1560 880)">
          <path d="M -46 -92 L 46 -92 L 34 -16 L 16 -16 L 16 30 L 46 54 L -46 54 L -16 30 L -16 -16 L -34 -16 Z"
            fill={PAPER.gold} style={{ filter: "drop-shadow(0 0 30px rgba(245,197,24,0.8))" }} />
        </g>
        <GrainOverlay id="euro" />
      </svg>
    </div>
      <Rise at={251} until={256.6} size={58} align="left">Euro 2016. Injured in the final —<br /><b>he led from the sideline.</b></Rise>
      <Rise at={257} size={58} align="left">Portugal's <b>first trophy.</b></Rise>
    </>
  );
};

/* ---------- 265–278: Turin — the ovation ---------- */
const ShotOvation: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 265;
  // paper crowd rising in a wave, row by row
  const rows = 6;
  return (
    <div style={{ position: "absolute", inset: -80 }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="ova" />
        <rect width={1920} height={1080} fill="url(#ova-nightsky)" />
        <circle cx={960} cy={300} r={200} fill="url(#ova-glow)" opacity={0.4} />
        {/* lone figure on the pitch */}
        <PaperFigure id="ova" x={960} y={1000} scale={1.6} pose={POSES.cheer} shirt={PAPER.white} shorts={PAPER.ink} />
        {[...Array(rows)].map((_, r) => {
          const riseP = interpolate(Math.min(1, Math.max(0, (t - r * 0.9) / 1.6)), [0, 1], [0, 1]);
          const re = Easing.out(Easing.back())(riseP);
          const y = 620 - r * 78;
          return (
            <g key={r} transform={`translate(0 ${(1 - re) * 130})`} opacity={0.35 + riseP * 0.65}>
              {[...Array(16)].map((_, i) => {
                const x = 80 + i * 116 + (r % 2) * 58;
                const sway = Math.sin(t * 1.6 + i * 0.8 + r) * 8;
                return (
                  <g key={i} transform={`translate(${x + sway} ${y})`}>
                    <circle r={34 - r * 2} fill={r % 2 ? "#31435c" : "#3d4f6e"} filter="url(#ova-torn-sm)" />
                    <rect x={-(34 - r * 2)} y={18} width={(34 - r * 2) * 2} height={60 - r * 6}
                      fill={r % 2 ? "#2a3a52" : "#354862"} filter="url(#ova-torn-sm)" />
                    {/* clapping hands */}
                    <circle cx={-20} cy={-34 - re * 26} r={10} fill="#e8b98a" />
                    <circle cx={20} cy={-34 - re * 26} r={10} fill="#e8b98a" />
                  </g>
                );
              })}
            </g>
          );
        })}
        <GrainOverlay id="ova" />
      </svg>
      <Rise at={266} until={271.6} size={56} align="left">In Turin, rival fans stood<br />and applauded an opponent.</Rise>
      <Rise at={272} until={277.5} size={56} align="left"><b>That never happens.</b></Rise>
    </div>
  );
};

export const Immortal: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (t < 234.7 || t > 280.4) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: "#060505", overflow: "hidden" }}>
      {/* 235–250: SIUUU, slowed — pre-trimmed close-up (2.5–4.0s of clip08);
          3 loops × 5s at 0.3x. No startFrom (unreliable in render). */}
      {t >= 235 && t < 250.4 && (
        <div style={{ position: "absolute", inset: -60, transform: `scale(${interpolate(t, [235, 250], [1, 1.12])})` }}>
          {[0, 1, 2].map((k) => {
            const ps = 235 + k * 5.0;
            const pe = Math.min(250.5, ps + 5.05);
            if (t < ps || t >= pe) return null;
            return (
              <Sequence key={k} from={Math.round(ps * 30)} durationInFrames={Math.ceil((pe - ps) * 30)}>
                <Video src={staticFile("v4/siuuu-closeup.mp4")} muted
                  playbackRate={0.3}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Sequence>
            );
          })}
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(6,5,8,0.35)" }} />
          <Rise at={236} until={239.6} size={58}>Then he gave the world a word:</Rise>
          <Slam at={240} size={260} color={PAPER.gold}>SIUUU.</Slam>
        </div>
      )}
      {t >= 250 && t < 265.4 && <ShotEuro />}
      {t >= 265 && <ShotOvation />}
      <Scrim opacity={0.35} />
      {t >= 278 && t < 280.2 && (
        <Rise at={278} size={64} color={PAPER.gold} style={{ bottom: 200 }}>
          Some win trophies. <b>Few become a language.</b>
        </Rise>
      )}
      <Flash at={235} peak={0.4} />
      <ActTransition at={279.2} />
    </AbsoluteFill>
  );
};
