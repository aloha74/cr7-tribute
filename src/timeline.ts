import { interpolate } from "remotion";

export const FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const DURATION_SEC = 247; // 4:07 — matches "Something Just Like This"
export const DURATION_FRAMES = DURATION_SEC * FPS; // 7410

export const GOLD = "#f5c518";
export const WHITE = "#ffffff";
export const DIM = "rgba(255,255,255,0.55)";

export interface SceneSegment {
	id: string;
	name: string;
	startSec: number;
	endSec: number;
}

/**
 * Estimated scene boundaries mapped to the song structure.
 * Tune startSec/endSec freely — every scene derives its frames from here.
 */
export const TIMELINE: SceneSegment[] = [
	{ id: "intro", name: "Intro — Hero title", startSec: 0, endSec: 20 },
	{ id: "origins", name: "Origins — Madeira 1985, Sporting CP debut 2002", startSec: 20, endSec: 50 },
	{ id: "united", name: "Manchester United 2003 — the number 7", startSec: 50, endSec: 65 },
	{ id: "glory1", name: "Glory — 5 Ballon d'Or, 5 Champions League", startSec: 65, endSec: 95 },
	{ id: "madrid", name: "Real Madrid 2009–2018 — 450 goals", startSec: 95, endSec: 125 },
	{ id: "juve", name: "Juventus 2018–2021", startSec: 125, endSec: 140 },
	{ id: "portugal", name: "Portugal — Euro 2016 champions", startSec: 140, endSec: 170 },
	{ id: "goals", name: "900+ career goals counter", startSec: 170, endSec: 200 },
	{ id: "legacy", name: "Legacy — SIUUU celebration", startSec: 200, endSec: 230 },
	{ id: "outro", name: "Outro — end card", startSec: 230, endSec: 247 },
];

/** Sequence timing (in frames) for a scene id. */
export const sceneTiming = (id: string) => {
	const seg = TIMELINE.find((s) => s.id === id);
	if (!seg) {
		throw new Error(`Unknown scene id: ${id}`);
	}
	return {
		from: seg.startSec * FPS,
		durationInFrames: (seg.endSec - seg.startSec) * FPS,
	};
};

/** Smooth fade in at scene start / fade out at scene end. */
export const fadeInOut = (
	frame: number,
	durationInFrames: number,
	fadeIn = 15,
	fadeOut = 20,
): number =>
	interpolate(
		frame,
		[0, fadeIn, durationInFrames - fadeOut, durationInFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
