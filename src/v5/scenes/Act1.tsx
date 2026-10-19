import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { PaperCut } from "../components/PaperCut";
import { WordStagger, Slam } from "../components/Kinetic";
import { Grade, Whip } from "../components/FX";

/** 15–60s: childhood paper-cut, camera always drifting. Flat absolute timing. */
export const Act1: React.FC = () => {
  const art = staticFile("v5/art/childhood-madeira.webp");
  return (
    <AbsoluteFill>
      {/* 15-30s: run up the hill */}
      <PaperCut src={art} at={15} dur={15} zoomFrom={1.05} zoomTo={1.3} driftX={70} driftY={-40} />
      <WordStagger at={16} text="Không ai cho cậu ấy gì cả." size={88} until={23} />
      <WordStagger at={23.5} text="Cậu ấy lấy tất cả." size={88} until={29.5} />
      <Whip at={29.7} />
      {/* 30-45s: second drift pass, opposite direction */}
      <PaperCut src={art} at={30} dur={15} zoomFrom={1.28} zoomTo={1.06} driftX={-80} driftY={30} />
      <Slam at={31} until={35} size={120}>{"Quét rác."}</Slam>
      <Slam at={35.5} until={39.5} size={120}>{"Bóng rách."}</Slam>
      <Slam at={40} until={44} size={130}>{"Chạy."}</Slam>
      <Whip at={44.7} />
      {/* 45-60s: push in tight on the boy */}
      <PaperCut src={art} at={45} dur={15} zoomFrom={1.15} zoomTo={1.5} driftX={30} driftY={-50} />
      <WordStagger at={46} text="Đói khát. Lì lợm. Không bao giờ dừng lại." size={72} until={55} />
      <WordStagger at={55.5} text="Cậu bé ấy tên là Cristiano." size={76} until={59.8} />
      <Whip at={59.7} />
      <Grade />
    </AbsoluteFill>
  );
};
