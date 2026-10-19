# VERIFY FOOTAGE — CR7 v6 (19/10/2026)

> Công cụ: `ffprobe` (stream params) + `ffmpeg -v error -f null -` (decode toàn file, 0 error = playable end-to-end).
> Quy tắc logo (DECISIONS §1): footage giữ nguyên bản — logo tự nhiên trên áo/sân KHÔNG che/crop/mờ; CẤM watermark treo góc.

## footage-new/ (chưa xác minh → ĐÃ VERIFY)

| File | Scene | Codec | Resolution | FPS | Duration | Size | Decode | Kết luận |
|---|---|---|---|---|---|---|---|---|
| `cr7-drone-selfie-4k.webm` | S1 | VP9 | 854×450 | 23.976 | 66.34s | 8.9MB | 0 error | **OK, playable.** Lưu ý: tên file "4k" nhưng thực tế chỉ 854×450 (SD) — team build upscale + HUD che vỡ hạt theo treatment S6-style. Đủ dài cho S1 (13s). |
| `cr7-injury-blood-face.webm` | S6 | VP9 | 854×480 | 29.97 | 35.78s | 3.8MB | 0 error | **OK, playable.** Đủ dài cho S6 (12s). |
| `training-session.webm` | S9 | VP9 | 1920×1080 | 25 | 62.30s | 20.8MB | 0 error | **OK, playable.** Full HD — tốt cho montage S9 (15s). |

## public/v3/clip01–16.mp4 (CC BY 3.0 — attribution CHỈ ở end credits)

| File | Scene | Codec | Resolution | FPS | Duration | Decode | Kết luận |
|---|---|---|---|---|---|---|---|
| clip01–04 | S12 | h264 | 1920×1080 | 25 | 4.00s mỗi clip | 0 error (check 01, 02) | **OK.** |
| clip05–08 | S14 | h264 | 1920×1080 | 25 | 4.00s mỗi clip (clip08: 4.004s) | 0 error (check 08) | **OK.** |
| clip09–16 | S18 | h264 | 1920×1080 | 25 | 4.00s mỗi clip | 0 error (check 16) | **OK.** |

Tất cả 16 clip đồng nhất 1080p25, mỗi clip 4s — khớp cut 4 beats (≈64f) ở S12/S14 và cut 2 beats (≈32f) ở S18.

## public/v4 + v5 (SIUUU)

| File | Scene | Codec | Resolution | FPS | Duration | Size | Decode | Kết luận |
|---|---|---|---|---|---|---|---|---|
| `public/v4/siuuu-closeup.mp4` | S19 | h264 | 1920×1080 | 25 | 1.48s | 1.2MB | probe OK | **OK, playable.** Ngắn (1.48s) — treatment chỉ dùng cho pha anticipation/bật (tách nền), phần còn lại là type + vòng tròn giấy. |
| `public/v5/siuuu-alpha.webm` | S19 (dự phòng) | VP9 | 960×540 | 30 | 1.47s | 0.2MB | 0 error | **OK, playable. LƯU Ý:** tên file "alpha" nhưng thực tế là **yuv420p KHÔNG có kênh alpha** — không dùng làm matte alpha trực tiếp được; chỉ là bản dự phòng tách nền nếu closeup tách không sạch. |

## TỔNG KẾT
- **22/22 file OK, playable, không file nào hỏng/corrupt.**
- 2 điểm team build cần biết (không phải lỗi): (1) `cr7-drone-selfie-4k.webm` chỉ 854×450 dù tên có "4k"; (2) `siuuu-alpha.webm` không có kênh alpha thật.
- License: clip01–16 = CC BY 3.0 (Wikimedia Commons "All 48 goals 2014-15") — attribution CHỈ ở end credits S23 theo treatment. Các file footage-new + siuuu-*: provenance **chưa xác minh** (giữ nguyên cảnh báo của treatment §3.1) — verify quyền dùng trước khi public/bật kiếm tiền.
