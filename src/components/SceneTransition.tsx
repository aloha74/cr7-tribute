import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { GOLD } from "../timeline";

interface SceneTransitionProps {
	frame: number; // scene-local frame; transition plays over the first 15 frames
	type: "whip" | "zoom" | "flash" | "glitch";
}

/** Deterministic pseudo-random in [0,1) seeded by an integer. */
const rand = (seed: number): number => {
	const x = Math.sin(seed * 999.7 + 13.13) * 43758.5453;
	return x - Math.floor(x);
};

const TRANSITION_FRAMES = 15;

/**
 * Viral-style scene transition overlay. Pure div/CSS, no external libs.
 * Render at the very start of a scene (skip on intro).
 */
export const SceneTransition: React.FC<SceneTransitionProps> = ({ frame, type }) => {
	if (frame > TRANSITION_FRAMES) {
		return null;
	}

	// ---- WHIP PAN: gradient bar sweeping across with a motion trail ----
	if (type === "whip") {
		const x = interpolate(frame, [0, TRANSITION_FRAMES], [-600, 2400], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		const opacity = interpolate(frame, [10, TRANSITION_FRAMES], [1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		return (
			<AbsoluteFill style={{ opacity, overflow: "hidden" }}>
				{/* motion trail */}
				<div
					style={{
						position: "absolute",
						top: -200,
						bottom: -200,
						left: x - 700,
						width: 700,
						background: `linear-gradient(90deg, transparent, rgba(245,197,24,0.18))`,
						transform: "skewX(-12deg)",
					}}
				/>
				{/* leading edge */}
				<div
					style={{
						position: "absolute",
						top: -200,
						bottom: -200,
						left: x - 60,
						width: 130,
						background: `linear-gradient(90deg, transparent, ${GOLD}, #ffffff)`,
						filter: "blur(6px)",
						transform: "skewX(-12deg)",
					}}
				/>
			</AbsoluteFill>
		);
	}

	// ---- ZOOM: dark plate scaling down + fading out ----
	if (type === "zoom") {
		const scale = interpolate(frame, [0, TRANSITION_FRAMES], [1.25, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		const opacity = interpolate(frame, [0, TRANSITION_FRAMES], [1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		return (
			<AbsoluteFill
				style={{
					background: "#050508",
					opacity,
					transform: `scale(${scale})`,
				}}
			/>
		);
	}

	// ---- FLASH: quick white/gold flash over 8 frames ----
	if (type === "flash") {
		const opacity = interpolate(frame, [0, 8], [1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		return (
			<AbsoluteFill
				style={{
					background: `linear-gradient(120deg, #ffffff 0%, ${GOLD} 60%, #ffffff 100%)`,
					opacity,
				}}
			/>
		);
	}

	// ---- GLITCH: 5 horizontal slices shifting with seeded randomness ----
	const slices = Array.from({ length: 5 }, (_, i) => {
		const offset = (rand(frame * 7 + i * 31) - 0.5) * 90;
		const hue = rand(frame * 3 + i * 57);
		const tint =
			hue > 0.66
				? "rgba(255,60,60,0.35)"
				: hue > 0.33
					? `rgba(245,197,24,0.4)`
					: "rgba(90,180,255,0.35)";
		const flicker = rand(frame * 11 + i * 13) > 0.35 ? 1 : 0;
		return { offset, tint, flicker, i };
	});
	const glitchOpacity = interpolate(frame, [11, TRANSITION_FRAMES], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ opacity: glitchOpacity, overflow: "hidden" }}>
			{slices.map((s) => (
				<div
					key={s.i}
					style={{
						position: "absolute",
						top: `${s.i * 20}%`,
						left: -60,
						right: -60,
						height: "20%",
						background: s.tint,
						mixBlendMode: "screen",
						opacity: s.flicker,
						transform: `translateX(${s.offset}px)`,
					}}
				/>
			))}
			{/* scanlines */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, transparent 2px, transparent 6px)",
					opacity: 0.5,
				}}
			/>
		</AbsoluteFill>
	);
};
