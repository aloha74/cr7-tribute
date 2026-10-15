import React from "react";
import { Composition } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CR7Video } from "./CR7Video";
import { DURATION_FRAMES, FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./timeline";

loadFont(); // Anton — cinematic condensed display font
loadInter(); // Inter — clean body font

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="CR7Tribute"
				component={CR7Video}
				durationInFrames={DURATION_FRAMES}
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
		</>
	);
};
