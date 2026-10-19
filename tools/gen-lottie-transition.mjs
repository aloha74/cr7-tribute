// Generates src/v4/anim/act-transition.json — hand-authored Lottie:
// gold line draws across (0–12f), flash + shard burst (12–30f). 1920x1080, 30fps.
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1920, H = 1080, CX = 960, CY = 540;

const easeOut = (t0, t1, s0, s1) => [
  { i: { x: [0.2], y: [1] }, o: { x: [0.6], y: [0] }, t: t0, s: s0 },
  { t: t1, s: s1 },
];

const layers = [];

// 1 — the drawing line (left -> right), via animated rect size+position
// (trim paths "tm" break lottie-web parsing in this setup — avoided)
const lineDraw = (t0, t1, s0, s1) => ({
  a: 1,
  k: [
    { i: { x: [0.35], y: [1] }, o: { x: [0.65], y: [0] }, t: t0, s: s0 },
    { t: t1, s: s1 },
  ],
});
layers.push({
  ddd: 0, ind: 1, ty: 4, nm: "line",
  ks: {
    o: { a: 1, k: [{ i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 12, s: [100] }, { t: 18, s: [0] }] },
    r: { a: 0, k: 0 }, p: { a: 0, k: [CX, CY, 0] }, a: { a: 0, k: [0, 0, 0] },
    s: { a: 1, k: [{ i: { x: [0.3], y: [1] }, o: { x: [0.5], y: [0] }, t: 10, s: [100, 100, 100] }, { t: 14, s: [100, 420, 100] }] },
  },
  shapes: [{
    ty: "gr", nm: "g", it: [
      {
        ty: "rc", d: 1,
        s: lineDraw(0, 12, [0, 7], [1760, 7]),
        p: lineDraw(0, 12, [-880, 0], [0, 0]),
        r: { a: 0, k: 3 },
      },
      { ty: "fl", c: { a: 0, k: [0.961, 0.773, 0.094, 1] }, o: { a: 0, k: 100 } },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    ],
  }],
  ip: 0, op: 30, st: 0,
});

// 2 — impact flash
layers.push({
  ddd: 0, ind: 2, ty: 4, nm: "flash",
  ks: {
    o: { a: 1, k: [{ i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 12, s: [0] }, { t: 14, s: [55] }, { t: 20, s: [0] }] },
    r: { a: 0, k: 0 }, p: { a: 0, k: [CX, CY, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] },
  },
  shapes: [{
    ty: "gr", nm: "g", it: [
      { ty: "rc", d: 1, s: { a: 0, k: [W, H] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 } },
      { ty: "fl", c: { a: 0, k: [1, 0.93, 0.72, 1] }, o: { a: 0, k: 100 } },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    ],
  }],
  ip: 0, op: 30, st: 0,
});

// 3–12 — shards bursting outward
for (let i = 0; i < 10; i++) {
  const ang = (i / 10) * Math.PI * 2 + 0.31;
  const dist = 700 + (i % 3) * 160;
  const x1 = CX + Math.cos(ang) * dist;
  const y1 = CY + Math.sin(ang) * dist * 0.72;
  const len = 150 + (i % 4) * 70;
  layers.push({
    ddd: 0, ind: 3 + i, ty: 4, nm: `shard${i}`,
    ks: {
      o: { a: 1, k: [{ i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] }, t: 13, s: [100] }, { t: 28, s: [0] }] },
      r: { a: 0, k: (ang * 180) / Math.PI },
      p: {
        a: 1, k: [
          { i: { x: [0.15], y: [1] }, o: { x: [0.5], y: [0] }, t: 13, s: [CX, CY, 0] },
          { t: 29, s: [x1, y1, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ i: { x: [0.3], y: [1] }, o: { x: [0.5], y: [0] }, t: 13, s: [30, 100, 100] }, { t: 20, s: [100, 100, 100] }] },
    },
    shapes: [{
      ty: "gr", nm: "g", it: [
        { ty: "rc", d: 1, s: { a: 0, k: [len, 6] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 2 } },
        { ty: "fl", c: { a: 0, k: [0.961, 0.773, 0.094, 1] }, o: { a: 0, k: 100 } },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
    }],
    ip: 0, op: 30, st: 0,
  });
}

const anim = {
  v: "5.7.4", fr: 30, ip: 0, op: 30, w: W, h: H,
  nm: "act-transition", ddd: 0, assets: [], layers,
};

const out = join(__dirname, "..", "src", "v4", "anim", "act-transition.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(anim));
console.log("wrote", out, "layers:", layers.length);
