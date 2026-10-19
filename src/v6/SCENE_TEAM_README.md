# SCENE TEAM INSTRUCTIONS — CR7 v6

## Đọc trước khi code (bắt buộc)
1. `v6/TREATMENT_V6.md` — spec chi tiết từng scene được giao (§1), bản đồ transition (§1.x), text duyệt (§2 — CHỈ dùng text trong danh sách này)
2. `research/TECHNIQUE_BIBLE.md` — Phần B (mã kỹ thuật T1–T23), Phần C (12 điểm C1–C12 phải tránh)
3. `v6/DECISIONS.md` — quy tắc logo: CẤM watermark góc; logo tự nhiên trong footage GIỮ NGUYÊN

## Scaffolding có sẵn (dùng, không viết lại)
- `src/v6/CR7V6.tsx` — registry scene (mỗi scene nhận `frame` LOCAL, 0 = đầu scene)
- `src/v6/timeline.json` — start/dur từng scene (frames), music markers (D1–D4, J1–J3, L1–L2, SIL-0–2)
- `src/v6/motion/eases.ts` — expoOut, power3Out, power4Out, sineInOut, backOut17, springCrit/IOS/Snappy, cresc, decayExp
- `src/v6/motion/beat.ts` — `beatToFrame(beat)` (T1: mọi cut/effect ánh xạ qua beat, CẤM hardcode giây), `secToFrame`
- `src/v6/components/Grade.tsx` — `COLORS`, `Grade` (đã bọc ngoài ở CR7V6), `GoldHalo`, `ImpactFlash`, `useShake`, `useBeatPunch`
- `src/v6/components/KineticText.tsx` — `CharSlam`, `Stamp`, `Counter` (T3/T4)
- Assets: `public/v6/assets/*.png` — **đọc `public/v6/assets/ASSET_MANIFEST.md` để biết mã file chính xác** (P1–P14, SIL-CR7-*, SF-S27-M1, SF-S28-M4), footage: `public/v6/footage/*.mp4` (đã optimize từ webm: keyframe dày, seek nhanh — DÙNG BẢN NÀY, không dùng `footage-new/*.webm` trực tiếp), `public/v3/clip01–16.mp4`, `public/v4/siuuu-closeup.mp4`, `public/v5/siuuu-alpha.webm`
- SFX: `public/v6/sfx/*.wav` — **đọc `public/v6/sfx/SFX_MANIFEST.md`** (20 stems, có timestamp đặt). Lưu ý: `siuuu-alpha.webm` KHÔNG có kênh alpha thật — S19 dùng `siuuu-closeup.mp4`; footage drone S1 thực tế chỉ 854×450 (SD) — cần upscale + HUD che vỡ hạt.

## Luật sắt khi implement
1. **T20 — 3 tầng motion mọi scene:** Primary + Secondary + Ambient. KHÔNG frame nào mọi thứ đứng yên (grain thở đã có ở Grade, nhưng mỗi scene cần motion riêng).
2. **T3 — cấm linear** cho chuyển động không gian; cấm opacity-only; entrance luôn spring/bezier.
3. **T1 — cấm hardcode giây:** mọi timing qua `beatToFrame()` hoặc `secToFrame()`.
4. **Text:** CHỈ từ danh sách §2 treatment. Font: Anton (display) + Inter (body) — đã load.
5. **Transition biên scene:** theo bản đồ transition §1.x (vật motivate đã spec).
6. **Camera dial + pacing dial:** theo bảng §0 treatment cho từng act.
7. **Footage:** giữ nguyên bản (không che logo). HUD viewfinder chỉ ở S6/S12/S14/S18, tuân safe-area (cách viền ≥5%, không che subject).
8. **Paper-cut:** stop-motion 10fps (posterize — implement bằng cách quantize frame: `Math.floor(frame/3)*3`), bounce-settle + bóng đổ, cấm motion blur CGI.

## Quy trình mỗi scene
1. Code scene theo spec treatment
2. `npx remotion still CR7V6 out/check-<scene>.png --frame=<giữa scene>` — tự xem, sửa
3. 2 vòng review độc lập nội bộ team (kỹ thuật + cảm xúc) trước khi báo xong
4. Báo cáo: scene nào xong, kỹ thuật T nào đã dùng, vấn đề gặp phải

## Kiểm tra compile
`npx tsc --noEmit` phải pass sau mỗi scene.
