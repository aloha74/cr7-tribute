import React from "react";
import { Composition } from "remotion";
import { CR7Video } from "./CR7Video";
import { CR7V3 } from "./v3/CR7V3";
import { CR7V4 } from "./v4/CR7V4";
import { CR7V5 } from "./v5/CR7V5";
import { CR7V6, V6_DURATION, V6_FPS, V6_WIDTH, V6_HEIGHT } from "./v6/CR7V6";



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
			<Composition
				id="CR7V4"
				component={CR7V4}
				durationInFrames={9000}
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
			
			
			
			
			
			
			
			
			
			<Composition
				id="CR7V5"
				component={CR7V5}
				durationInFrames={9000}
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
			<Composition
				id="CR7V6"
				component={CR7V6}
				durationInFrames={V6_DURATION}
				fps={V6_FPS}
				width={V6_WIDTH}
				height={V6_HEIGHT}
			/>
		</>
	);
};
