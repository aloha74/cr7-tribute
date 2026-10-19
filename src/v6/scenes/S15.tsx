/**
 * S15 · 3:15–3:32 (frames 5850–6360, 510f) · EURO 2016 — nâng cúp (MOTIF LẦN 2)
 * 3:15–3:20 assemble (CR7 tay giơ cao, CHƯA có cúp — trophy masked by crop)
 * 3:20–3:23 beat morph riêng: bóng P10 bay vào tay → morph thành cúp (T6, hero duy nhất)
 * 3:23–3:30 gold particle burst 150 + halo + "EURO · 2016"
 * 3:30–3:32 hold (choir vào — audio). T: T13 · T6 · T15 · T18 · T20
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { beatToFrame } from "../motion/beat";
import { expoOut, springSnappy } from "../motion/eases";
import { GoldHalo, ImpactFlash } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { PaperParticles, Embers, sm, g, P10, mulberry32 } from "../components/TeamB";

const START = 5850;
const bf = (beat: number) => beatToFrame(beat) - START;

const MORPH_IN = bf(274); // 3:20 — ball flies in
const MORPH = bf(277); // morph peak: ball -> trophy
const BURST = bf(280); // 3:23 — particle burst
const HOLD = bf(293); // 3:30 — choir enters (audio)
const EXIT = 470;

// P6 (1344x1792) displayed at width 1500 -> height 2000. Trophy hidden at top:-820.
const IMG_W = 1500;
const IMG_H = 2000;
const TOP_HIDDEN = -820;
const TOP_REVEAL = -100;

const S15: React.FC<{ frame: number }> = ({ frame }) => {
  const smf = sm(frame);

  // assemble back-to-front: figure rises with bounce-settle (stop-motion)
  const riseT = Math.max(0, Math.min(1, (smf - 20) / 50));
  const rise = springSnappy(riseT);
  const riseY = interpolate(rise, [0, 1], [160, 0]);

  // morph: container pans up revealing trophy (ball -> cup, T6)
  const morphT = Math.max(0, Math.min(1, (frame - MORPH) / (BURST - MORPH)));
  const morphE = springSnappy(morphT);
  const top = interpolate(morphE, [0, 1], [TOP_HIDDEN, TOP_REVEAL]);

  // ball flight: left -> hands (960, 90)
  const ballT = Math.max(0, Math.min(1, (frame - MORPH_IN) / (MORPH - MORPH_IN)));
  const ballE = expoOut(ballT);
  const ballX = interpolate(ballE, [0, 1], [150, 960]);
  const ballY = interpolate(ballE, [0, 1], [760, 90]) - Math.sin(ballE * Math.PI) * 120;
  const ballShrink = morphT > 0 ? 1 - springSnappy(Math.min(1, morphT * 1.2)) * 0.9 : 1;

  // slow push-in after burst
  const push = frame > BURST ? Math.exp(0.0677 * ((frame - BURST) / (510 - BURST))) : 1; // log-zoom

  // exit: cup shrinks to top corner (S15→S16 handoff)
  const exitT = Math.max(0, Math.min(1, (frame - EXIT) / 40));
  const exitE = expoOut(exitT);
  const exitScale = 1 - exitE * 0.65;
  const exitX = exitE * 420;
  const exitY = exitE * -260;

  // stars (secondary)
  const stars = React.useMemo(() => {
    const r = mulberry32(77);
    return Array.from({ length: 40 }, () => ({ x: r() * 1920, y: r() * 500, s: 2 + r() * 5, tw: r() * 6 }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0f", overflow: "hidden" }}>
      {/* PRIMARY: paper night bg */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 22%, rgba(120,22,22,0.85) 0%, rgba(60,10,10,0.9) 45%, rgba(20,5,5,1) 100%)",
        }}
      />
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.s,
            height: s.s,
            borderRadius: "50%",
            backgroundColor: "#f5d67b",
            opacity: 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(frame / 24 + s.tw)),
          }}
        />
      ))}

      {/* ENTRANCE (T6 — S14→S15 handoff): quả bóng S14 zoom vào → mở ra thành bóng
          paper-cut: bóng tối phủ khung f0 rồi thu nhỏ + tan ra, lộ scene. */}
      {frame < 18 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            width: 420,
            height: 420,
            transform: `translate(-50%,-50%) scale(${5 - (4 * frame) / 17})`,
            opacity: 1 - frame / 17,
            filter: "brightness(0.25) saturate(0.6)",
          }}
        >
          <img src={staticFile(P10)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      )}

      {/* PRIMARY: CR7 figure (P6 crop — trophy hidden until morph) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transform: `translate(${exitX}px, ${riseY + exitY}px) scale(${push * exitScale})`,
          transformOrigin: "50% 60%",
          opacity: frame < 8 ? frame / 8 : 1,
        }}
      >
        <img
          src={staticFile("v6/assets/p6-cr7-lifting-trophy.png")}
          style={{
            position: "absolute",
            left: (1920 - IMG_W) / 2,
            top,
            width: IMG_W,
            height: IMG_H,
            objectFit: "fill",
            filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.8))",
          }}
        />
      </div>

      {/* PRIMARY: hero ball flies into hands (P10) */}
      {frame >= MORPH_IN && ballShrink > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: ballX,
            top: ballY,
            width: 130,
            height: 130,
            transform: `translate(-50%,-50%) scale(${ballShrink}) rotate(${ballE * 400}deg)`,
            filter: "drop-shadow(0 0 24px rgba(245,214,123,0.8))",
          }}
        >
          <img src={staticFile(P10)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      )}

      {/* morph flash: ball becomes trophy (hero of the beat — NO particles here) */}
      {morphT > 0 && morphT < 1 && (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at 50% 18%, rgba(245,214,123,0.85) 0%, rgba(245,214,123,0) 45%)",
            opacity: Math.sin(morphT * Math.PI),
          }}
        />
      )}
      <ImpactFlash atFrame={g(START, MORPH)} dur={2} />

      {/* SECONDARY: gold particle burst 150 (AFTER morph) + halo */}
      {frame >= BURST && (
        <PaperParticles count={150} seed={150} atFrame={g(START, BURST)} dur={90} maxDist={720} centerX={960} centerY={380} />
      )}
      <GoldHalo size={1100} opacity={frame >= BURST ? 0.5 : 0.18} />

      {/* SECONDARY: stamp */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 880 }}>
        <Stamp text="EURO · 2016" atFrame={g(START, BURST + 8)} fontSize={72} rotate={-2} />
      </AbsoluteFill>

      {/* AMBIENT */}
      <Embers seed={51} count={22} />
    </AbsoluteFill>
  );
};

export default S15;
