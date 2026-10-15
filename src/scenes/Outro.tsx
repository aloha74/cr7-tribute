import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { SceneTransition } from "../components/SceneTransition";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 10 — Outro end card (201–216s). Zoom transition in. */
export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("outro");
	// Gentle fade in, then hold, then fade to black at the very end
	const opacity = interpolate(frame, [0, 25, durationInFrames - 40, durationInFrames], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const lineWidth = interpolate(frame, [40, 110], [0, 560], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const creditOpacity = interpolate(frame, [160, 210], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<Scene>
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div
					style={{
						fontFamily: "Anton, sans-serif",
						fontSize: 260,
						color: GOLD,
						lineHeight: 1,
						textShadow: `0 0 130px ${GOLD}55`,
					}}
				>
					CR7
				</div>
				<div
					style={{
						margin: "34px 0",
						height: 3,
						width: lineWidth,
						background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
					}}
				/>
				<KineticText
					text="A LEGEND IN MOTION"
					frame={frame}
					fps={30}
					delay={45}
					color={WHITE}
					fontSize={64}
				/>
				<div
					style={{
						marginTop: 44,
						fontFamily: "Inter, sans-serif",
						fontSize: 30,
						letterSpacing: "0.55em",
						color: DIM,
					}}
				>
					A TRIBUTE
				</div>
				<div
					style={{
						marginTop: 90,
						fontFamily: "Inter, sans-serif",
						fontSize: 22,
						letterSpacing: "0.2em",
						color: "rgba(255,255,255,0.4)",
						opacity: creditOpacity,
					}}
				>
					Photos: Wikimedia Commons (CC BY-SA)
				</div>
			</div>

			<FilmGrain frame={frame} />
			<SceneTransition frame={frame} type="zoom" />
		</Scene>
	);
};
