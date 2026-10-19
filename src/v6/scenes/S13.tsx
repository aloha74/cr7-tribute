/**
 * S13 · 2:40–3:02 (frames 4800–5460, 660f) · TÂY BAN NHA 2018 — grammar SLOW-MO
 * 2:40–2:45 compression (1 slow push-in, hold "nín thở") → run-up → kick at beat 212
 * (2:47 = D1 cheer peak, slowest frame) → ball flight stop-motion on twos +
 * hand-drawn speed lines → net ripple → "3–3" per-char explosion.
 * NO CGI motion blur. T: T8 · T3 · T13 · T9 · T20 · T16
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { beatToFrame } from "../motion/beat";
import { expoOut, power4Out, sineInOut, springSnappy } from "../motion/eases";
import { COLORS, ImpactFlash, useShake, GoldHalo } from "../components/Grade";
import { CharSlam, Stamp } from "../components/KineticText";
import { SpeedLines, PaperParticles, Embers, sm, g, P10 } from "../components/TeamB";

const START = 4800;
const bf = (beat: number) => beatToFrame(beat) - START;

const HOLD_END = bf(208); // 2:45 — compression ends, run-up begins
const KICK = bf(212); // 2:47 — slowest frame = D1 cheer peak (audio sync)
const NET = bf(226); // ball hits net
const EXIT = 600;

// ball: foot (1000,950) -> goal mouth (1420,560), inside plate space (1920x1280 -> cover crop)
const BX0 = 1000; const BY0 = 830; const BX1 = 1420; const BY1 = 440;

const S13: React.FC<{ frame: number }> = ({ frame }) => {
  const smf = sm(frame);

  // CAMERA: ONE slow push-in (Flowing->Locked) + shake at net hit
  const push = Math.exp(0.113 * (frame / 660)); // log-zoom, no linear
  const shake = useShake(g(START, NET), 18, 16);

  // run-up: plate drifts slightly (stop-motion twos) f158–f222
  const runT = Math.max(0, Math.min(1, (smf - HOLD_END) / (KICK - HOLD_END)));
  const runX = interpolate(power4Out(runT), [0, 1], [0, -46]);

  // ball flight: contact slow-mo f222–f262 (25%), then flight to net
  const flyT = Math.max(0, Math.min(1, (smf - KICK) / (NET - KICK)));
  // slow near contact (first 18%), then release — speed ramp 25%->100%
  const slow = flyT < 0.18 ? flyT * 0.35 : 0.063 + (flyT - 0.18) * 1.142;
  const fp = 1 - Math.pow(1 - Math.min(1, slow), 2.2); // decelerating struck ball
  const ballX = interpolate(fp, [0, 1], [BX0, BX1]);
  const ballY = interpolate(fp, [0, 1], [BY0, BY1]) - Math.sin(fp * Math.PI) * 130;
  const ballSpin = fp * 620;
  const ballScale = 1 + Math.sin(Math.min(1, flyT * 3) * Math.PI) * 0.06; // contact squash

  // net ripple after hit: decaying skew oscillation
  const ripT = (frame - NET) / 60;
  const ripple = ripT >= 0 && ripT <= 1 ? Math.sin(ripT * 22) * Math.exp(-3.5 * ripT) * 14 : 0;

  // exit: "3-3" chars fly outward f600–660
  const exitT = Math.max(0, Math.min(1, (frame - EXIT) / 60));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* PRIMARY: paper stadium plate (P5) — slow push-in, run-up drift */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          transform: `translate(${runX + shake.x}px, ${shake.y}px) scale(${push})`,
        }}
      >
        <img
          src={staticFile("v6/assets/p5-freekick-wall.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* net ripple overlay at goal mouth */}
        <svg
          width="1920"
          height="1280"
          viewBox="0 0 1920 1280"
          style={{ position: "absolute", inset: 0, transform: `skewX(${ripple}deg)`, transformOrigin: "1420px 560px" }}
        >
          {Array.from({ length: 9 }, (_, r) =>
            Array.from({ length: 7 }, (_, c) => (
              <rect
                key={`${r}-${c}`}
                x={1290 + c * 42}
                y={430 + r * 42}
                width={38}
                height={38}
                fill="none"
                stroke="rgba(244,234,216,0.35)"
                strokeWidth={2}
              />
            ))
          )}
        </svg>
        {/* PRIMARY: hero ball (P10) — stop-motion on twos, hand-drawn speed lines */}
        {frame >= KICK - 2 && (
          <div
            style={{
              position: "absolute",
              left: ballX,
              top: ballY,
              width: 120,
              height: 120,
              transform: `translate(-50%,-50%) rotate(${ballSpin}deg) scale(${ballScale})`,
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.7))",
            }}
          >
            <img src={staticFile(P10)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        )}
      </div>

      {/* speed lines during flight (hand-drawn, no CGI blur) */}
      {frame >= KICK && frame < NET + 10 && (
        <SpeedLines seed={5} n={16} fromX={820} fromY={620} len={460} progress={Math.min(1, flyT * 1.4)} />
      )}

      {/* SECONDARY: stamps */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
        <Stamp text="TÂY BAN NHA · 2018" atFrame={g(START, 10)} fontSize={60} rotate={-2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
        <Stamp text="PHÚT 88" atFrame={g(START, 26)} fontSize={44} color={COLORS.ivory} rotate={1.5} />
      </AbsoluteFill>

      {/* SECONDARY: "3–3" per-char explosion at net hit */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: 1 - exitT }}>
          <CharSlam text="3–3" atFrame={g(START, NET)} fontSize={260} color={COLORS.goldLight} staggerMs={40} scaleFrom={8} />
        </div>
      </AbsoluteFill>

      {/* exit fragments: chars burst outward (wipe into S14) */}
      {exitT > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
          {"3–3".split("").map((ch, i) => {
            const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const d = expoOut(exitT) * 700;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  fontFamily: "Anton, sans-serif",
                  fontSize: 260,
                  color: COLORS.goldLight,
                  transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) rotate(${expoOut(exitT) * (i % 2 ? 160 : -160)}deg) scale(${1 - exitT * 0.4})`,
                  opacity: 1 - exitT,
                }}
              >
                {ch}
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      <ImpactFlash atFrame={g(START, NET)} dur={2} />
      <PaperParticles count={70} seed={55} atFrame={g(START, NET)} dur={50} maxDist={600} centerX={1420} centerY={480} />

      {/* SECONDARY: halo swells at the kick (D1 cheer peak sync) */}
      <GoldHalo size={1000} opacity={frame >= KICK - 10 && frame < KICK + 60 ? 0.5 : 0.2} />

      {/* AMBIENT */}
      <Embers seed={41} count={24} color="rgba(245,214,123,0.4)" />
    </AbsoluteFill>
  );
};

export default S13;
