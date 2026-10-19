#!/usr/bin/env node
// VÒNG 2: "đôi tai ngoài" — phân tích độc lập file WAV, không dùng gì từ compose script.
// Hỏi: có đơn điệu không? chuyển chương mượt không? peak có chỗ nào vượt -3dB không?
import { readFileSync } from "fs";

const buf = readFileSync("public/v5/score.wav");
const SR = 44100, N = buf.readUInt32LE(40) / 4;
const L = new Float32Array(N), R = new Float32Array(N);
for (let i = 0; i < N; i++) {
  L[i] = buf.readInt16LE(44 + i * 4) / 32768;
  R[i] = buf.readInt16LE(44 + i * 4 + 2) / 32768;
}
const fail = [], ok = [];
const check = (name, cond, detail) => {
  const line = detail ? name + " -- " + detail : name;
  if (cond) ok.push(line); else fail.push(line);
};
const seg = (a, b) => {
  let s = 0, c = 0;
  for (let i = Math.floor(a * SR); i < Math.min(N, Math.floor(b * SR)); i += 11) { s += L[i] * L[i] + R[i] * R[i]; c++; }
  return Math.sqrt(s / Math.max(1, c) / 2);
};

// 1. Đường cong năng lượng 5s — có biến thiên động (không đơn điệu)?
const curve = [];
for (let t = 0; t < 300; t += 5) curve.push(seg(t, t + 5));
const mean = curve.reduce((a, b) => a + b, 0) / curve.length;
const sd = Math.sqrt(curve.reduce((a, b) => a + (b - mean) ** 2, 0) / curve.length);
console.log("RMS 5s: mean=" + mean.toFixed(3) + " sd=" + sd.toFixed(3) + " min=" + Math.min(...curve).toFixed(3) + " max=" + Math.max(...curve).toFixed(3));
check("biến thiên động đủ lớn (không đơn điệu)", sd / mean > 0.25, "sd/mean=" + (sd / mean).toFixed(2));
// không có đoạn phẳng lì >15s (trừ fade cuối)
let flatRun = 0, flatMax = 0;
for (let i = 0; i < curve.length; i++) {
  if (Math.abs(curve[i] - curve[Math.max(0, i - 1)]) < 0.004 && curve[i] < 0.02) { flatRun += 5; flatMax = Math.max(flatMax, flatRun); }
  else flatRun = 0;
}
check("không có đoạn chết lặng >15s", flatMax <= 15, "flatMax=" + flatMax + "s");

// 2. Khoảng lặng ngoài ý muốn (>2s dưới -50dB)?
const silences = [];
let s0 = -1;
for (let t = 0; t < 300; t += 0.5) {
  const r = seg(t, t + 0.5);
  if (r < 0.0032) { if (s0 < 0) s0 = t; }
  else { if (s0 >= 0 && t - s0 > 2) silences.push([s0, t]); s0 = -1; }
}
console.log("silent gaps >2s:", JSON.stringify(silences));
check("không có khoảng lặng ngoài ý muốn", silences.every(([a]) => a >= 298), JSON.stringify(silences));

// 3. Chuyển chương 60/130: không có click/DC jump (delta mẫu tối đa quanh biên)
const maxDelta = (t) => {
  let m = 0;
  for (let i = Math.floor((t - 0.5) * SR); i < Math.floor((t + 0.5) * SR); i++) {
    m = Math.max(m, Math.abs(L[i + 1] - L[i]), Math.abs(R[i + 1] - R[i]));
  }
  return m;
};
const d60 = maxDelta(60), d130 = maxDelta(130), dMid = maxDelta(200);
console.log("max sample-delta: @60=" + d60.toFixed(3) + " @130=" + d130.toFixed(3) + " @200=" + dMid.toFixed(3));
check("không click ở biên chương", d60 < 0.5 && d130 < 0.5, "@60=" + d60.toFixed(3) + " @130=" + d130.toFixed(3));

// 4. Peak từng cửa sổ 1s — độc lập với vòng 1 (bước nhảy khác)
let worst = 0, wt = 0;
for (let w = 0; w < 300; w++) {
  let p = 0;
  for (let i = w * SR; i < (w + 1) * SR; i += 7) p = Math.max(p, Math.abs(L[i]), Math.abs(R[i]));
  if (p > worst) { worst = p; wt = w; }
}
const worstDb = 20 * Math.log10(worst);
check("peak mọi cửa sổ 1s < -3dB", worstDb < -3, "worst=" + worstDb.toFixed(2) + "dB @" + wt + "s");

// 5. Stereo: không mono, không ngược pha
let dot = 0, eL = 0, eR = 0;
for (let i = 0; i < N; i += 43) { dot += L[i] * R[i]; eL += L[i] * L[i]; eR += R[i] * R[i]; }
const corr = dot / Math.sqrt(eL * eR);
console.log("stereo correlation=" + corr.toFixed(3) + " E_L=" + eL.toFixed(0) + " E_R=" + eR.toFixed(0));
check("stereo có chiều rộng (không mono cứng)", corr < 0.98, "corr=" + corr.toFixed(3));
check("không ngược pha", corr > 0, "corr=" + corr.toFixed(3));
check("cân bằng L/R", Math.abs(eL - eR) / Math.max(eL, eR) < 0.15);

// 6. Tương phản âm sắc: tỉ lệ năng lượng high-freq (>4kHz) mỗi chương
const hpRatio = (a, b) => {
  let hf = 0, tot = 0, pL = 0, pR = 0;
  const k = 4000 / (SR / 2); // one-pole highpass coeff-ish
  for (let i = Math.floor(a * SR); i < Math.floor(b * SR); i += 5) {
    const xl = L[i] - pL, xr = R[i] - pR; pL = L[i]; pR = R[i];
    hf += xl * xl + xr * xr; tot += L[i] * L[i] + R[i] * R[i];
  }
  return hf / Math.max(1e-9, tot);
};
const h1 = hpRatio(20, 55), h2 = hpRatio(90, 125), h3 = hpRatio(150, 200), hC = hpRatio(280, 295);
console.log("HF ratio: ch1=" + h1.toFixed(3) + " ch2=" + h2.toFixed(3) + " ch3=" + h3.toFixed(3) + " credits=" + hC.toFixed(3));
check("ch3 có nội dung high-freq rõ (hat/snare/air)", h3 > 0.5 * h1, h3.toFixed(3) + " vs ch1 " + h1.toFixed(3));
check("credits ấm, không chói hơn ch3", hC < h3 * 1.6, hC.toFixed(3) + " vs ch3 " + h3.toFixed(3));

// 7. Cao trào đúng chỗ: năng lượng quanh 240 và 250-270 phải thuộc top
const e240 = seg(238, 244), eCount = seg(250, 270), eMax = Math.max(...curve);
console.log("RMS: siuuu(238-244)=" + e240.toFixed(3) + " count(250-270)=" + eCount.toFixed(3) + " max5s=" + eMax.toFixed(3));
check("cao trào SIUUU thuộc top năng lượng", e240 > eMax * 0.75);
check("đoạn đếm 0-900 duy trì năng lượng cao", eCount > eMax * 0.6);

console.log("\n--- VÒNG 2 ---");
console.log("PASS:", ok.length); ok.forEach((s) => console.log("  +", s));
console.log("FAIL:", fail.length); fail.forEach((s) => console.log("  X", s));
process.exit(fail.length ? 1 : 0);
