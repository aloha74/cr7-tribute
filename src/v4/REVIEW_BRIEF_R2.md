# Round-2 independent review brief — CR7 v4 "THE 900 CLUB" draft

## What to review
File: `~/workspace/cr7-tribute/out/cr7-v4-draft.mp4` (300s, 1920×1080, 30fps)
Contact sheets: `/tmp/v4r2-sheet-N.png` (every 10s, generated after render)

## Source of truth
- Treatment: `~/workspace/cr7-tribute/TREATMENT_V4.md` (5 acts, timings, text lines, facts)
- Footage manifest: `~/workspace/cr7-tribute/src/v4/footage.ts`
- Montage labels live in `~/workspace/cr7-tribute/src/v4/timeline.ts` (MONTAGE_CUTS)

## Check these (report PASS/FAIL per item + one-line evidence)
1. **Pacing**: does each act breathe at its own rhythm? Prologue hook ≤3s? Any dead/slow stretch?
2. **Transitions**: Lottie line→burst at act boundaries (29.2, 99.2, 164.2, 234.2, 279.2s), tear wipes inside acts, whip cuts in montage — do they land on music hits? Any default-looking fade?
3. **Text**: every line readable, no overlaps, no clipping at edges, correct per treatment, big/clear English. Credits at end include the CC BY 3.0 Wikimedia attribution.
4. **Music sync**: stat slams / montage cuts / SIUUU / final hit land on beats (hits at 22, 165, 235, 294s; 0.6s grid in acts 2–3).
5. **Footage honesty**: montage labels must match what's on screen (verified list: LA LIGA 2014–15 / GOAL / EL CLÁSICO / CAMP NOU / GOAL / NEVER SATISFIED / AGAIN. / AND AGAIN. / AND AGAIN. / 48.). No "bicycle"/technique claims. Euro 2016 & Turin are paper+text only — no fabricated footage.
6. **Facts**: 900+ goals, Madeira 1985, left home at 12, heart surgery at 15, Moscow 2008 header, Ballon d'Or at 23, €94M 2009, 48 goals/35 games, 140 UCL, 130+ Portugal, Euro 2016, Turin ovation.
7. **Visual bugs**: black frames, stuck frames, NaN/invisible elements, text collisions.

## Deliverable
Numbered issue list, each: timestamp + what you see + suggested fix. Then overall PASS / PASS WITH FIXES / FAIL.

## Already fixed in this draft (do not re-report)
- Captions were clipped by camera pan in Island/Ballon d'Or/Euro shots — fixed by moving captions outside transformed containers.
- "133" at ~185s is the UCL counter mid-count (reaches 140 by ~189s) — not a bug.
- Act-transition Lottie now fires correctly at 29.2/99.2/164.2/234.2/279.2s.
- Draft is 1280×720 (preview); final will be 1920×1080. Judge layout/proportions, not pixel sharpness.
