import React from "react";
import { useCurrentFrame } from "remotion";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { StatCounter } from "../components/StatCounter";
import { GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 4 — 5 Ballon d'Or + 5 Champions League (65–95s). */
export const Glory1: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("glory1");
	const opacity = fadeInOut(frame, durationInFrames);

	return (
		<Scene>
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<KineticText text="GLORY, BY THE NUMBERS" frame={frame} fps={30} delay={10} color={WHITE} fontSize={84} />

				<div style={{ display: "flex", gap: 220, marginTop: 80 }}>
					<StatCounter
						from={0}
						to={5}
						frame={frame}
						fps={30}
						duration={70}
						delay={50}
						label="BALLON D'OR"
						color={GOLD}
						fontSize={190}
					/>
					<div style={{ width: 2, background: "rgba(255,255,255,0.14)" }} />
					<StatCounter
						from={0}
						to={5}
						frame={frame}
						fps={30}
						duration={70}
						delay={80}
						label="CHAMPIONS LEAGUE"
						color={WHITE}
						fontSize={190}
					/>
				</div>

				<div
					style={{
						marginTop: 70,
						fontFamily: "Inter, sans-serif",
						fontSize: 30,
						letterSpacing: "0.4em",
						color: "rgba(255,255,255,0.55)",
					}}
				>
					2008 · 2013 · 2014 · 2016 · 2017
				</div>
			</div>
		</Scene>
	);
};
