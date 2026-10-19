/**
 * S12 · 2:25–2:40 (frames 4350–4800, 450f) · Montage footage 4 bàn (clip01–04)
 * Cut every ~7 beats, beat punch +0.012/beat, log-zoom punch-in, whip 02→03.
 * D1 (2:32–2:36, beats 184–191): kick transient rises — gold accent at beat 184.
 * HUD viewfinder "S12". T: T7 · T5 · T11 · T18 · T1 · T16 · T20
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { beatToFrame } from "../motion/beat";
import { COLORS, ImpactFlash, useShake, useBeatPunch } from "../components/Grade";
import { WhipStreak, HUD, Embers, sm, g, makeBeatClock, LVideo } from "../components/TeamB";

const START = 4350;
const bf = (beat: number) => beatToFrame(beat) - START;
const beatAt = makeBeatClock(171, 199, START);

// 4 clips, ~7 beats each (beats 171–178–185–192–199)
const CLIPS = [
  { src: "v3/clip01.mp4", from: bf(171), to: bf(178), startFrom: 10 },
  { src: "v3/clip02.mp4", from: bf(178), to: bf(185), startFrom: 30 },
  { src: "v3/clip03.mp4", from: bf(185), to: bf(192), startFrom: 5 },
  { src: "v3/clip04.mp4", from: bf(192), to: bf(199), startFrom: 45 },
];
const D1_KICK = bf(184); // 2:32 — kick transient rises (audio: D1 stem)

const S12: React.FC<{ frame: number }> = ({ frame }) => {
  const smf = sm(frame);
  const beat = beatAt(frame);

  // T7: log-zoom punch-in across the whole montage + beat punch
  const logZoom = Math.exp(0.14 * (frame / 450));
  const punch = useBeatPunch(beat, 4, 0.012, 0.03);
  // D1 kick accent: extra punch decaying after beat 184
  const dt = (frame - D1_KICK) / 40;
  const d1punch = dt >= 0 && dt <= 1 ? 1 + 0.05 * Math.exp(-3 * dt) : 1;
  const shake = useShake(g(START, D1_KICK), 10, 14);
  const scale = logZoom * punch * d1punch;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* PRIMARY: footage montage */}
      {CLIPS.map((c, i) => {
        if (frame < c.from || frame >= c.to) return null;
        const slotDur = c.to - c.from;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: -120,
              transform: `translate(${shake.x}px, ${shake.y}px) scale(${scale})`,
            }}
          >
            <LVideo
              at={START + c.from}
              dur={slotDur}
              src={c.src}
              startFrom={c.startFrom}
              slotFrames={slotDur}
            />
          </div>
        );
      })}

      {/* T5: whip pan hiding the cut between clip 02→03 (beat 185) */}
      <WhipStreak atFrame={g(START, bf(185))} dur={12} />

      {/* D1 accent: flash as the kick transient rises */}
      <ImpactFlash atFrame={g(START, D1_KICK)} dur={2} />

      {/* T18: grade unify over footage */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(74,14,14,0.28) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* SECONDARY: HUD viewfinder */}
      <HUD id="S12" />

      {/* AMBIENT */}
      <Embers seed={32} count={18} color="rgba(244,234,216,0.28)" />

      {/* EXIT: whip into S13 (footage→paper handoff) */}
      <WhipStreak atFrame={g(START, 436)} dur={14} />
    </AbsoluteFill>
  );
};

export default S12;
