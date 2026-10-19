/**
 * S19 · 5:30–5:40 (frames 9900–10200, 300f) · SIUUU — ONE HERO IMPACT duy nhất
 * Handoff S28: hạt giấy tụ thành vòng tròn P9 → vòng tròn xé mở (T21 entrance)
 * → footage cận (tách nền ≈ mask tròn xé + close crop): anticipation 0.97 (2f)
 * → bật ease-out-back → landing: glitch + RGB split bounded 10f + flash + shake
 * → "SIUUU" nổ per-char → vòng tròn settle (follow-through 50ms)
 * → NATIVE MOVE (T21): vòng tròn xé mở thành transition sang S20.
 * D3 (5:28–5:32) ducking + SIL-2: 36f đầu restrained. Camera Locked + Slammed.
 * T: T3 · T10 · T16 · T21 · T9 · T19 · T20
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { beatToFrame } from "../motion/beat";
import { expoOut, power4Out } from "../motion/eases";
import { COLORS, ImpactFlash, useShake, GoldHalo } from "../components/Grade";
import { CharSlam } from "../components/KineticText";
import { PaperParticles, Shard, Embers, g, makeBeatClock, P9, LVideo } from "../components/TeamB";

const START = 9900;
const bf = (beat: number) => beatToFrame(beat) - START;
const beatAt = makeBeatClock(522, 542, START);

const GATHER_END = 14;
const TEAR_END = 34;
const ANTIC = 28; // anticipation 2f
const LEAP_END = 54;
const LAND = 56; // landing: glitch bounded 10f
const TEXT_AT = 60;
const RING_BACK = 97; // follow-through: ring settles 50ms after text
const EXIT_AT = 240;

const S19: React.FC<{ frame: number }> = ({ frame }) => {
  const beat = beatAt(frame);

  // ---- P9 paper circle lifecycle ----
  // f0: circle already formed (S28 handoff) — particles join it f0–14
  // f14–34: tears open = zoom through the cracked disc (T21 entrance)
  const tearT = Math.max(0, Math.min(1, (frame - GATHER_END) / (TEAR_END - GATHER_END)));
  const tearE = expoOut(tearT);
  // f97: ring settles back as a FRAMING RING (follow-through 50ms after text)
  // f240–300: disc tears open into S20 (T21 exit — one native move)
  const exitT = Math.max(0, Math.min(1, (frame - EXIT_AT) / 60));
  const exitE = expoOut(exitT);
  // disc mode (tears) vs ring mode (hold framing)
  const ringMode = frame >= RING_BACK && frame < EXIT_AT;
  let ringScale: number, ringOp: number, ringRot: number;
  if (!ringMode && frame < RING_BACK) {
    ringScale = 0.75 + tearE * 1.6;
    ringOp = 0.9;
    ringRot = tearE * 14;
  } else if (ringMode) {
    // hero hold: ring framing the figure + subtle beat punch (Locked camera)
    const frac = beat - Math.floor(beat);
    const bp = 1 + 0.012 * Math.exp(-3 * frac);
    ringScale = 0.62 * bp;
    ringOp = 0.95;
    ringRot = 14;
  } else {
    ringScale = 0.62 + exitE * 2.0;
    ringOp = 0.95;
    ringRot = 14 + exitE * 22;
  }
  const ringSize = 1250 * ringScale;
  // ring mode: show ONLY the torn annulus (30–47% radius) — the P9 square's
  // dark corners are masked out, the torn edge stays visible, center is clear.
  // disc mode (gather/tear/exit): full torn disc — corners cut so no dark square.
  const ringMask = ringMode
    ? {
        maskImage: "radial-gradient(circle at 50% 50%, transparent 30%, black 35%, black 46%, transparent 49%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 30%, black 35%, black 46%, transparent 49%)",
      }
    : {
        maskImage: "radial-gradient(circle at 50% 50%, black 46%, transparent 49%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 46%, transparent 49%)",
      };

  // ---- footage: anticipation -> leap (ease-out-back) -> landing ----
  const antic = frame >= ANTIC && frame < ANTIC + 2 ? 0.97 : 1;
  const leapT = Math.max(0, Math.min(1, (frame - ANTIC - 2) / (LEAP_END - ANTIC - 2)));
  // ease-out-back zeta~0.7: overshoot ~5%
  const c1 = 1.2; const c3 = c1 + 1;
  const back = 1 + c3 * Math.pow(leapT - 1, 3) + c1 * Math.pow(leapT - 1, 2);
  const leapScale = frame < ANTIC ? 1 : 0.97 + (1.14 - 0.97) * back;
  const leapY = frame < ANTIC ? 0 : -80 * back;
  const exitZoom = 1 + exitE * 0.25;
  const vidScale = leapScale * antic * exitZoom;

  // landing shake (impact effect, not camera move)
  const shake = useShake(g(START, LAND), 18, 14);
  // small shakes on beats during hold (static hold + shake grammar)
  const sh2 = useShake(g(START, bf(530)), 7, 10);
  const sh3 = useShake(g(START, bf(534)), 7, 10);

  const inGlitch = frame >= LAND && frame < LAND + 10;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* PRIMARY: SIUUU closeup footage (trimmed: last frame = closeup, no wide cutaway).
          "tách nền" ≈ torn-circle mask + close crop. Realtime 1:1, holds last frame. */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          transform: `translate(${shake.x + sh2.x + sh3.x}px, ${shake.y + sh2.y + sh3.y + leapY}px) scale(${vidScale})`,
        }}
      >
        <LVideo at={START} dur={300} src="v6/footage/siuuu-closeup-trim.mp4" startFrom={0} srcDur={1.44} slotFrames={300} playbackRate={1} />
        {/* glitch: RGB split copies, bounded 10f, sync beat (frame-synced, same time base) */}
        {inGlitch && (
          <>
            <div style={{ position: "absolute", inset: 0, transform: "translateX(-11px)", mixBlendMode: "screen", opacity: 0.6, filter: "brightness(0.55) sepia(1) hue-rotate(-45deg) saturate(4)" }}>
              <LVideo at={START} dur={300} src="v6/footage/siuuu-closeup-trim.mp4" startFrom={0} srcDur={1.44} slotFrames={300} playbackRate={1} />
            </div>
            <div style={{ position: "absolute", inset: 0, transform: "translateX(11px)", mixBlendMode: "screen", opacity: 0.6, filter: "brightness(0.55) sepia(1) hue-rotate(165deg) saturate(4)" }}>
              <LVideo at={START} dur={300} src="v6/footage/siuuu-closeup-trim.mp4" startFrom={0} srcDur={1.44} slotFrames={300} playbackRate={1} />
            </div>
          </>
        )}
      </div>
      <ImpactFlash atFrame={g(START, LAND)} dur={2} />

      {/* P9 paper circle: tear phase = multiply disc; ring phase = masked annulus, paper-true.
          Ring parked upper-left so it never covers CR7's face (face ~right-center). */}
      {ringOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: (ringMode ? 870 : 960) - ringSize / 2,
            top: (ringMode ? 450 : 540) - ringSize / 2,
            width: ringSize,
            height: ringSize,
            opacity: ringOp,
            transform: `rotate(${ringRot}deg)`,
            mixBlendMode: ringMode ? "normal" : "multiply",
          }}
        >
          <img src={staticFile(P9)} style={{ width: "100%", height: "100%", ...ringMask }} />
        </div>
      )}

      {/* handoff: paper particles gather into the circle (S28 -> S19) */}
      {frame < 20 && (
        <PaperParticles count={46} seed={190} atFrame={g(START, 0)} dur={15} mode="gather" maxDist={900} centerX={960} centerY={540} />
      )}
      {/* tear shards */}
      {tearT > 0 && tearT < 1 && Array.from({ length: 8 }, (_, i) => <Shard key={i} seed={290} i={i} atFrame={g(START, GATHER_END)} dur={26} />)}
      {exitT > 0 && Array.from({ length: 8 }, (_, i) => <Shard key={`x${i}`} seed={390} i={i} atFrame={g(START, EXIT_AT + 8)} dur={40} />)}

      {/* SECONDARY: "SIUUU" per-char explosion */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 560 }}>
        <CharSlam text="SIUUU" atFrame={g(START, TEXT_AT)} fontSize={210} color={COLORS.goldLight} staggerMs={40} scaleFrom={8} />
      </AbsoluteFill>

      {/* SECONDARY: halo breathes on the hero */}
      <GoldHalo size={1000} opacity={0.4} />

      {/* AMBIENT */}
      <Embers seed={91} count={20} />

      {/* exit flash into S20 */}
      {frame >= 296 && <ImpactFlash atFrame={g(START, 296)} dur={2} />}
    </AbsoluteFill>
  );
};

export default S19;
