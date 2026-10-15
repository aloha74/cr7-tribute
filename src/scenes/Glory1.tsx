import React from "react";
import { useCurrentFrame } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { KineticText } from "../components/KineticText";
import { LyricHook } from "../components/LyricHook";
import { PhotoLayer } from "../components/PhotoLayer";
import { Scene } from "../components/Scene";
import { SceneTransition } from "../components/SceneTransition";
import { StatCounter } from "../components/StatCounter";
import { GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 4 — 5 Ballon d'Or + 5 Champions League (57–83s). Glitch transition in. */
export const Glory1: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("glory1");
	const opacity = fadeInOut(frame, durationInFrames);

	return (
		<Scene>
			{/* Layer 2 — midground: CR7 after the 2018 UCL final, right side */}
			<PhotoLayer
				src="images/cr7-ucl-final-2018.jpg"
				frame={frame}
				fps={30}
				durationInFrames={durationInFrames}
				side="right"
			/>

			{/* Layer 3 — foreground: counters on the left */}
			<div
				style={{
					opacity,
					position: "absolute",
					left: 130,
					top: "50%",
					transform: "translateY(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					maxWidth: 900,
				}}
			>
				<KineticText text="GLORY, BY THE NUMBERS" frame={frame} fps={30} delay={10} color={WHITE} fontSize={72} align="left" />

				<div style={{ display: "flex", gap: 120, marginTop: 60 }}>
					<StatCounter
						from={0}
						to={5}
						frame={frame}
						fps={30}
						duration={70}
						delay={50}
						label="BALLON D'OR"
						color={GOLD}
						fontSize={170}
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
						fontSize={170}
					/>
				</div>

				<div
					style={{
						marginTop: 56,
						fontFamily: "Inter, sans-serif",
						fontSize: 28,
						letterSpacing: "0.4em",
						color: "rgba(255,255,255,0.55)",
					}}
				>
					2008 · 2013 · 2014 · 2016 · 2017
				</div>

				<div style={{ marginTop: 64 }}>
					<LyricHook text="GREATNESS IS EARNED" frame={frame} fps={30} delay={170} fontSize={46} />
				</div>
			</div>

			<FilmGrain frame={frame} />
			<SceneTransition frame={frame} type="glitch" />
		</Scene>
	);
};
