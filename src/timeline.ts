export const FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const DURATION_SEC = 216; // 3:36 — matches "Anthem of Victory" (Pixabay, free for commercial use)
export const DURATION_FRAMES = DURATION_SEC * FPS; // 6480

export const GOLD = "#f5c518";
export const WHITE = "#ffffff";
export const DIM = "rgba(255,255,255,0.55)";

// Musical hit points (seconds) extracted from Anthem of Victory via onset analysis.
// Scene boundaries and major text entrances snap to these hits.
export const HITS = [
  0.7, 4.3, 8.1, 11.2, 16.3, 19.7, 26.2, 29.3, 32.5, 37.4, 41.0, 45.7,
  48.8, 55.7, 59.5, 64.5, 69.9, 82.8, 89.0, 93.9, 98.0, 101.2, 104.3,
  108.3, 112.0, 115.2, 124.3, 127.5, 137.7, 140.9, 145.5, 152.4, 155.5,
  176.5, 182.5, 187.0, 190.1, 194.2, 197.7, 200.9, 204.4, 207.5,
];

export type TransitionKind = "whip" | "zoom" | "flash" | "glitch";

export interface SceneSegment {
  id: string;
  name: string;
  /** start frame (inclusive) */
  start: number;
  /** end frame (exclusive) */
  end: number;
  transition: TransitionKind;
  transitionColor: string;
}

const s = (sec: number) => Math.round(sec * FPS);

/**
 * Scene boundaries snapped to musical hits of the 216s soundtrack.
 * Every scene derives its frames from here.
 */
export const TIMELINE: SceneSegment[] = [
  { id: "intro",    name: "Intro — hero title",                          start: s(0),     end: s(16.3),  transition: "zoom",   transitionColor: "#f5b301" },
  { id: "origins",  name: "Origins — Madeira 1985, Sporting CP",          start: s(16.3),  end: s(45.7),  transition: "whip",   transitionColor: "#f5b301" },
  { id: "united",   name: "Manchester United 2003 — the number 7",        start: s(45.7),  end: s(55.7),  transition: "flash",  transitionColor: "#ffffff" },
  { id: "glory1",   name: "Glory — 5 Ballon d'Or, 5 Champions League",   start: s(55.7),  end: s(82.8),  transition: "zoom",   transitionColor: "#f5b301" },
  { id: "madrid",   name: "Real Madrid 2009–2018 — 450 goals",            start: s(82.8),  end: s(108.3), transition: "whip",   transitionColor: "#ffffff" },
  { id: "juve",     name: "Juventus 2018–2021",                           start: s(108.3), end: s(124.3), transition: "glitch", transitionColor: "#f5b301" },
  { id: "portugal", name: "Portugal — Euro 2016 champion",                start: s(124.3), end: s(152.4), transition: "whip",   transitionColor: "#e33e2b" },
  { id: "goals",    name: "900+ career goals counter",                   start: s(152.4), end: s(176.5), transition: "zoom",   transitionColor: "#f5b301" },
  { id: "legacy",   name: "Legacy — SIUUU",                              start: s(176.5), end: s(200.9), transition: "flash",  transitionColor: "#f5b301" },
  { id: "outro",    name: "Outro — legend in motion",                    start: s(200.9), end: s(216),   transition: "zoom",   transitionColor: "#f5b301" },
];

/** Convert an absolute hit time (seconds) to a frame relative to a scene start. */
export const hitFrame = (hitSeconds: number, sceneStartFrame: number) =>
  Math.round(hitSeconds * FPS) - sceneStartFrame;
