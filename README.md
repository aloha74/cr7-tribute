# CR7 Tribute — Remotion Video

Video tribute Cristiano Ronaldo dựng **bằng code** với [Remotion](https://remotion.dev) — phong cách motion graphics cinematic như After Effects: chữ kinetic typography, bộ đếm số động, timeline sự nghiệp, hạt ánh sáng, shockwave ăn mừng SIUUU.

- **Độ dài:** 247 giây (4:07) — khớp bài *Something Just Like This*
- **Kích thước:** 1920×1080 · **30fps** · 7410 frames
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

## Thêm nhạc nền

Bài *Something Just Like This* **có bản quyền** — project này không tải, không nhúng nhạc.

1. Tự chuẩn bị file nhạc hợp pháp, đặt tên `something-just-like-this.mp3`
2. Copy vào thư mục `public/` → `public/something-just-like-this.mp3`
3. Mở `src/CR7Video.tsx`, **uncomment** dòng:
   ```tsx
   <Audio src={staticFile("something-just-like-this.mp3")} />
   ```
4. Render lại — nhạc sẽ khớp timeline 247 giây.

## Chỉnh timeline

Mọi mốc thời gian nằm ở **`src/timeline.ts`** — mảng `TIMELINE`:

```ts
{ id: "madrid", name: "Real Madrid 2009–2018 — 450 goals", startSec: 95, endSec: 125 },
```

Sửa `startSec`/`endSec` rồi render lại — các `Sequence` trong `CR7Video.tsx` tự tính frame theo (`giây × 30fps`). Các mốc hiện tại là **ước lượng theo cấu trúc bài hát**, anh cứ chỉnh cho khớp bản nhạc của mình.

| # | Scene | Giây | Nội dung |
|---|-------|------|----------|
| 1 | intro | 0–20 | Hero "CRISTIANO RONALDO" |
| 2 | origins | 20–50 | Madeira 1985 · Sporting CP debut 2002 |
| 3 | united | 50–65 | Manchester United 2003 · áo số 7 |
| 4 | glory1 | 65–95 | 5 Ballon d'Or · 5 Champions League |
| 5 | madrid | 95–125 | Real Madrid · 450 bàn |
| 6 | juve | 125–140 | Juventus 2018–2021 |
| 7 | portugal | 140–170 | Euro 2016 · vua phá lưới ĐTQG |
| 8 | goals | 170–200 | Bộ đếm 900+ bàn sự nghiệp |
| 9 | legacy | 200–230 | SIUUU · di sản |
| 10 | outro | 230–247 | End card "CR7 — SOMETHING JUST LIKE THIS" |

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
    ├── Root.tsx            # Composition CR7Tribute (1920×1080, 30fps, 7410f)
    ├── CR7Video.tsx        # ráp 10 scene bằng Sequence + chỗ gắn Audio
    ├── timeline.ts         # TIMELINE, hằng số, helper fadeInOut/sceneTiming
    ├── components/
    │   ├── KineticText.tsx # chữ bay vào từng từ bằng spring
    │   ├── StatCounter.tsx # bộ đếm số chạy (interpolate + easing)
    │   └── Scene.tsx       # wrapper nền tối gradient + vignette
    └── scenes/             # 10 scene: Intro, Origins, United, Glory1,
                            # Madrid, Juve, Portugal, Goals, Legacy, Outro
```

## Lưu ý bản quyền

- **Nhạc:** không tải/không nhúng *Something Just Like This* hay bất kỳ bản nhạc có bản quyền nào. Dùng bản anh có quyền sử dụng.
- **Lời bài hát:** các scene chỉ dùng tên section (Intro, Origins…), **không trích lời bài hát**.
- **Hình ảnh:** mọi graphic vẽ bằng CSS/SVG thuần — không dùng ảnh/video ngoài.
