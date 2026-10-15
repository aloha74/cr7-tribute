import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { FPS, TIMELINE } from "./timeline";
import { Intro } from "./scenes/Intro";
import { Origins } from "./scenes/Origins";
import { United } from "./scenes/United";
import { Glory1 } from "./scenes/Glory1";
import { Madrid } from "./scenes/Madrid";
import { Juve } from "./scenes/Juve";
import { Portugal } from "./scenes/Portugal";
import { Goals } from "./scenes/Goals";
import { Legacy } from "./scenes/Legacy";
import { Outro } from "./scenes/Outro";

const SCENE_COMPONENTS: Record<string, React.FC> = {
	intro: Intro,
	origins: Origins,
	united: United,
	glory1: Glory1,
	madrid: Madrid,
	juve: Juve,
	portugal: Portugal,
	goals: Goals,
	legacy: Legacy,
	outro: Outro,
};

export const CR7Video: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: "#000000" }}>
			{TIMELINE.map((seg) => {
				const Component = SCENE_COMPONENTS[seg.id];
				if (!Component) {
					throw new Error(`No component registered for scene "${seg.id}"`);
				}
				return (
					<Sequence
						key={seg.id}
						from={seg.startSec * FPS}
						durationInFrames={(seg.endSec - seg.startSec) * FPS}
					>
						<Component />
					</Sequence>
				);
			})}

			{/* Soundtrack: "Anthem of Victory" by Good_B_Music — Pixabay Content License
			    (free for commercial use, monetization allowed). */}
			<Audio src={staticFile("anthem-of-victory.mp3")} />
		</AbsoluteFill>
	);
};
