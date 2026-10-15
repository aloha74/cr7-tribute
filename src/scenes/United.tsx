import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 3 — Manchester United, the number 7 (50–65s). */
export const United: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("united");
	const opacity = fadeInOut(frame, durationInFrames);
	const pop = spring({ frame: frame - 20, fps: 30, config: { damping: 200, stiffness: 90 } });
	const ringRotate = interpolate(frame, [0, durationInFrames], [0, 120]);

	return (
		<Scene>
			<div style={{ opacity, display: "flex", alignItems: "center", gap: 110 }}>
				{/* Giant number 7 with rotating ring */}
				<div style={{ position: "relative", width: 520, height: 520, display: "flex", justifyContent: "center", alignItems: "center" }}>
					<div
						style={{
							position: "absolute",
							inset: 10,
							borderRadius: "50%",
							border: "3px dashed rgba(245,197,24,0.5)",
							transform: `rotate(${ringRotate}deg) scale(${pop})`,
						}}
					/>
					<div
						style={{
							position: "absolute",
							inset: 55,
							borderRadius: "50%",
							border: "1px solid rgba(255,255,255,0.15)",
							transform: `scale(${pop})`,
						}}
					/>
					<div
						style={{
							fontFamily: "Anton, sans-serif",
							fontSize: 380,
							color: GOLD,
							lineHeight: 1,
							transform: `scale(${pop})`,
							textShadow: `0 0 120px ${GOLD}66`,
						}}
					>
						7
					</div>
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<KineticText text="MANCHESTER UNITED" frame={frame} fps={30} delay={35} color={WHITE} fontSize={88} align="left" />
					<div style={{ marginTop: 26, fontFamily: "Inter, sans-serif", fontSize: 40, fontWeight: 600, letterSpacing: "0.3em", color: GOLD }}>
						2003
					</div>
					<div style={{ marginTop: 14, fontFamily: "Inter, sans-serif", fontSize: 30, color: DIM, maxWidth: 640 }}>
						A teenager inherits the legendary number 7 shirt — and makes it his own.
					</div>
				</div>
			</div>
		</Scene>
	);
};
