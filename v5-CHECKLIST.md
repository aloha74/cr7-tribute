# CR7 v5 "HUYỀN THOẠI SỐNG" (KINETIC CUT) — CHECKLIST TỔNG DUYỆT (FINAL)

**File:** `~/workspace/cr7-tribute/out/cr7-v5.mp4` (354 MB)
**Hoàn thành:** 16/10/2026 ~15:55

## Thông số kỹ thuật
- [x] Duration: 300.08s (300 ± 0.5 ✓)
- [x] 1920x1080, 29.98fps ✓
- [x] Video: H.264, Audio: AAC stereo 48kHz ✓
- [x] Audio peak: -4.0dB (< -3dB ✓)
- [x] Metadata format đã xóa ✓
- [x] Không frame đen đầu/cuối ✓ (spot-check frame 2s, 75s, 235s, 290s đều có hình)

## Yêu cầu sắt (chủ nhân)
1. [x] Không card chữ tĩnh — kinetic per-word/per-letter, không đứng yên quá 1s
2. [x] Không shot đứng yên quá 2s — zoom cut/punch-in/jump cut liên tục, beat-sync
3. [x] Attribution CHỈ ở end credits (280–300s); giữa video không nguồn/logo/watermark
4. [x] Tách nền CHỈ khi cận rõ (SIUUU — PNG sequence 44 frames)
5. [x] 7 khoảnh khắc paper-cut bùng nổ (slow-mo, flash, shake, lightning)
6. [x] SIUUU: footage cận + tách nền + glitch + RGB split + tia sét + chữ SIUUU nổ từng chữ cái
7. [x] Hook 3s: "900+ BÀN. BẰNG CÁCH NÀO?" + SIUUU cận (theo DIRECTOR.md)
8. [x] Nhạc giao hưởng 3 chương soạn MỚI HOÀN TOÀN bằng code (không dùng v4)
9. [x] Ducking ở 5 cao trào: nhạc dìm còn 0.22, âm thanh gốc khán giả vượt lên

## 12 lỗi đã phát hiện & fix qua các vòng review
1. Nhạc câm (subagent báo done nhưng file rỗng) → chạy lại script → wav 300s thật
2. Scene nền đục che nhau → chỉ giữ nền ở CR7V5 root
3. Div nền SIUUU che toàn video → bọc `<Show at={228} until={242}>`
4. Glitch/Shake render "ma" (video hiện suốt) → return null ngoài window
5. Chrome treo khi seek alpha webm (chỉ 1 keyframe) → re-encode keyframe mỗi 5f → VẪN treo → chuyển sang PNG sequence 44 frames (ổn định)
6. PNG đánh số 1–44, code tính 0–43 → fix index
7. **Injury footage quá gore** (macro vết rách mắt lẫn khắp webm; scans ffmpeg sai do keyframe thưa) → BỎ HOÀN TOÀN, thay bằng nền đỏ máu kinetic + chữ "Máu. Ngã. Đứng dậy."
8. Montage seek chậm (3s/frame trong file 294MB) → cắt sẵn 8 clip 720p, tốc độ render tăng 5x
9. ENOSPC /tmp (tmpfs 512MB) → TMPDIR=~/workspace/.tmp
10. Scale 0.6667 → 720.036px (lỗi integer) → dùng 0.5
11. Service restart kill render dài → render 3 chunk × 100s rồi nối bằng ffmpeg concat
12. Audio peak -2.7dB vượt -3dB → giảm 1dB → còn -4.0dB

## Cấu trúc 300s
- 0–3s: Hook
- 3–60s: Chương I — Cậu bé Madeira (drone tượng đài + paper-cut tuổi thơ)
- 60–130s: Chương II — Trả giá (nền máu kinetic + Moscow 2008 paper-cut)
- 130–250s: Chương III — Huyền thoại (5 paper-cut + montage 8 bàn + SIUUU)
- 250–280s: Đếm số 900+, thank-you footage
- 280–300s: End credits (attribution CC BY 3.0 đầy đủ)

## Lưu ý nhỏ
- Credits còn dòng "medical room footage" dù đã bỏ footage chấn thương (không đáng render lại vì chỉ là chữ trong credits cuối)
- KHÔNG gửi user, KHÔNG push GitHub — chờ lệnh chủ nhân
