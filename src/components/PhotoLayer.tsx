import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { GOLD } from "../timeline";

interface PhotoLayerProps {
	src: string; // e.g. "images/cr7-2013.jpg" (relative to public/)
	frame: number;
	fps: number;
	durationInFrames: number;
	side: "left" | "right" | "full";
	kenburns?: boolean;
}

/**
 * Layered photo with Ken Burns drift + gold duotone treatment.
 * side="full" renders as a dimmed, blurred background plate.
 */
export const PhotoLayer: React.FC<PhotoLayerProps> = ({
	src,
	frame,
	fps,
	durationInFrames,
	side,
	kenburns = true,
}) => {
	const zoom = kenburns
		? interpolate(frame, [0, durationInFrames], [1.18, 1.06], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			})
		: 1.05;
	const panX = kenburns
		? interpolate(frame, [0, durationInFrames], [-22, 22], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			})
		: 0;

	if (side === "full") {
		return (
			<AbsoluteFill>
				<div
					style={{
						position: "absolute",
						inset: -40,
						opacity: 0.35,
						filter: "blur(14px) saturate(0.85)",
						transform: `scale(1.12)`,
						overflow: "hidden",
					}}
				>
					<Img
						src={staticFile(src)}
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
					/>
				</div>
				{/* Darken so foreground text stays readable */}
				<AbsoluteFill
					style={{
						background:
							"linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.7) 100%)",
					}}
				/>
			</AbsoluteFill>
		);
	}

	const isLeft = side === "left";

	return (
		<div
			style={{
				position: "absolute",
				top: "50%",
				transform: "translateY(-50%)",
				...(isLeft ? { left: 110 } : { right: 110 }),
				width: 620,
				height: 880,
				overflow: "hidden",
				borderRadius: 18,
				border: `1px solid rgba(245,197,24,0.4)`,
				boxShadow: `0 0 90px rgba(245,197,24,0.28), 0 30px 80px rgba(0,0,0,0.65)`,
			}}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					transform: `scale(${zoom}) translateX(${panX}px)`,
				}}
			>
				<Img
					src={staticFile(src)}
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</div>
			{/* Gold duotone grade */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: `linear-gradient(160deg, rgba(245,197,24,0.5) 0%, rgba(120,60,0,0.35) 55%, rgba(0,0,0,0.45) 100%)`,
					mixBlendMode: "overlay",
					opacity: 0.25,
				}}
			/>
			{/* Bottom fade into background */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)",
				}}
			/>
		</div>
	);
};
