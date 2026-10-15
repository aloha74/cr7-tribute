import React from "react";
import { Composition } from "remotion";
import { CR7Video } from "./CR7Video";
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
		</>
	);
};
