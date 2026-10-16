import { FPS } from "../timeline";

export interface V3Scene {
  id: string;
  start: number;
  end: number;
}

const s = (sec: number) => Math.round(sec * FPS);

/** v3 beat-aligned scene boundaries (same music hits as v2). */
export const V3_TIMELINE: V3Scene[] = [
  { id: "hook", start: s(0), end: s(16.3) },
  { id: "boy", start: s(16.3), end: s(45.7) },
  { id: "stages", start: s(45.7), end: s(82.8) },
  { id: "proof", start: s(82.8), end: s(108.3) },
  { id: "montage", start: s(108.3), end: s(152.4) },
  { id: "turn", start: s(152.4), end: s(176.5) },
  { id: "answer", start: s(176.5), end: s(200.9) },
  { id: "echo", start: s(200.9), end: s(216) },
];

export const v3seg = (id: string): V3Scene => V3_TIMELINE.find((x) => x.id === id)!;
