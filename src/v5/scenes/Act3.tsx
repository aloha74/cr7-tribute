import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { PaperCut } from "../components/PaperCut";
import { Footage } from "../components/Footage";
import { WordStagger, Slam, LetterPop, Flash } from "../components/Kinetic";
import { Grade, Whip, Shake, Glitch, Lightning, Show } from "../components/FX";

/** 130–250s: the legend moments. */
export const Act3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const A = (n: string) => staticFile(`v5/art/${n}.webp`);
  const thanks = staticFile("v5/footage/thankyou.mp4");
  // SIUUU alpha as PNG sequence (robust; webm VP9+alpha hangs Chrome on seek)
  const siuIdx = t >= 228 && t <= 242 ? 1 + Math.floor(((t - 228) * 30) % 44) : 1;
  const siuFrame = staticFile(`v5/siuu-frames/a${String(siuIdx).padStart(3, "0")}.png`);
  // (montage uses pre-cut clips v5/montage/m0..m7.mp4)
  return (
    <AbsoluteFill>
      {/* WOLFSBURG 130-148 */}
      <PaperCut src={A("wolfsburg")} at={130} dur={18} zoomFrom={1.08} zoomTo={1.32} driftX={60} driftY={-30} flashAt={[139, 142, 145]} />
      <Slam at={131} until={136} size={150} color="#e63946">{"0–2"}</Slam>
      <WordStagger at={136.5} text="Bị dẫn trước. Cả thế giới nghĩ xong rồi." size={64} until={139.5} />
      <Shake at={139} until={147} amp={12}>
        <Slam at={139.5} until={141.5} size={220} color="#f5c518">{"1"}</Slam>
        <Slam at={142} until={144} size={220} color="#f5c518">{"2"}</Slam>
        <Slam at={144.5} until={147} size={220} color="#f5c518">{"3"}</Slam>
      </Shake>
      <Flash at={139.5} /><Flash at={142} /><Flash at={144.5} />
      <Whip at={147.7} />
      {/* SPAIN 2018 — 148-164 */}
      <PaperCut src={A("spain")} at={148} dur={16} zoomFrom={1.3} zoomTo={1.12} driftX={-40} driftY={20} />
      <Slam at={149} until={153} size={120}>{"PHÚT 88"}</Slam>
      <WordStagger at={153.5} text="Một quả đá phạt. Cả đất nước nín thở." size={66} until={158} />
      <LetterPop at={158.5} text="3-3" size={260} until={163.5} />
      <Flash at={158.5} durF={5} />
      <Whip at={163.7} />
      {/* EURO 2016 — 164-178 */}
      <PaperCut src={A("euro")} at={164} dur={14} zoomFrom={1.06} zoomTo={1.3} driftX={50} driftY={-25} flashAt={[170, 174]} />
      <WordStagger at={165} text="Vô địch Euro 2016." size={96} until={172} />
      <WordStagger at={172.5} text="Lần đầu tiên trong lịch sử." size={72} until={177.5} />
      <Whip at={177.7} />
      {/* 3-PEAT 178-190 */}
      <PaperCut src={A("threepeat")} at={178} dur={12} zoomFrom={1.1} zoomTo={1.28} driftX={-45} driftY={-20} />
      <Slam at={179} until={182} size={150} color="#f5c518">{"2016"}</Slam>
      <Slam at={182.2} until={185.2} size={150} color="#f5c518">{"2017"}</Slam>
      <Slam at={185.4} until={189.5} size={150} color="#f5c518">{"2018"}</Slam>
      <Flash at={179} /><Flash at={182.2} /><Flash at={185.4} />
      <Whip at={189.7} />
      {/* BICYCLE JUVE 190-204 */}
      <PaperCut src={A("bicycle")} at={190} dur={14} zoomFrom={1.32} zoomTo={1.1} driftX={35} driftY={30} />
      <Lightning at={192} until={202} x={260} />
      <Lightning at={194} until={202} x={1500} flip scale={0.8} />
      <WordStagger at={191} text="Ngả bàn đèn." size={110} until={197} />
      <WordStagger at={197.5} text="Cả sân đối thủ đứng dậy vỗ tay." size={64} until={203.5} />
      <Whip at={203.7} />
      {/* MONTAGE 204-228: 8 beat cuts (pre-cut clips, speed baked in) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Footage key={i} src={staticFile(`v5/montage/m${i}.mp4`)} at={204 + i * 3} dur={3.1} srcIn={0}
          zoomFrom={1.08 + (i % 3) * 0.08} zoomTo={1.42} darken={0.08} />
      ))}
      <Slam at={205} until={209} size={100}>{"BÀN."}</Slam>
      <Slam at={211} until={215} size={100}>{"LẠI BÀN."}</Slam>
      <Slam at={217} until={221} size={100}>{"VẪN BÀN."}</Slam>
      <Slam at={223} until={227.5} size={110} color="#f5c518">{"48 BÀN · 1 MÙA"}</Slam>
      <Whip at={227.7} />
      {/* SIUUU 228-242: bg-removed close-up + letters + fx */}
      <Show at={228} until={242}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #1a0f14 0%, #060607 70%)" }} />
      </Show>
      <Shake at={228} until={242} amp={16}>
        <Glitch at={230} until={241} intensity={1.4}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={siuFrame} style={{ height: "88%", transform: "scale(1.15)" }} />
          </div>
        </Glitch>
      </Shake>
      <Lightning at={229} until={241} x={180} scale={1.1} />
      <Lightning at={231} until={241} x={1560} flip scale={0.9} />
      <LetterPop at={230} text="SIUUU" size={270} until={241.5} />
      <Flash at={230} durF={4} /><Flash at={234} durF={3} /><Flash at={238} durF={4} peak={0.9} />
      <Whip at={241.7} />
      {/* BRIDGE 242-250: fans' love — watermark cropped out */}
      <Footage src={thanks} at={242} dur={8} srcIn={3} srcFps={25} zoomFrom={1.08} zoomTo={1.28}
        crop={[0.1, 0.14, 0.09, 0.03]} darken={0.2} />
      <WordStagger at={243} text="Huyền thoại — vẫn đang viết tiếp." size={72} until={249.5} />
      <Whip at={249.7} />
      <Grade />
    </AbsoluteFill>
  );
};
