import React from "react";
import { AbsoluteFill, Video, staticFile } from "remotion";
import { Footage } from "../components/Footage";
import { WordStagger, Slam, Rise, Flash } from "../components/Kinetic";
import { Grade, Whip, Glitch } from "../components/FX";

/**
 * 0–15s: 3-SECOND HOOK (cold open) then rewind to 1985.
 * 0-3: "900+ BÀN THẮNG. BẰNG CÁCH NÀO?" + SIUUU close-up burst on heartbeats.
 * 3-15: FUNCHAL MADEIRA 1985 + drone pullback of the statue.
 */
export const Prologue: React.FC = () => (
  <AbsoluteFill>
    {/* HOOK 0-3s */}
    <Glitch at={0.4} until={2.9} intensity={0.8}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Video src={staticFile("v4/siuuu-closeup.mp4")} muted loop
          style={{ height: "130%", opacity: 0.55 }} />
      </div>
    </Glitch>
    <Slam at={0.15} until={1.6} size={190} color="#f5c518">{"900+ BÀN THẮNG."}</Slam>
    <Slam at={1.55} until={3.1} size={120}>{"BẰNG CÁCH NÀO?"}</Slam>
    <Flash at={0.15} durF={2} peak={0.5} />
    <Flash at={1.55} durF={2} peak={0.5} />
    {/* REWIND 3-15s */}
    <WordStagger at={3.4} text="FUNCHAL · MADEIRA · 1985" size={80} perWordBeats={2} until={8.5} />
    <Footage src={staticFile("v5/footage/cr7-drone-selfie-4k.webm")} at={6} dur={9}
      srcIn={35.5} srcFps={24} zoomFrom={1.45} zoomTo={1.02} darken={0.25} />
    <Rise at={9} until={14.2} size={44}>{"Nơi một huyền thoại bắt đầu — từ hai bàn tay trắng."}</Rise>
    <Whip at={14.7} />
    <Grade />
  </AbsoluteFill>
);
