import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { StatCounter } from "../components/StatCounter";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 5 — Real Madrid era, 450 goals (95–125s). */
export const Madrid: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("madrid");
	const opacity = fadeInOut(frame, durationInFrames);
	// Pulsing glow behind the counter
	const glow = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 1.4);

	return (
		<Scene>
			<div
				style={{
					position: "absolute",
					width: 1100,
					height: 1100,
					borderRadius: "50%",
					background: `radial-gradient(circle, rgba(245,197,24,${0.1 + glow * 0.08}) 0%, transparent 65%)`,
				}}
			/>
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div style={{ fontFamily: "Inter, sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: "0.55em", color: DIM }}>
					REAL MADRID · 2009 — 2018
				</div>
				<div style={{ margin: "40px 0" }}>
					<StatCounter
						from={0}
						to={450}
						frame={frame}
						fps={30}
						duration={180}
						delay={40}
						label="GOALS — ALL-TIME CLUB RECORD"
						color={GOLD}
						fontSize={230}
					/>
				</div>
				<KineticText text="THE GREATEST GOALSCORER IN CLUB HISTORY" frame={frame} fps={30} delay={120} color={WHITE} fontSize={44} />
				<div
					style={{
						marginTop: 36,
						height: 3,
						width: interpolate(frame, [140, 220], [0, 700], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						}),
						background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
					}}
				/>
			</div>
		</Scene>
	);
};
