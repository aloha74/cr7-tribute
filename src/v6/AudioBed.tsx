/**
 * AudioBed — CR7 v6 final mix (composition level).
 *
 * score.wav (380s) đã bake: ducking D1–D4 (-12dB), taiko hits, snare builds,
 * cymbal swells, risers, orchestral accents — KHÔNG layer lại các stem này (tránh doubling).
 *
 * Chỉ layer những gì score thiếu (đã verify bằng spectrum):
 *  - heartbeat (score im lặng ở SIL-1/SIL-2)
 *  - D1–D4: stem tổng hợp thay "tiếng gốc" (rights-safe), vượt lên khi nhạc duck
 *  - J1 ball bounce, J3 chant (foley/layer riêng)
 *  - impact_thump tại các impact frame mà score không có accent riêng (S7, S11×3, S27, S28×2)
 *    → đặt sớm 2–3f (T4-rule). S13 kick/net và S19 landing đã có D1/score accent → bỏ qua.
 */
import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";

const F = (sec: number) => Math.round(sec * 30);
const SFX = "v6/sfx";

const Impact: React.FC<{ at: number; vol?: number }> = ({ at, vol = 0.7 }) => (
  <Sequence from={at} durationInFrames={40}>
    <Audio src={staticFile(`${SFX}/sfx_impact_thump.wav`)} volume={vol} />
  </Sequence>
);

export const AudioBed: React.FC = () => {
  const frame = useCurrentFrame();

  // D3 (328–332s): fade cosine 0.8s 2 đầu theo spec §4 + gain -6dB (fix R1#1)
  // → chant "vượt lên làm chủ đạo" nhưng không phá SIL-2 near-silence
  const D3_START = F(328);
  const D3_END = F(332);
  const D3_FADE = Math.round(0.8 * 30); // 24f
  const d3Vol = interpolate(
    frame,
    [D3_START, D3_START + D3_FADE, D3_END - D3_FADE, D3_END],
    [0, 0.5, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Nhạc nền chính — đã bake ducking + orchestral SFX */}
      <Audio src={staticFile("v6/score.wav")} />

      {/* Heartbeat: SIL-1 (0–15s, loop file 6s) */}
      <Sequence from={F(0)} durationInFrames={F(6)}>
        <Audio src={staticFile(`${SFX}/sfx_heartbeat_loop_6s.wav`)} />
      </Sequence>
      <Sequence from={F(6)} durationInFrames={F(6)}>
        <Audio src={staticFile(`${SFX}/sfx_heartbeat_loop_6s.wav`)} />
      </Sequence>
      <Sequence from={F(12)} durationInFrames={F(3)}>
        <Audio src={staticFile(`${SFX}/sfx_heartbeat_loop_6s.wav`)} />
      </Sequence>
      {/* Heartbeat: SIL-2 (5:28–5:30) */}
      <Sequence from={F(328)} durationInFrames={F(2)}>
        <Audio src={staticFile(`${SFX}/sfx_heartbeat_loop_6s.wav`)} />
      </Sequence>

      {/* D1: kick + crowd bed 2:32→2:47 (đỉnh reo hò 2:47 = visual S13) */}
      <Sequence from={F(152)} durationInFrames={F(15)}>
        <Audio src={staticFile(`${SFX}/sfx_d1_kick_crowd_15s.wav`)} />
      </Sequence>
      {/* D2: cup cheer 3:34–3:38 */}
      <Sequence from={F(214)} durationInFrames={F(4)}>
        <Audio src={staticFile(`${SFX}/sfx_d2_cup_cheer_4s.wav`)} />
      </Sequence>
      {/* D3: SIUUU chant 5:28–5:32 — fade cosine 0.8s + gain 0.5 (fix R1#1) */}
      <Sequence from={D3_START} durationInFrames={D3_END - D3_START}>
        <Audio
          src={staticFile(`${SFX}/sfx_d3_siuuu_chant_4s.wav`)}
          volume={d3Vol}
        />
      </Sequence>
      {/* Snare build thứ hai 5:30–5:40 (fix R1#1: score bake quá yếu) */}
      <Sequence from={F(330)} durationInFrames={F(10)}>
        <Audio
          src={staticFile(`${SFX}/sfx_snare_build_10s.wav`)}
          volume={0.4}
        />
      </Sequence>
      {/* Hit modulation Am→Bbm 5:40 — tăng cường (fix R1#1), sớm 2f theo T4 */}
      <Sequence from={F(340) - 2} durationInFrames={75}>
        <Audio src={staticFile(`${SFX}/sfx_taiko_hit.wav`)} volume={0.65} />
      </Sequence>
      {/* L1: chant tail kéo 18f vào Finale (5:40) */}
      <Sequence from={F(339.4)} durationInFrames={F(1)}>
        <Audio src={staticFile(`${SFX}/sfx_d3_siuuu_chant_4s.wav`)} startFrom={90} volume={0.5} />
      </Sequence>
      {/* D4: stadium bed 6:04–6:08 */}
      <Sequence from={F(364)} durationInFrames={F(4)}>
        <Audio src={staticFile(`${SFX}/sfx_d4_stadium_bed_4s.wav`)} />
      </Sequence>

      {/* J1: ball bounce 0:59.7 (sớm 2f) */}
      <Sequence from={1789} durationInFrames={20}>
        <Audio src={staticFile(`${SFX}/sfx_ball_bounce_j1.wav`)} />
      </Sequence>
      {/* J3: chant Act IV 4:09.6 (sớm 2f) */}
      <Sequence from={7486} durationInFrames={60}>
        <Audio src={staticFile(`${SFX}/sfx_chant_act4_2s.wav`)} />
      </Sequence>

      {/* Impact thumps (sớm 2–3f, vol 0.7) */}
      <Impact at={2750} />   {/* S7 penalty kick */}
      <Impact at={4009} />   {/* S11 goal 1 */}
      <Impact at={4154} />   {/* S11 goal 2 */}
      <Impact at={4298} />   {/* S11 goal 3 */}
      <Impact at={9141} />   {/* S27 header freeze */}
      <Impact at={9621} />   {/* S28 M3 header */}
      <Impact at={9747} />   {/* S28 M4 penalty stamp */}
    </>
  );
};
