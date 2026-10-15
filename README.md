# CR7 Tribute — Remotion Video

Video tribute Cristiano Ronaldo dựng **bằng code** với [Remotion](https://remotion.dev) — phong cách motion graphics cinematic như After Effects: chữ kinetic typography, bộ đếm số động, timeline sự nghiệp, hạt ánh sáng, shockwave ăn mừng SIUUU.

- **Độ dài:** 216 giây (3:36) — khớp nhạc nền *Anthem of Victory*
- **Kích thước:** 1920×1080 · **30fps** · 6480 frames
- **Phong cách:** nền tối cinematic + chữ vàng/trắng

## Cài đặt

```bash
cd cr7-tribute
npm install
```

## Chạy Studio (xem trước từng frame)

```bash
npm run dev
# hoặc: npx remotion studio
```

Mở Composition **CR7Tribute** trong Studio để xem và chỉnh từng scene.

## Render video

```bash
npm run render
# hoặc: npx remotion render CR7Tribute out/cr7.mp4
```

Render thử 1 scene (ví dụ test nhanh):

```bash
npx remotion render CR7Tribute out/test.mp4 --frames=0-600
```

## Nhạc nền

Nhạc nền hiện tại: **"Anthem of Victory"** của Good_B_Music — giấy phép **Pixabay Content License** (dùng miễn phí cho mục đích thương mại, **cho phép kiếm tiền** từ nội dung, kể cả trên Facebook).
File nhạc: `public/anthem-of-victory.mp3` (216 giây), đã gắn sẵn trong `src/CR7Video.tsx`:

```tsx
<Audio src={staticFile("anthem-of-victory.mp3")} />
```

### Thay nhạc khác

1. Chuẩn bị file mp3 mới (đảm bảo anh có quyền sử dụng — ví dụ nhạc Pixabay, Uppbeat, hoặc nhạc tự sáng tác)
2. Copy vào `public/` (ví dụ `public/nhac-moi.mp3`)
3. Sửa tên file trong `src/CR7Video.tsx`:
   ```tsx
   <Audio src={staticFile("nhac-moi.mp3")} />
   ```
4. Nếu nhạc mới dài khác 216 giây: cập nhật `DURATION_SEC` trong `src/timeline.ts` và co giãn lại các mốc `startSec`/`endSec` của `TIMELINE` cho khớp, rồi render lại.

## Chỉnh timeline

Mọi mốc thời gian nằm ở **`src/timeline.ts`** — mảng `TIMELINE`:

```ts
{ id: "madrid", name: "Real Madrid 2009–2018 — 450 goals", startSec: 95, endSec: 125 },
```

Sửa `startSec`/`endSec` rồi render lại — các `Sequence` trong `CR7Video.tsx` tự tính frame theo (`giây × 30fps`). Các mốc hiện tại đã được co theo tỉ lệ 216/247 để khớp nhạc nền 216 giây; anh cứ chỉnh cho khớp bản nhạc của mình.

| # | Scene | Giây | Nội dung |
|---|-------|------|----------|
| 1 | intro | 0–17 | Hero "CRISTIANO RONALDO" |
| 2 | origins | 17–44 | Madeira 1985 · Sporting CP debut 2002 |
| 3 | united | 44–57 | Manchester United 2003 · áo số 7 |
| 4 | glory1 | 57–83 | 5 Ballon d'Or · 5 Champions League · hook "GREATNESS IS EARNED" |
| 5 | madrid | 83–109 | Real Madrid · 450 bàn · ảnh đá phạt |
| 6 | juve | 109–122 | Juventus 2018–2021 · ảnh Juve 2019 |
| 7 | portugal | 122–149 | Euro 2016 · vua phá lưới ĐTQG |
| 8 | goals | 149–175 | Bộ đếm 900+ bàn · ảnh nền mờ · hook "RELENTLESS" |
| 9 | legacy | 175–201 | SIUUU · ảnh ăn mừng · hook "BUILT BY SACRIFICE" |
| 10 | outro | 201–216 | End card "A LEGEND IN MOTION" |

## Cấu trúc thư mục

```
cr7-tribute/
├── package.json            # remotion ^4.0.535, scripts dev/build/render
├── remotion.config.ts
├── tsconfig.json
├── public/                 # để file mp3 nhạc nền ở đây (tự chuẩn bị)
├── out/                    # file mp4 sau khi render
└── src/
    ├── index.ts            # registerRoot
    ├── Root.tsx            # Composition CR7Tribute (1920×1080, 30fps, 6480f)
    ├── CR7Video.tsx        # ráp 10 scene bằng Sequence + chỗ gắn Audio
    ├── timeline.ts         # TIMELINE, hằng số, helper fadeInOut/sceneTiming
    ├── components/
    │   ├── KineticText.tsx # chữ bay vào từng từ bằng spring
    │   ├── StatCounter.tsx # bộ đếm số chạy (interpolate + easing)
    │   ├── Scene.tsx       # wrapper nền tối gradient + vignette
    │   ├── PhotoLayer.tsx  # ảnh Ken Burns + duotone vàng (CC BY-SA)
    │   ├── SceneTransition.tsx # chuyển cảnh viral: whip/zoom/flash/glitch
    │   ├── FilmGrain.tsx   # hạt phim SVG feTurbulence
    │   └── LyricHook.tsx   # chữ hook spring + glow vàng
    └── scenes/             # 10 scene: Intro, Origins, United, Glory1,
                            # Madrid, Juve, Portugal, Goals, Legacy, Outro
```

## Phiên bản viral (nâng cấp)

- **Ảnh thật của CR7** (Wikimedia Commons, CC BY-SA / CC BY — xem `ATTRIBUTION.md`):
  - `public/images/cr7-portugal-2018.jpg` — chân dung áo Bồ Đào Nha 2018
  - `public/images/cr7-ucl-final-2018.jpg` — vest sau chung kết Champions League 2018
  - `public/images/cr7-2013.jpg` — CR7 năm 2013
  - `public/images/cr7-freekick.jpg` — CR7 đá phạt áo Real Madrid (CC BY-SA 2.0)
  - `public/images/cr7-celebration.jpg` — CR7 ăn mừng, số 7 (CC BY-SA 2.0)
  - `public/images/cr7-juve-2019.jpg` — thời Juventus (CC BY 4.0)
  - `public/images/cr7-scores.jpg` — CR7 ghi bàn (CC BY 2.0)
- **Components mới** (`src/components/`):
  - `PhotoLayer.tsx` — ảnh nhiều lớp với hiệu ứng Ken Burns (zoom + pan), phủ duotone vàng (overlay), viền glow; chế độ `full` làm nền mờ
  - `SceneTransition.tsx` — chuyển cảnh kiểu viral: `whip` (quét ngang), `zoom`, `flash` (8 frames), `glitch` (5 lát cắt ngẫu nhiên theo frame)
  - `FilmGrain.tsx` — hạt phim bằng SVG feTurbulence, opacity 0.07
  - `LyricHook.tsx` — chữ hook hiện từng từ bằng spring + glow vàng
- **Lyric hooks** (cụm tự sáng tác, **không trích lời bất kỳ bài hát nào**):
  - `GREATNESS IS EARNED` — scene glory1
  - `RELENTLESS` — scene goals
  - `BUILT BY SACRIFICE` — scene legacy (dòng nhỏ dưới SIUUU)
  - `A LEGEND IN MOTION` — outro end card
- **Transitions theo scene:** intro (không), origins flash, united zoom, glory1 glitch, madrid whip, juve flash, portugal zoom, goals whip, legacy flash, outro zoom
- **Ghi nhận ảnh:** scene outro có dòng credit "Photos: Wikimedia Commons (CC BY-SA)"

## Lưu ý bản quyền

- **Nhạc:** nhạc nền *"Anthem of Victory"* (Good_B_Music) theo Pixabay Content License — miễn phí thương mại, cho phép kiếm tiền nội dung. Chi tiết trong `ATTRIBUTION.md`.
- **Lời bài hát:** chỉ dùng các cụm hook tự sáng tác được liệt kê ở trên, **không trích lời bất kỳ bài hát nào**.
- **Hình ảnh:** 7 ảnh CR7 dùng theo giấy phép CC BY-SA / CC BY (chi tiết trong `ATTRIBUTION.md`); mọi graphic còn lại vẽ bằng CSS/SVG thuần.
