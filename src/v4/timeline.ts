// v4 timeline — 300s @ 30fps = 9000 frames. All times in seconds.
export const FPS = 30;
export const DURATION_S = 300;
export const DURATION_FRAMES = FPS * DURATION_S;

export const S = (sec: number) => Math.round(sec * FPS);

export const SEG = {
  prologue: { start: 0, end: 30 },
  island: { start: 30, end: 100 },
  ascent: { start: 100, end: 165 },
  machine: { start: 165, end: 235 },
  immortal: { start: 235, end: 280 },
  epilogue: { start: 280, end: 300 },
} as const;

// Act 3 montage: 10 cuts on the 0.6s kick grid, 192.0 -> 225.6, each ~3.6s
export const MONTAGE_CUTS: { at: number; clip: string; label: string; sub?: string }[] = [
  { at: 192.0, clip: "v3/clip03.mp4", label: "LA LIGA · 2014–15", sub: "every goal, one season" },
  { at: 195.6, clip: "v3/clip05.mp4", label: "GOAL" },
  { at: 199.8, clip: "v3/clip07.mp4", label: "EL CLÁSICO" },
  { at: 203.4, clip: "v3/clip11.mp4", label: "CAMP NOU" },
  { at: 207.0, clip: "v3/clip15.mp4", label: "GOAL" },
  { at: 211.2, clip: "v3/clip13.mp4", label: "NEVER SATISFIED" },
  { at: 214.8, clip: "v3/clip02.mp4", label: "AGAIN." },
  { at: 218.4, clip: "v3/clip09.mp4", label: "AND AGAIN." },
  { at: 222.0, clip: "v3/clip16.mp4", label: "AND AGAIN." },
  { at: 225.6, clip: "v3/clip14.mp4", label: "48." },
];

// Music hit grid (from tools/compose-score.mjs)
export const HITS = {
  prologueHit: 22,
  act3Drop: 165,
  act3HalfBreak: [200, 205] as const,
  act4Hit: 235,
  finalHit: 294,
};
export const BT = 0.6; // act 2/3 beat
