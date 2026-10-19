# REVIEW VÒNG 1 — REVIEWER A (17/10/2026, bản revise + Act IV "VUA C1")

**Phạm vi:** `TREATMENT_V6.md` (bản vừa revise thêm Act IV) đối chiếu `STATS_VERIFIED.md`, `DECISIONS.md`, checklist Phần D `TECHNIQUE_BIBLE.md`.

## VERDICT: CHƯA ĐẠT (cần sửa 1 vòng, lỗi đều sửa được cơ học)

Nói thẳng: phần xương sống (số học 380s, mapping nhạc +80s, 27/27 biên transition, SIUUU là hero impact duy nhất) làm rất chắc. Nhưng có **3 scene vi phạm quy tắc sắt #4** (text trên màn hình mà không có trong danh sách TEXT DUYỆT §2) — quy tắc sắt thì không có "gần đúng". Sửa xong 6 lỗi dưới đây là ĐẠT.

---

## DANH SÁCH LỖI

### R1A-1 — S8: 3 chuỗi text lậu (vi phạm quy tắc sắt #4)
- **Vị trí:** S8 NỘI DUNG — trục chart có nhãn `"LỠ HẸN → ĐĂNG QUANG"`, nhãn trục `"SỐ LẦN VÔ ĐỊCH C1"`, và chuỗi `"5 lần vô địch UEFA Champions League"`.
- **Vấn đề:** cả 3 chuỗi đều xuất hiện trên màn hình nhưng KHÔNG có trong §2 TEXT DUYỆT (#1–#52).
- **Sửa:** thêm vào §2 (gợi ý #53–#55):
  - #53 `LỠ HẸN → ĐĂNG QUANG` (S8)
  - #54 `SỐ LẦN VÔ ĐỊCH C1` (S8)
  - #55 `5 LẦN VÔ ĐỊCH UEFA CHAMPIONS LEAGUE` (S8 — viết hoa cho nhất quán với danh sách; scene hiện ghi chữ thường "5 lần vô địch UEFA Champions League" là không khớp case)

### R1A-2 — S25: 4 annotation text lậu (vi phạm quy tắc sắt #4)
- **Vị trí:** S25 NỘI DUNG, 4 ô grid:
  - annotation `"6/2017 → 4/2018"` (ô "11 TRẬN LIÊN TIẾP")
  - annotation `"NHIỀU NHẤT LỊCH SỬ"` (ô "67 BÀN KNOCK-OUT") — lưu ý: khác chuỗi #33 `"NHIỀU NHẤT MỌI THỜI ĐẠI"`, không được gộp
  - annotation `"2008 · 2014 · 2017"` (ô "GHI BÀN 3 TRẬN CHUNG KẾT")
  - annotation `"VS JUVENTUS · 7 TRẬN"` (ô "10 BÀN VS 1 CLB")
- **Vấn đề:** không chuỗi nào có trong §2.
- **Sửa:** thêm #56–#59 vào §2 đúng nguyên văn.

### R1A-3 — S26: 3 text lậu (vi phạm quy tắc sắt #4)
- **Vị trí:** S26 NỘI DUNG:
  - chữ `"VS"` slam giữa màn hình
  - annotation `"5 BÀN TRONG 2 LƯỢT TỨ KẾT 2016/17"` (nửa BAYERN)
  - năm `"(2014 · 2016)"` gắn sau #41 `"GHI BÀN 2 TRẬN CHUNG KẾT"` (nửa ATLETICO)
- **Vấn đề:** không có trong §2. Đặc biệt `"(2014 · 2016)"` là năm gắn liền với #41 — nếu build theo §2 hiện tại sẽ mất thông tin.
- **Sửa:** thêm #60 `VS`, #61 `5 BÀN TRONG 2 LƯỢT TỨ KẾT 2016/17`, và sửa #41 thành `GHI BÀN 2 TRẬN CHUNG KẾT (2014 · 2016)` (gộp năm vào chuỗi duyệt).

### R1A-4 — Bảng MOTIF (T15): timestamp lần 2 đã cũ
- **Vị trí:** bảng "Bản đồ MOTIF quả bóng", hàng lần 2 ghi `3:24–3:32`.
- **Vấn đề:** từ CHANGELOG v2 (sửa B-E14), beat morph bóng→cúp đã tách thành **3:20–3:23** (khung thoáng, không particle), particle burst dời sang **3:23–3:30**. Bảng motif chưa cập nhật theo → team build đọc bảng sẽ đặt morph sai ~4 giây, đúng vào chỗ vừa được tách ra để "morph được đọc".
- **Sửa:** hàng lần 2 → `3:20–3:23 (morph) · 3:23–3:30 (particle burst)`; cột "Hình thức" ghi rõ "morph 3s riêng trước burst" cho khớp S15.

### R1A-5 — S8: 3 năm cột đỏ chưa có trong STATS_VERIFIED.md
- **Vị trí:** S8 NỘI DUNG — 3 cột đỏ `"2009 · 2011 · 2015"` với chú thích "(những năm lỡ hẹn cúp C1 cấp CLB — thua chung kết/bán kết)".
- **Vấn đề:** 3 năm này KHÔNG xuất hiện trong `STATS_VERIFIED.md`. Lịch sử bóng đá thì đúng (chung kết 2009 thua Barcelona; bán kết 2011 thua Barcelona; bán kết 2015 thua Juventus) nhưng treatment đang dùng số liệu ngoài phạm vi verify — đúng kiểu lỗi mà quy trình verify được lập ra để chặn.
- **Sửa (chọn 1):** (a) bổ sung 3 năm + nguồn vào `STATS_VERIFIED.md` trước build; hoặc (b) đổi annotation thành framing không cần năm cụ thể (nhãn trục "LỠ HẸN → ĐĂNG QUANG" đã đủ kể chuyện).

### R1A-6 — §4 hàng C9: claim "đều có breakdown 4s trước" sai với D3
- **Vị trí:** §4 C9: "4 ducking (D1…D4) đều có breakdown 4s trước + fade cosine 0.8s".
- **Vấn đề:** D1 (breakdown 2:28–2:32), D2 (breakdown 3:30–3:34), D4 (breakdown 6:00–6:04) đúng có breakdown 4s. Nhưng D3 (5:28–5:32) được dẫn bằng **SIL-2 (5:28–5:30, near-silence 2s)**, không phải breakdown 4s.
- **Sửa:** "D1/D2/D4 có breakdown 4s trước; D3 dẫn bằng SIL-2 (near-silence chồng ducking — có chủ ý, xem bảng ducking)".

---

## KIỂM TRA ĐẠT (ghi nhận để reviewer B khỏi làm lại)

1. **Số liệu Act IV khớp 100% STATS_VERIFIED.md:** 12/17/10/16/12/15 (mùa 12/13→17/18) ✅; annotation "ĐỒNG VUA PHÁ LƯỚI · MESSI & NEYMAR" ghi đúng đính chính ✅; 140 vs 129 + "NHIỀU NHẤT MỌI THỜI ĐẠI" ✅; 11 trận (6/2017→4/2018), 67 knock-out, 3 chung kết (2008·2014·2017), 10 bàn vs Juventus/7 trận ✅; Atletico 25 bàn/35 trận/4 hat-trick/chung kết 2014+2016 ✅; Bayern 9 bàn/8 trận/5 bàn tứ kết 2016/17 ✅; Sampdoria viết ĐÚNG "ĐẦU CHẠM BÓNG · 2.56M / CHÂN RỜI ĐẤT · 71CM" (không ghi "nhảy cao 2.56m") ✅; xe đạp: tứ kết lượt đi, phút 64, Allianz Stadium, standing ovation, Goal of the Season 2017/18 ✅; penalty phút 120 (2014) + penalty quyết định (2016) ✅; 5 C1 KHÔNG dùng như kỷ lục tuyệt đối ✅.
2. **Tổng thời lượng:** 60+70+120+80+10+12+8+10+10 = **380s đúng**, 11400 frames ✅; không gap/không chồng timestamp giữa các scene ✅.
3. **Transition 27/27 biên** đủ và liền mạch (đếm thủ công đủ 27 hàng; 3 hard cut có chủ ý đều ghi lý do) ✅.
4. **SIUUU là one hero impact duy nhất:** §0 + S18 + S27 đều ghi rõ; taiko 4:10 được định nghĩa là "cánh cửa" không phải hero impact ✅.
5. **Mỗi scene ≥3 mã T:** đếm thủ công 28/28 scene (thấp nhất S21/S22/S23 = 4 mã) ✅.
6. **Nhạc +80s:** modulation 5:40, snare build 5:30–5:40, unison 6:00–6:15, D3 5:28–5:32, D4 6:04–6:08, SIL-2 5:28–5:30, Picardy 6:15–6:20, breakdown D4 6:00–6:04 — tất cả đúng +80s so với Guide §3 ✅. S24–S27 chỉ ghi định hướng, không bịa timestamp nhạc mới ✅.
7. **J/L-cut số học:** J1 0:59.7 = 60−8/30 ✅; J3 4:09.6 = 250−12/30 ✅; J2 5:29.6 = 330−12/30 ✅; L1 5:40.0 (+18f), L2 2:10.0 (+12f) ✅. Ducking/silence nằm đúng trong scene chứa nó (D1∈S12, D2∈S16, D3 chồng SIL-2∈S27/S19, D4∈S22) ✅. S9: 21.5 beats @86BPM = 15.0s ✅; S10: 1.5s ≈ 2.1 beats, micro-silence 0.5s ≈ 0.7 beat ✅.
8. **S15:** note "CHỜ CHỦ NHÂN CHỐT" đã xóa, có dòng "ĐÃ CHỐT 17/10/2026 (DECISIONS §2): GIỮ LẠI" ✅. Chuỗi "chờ chốt" còn lại chỉ nằm trong CHANGELOG v1/v2 (ghi chép lịch sử, không phải việc đang treo) — chấp nhận được.
9. **Logo:** quy tắc sắt #3, §3.1, §5 đều theo DECISIONS §1 (cấm watermark góc; logo tự nhiên giữ nguyên) ✅; không còn sót plan che logo nào (2 chỗ nhắc "che logo" đều là "hủy plan") ✅.
10. **Attribution:** chỉ ở S23 credits ✅; không watermark nguồn trong nội dung ✅. HUD viewfinder là element kỹ thuật theo danh sách scene cố định S6/S12/S14/S18 + quy tắc safe-area ✅.
11. **Arc BĐN:** S15 là ăn mừng Euro (không tranh cãi), S8 đã đổi 3 cột đỏ sang năm cấp CLB ✅ — đúng DECISIONS §2.
12. **Text #27–#52:** đầy đủ trong §2 ✅; #20 dùng lại ở S27 có ghi chú ✅.
13. **Checklist Phần D (vòng 1):** beat-grid/T20/easing/dial act/transitions motivate đều được spec ở treatment ✅ (phần implement thuộc team build + QA).

## GHI CHÚ NHỎ (không tính lỗi)
- S5: dãy số học "0.5+1.43+0.7+1.43+0.7+1.43+1.9" cộng ra 8.09s trong khi scene đúng 8.0s — lệch 2–3 frame do làm tròn, có chữ "≈" nên bỏ qua được.
- "KNOCK-OUT" (#35) là từ tiếng Anh nhưng là thuật ngữ bóng đá phổ thông trong tiếng Việt — giữ nguyên, không sửa.
- S27 pacing arc Brisk→Locked đã có trong ngoại lệ dial (tiền lệ S13) ✅.

## ĐỀ XUẤT TRÌNH TỰ SỬA
1. Bổ sung #53–#62 vào §2 TEXT DUYỆT (R1A-1, R1A-2, R1A-3) — 10 phút.
2. Sửa timestamp motif lần 2 (R1A-4) + wording C9 (R1A-6) — 5 phút.
3. Xử lý 3 năm S8: bổ sung vào STATS_VERIFIED.md hoặc gỡ chú thích năm (R1A-5).
4. Sau đó coi như ĐẠT vòng 1, chuyển reviewer B (vòng 2 cảm xúc).
