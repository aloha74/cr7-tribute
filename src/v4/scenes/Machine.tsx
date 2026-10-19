import React from "react";
import { AbsoluteFill, Video, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { MONTAGE_CUTS, HITS } from "../timeline";
import { PAPER } from "../components/Paper";
import { Slam, Rise, Counter, Flash, Scrim } from "../components/Kinetic";
import { GoalBurst } from "../components/GoalBurst";
import { ActTransition } from "../components/ActTransition";

/** Whip cut: outgoing punches left, incoming whips from right. 8 frames. */
const WhipCut: React.FC<{ children: React.ReactNode; local: number }> = ({ children, local }) => {
  // local: frames since this cut started
  const inp = Math.min(1, local / 8);
  const e = Easing.out(Easing.cubic)(inp);
  const x = interpolate(e, [0, 1], [960, 0]);
  const squash = local < 4 ? interpolate(local, [0, 4], [1.35, 1]) : 1;
  return (
    <div style={{
      position: "absolute", inset: -80,
      transform: `translateX(${x}px) scaleX(${squash})`,
      opacity: inp === 0 ? 0 : 1,
    }}>{children}</div>
  );
};

const MontageClip: React.FC<{ at: number; clip: string; label: string; sub?: string; next: number }> = ({
  at, clip, label, sub, next,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const local = frame - at * 30;
  const dur = next - at;
  if (t < at || t >= next) return null;
  // punch zoom that resets on every cut
  const zoom = 1 + (local / 30) * 0.09;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <WhipCut local={local}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
          <Sequence from={Math.round(at * 30)} durationInFrames={Math.ceil(dur * 30) + 2}>
            <Video src={staticFile(clip)} muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Sequence>
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.22)" }} />
        </div>
      </WhipCut>
      {/* gold burst on the hit */}
      {local < 55 && <GoalBurst />}
      {/* label */}
      <div style={{
        position: "absolute", left: 100, bottom: 110,
        opacity: interpolate(Math.min(1, local / 10), [0, 1], [0, 1]),
        transform: `translateY(${interpolate(Math.min(1, local / 12), [0, 1], [46, 0])}px)`,
      }}>
        <div style={{
          fontFamily: "'Anton', sans-serif", fontSize: 92, color: PAPER.gold,
          textTransform: "uppercase", letterSpacing: "0.02em",
          textShadow: "0 8px 44px rgba(0,0,0,0.85)",
        }}>{label}</div>
        {sub && (
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 34, color: "#f3e9d2", marginTop: 6, opacity: 0.9 }}>{sub}</div>
        )}
      </div>
      {/* beat tick marks */}
      <div style={{
        position: "absolute", top: 64, left: 100, right: 100, display: "flex", gap: 10,
      }}>
        {MONTAGE_CUTS.map((c, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            backgroundColor: c.at <= at ? PAPER.gold : "rgba(255,255,255,0.22)",
          }} />
        ))}
      </div>
      {local < 3 && <Flash at={at} durF={3} peak={0.35} />}
    </AbsoluteFill>
  );
};

export const Machine: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (t < 164.7 || t > 235.4) return null;
  const lastCut = MONTAGE_CUTS[MONTAGE_CUTS.length - 1];
  // punch the whole frame on each braam (2.4s grid)
  const braamPhase = (t - 165) % 2.4;
  const punch = braamPhase < 0.35 ? 1 + (1 - braamPhase / 0.35) * 0.035 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#060505", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -40, transform: `scale(${punch})` }}>
        {/* 165–180: stat slam */}
        {t >= 165 && t < 180 && (
          <>
            <Slam at={165} until={169.6} size={200} color="#f3e9d2">35 GAMES.</Slam>
            <Slam at={170} until={174.6} size={200} color={PAPER.gold}>48 GOALS.</Slam>
            <Slam at={175} size={200} color="#f3e9d2">ONE SEASON.</Slam>
            {braamPhase < 6 && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(245,197,24,0.14), transparent 65%)" }} />}
          </>
        )}
        {/* 180–192: UCL record */}
        {t >= 180 && t < 192 && (
          <>
            <Counter at={180} dur={8} to={140} size={400} />
            {t >= 188.5 && (
              <Rise at={188.5} size={52} color={PAPER.gold}>
                Champions League goals. More than anyone. <b>Ever.</b>
              </Rise>
            )}
          </>
        )}
        {/* 192–230: the montage */}
        {MONTAGE_CUTS.map((c, i) => (
          <MontageClip key={i} at={c.at} clip={c.clip} label={c.label} sub={c.sub}
            next={i < MONTAGE_CUTS.length - 1 ? MONTAGE_CUTS[i + 1].at : 230} />
        ))}
        {/* 230–235: freeze — the breath */}
        {t >= 230 && (
          <>
            <div style={{ position: "absolute", inset: 0, transform: "scale(1.06)" }}>
              <Sequence from={6900} durationInFrames={170}>
                <Video src={staticFile(lastCut.clip)} muted playbackRate={0.18}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Sequence>
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
            </div>
            <Rise at={230.6} size={110} color={PAPER.gold} style={{ bottom: 200 }}>
              <span style={{ fontFamily: "'Anton', sans-serif", textTransform: "uppercase" }}>A machine.</span>
            </Rise>
          </>
        )}
      </div>
      <Scrim opacity={0.25} />
      <Flash at={HITS.act4Hit} peak={0.5} />
      <ActTransition at={234.2} />
    </AbsoluteFill>
  );
};
