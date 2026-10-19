/**
 * T1 — Beat-grid is the single source of truth.
 * Loads src/v6/beat-grid.json (baked from the real score by the music team).
 * Falls back to the tempo plan if the grid is missing (dev only — never ship).
 */
import beatGrid from "../beat-grid.json";

export const FPS = 30;

type BeatGrid = {
  beats: number[]; // beat index -> time in seconds
  downbeats?: number[];
  bpm?: number;
  energy?: number[];
};

const grid = beatGrid as BeatGrid;

export function beatToFrame(beat: number): number {
  const beats = grid.beats;
  if (!beats || beats.length === 0) {
    throw new Error("beat-grid.json is empty — music team must bake BEATS[] first (T1).");
  }
  // Backward extrapolation for prologue (beats < 0, before beat 0 at 15s):
  // use Ch. I tempo (66 BPM → 27.27 f/beat)
  if (beat < 0) {
    const fpb = framesPerBeat(66);
    return Math.round(beats[0] * FPS + beat * fpb);
  }
  const i = Math.floor(beat);
  const frac = beat - i;
  const t0 = beats[Math.max(0, Math.min(i, beats.length - 1))];
  const t1 = beats[Math.max(0, Math.min(i + 1, beats.length - 1))];
  return Math.round((t0 + (t1 - t0) * frac) * FPS);
}

export function secToFrame(sec: number): number {
  return Math.round(sec * FPS);
}

/** frames per beat at a given bpm */
export const framesPerBeat = (bpm: number) => (60 / bpm) * FPS;

/** Tempo plan (treatment §0) — reference only, real grid comes from audio */
export const TEMPO_PLAN = {
  ch1: { from: 66, to: 68, range: [0, 60] },
  ch2: { from: 84, to: 88, range: [60, 130] },
  ch3: { from: 112, to: 116, range: [130, 380] },
} as const;
