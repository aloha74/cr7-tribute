import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { PaperCut } from "../components/PaperCut";
import { WordStagger, Slam, Flash } from "../components/Kinetic";
import { Grade, Whip, Shake, Glitch } from "../components/FX";

/** 60–130s: blood + Moscow 2008. */
export const Act2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const moscow = staticFile("v5/art/moscow.webp");
  // blood-red pulsing background (injury webm has graphic macro shots throughout — not usable)
  const pulse = 0.75 + 0.25 * Math.sin(t * 2.2);
  const showBlood = t >= 60 && t < 100;
  return (
    <AbsoluteFill>
      {/* 60-100s: blood-red kinetic background, zoom cuts via text */}
      {showBlood && (
        <div style={{
          position: "absolute", inset: -60,
          background: `radial-gradient(ellipse at 50% 45%, rgba(140,20,25,${0.55 * pulse}) 0%, rgba(40,5,8,0.95) 55%, #060607 100%)`,
          transform: `scale(${1 + 0.08 * Math.sin(t * 0.9)})`,
        }} />
      )}
      {showBlood && (
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5,
          background: "repeating-linear-gradient(115deg, transparent 0px, transparent 90px, rgba(120,15,20,0.12) 90px, rgba(120,15,20,0.12) 94px)",
        }} />
      )}
      <Shake at={60} until={100} amp={10}>
        <WordStagger at={62} text="Máu." size={150} until={67} />
      </Shake>
      <Slam at={68} until={72.5} size={120}>{"Ngã."}</Slam>
      <Slam at={74} until={78.5} size={130}>{"Đứng dậy."}</Slam>
      <Slam at={80} until={84.5} size={120}>{"Ngã nữa."}</Slam>
      <Glitch at={86} until={97} intensity={1.2}>
        <Slam at={87} until={96.5} size={150} color="#e63946">{"VẪN ĐỨNG DẬY."}</Slam>
      </Glitch>
      <Whip at={99.7} />
      {/* 100-130s: Moscow 2008 paper-cut, slow-mo feel */}
      <PaperCut src={moscow} at={100} dur={30} zoomFrom={1.06} zoomTo={1.34} driftX={-50} driftY={20}
        flashAt={[112, 124]} darken={0.1} />
      <WordStagger at={101} text="Moscow. Mưa. Chấm penalty." size={84} until={110} />
      <Flash at={112} durF={6} peak={0.9} />
      <WordStagger at={113.5} text="Trượt — rồi nâng cúp." size={88} until={121} />
      <Slam at={122} until={128} size={110} color="#f5c518">{"2008 · VUA CHÂU ÂU"}</Slam>
      <Whip at={129.7} />
      <Grade />
    </AbsoluteFill>
  );
};
