/**
 * v6 easing vocabulary — ported from GSAP/hyperframes (see TECHNIQUE_BIBLE.md T11).
 * Rule: NEVER linear for spatial motion. Overshoot only on transform, never opacity.
 */
import { Easing } from "remotion";

// Entrance default: bezier(0.16,1,0.3,1)
export const easeEnter = Easing.bezier(0.16, 1, 0.3, 1);
// Apple signature
export const easeApple = Easing.bezier(0.22, 1, 0.36, 1);
// Premium reveal: bezier(0.4,0,0.2,1), overshoot 0%
export const easePremium = Easing.bezier(0.4, 0, 0.2, 1);

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1); // hook / surprise
export const power3Out = Easing.bezier(0.215, 0.61, 0.355, 1); // legacy / premium tail
export const power4Out = Easing.bezier(0.25, 1, 0.5, 1); // montage punch
export const sineInOut = Easing.bezier(0.37, 0, 0.63, 1); // ambient
export const backOut17 = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoot ~ playful

/**
 * Baked spring easings (closed-form damped harmonic).
 * zeta=1.0 critically damped (no overshoot, house default)
 * zeta=0.82 iOS-feel (~1.5% overshoot)
 * zeta=0.7  Snappy (~5-10% overshoot)
 */
export function bakedSpring(zeta: number, w0 = 12): (t: number) => number {
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const wd = w0 * Math.sqrt(Math.max(0, 1 - zeta * zeta));
    if (zeta >= 1) {
      // critically damped / overdamped
      const e = Math.exp(-w0 * t);
      return 1 - e * (1 + w0 * t);
    }
    const e = Math.exp(-zeta * w0 * t);
    const v = 1 - e * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
    return v;
  };
}

export const springCrit = bakedSpring(1.0); // house default
export const springIOS = bakedSpring(0.82); // subtle overshoot
export const springSnappy = bakedSpring(0.7); // slam / kinetic

/** Curved crescendo (not linear): x^1.6 */
export const cresc = (t: number) => Math.pow(Math.max(0, Math.min(1, t)), 1.6);
/** Exponential decay for beat-punch */
export const decayExp = (t: number, k = 3) => Math.exp(-k * Math.max(0, t));

/** Anticipation dip: scale 0.95 for 60-120ms before action */
export const anticipationDip = (t: number) =>
  t < 0.15 ? 1 - 0.05 * Math.sin((t / 0.15) * Math.PI) : 1;
