import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Scene } from "../components/Scene";
import { StatCounter } from "../components/StatCounter";
import { GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 8 — The 900+ career goals counter (170–200s). */
export const Goals: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("goals");
	const opacity = fadeInOut(frame, durationInFrames);
	// Rising particle dots
	const particles = Array.from({ length: 26 }, (_, i) => {
		const speed = 0.5 + (i % 5) * 0.22;
		const y = interpolate((frame * speed + i * 137) % 900, [0, 900], [620, -120], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		const x = ((i * 173) % 1500) - 750;
		const size = 3 + (i % 4) * 2.5;
		return { x, y, size, key: i };
	});

	return (
		<Scene>
			{/* Floating particles */}
			<div style={{ position: "absolute", inset: 0, opacity: opacity * 0.8 }}>
				{particles.map((p) => (
					<div
						key={p.key}
						style={{
							position: "absolute",
							left: `calc(50% + ${p.x}px)`,
							top: `calc(50% + ${p.y}px)`,
							width: p.size,
							height: p.size,
							borderRadius: "50%",
							background: GOLD,
							opacity: 0.55,
							boxShadow: `0 0 14px ${GOLD}`,
						}}
					/>
				))}
			</div>

			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div
					style={{
						fontFamily: "Inter, sans-serif",
						fontSize: 40,
						fontWeight: 700,
						letterSpacing: "0.6em",
						color: WHITE,
						marginBottom: 36,
					}}
				>
					CAREER GOALS
				</div>
				<StatCounter
					from={0}
					to={900}
					frame={frame}
					fps={30}
					duration={620}
					delay={40}
					suffix="+"
					label=""
					color={GOLD}
					fontSize={330}
				/>
				<div
					style={{
						marginTop: 40,
						fontFamily: "Inter, sans-serif",
						fontSize: 32,
						letterSpacing: "0.35em",
						color: "rgba(255,255,255,0.55)",
					}}
				>
					AND STILL COUNTING
				</div>
			</div>
		</Scene>
	);
};
