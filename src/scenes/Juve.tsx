import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { DIM, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 6 — Juventus (125–140s). Black & white stripes motif. */
export const Juve: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("juve");
	const opacity = fadeInOut(frame, durationInFrames);
	const stripeShift = interpolate(frame, [0, durationInFrames], [0, -120]);

	return (
		<Scene>
			{/* Diagonal black/white stripes drifting in the background */}
			<div
				style={{
					position: "absolute",
					inset: -300,
					opacity: 0.1 * opacity,
					background:
						"repeating-linear-gradient(115deg, #ffffff 0px, #ffffff 46px, #000000 46px, #000000 92px)",
					transform: `translateX(${stripeShift}px)`,
				}}
			/>
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div style={{ fontFamily: "Inter, sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: "0.55em", color: DIM }}>
					2018 — 2021
				</div>
				<div style={{ margin: "34px 0" }}>
					<KineticText text="JUVENTUS" frame={frame} fps={30} delay={25} color={WHITE} fontSize={200} />
				</div>
				<KineticText text="CONQUERING ITALY" frame={frame} fps={30} delay={70} color={WHITE} fontSize={52} />
				<div style={{ marginTop: 30, fontFamily: "Inter, sans-serif", fontSize: 30, color: DIM }}>
					Back-to-back Serie A titles · 101 goals in 134 games
				</div>
			</div>
		</Scene>
	);
};
