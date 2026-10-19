/**
 * S18 · 3:56–4:10 (frames 7080–7500, 420f) · Montage 8 bàn (clip09–16) + build Act IV
 * Cut mỗi 2 beats (~32f), beat punch +0.012/beat +0.03/bar, log-zoom (T7 grammar chính).
 * 1 whip duy nhất tại 4:06 (beat 361) · build 4:06–4:10: riser/snare → J3 (4:09.6,
 * local 408) → taiko downbeat 4:10 mở Act IV. HUD "S18".
 * T: T7 · T5 · T17 · T19 · T18 · T1 · T20
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { beatToFrame } from "../motion/beat";
import { COLORS, ImpactFlash, useBeatPunch } from "../components/Grade";
import { WhipStreak, HUD, Embers, PaperParticles, g, makeBeatClock, LVideo } from "../components/TeamB";
import { GoldHalo } from "../components/Grade";

const START = 7080;
const bf = (beat: number) => beatToFrame(beat) - START;
const beatAt = makeBeatClock(342, 369, START);

const CUTS = [342, 344, 346, 348, 350, 352, 354, 356, 358];
const SRCS = ["v3/clip09.mp4", "v3/clip10.mp4", "v3/clip11.mp4", "v3/clip12.mp4", "v3/clip13.mp4", "v3/clip14.mp4", "v3/clip15.mp4", "v3/clip16.mp4"];
const STARTS = [12, 55, 8, 70, 25, 90, 5, 40];
const BUILD_AT = bf(358); // build bắt đầu
const WHIP_AT = bf(361); // 4:06 — 1 whip duy nhất
const J3 = 408; // 4:09.6 — chant + taiko vào trước (audio)

const S18: React.FC<{ frame: number }> = ({ frame }) => {
  const gframe = useCurrentFrame();
  const beat = beatAt(frame);
  const punch = useBeatPunch(beat, 4, 0.012, 0.03);

  // log-zoom continuous + build zoom
  const logZoom = Math.exp(0.16 * (frame / 420));
  const buildT = Math.max(0, Math.min(1, (frame - BUILD_AT) / (420 - BUILD_AT)));
  const buildZoom = 1 + buildT * buildT * 0.3;
  const scale = logZoom * punch * buildZoom;

  // which clip
  let ci = 7;
  for (let i = 0; i < 8; i++) {
    if (frame >= bf(CUTS[i]) && frame < (i === 7 ? 421 : bf(CUTS[i + 1]))) { ci = i; break; }
  }
  const slotFrom = bf(CUTS[ci]);
  const slotTo = ci === 7 ? 420 : bf(CUTS[ci + 1]);

  // build flashes: snare-synced pulse mỗi beat từ 361 (subtle) + hit cuối
  const buildBeats = [361, 362, 363, 364, 365, 366, 367, 368];
  const flashOp = buildBeats.reduce((acc, b) => {
    const t = (frame - bf(b)) / 8;
    if (t >= 0 && t <= 1) return acc + (1 - t) * 0.22;
    return acc;
  }, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* PRIMARY: 8-clip montage */}
      <div style={{ position: "absolute", inset: -140, transform: `scale(${scale})` }}>
        <LVideo
          key={ci}
          at={START + slotFrom}
          dur={slotTo - slotFrom}
          src={SRCS[ci]}
          startFrom={STARTS[ci]}
          slotFrames={slotTo - slotFrom}
        />
      </div>

      {/* the ONE whip (4:06) into build */}
      <WhipStreak atFrame={g(START, WHIP_AT)} dur={12} />

      {/* build: snare-synced flashes + rising halo + particles */}
      {flashOp > 0 && <AbsoluteFill style={{ backgroundColor: "#fff", opacity: Math.min(0.5, flashOp) }} />}
      {frame >= BUILD_AT && (
        <>
          <GoldHalo size={1000} opacity={0.25 + buildT * 0.5} />
          <PaperParticles count={40} seed={180} atFrame={g(START, BUILD_AT + 40)} dur={120} maxDist={800} centerX={960} centerY={540} color={COLORS.ivory} />
        </>
      )}

      {/* T19: riser kết chính xác trên hit 4:10 — visual peak */}
      {frame >= 414 && <ImpactFlash atFrame={g(START, 414)} dur={2} />}

      {/* T18: grade unify */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(74,14,14,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.3) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* SECONDARY: HUD */}
      <HUD id="S18" />

      {/* AMBIENT */}
      <Embers seed={81} count={18} color="rgba(244,234,216,0.3)" />
    </AbsoluteFill>
  );
};

export default S18;
