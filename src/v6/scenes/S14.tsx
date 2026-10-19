/**
 * S14 · 3:02–3:15 (frames 5460–5850, 390f) · Montage 4 bàn (clip05–08) — breathing
 * clip05/06 cut mỗi 4 beats · clip07 giữ 6 beats: frame gần-đóng-băng + Ken Burns
 * đảo chiều + parallax 3 lớp (counter-motion) · clip08 tới hết.
 * Text: "HAT-TRICK · 50+ BÀN/MÙA". HUD "S14". T: T7 · T12 · T11 · T18 · T20 · T1
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { beatToFrame } from "../motion/beat";
import { sineInOut } from "../motion/eases";
import { COLORS, useBeatPunch } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { HUD, Embers, sm, g, makeBeatClock, LVideo } from "../components/TeamB";

const START = 5460;
const bf = (beat: number) => beatToFrame(beat) - START;
const beatAt = makeBeatClock(240, 264, START);

const C5 = { from: bf(240), to: bf(244) };
const C6 = { from: bf(244), to: bf(248) };
const C7 = { from: bf(248), to: bf(254) }; // 6-beat breathing
const C8 = { from: bf(254), to: bf(264) };

/** Normal montage clip slot */
const Clip: React.FC<{ src: string; from: number; to: number; startFrom: number; scale: number }> = ({
  src,
  from,
  to,
  startFrom,
  scale,
}) => (
  <div style={{ position: "absolute", inset: -100, transform: `scale(${scale})` }}>
    <LVideo at={START + from} dur={to - from} src={src} startFrom={startFrom} slotFrames={to - from} />
  </div>
);

const S14: React.FC<{ frame: number }> = ({ frame }) => {
  const smf = sm(frame);
  const beat = beatAt(frame);
  const punch = useBeatPunch(beat, 4, 0.012, 0.03);
  const baseScale = 1.06 * punch;

  // clip07 breathing: near-frozen slow-mo + 3-layer parallax (counter-motion)
  const holdT = Math.max(0, Math.min(1, (smf - C7.from) / (C7.to - C7.from)));
  const kb = holdT < 0.5 ? 1 + sineInOut(holdT * 2) * 0.05 : 1.05 - sineInOut((holdT - 0.5) * 2) * 0.05; // Ken Burns đảo chiều
  const drift = Math.sin(holdT * Math.PI) * 40;

  const inC5 = frame >= C5.from && frame < C5.to;
  const inC6 = frame >= C6.from && frame < C6.to;
  const inC7 = frame >= C7.from && frame < C7.to;
  const inC8 = frame >= C8.from && frame < C8.to;

  // EXIT (T6 — S14→S15 handoff): zoom vào bóng trong clip08 — exponential, 24f cuối.
  // Khung nảy vào quả bóng → che khung → S15 mở ra từ bóng paper-cut.
  const exitT = Math.max(0, Math.min(1, (frame - 366) / 24));
  const exitZoom = Math.exp(0.85 * exitT); // 1 → ~2.34, exponential (cấm linear)

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* PRIMARY: 4-clip montage (+ exit zoom wrapper) */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${exitZoom})`, transformOrigin: "50% 55%" }}>
      {inC5 && <Clip src="v3/clip05.mp4" from={C5.from} to={C5.to} startFrom={8} scale={baseScale} />}
      {inC6 && <Clip src="v3/clip06.mp4" from={C6.from} to={C6.to} startFrom={40} scale={baseScale} />}

      {/* PRIMARY: clip07 breathing — 3 lớp parallax trên frame gần-đóng-băng */}
      {inC7 && (
        <>
          {/* bg 0.2x: blurred, drifts left */}
          <div
            style={{
              position: "absolute",
              inset: -160,
              transform: `translateX(${-drift * 0.4}px) scale(${kb * 1.25})`,
              filter: "blur(10px) brightness(0.7)",
            }}
          >
            <LVideo at={START + C7.from} dur={C7.to - C7.from} src="v3/clip07.mp4" startFrom={55} slotFrames={C7.to - C7.from} playbackRate={0.15} />
          </div>
          {/* mid 0.6x: main */}
          <div
            style={{
              position: "absolute",
              inset: -100,
              transform: `translateX(${drift * 0.2}px) scale(${kb})`,
            }}
          >
            <LVideo at={START + C7.from} dur={C7.to - C7.from} src="v3/clip07.mp4" startFrom={55} slotFrames={C7.to - C7.from} playbackRate={0.15} />
          </div>
          {/* fg 1.2x: soft-masked crop, counter-motion right */}
          <div
            style={{
              position: "absolute",
              inset: "12% 18%",
              overflow: "hidden",
              transform: `translateX(${drift * 0.9}px) scale(${kb * 1.35})`,
              maskImage: "radial-gradient(ellipse at center, black 55%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 78%)",
              border: "2px solid rgba(212,160,23,0.5)",
            }}
          >
            <LVideo at={START + C7.from} dur={C7.to - C7.from} src="v3/clip07.mp4" startFrom={55} slotFrames={C7.to - C7.from} playbackRate={0.15} />
          </div>
        </>
      )}

      {inC8 && <Clip src="v3/clip08.mp4" from={C8.from} to={C8.to} startFrom={20} scale={baseScale} />}
      </div>

      {/* T18: grade unify */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(74,14,14,0.25) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.3) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* SECONDARY: text bay (không card báo cáo) + HUD */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <Stamp text="HAT-TRICK · 50+ BÀN/MÙA" atFrame={g(START, 20)} fontSize={46} rotate={-1.5} />
      </AbsoluteFill>
      <HUD id="S14" />

      {/* AMBIENT */}
      <Embers seed={44} count={16} color="rgba(244,234,216,0.25)" />
    </AbsoluteFill>
  );
};

export default S14;
