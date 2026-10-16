import React from "react";
import { Composition } from "remotion";
import { CR7Video } from "./CR7Video";
import { CR7V3 } from "./v3/CR7V3";
import { DURATION_FRAMES, FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./timeline";
import { loadLocalFonts } from "./fonts";

loadLocalFonts(); // Anton (display) + Inter (body) from public/fonts/

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
			<Composition
				id="CR7V3"
				component={CR7V3}
				durationInFrames={DURATION_FRAMES}
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
		</>
	);
};
