#!/usr/bin/env node
// VÒNG 1: kiểm tra kỹ thuật file WAV + cue-map (đọc lại từ đĩa, độc lập với compose script)
import { readFileSync } from "fs";

const buf = readFileSync("public/v5/score.wav");
const fail = [];
const ok = [];
const check = (name, cond, detail = "") => {
  const line = detail ? name + " -- " + detail : name;
  if (cond) ok.push(line); else fail.push(line);
};

// --- WAV header ---
check("RIFF/WAVE header", buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WAVE");
const channels = buf.readUInt16LE(22), sr = buf.readUInt32LE(24), bits = buf.readUInt16LE(34);
const dataBytes = buf.readUInt32LE(40);
check("stereo", channels === 2, `channels=${channels}`);
check("44.1kHz", sr === 44100, `sr=${sr}`);
check("16-bit PCM", bits === 16 && buf.readUInt16LE(20) === 1, `bits=${bits}`);
const nSamples = dataBytes / 4;
const dur = nSamples / sr;
check("duration == 300.0s", Math.abs(dur - 300) < 0.001, `dur=${dur.toFixed(3)}s`);

// --- samples ---
const L = new Float32Array(nSamples), R = new Float32Array(nSamples);
let peak = 0, clipped = 0;
for (let i = 0; i < nSamples; i++) {
  const l = buf.readInt16LE(44 + i * 4) / 32768, r = buf.readInt16LE(44 + i * 4 + 2) / 32768;
  L[i] = l; R[i] = r;
  peak = Math.max(peak, Math.abs(l), Math.abs(r));
  if (Math.abs(l) >= 0.999 || Math.abs(r) >= 0.999) clipped++;
}
const peakDb = 20 * Math.log10(peak);
check("peak < -3 dB", peakDb < -3, `peak=${peakDb.toFixed(2)} dB`);
check("no hard clipping", clipped === 0, `clipped samples=${clipped}`);
check("not silent", peak > 0.1, `peak=${peak.toFixed(3)}`);

const rms = (a, b) => {
  let s = 0; const i0 = Math.floor(a * sr), i1 = Math.floor(b * sr);
  for (let i = i0; i < i1; i += 7) s += (L[i] * L[i] + R[i] * R[i]) / 2;
  return Math.sqrt(s / Math.max(1, Math.floor((i1 - i0) / 7)));
};
// --- 3-chapter energy structure ---
const r1 = rms(15, 60), r2 = rms(60, 130), r3 = rms(130, 270), rC = rms(272, 298);
console.log(`RMS ch1(15-60)=${r1.toFixed(3)} ch2(60-130)=${r2.toFixed(3)} ch3(130-270)=${r3.toFixed(3)} credits(272-298)=${rC.toFixed(3)}`);
check("ch2 louder than ch1", r2 > r1 * 1.15, `${r2.toFixed(3)} vs ${r1.toFixed(3)}`);
check("ch3 loudest", r3 > r2 * 1.1, `${r3.toFixed(3)} vs ${r2.toFixed(3)}`);
check("credits calmer than ch3", rC < r3 * 0.75, `${rC.toFixed(3)} vs ${r3.toFixed(3)}`);
check("ch1 not empty", r1 > 0.01);
check("prologue heartbeat region audible", rms(0, 14) > 0.01);
check("end fade near-silent", rms(299, 300) < 0.02, `rms=${rms(299, 300).toFixed(4)}`);
check("breath before credits piano (271.8-273) exists", rms(271.8, 273) < r3 * 0.35, `rms=${rms(271.8, 273).toFixed(4)} vs ch3=${r3.toFixed(3)}`);

// peak per 1s window — nowhere may exceed -3 dB
let worstWin = 0, worstT = 0;
for (let w = 0; w < 300; w++) {
  let p = 0;
  for (let i = w * sr; i < (w + 1) * sr; i += 13) p = Math.max(p, Math.abs(L[i]), Math.abs(R[i]));
  if (p > worstWin) { worstWin = p; worstT = w; }
}
check("no 1s window exceeds -3 dB", 20 * Math.log10(worstWin) < -3,
  `worst=${(20 * Math.log10(worstWin)).toFixed(2)} dB @ ${worstT}s`);

// --- cue-map.json ---
const cm = JSON.parse(readFileSync("src/v5/cue-map.json", "utf8"));
check("cue-map duration 300", cm.duration === 300);
check("3 chapters", cm.chapters.length === 3);
check("bpm ch1=70", cm.chapters[0].bpm === 70);
check("bpm ch2=100", cm.chapters[1].bpm === 100);
check("bpm ch3=128", cm.chapters[2].bpm === 128);
const bt = cm.beatTimes;
check("beatTimes count 550", bt.length === 550, `n=${bt.length}`);
let mono = true;
for (let i = 1; i < bt.length; i++) if (bt[i] <= bt[i - 1]) mono = false;
check("beatTimes monotonic", mono);
check("beatTimes within [0,300)", bt[0] === 0 && bt[bt.length - 1] < 300, `first=${bt[0]} last=${bt[bt.length-1]}`);
check("ch2 starts at beat 60.0", bt[70] === 60, `bt[70]=${bt[70]}`);
check("ch3 starts at beat 130.0", bt[187] === 130, `bt[187]=${bt[187]}`);
const m = cm.markers;
check("marker siuuu=240", m.siuuu === 240);
check("marker count900=250", m.count900 === 250);
check("marker credits=270", m.credits === 270);
check("marker end=300", m.end === 300);
// beat spacing matches bpm per chapter
const gap = (a, b) => +(bt[b] - bt[a]).toFixed(4);
check("ch1 spacing = 60/70", Math.abs(gap(0,1) - 60/70) < 0.002, `gap=${gap(0,1)}`);
check("ch2 spacing = 0.6", Math.abs(gap(70,71) - 0.6) < 0.002, `gap=${gap(70,71)}`);
check("ch3 spacing = 0.46875", Math.abs(gap(187,188) - 0.46875) < 0.002, `gap=${gap(187,188)}`);

console.log("\n--- VÒNG 1 ---");
console.log("PASS:", ok.length);
ok.forEach((s) => console.log("  ✓", s));
console.log("FAIL:", fail.length);
fail.forEach((s) => console.log("  ✗", s));
process.exit(fail.length ? 1 : 0);
