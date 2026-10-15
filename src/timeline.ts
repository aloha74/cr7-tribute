import { interpolate } from "remotion";

export const FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const DURATION_SEC = 216; // 3:36 — matches "Anthem of Victory" (Pixabay, free for commercial use)
export const DURATION_FRAMES = DURATION_SEC * FPS; // 6480

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
 * Scene boundaries scaled to the 216s soundtrack (ratio 216/247).
 * Tune startSec/endSec freely — every scene derives its frames from here.
 */
export const TIMELINE: SceneSegment[] = [
	{ id: "intro", name: "Intro — Hero title", startSec: 0, endSec: 17 },
	{ id: "origins", name: "Origins — Madeira 1985, Sporting CP debut 2002", startSec: 17, endSec: 44 },
	{ id: "united", name: "Manchester United 2003 — the number 7", startSec: 44, endSec: 57 },
	{ id: "glory1", name: "Glory — 5 Ballon d'Or, 5 Champions League", startSec: 57, endSec: 83 },
	{ id: "madrid", name: "Real Madrid 2009–2018 — 450 goals", startSec: 83, endSec: 109 },
	{ id: "juve", name: "Juventus 2018–2021", startSec: 109, endSec: 122 },
	{ id: "portugal", name: "Portugal — Euro 2016 champions", startSec: 122, endSec: 149 },
	{ id: "goals", name: "900+ career goals counter", startSec: 149, endSec: 175 },
	{ id: "legacy", name: "Legacy — SIUUU celebration", startSec: 175, endSec: 201 },
	{ id: "outro", name: "Outro — end card", startSec: 201, endSec: 216 },
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
