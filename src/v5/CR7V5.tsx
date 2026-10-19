import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Prologue } from "./scenes/Prologue";
import { Act1 } from "./scenes/Act1";
import { Act2 } from "./scenes/Act2";
import { Act3 } from "./scenes/Act3";
import { Finale } from "./scenes/Finale";
import { Epilogue } from "./scenes/Epilogue";
import { FPS } from "./cue";

/**
 * CR7 v5 "HUYỀN THOẠI SỐNG" — KINETIC CUT.
 * 300s @ 30fps. Built FRESH from TREATMENT_V5.md (not based on v1-v4).
 * Iron rules: no static text card; no static shot >2s; attribution only in credits.
 *
 * AUDIO MIX: symphonic score leads normally; at emotional peaks the score DUCKS
 * and the footage's native crowd audio takes over (goosebumps moments).
 */
const DUCKS: [number, number][] = [ // [start, end] seconds — score dips here
  [139, 147],   // Wolfsburg comeback goals
  [158, 164],   // Spain free kick
  [170, 178],   // Euro triumph
  [230, 242],   // SIUUU
  [270, 278],   // 900 count climax
];
const CROWD: { at: number; src: string }[] = [
  { at: 138.5, src: "v5/nat/crowd-wolfsburg.wav" },
  { at: 157.5, src: "v5/nat/crowd-spain.wav" },
  { at: 169.5, src: "v5/nat/crowd-euro.wav" },
  { at: 229.5, src: "v5/nat/crowd-siuuu.wav" },
  { at: 269.5, src: "v5/nat/crowd-count.wav" },
];

const smooth = (t: number, a: number, b: number, ramp = 1.2) => {
  if (t < a - ramp || t > b + ramp) return 0;
  if (t < a) return (t - (a - ramp)) / ramp;
  if (t > b) return 1 - (t - b) / ramp;
  return 1;
};

const scoreVolume = (frame: number) => {
  const t = frame / FPS;
  let duck = 0;
  for (const [a, b] of DUCKS) duck = Math.max(duck, smooth(t, a, b));
  return 1 - duck * 0.78; // dip to 0.22 at peaks
};

export const CR7V5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#060607" }}>
    <Prologue />
    <Act1 />
    <Act2 />
    <Act3 />
    <Finale />
    <Epilogue />
    {/* score with ducking */}
    <Audio src={staticFile("v5/score.wav")} volume={scoreVolume} />
    {/* native crowd takes over at peaks */}
    {CROWD.map((c, i) => {
      const durs = [10, 8, 10, 12, 10];
      const d = durs[i];
      return (
        <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={Math.round(d * FPS)}>
          <Audio src={staticFile(c.src)}
            volume={(frame) => {
              const t = frame / FPS;
              const r = 1.2;
              if (t < r) return t / r;
              if (t > d - r) return Math.max(0, (d - t) / r);
              return 1;
            }} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
