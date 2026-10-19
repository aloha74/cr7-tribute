import cueMap from "./cue-map.json";

export const FPS = 30;
export const DUR_S = 300;
export const DUR_F = FPS * DUR_S;
/** seconds -> frames */
export const S = (s: number) => Math.round(s * FPS);

export const BEATS: number[] = (cueMap as { beatTimes: number[] }).beatTimes;
export const MARK = (cueMap as { markers: Record<string, number> }).markers;

/** Index of the last beat <= t (seconds). */
export function beatIndexAt(t: number): number {
  let lo = 0, hi = BEATS.length - 1, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (BEATS[mid] <= t + 1e-6) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}
/** 0..1 progress inside current beat. */
export function beatPhase(t: number): number {
  const i = beatIndexAt(t);
  const a = BEATS[i], b = BEATS[Math.min(i + 1, BEATS.length - 1)];
  if (b <= a) return 0;
  return Math.min(1, Math.max(0, (t - a) / (b - a)));
}
/** Time of the n-th beat at/after t. */
export function beatAt(t: number, n = 0): number {
  const i = beatIndexAt(t);
  const j = BEATS[i] < t - 1e-6 ? i + 1 : i;
  return BEATS[Math.min(j + n, BEATS.length - 1)];
}
/** Pulse 1->0 decaying inside each beat (for shake/flash sync). */
export function beatPulse(t: number, decay = 3): number {
  return Math.exp(-decay * beatPhase(t));
}
