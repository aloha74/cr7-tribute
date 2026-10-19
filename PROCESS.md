# PROCESS.md — Quy trình làm video tribute CR7 v6 (tài liệu hóa để tái sử dụng)

> Dự án: video tri ân Cristiano Ronaldo · v6 "900+. BẰNG CÁCH NÀY." · 380s (~6:20) · 1080p30
> Repo: `aloha74/cr7-tribute` · Stack: Remotion (React) + nhạc/SFX tổng hợp bằng code (numpy/librosa)
> Quy tắc xuyên suốt: **2 VÒNG REVIEW ĐỘC LẬP ở MỌI khâu** (reviewer vòng 2 không xem kết quả vòng 1 trước)

---

## 0. Bài học từ v1–v5 (đọc trước để không lặp lại)

| Bản | Vấn đề | Bài học |
|---|---|---|
| v1–v4 | Slideshow ảnh tĩnh, text như báo cáo thành tích | Số liệu phải thành dataviz/counter kể chuyện, không card tĩnh |
| v5 | "Hoàn toàn là bản trình chiếu nhàm chán" + nhạc "kém sang, như trẻ con tập chơi nhạc" | (1) Mọi frame phải có 3 tầng motion; (2) Nhạc phải qua checklist 13 kỹ thuật + 10 cảm xúc |

12 điểm tự phê bình chi tiết: `research/TECHNIQUE_BIBLE.md` §C (C1–C12). 15 lỗi nhạc v5: `research/MUSIC_PROFESSIONAL_GUIDE.md` §1.

---

## 1. RESEARCH (trước khi viết treatment)

1. **Kỹ thuật dựng:** tổng hợp 20+ nguồn (bài "20 GitHub repos to build your own motion design studio", lemo-opuscar DIRECTOR.md, ngữ pháp Vox explainer) → `research/TECHNIQUE_BIBLE.md`: **23 mã kỹ thuật T1–T23** dựng được bằng code (whip/morph transitions, kinetic typography per-char, speed ramping, J-cut/L-cut, dataviz thay card tĩnh...).
2. **Nhạc:** phân tích pháp y nhạc bản cũ → `research/MUSIC_PROFESSIONAL_GUIDE.md`: 15 lỗi cụ thể + 11 kỹ thuật orchestration + kế hoạch phối khí + checklist 2 vòng (13 mục kỹ thuật vòng 1, 10 mục cảm xúc vòng 2 nghe mù).
3. **Số liệu:** mọi con số verify từ **≥2 nguồn độc lập** (UEFA, manutd.com, Sky Sports...) → `v6/STATS_VERIFIED.md`. **Cấm bịa số.**
4. **Phong cách tham chiếu:** `research/VOX_EXPLAINER_STYLE.md` (paper-cut + dataviz).

## 2. TREATMENT (`v6/TREATMENT_V6.md`)

- Viết scene-by-scene: mỗi scene có NỘI DUNG / KỸ THUẬT (mã T) / NHẠC (bám cue-map) / CAMERA-PACING (dial) / WHY.
- **§0 luật nền:** beat-grid là nguồn sự thật duy nhất (T1); easing vocabulary (cấm linear); 3 tầng motion mọi scene (T20); SFX sớm 2–3f; stack grade thống nhất (T18); timeline.json là single source of truth.
- **Bản đồ transition 28/28 biên** — mỗi biên có vật motivate (T5/T6/T17); hard cut chỉ khi có lý do ghi rõ.
- **§2 TEXT DUYỆT:** mọi chữ trên màn hình CHỈ từ danh sách này (100% tiếng Việt) — rule "only-the-user's-words".
- **§3 asset:** footage CC (ghi license/provenance) + paper-cut tự vẽ 100% + SFX tổng hợp.
- **2 vòng review treatment** trước khi build (vòng 1: 25 lỗi incl. 1 chặn; vòng 2: đạt).
- Quyết định của chủ nhân ghi vào `v6/DECISIONS.md` (ví dụ: cấm watermark góc video nhưng GIỮ logo tự nhiên trong footage; giữ Euro 2016; sửa nhạc cho khớp hình).

## 3. NHẠC (compose bằng code — `tools/compose-v6*.py`)

1. Viết cue-map trước (`public/v6/cue-sheet-v6.json`): tempo plan, sections, motif development (7 biến thể), ducking windows, intentional silences.
2. Compose MIDI → render WAV (numpy synth + humanization: velocity/time, CC11 swells).
3. **GATE:** không build hình Act nào khi nhạc chương đó chưa xong (cấm placeholder).
4. **Review nhạc 2 vòng:** vòng 1 — 13 mục kỹ thuật (MUSIC_PROFESSIONAL_GUIDE Phần 4); vòng 2 — 10 mục cảm xúc, nghe mù. Ghi biên bản, FAIL nào được chấp nhận phải ghi lý do.
5. Bake beat-grid từ audio thật: `tools/analyze-beats-v6.py` → `src/v6/beat-grid.json` → `beatToFrame()` trong code. **Cấm hardcode giây.**
6. SFX tổng hợp riêng (`v6/tools/gen_sfx.py`): 100% synthetic, rights-safe. Stem "tiếng gốc" (crowd/chant) thay cho audio bản quyền không xác minh được.

## 4. DỰNG HÌNH (Remotion — `src/v6/`)

1. **Scaffolding trước:** `CR7V6.tsx` (registry scene, mỗi scene nhận frame LOCAL), `timeline.json` (start/dur frames + music markers), `motion/eases.ts` + `motion/beat.ts`, `components/Grade.tsx` (grade stack + halo + shake + beat punch), `components/KineticText.tsx` (CharSlam/Stamp/Counter).
2. **Asset trước:** paper-cut vẽ theo manifest (`public/v6/assets/ASSET_MANIFEST.md`), footage optimize (`public/v6/footage/`), style frame cho moment khó.
3. **Chia team song song** theo cụm scene (v6: Team A S0–S10, Team B S11–S19, Team C S20–S28). Mỗi team đọc treatment + technique bible + decisions + SCENE_TEAM_README.md.
4. **Luật sắt khi code:** text chỉ từ §2; cấm watermark góc; logo tự nhiên giữ nguyên; paper-cut stop-motion 10fps (quantize frame), cấm motion blur CGI; 3 tầng motion mọi scene; cấm linear cho chuyển động không gian.
5. **Mỗi scene:** code → `remotion still` tự xem/sửa → 2 vòng review độc lập nội bộ → `tsc --noEmit` pass → ghi biên bản `v6/reviews/`.
6. **Tích hợp audio** (`src/v6/AudioBed.tsx`): score + SFX stems còn thiếu (đã verify spectrum: không layer lại cái score đã bake để tránh doubling). Impact SFX đặt sớm 2–3f tại frame đã trích từ code scene.

## 5. RENDER

- Chunked render (4 chunk × 2850 frames) để sống sót qua service restart: `tools/render-v6.sh` → concat `-c copy` → `out/cr7-v6.mp4`.
- Spec: 1920×1080, 30fps, H.264 + AAC stereo 48kHz, peak < −3dB.

## 6. QA + REVIEW VIDEO (2 vòng độc lập trên bản hoàn chỉnh)

1. **QA kỹ thuật:** duration 380s ±0.5, 1080p30, audio peak, không frame đen đầu/cuối thừa.
2. **Vòng 1 (kỹ thuật):** checklist Technique Bible Phần D — đối chiếu treatment từng scene, số liệu vs STATS_VERIFIED, chính tả, text chỉ từ §2, logo rule, transition map, J/L-cut + ducking + silence đúng timestamp.
3. **Vòng 2 (cảm xúc, xem mù):** reviewer không xem kết quả vòng 1 — nhịp, cảm xúc, còn "slideshow nhàm chán" không, motif có đọc được không.
4. Ghi biên bản cả 2 vòng vào `v6/reviews/`.

## 7. CHECKLIST TỔNG DUYỆT → GIAO

`v6-CHECKLIST.md`: thông số kỹ thuật + quy tắc sắt + chống slideshow (C1–C12) + gates nhạc + 2 vòng review → **XÓA METADATA file** (`ffmpeg -map_metadata -1` / kiểm tra bằng ffprobe: không còn encoder tag) → báo chủ nhân.

## 8. PUSH GITHUB

```bash
cd ~/workspace/cr7-tribute
git init -b main && git add -A && git commit -m "..."
# push qua OAuth connector: /opt/hatch/bin/github
```

---

## Checklist nhanh cho lần sau

- [ ] Research kỹ thuật + nhạc + số liệu (≥2 nguồn/số)
- [ ] Treatment scene-by-scene + transition map + text duyệt + 2 vòng review
- [ ] Quyết định chủ nhân → DECISIONS.md
- [ ] Compose nhạc + review 2 vòng + bake beat-grid (GATE trước khi build hình)
- [ ] Scaffolding + asset + style frame
- [ ] Dựng scene (mỗi scene 2 vòng review) → tích hợp audio → render chunked
- [ ] QA + review video 2 vòng → checklist tổng duyệt → xóa metadata
- [ ] PROCESS.md cập nhật → push GitHub

---

## 9. Bài học từ review video v6 (19/10/2026) — 2 vòng độc lập bắt 4 lỗi

**Vòng 1 (kỹ thuật) — 8/10 PASS, 1 FAIL (CHẶN), 1 PASS có ghi chú:**
- **R1#1 (CHẶN):** Audio D3/SIL-2 (328–342s) sai spec. Nguyên nhân: (1) D3 chant phát full volume, không có fade cosine 0.8s như spec §4 → át SIL-2 near-silence; (2) snare build 330–340 trong score bake quá yếu (RMS −30dB) — stem `sfx_snare_build_10s.wav` trong manifest nhưng AudioBed không layer (assume "đã bake"); (3) hit modulation 340 mờ. **Sửa:** D3 `volume` interpolate fade 0.8s + gain 0.5; layer snare build vol 0.4; taiko hit 340 vol 0.65 (sớm 2f, T4).
- **R1#2:** Annotation "ĐỒNG VUA PHÁ LƯỚI" (S24) bị cắt mép dưới — do camera `scale()` với transform-origin y=560 đẩy text y=926 ra khỏi frame. **Sửa:** chuyển annotation lên `top - 140` (trên đỉnh cột).
- **R1#3:** S0 f0–12 có glow nâu (spec: đen tuyệt đối) — do ambient radial + GoldHalo không fade. **Sửa:** `ambientIn` interpolate f12→36.
- **R1-O1:** Bóng S11 dùng plate nguyên (nhìn như bóng bầu dục ở cỡ nhỏ). **Sửa:** crop tròn `p10-hero-ball-crop.png` + `borderRadius: 50%`.

**Vòng 2 (cảm xúc, xem mù) — 7.5/10:** thoát mác slideshow; nhạc "sang", sync chuẩn; arc cảm xúc hoàn chỉnh. 3 điểm yếu: bản đồ S4 52–60s ít chuyển động; footage thật mờ (độ phân giải gốc thấp); hook 1.5s đầu tối. → Ghi nhận, không sửa creative khi chưa có ý kiến anh Dũng.

**Bài học đúc kết:**
1. **Stem nào treatment yêu cầu layer thì phải layer** — đừng assume "score đã bake". Manifest ghi mà code không dùng = lỗi.
2. **Fade là spec, không phải optional** — thiếu fade 0.8s đã phá hỏng hero moment duy nhất của video.
3. **Kiểm tra text mép dưới khi có camera zoom/scale** — transform-origin đẩy text ra khỏi frame.
4. **Đo score.wav trực tiếp** (astats/volumedetect) để phân biệt lỗi do score vs do mix.
