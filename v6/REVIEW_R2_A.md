# REVIEW VÒNG 2 — XÁC MINH FIX TREATMENT V6 (REVIEWER ĐỘC LẬP)

> Ngày: 17/10/2026 · Đối tượng: `TREATMENT_V6.md` bản đã fix + CHANGELOG v4 (380s, Act IV S24–S28) · Đã đọc: `TREATMENT_V6.md`, `REVIEW_R1_A.md`, `REVIEW_R1_B.md`, `STATS_VERIFIED.md`, `DECISIONS.md`.
> Phạm vi: chỉ xác minh fix có đúng như CHANGELOG v4 claim + phát hiện lỗi MỚI do fix gây ra. Không chê lại từ đầu.

## VERDICT: **ĐẠT (trình chủ nhân được)** — 1 lưu ý nhỏ ở mục 4 (không phải lỗi chặn).

---

## 1. BẢNG 10 LỖI LẤY MẪU (ngẫu nhiên từ 25 lỗi vòng 1: 5 từ R1A + 5 từ R1B)

| # | Mã lỗi | Fix theo CHANGELOG v4 | Đối chiếu trong treatment | Kết quả |
|---|---|---|---|---|
| 1 | **R1B-1** (nặng) | S25 viết lại thành STORY: 4 beat, mỗi beat 1 narrative, bỏ grid 2×2 | S25 NỘI DUNG (l.240–255): beat 1 "KHÔNG AI CẢN NỔI" (4:30–4:34), beat 2 "SINH RA CHO TRẬN LỚN" (4:34–4:38), beat 3 "DUY NHẤT" (4:38–4:42), beat 4 "NỖI ÁM ẢNH THÀNH TURIN" (4:42–4:46) + silhouette đi xuyên 4 beat + WHY ghi rõ "Dataviz KỂ CHUYỆN thay vì liệt kê" | **PASS** |
| 2 | **R1B-5** (nặng) | Tách S27 (26s) → S27 (5:04–5:17, 13s: M1+M2) + S28 (5:17–5:30, 13s: M3+M4+SIL-2) | S27 header l.261 (5:04–5:17, 13s), S28 header l.271 (5:17–5:30, 13s); M1 có hold 2s (5:08–5:10) + breathing 1s cuối S27 (5:16–5:17); KỸ THUẬT S27=5 mã, S28=7 mã | **PASS** |
| 3 | **R1B-8** (nặng) | M3 đổi sang moment mới: đánh đầu vs Man Utd 2013, grammar ảnh báo chí; gỡ #47–#49 khỏi §2 | S28 M3 (l.273–274): "Đánh đầu vs Man Utd 2013 · grammar ẢNH BÁO CHÍ (moment MỚI, chưa xuất hiện trong video — R1B-8)", caption #65 + narrative #66 + ghi chú verify (Sky Sports / Sports Mole / Ahram); §2 l.415–417: #47–#49 gạch ngang, scene "—"; P13 (l.472): khung ảnh báo chí Man Utd 2013 | **PASS** |
| 4 | **R1B-11** (chặn) | Gate bắt buộc ở §5 (pre-pro) + §6: KHÔNG build S24–S28 trước khi Guide §3 v2 compose xong + pass checklist nhạc | §5 l.528 + §6 l.544: dòng ⛔ GATE BẮT BUỘC nguyên văn, có đầy đủ 3 điều kiện (compose + 13 mục vòng 1 + 10 mục vòng 2) và "cấm build bằng nhạc placeholder" | **PASS** |
| 5 | **R1B-18** | "DUY NHẤT" chỉ dùng 1 lần | S25 beat 3 (l.246) dùng 1 lần; §2 #38 (l.406) ghi "word-focus ×1 — chỉ dùng 1 lần duy nhất cả video"; grep toàn file: không còn on-screen "DUY NHẤT" nào khác (l.21/233/650/676/691 là văn xuôi mô tả, không phải text màn hình) | **PASS** |
| 6 | **R1A-1** | Bổ sung §2: #53 `LỠ HẸN → ĐĂNG QUANG`, #54 `SỐ LẦN VÔ ĐỊCH C1`, #55 `5 LẦN VÔ ĐỊCH UEFA CHAMPIONS LEAGUE`; sửa case S8 | §2 l.421–423: đủ 3 entry; S8 NỘI DUNG (l.149) ghi viết hoa "**5 LẦN VÔ ĐỊCH UEFA CHAMPIONS LEAGUE**" + nhãn trục "**LỠ HẸN → ĐĂNG QUANG**" / "**SỐ LẦN VÔ ĐỊCH C1**" | **PASS** |
| 7 | **R1A-2** | Bổ sung §2: #56 `6/2017 → 4/2018`, #57 `NHIỀU NHẤT LỊCH SỬ`, #58 `2008 · 2014 · 2017`, #59 `VS JUVENTUS · 7 TRẬN` | §2 l.424–427: đủ 4 entry, đúng nguyên văn, gắn S25 (annotation beat 1–4) — khớp từng annotation trong S25 NỘI DUNG | **PASS** |
| 8 | **R1A-3** | Bổ sung §2: #60 `VS`, #61 `5 BÀN TRONG 2 LƯỢT TỨ KẾT 2016/17`; #41 gộp năm → `GHI BÀN 2 TRẬN CHUNG KẾT (2014 · 2016)` | §2 l.428–429 (#60, #61) + l.409 (#41 đã gộp năm); S26 NỘI DUNG (l.258): "VS" slam + annotation "GHI BÀN 2 TRẬN CHUNG KẾT (2014 · 2016)" + "5 BÀN TRONG 2 LƯỢT TỨ KẾT 2016/17" — khớp | **PASS** |
| 9 | **R1A-4** | Bảng motif lần 2: `3:24–3:32` → `3:20–3:23 (morph) · 3:23–3:30 (particle burst)`, ghi rõ morph riêng trước burst | Bảng MOTIF l.45: "**3:20–3:23 (morph) · 3:23–3:30 (particle burst)**", cột Hình thức ghi "morph riêng 3s thành cúp… (khung thoáng, KHÔNG particle: morph là hero duy nhất của beat này)" — khớp S15 (l.202) | **PASS** |
| 10 | **R1A-6** | §4 C9: sửa claim — D1/D2/D4 có breakdown 4s; D3 dẫn bằng SIL-2 | §4 C9 (l.511): "D1/D2/D4 có breakdown 4s trước + fade cosine 0.8s; D3 dẫn bằng SIL-2 (near-silence 2s chồng ducking — có chủ ý, xem bảng ducking)" | **PASS** |

**Spot-check thêm (fix đúng):** R1B-7 — S26 dip 1s (4:56.5–4:57.5) ghi rõ trong NỘI DUNG + NHẠC + WHY (l.256–257, 259) ✓ · R1B-12 — S25 "Counter chạy TUẦN TỰ từng beat" + "hold ≥1s" (l.242) ✓ · R1B-14 — S24 "2 counter so sánh: 140 (gold, lớn) vs 129 (grayscale, nhỏ) + 2 bar tỉ lệ" (l.234), không còn chữ "race counter" ✓ · R1B-3 — header Act IV (l.230/233) và §0 (l.21) đều ghi "đỉnh cao mới về NỘI DUNG (kỷ lục)"; còn 1 câu "đỉnh cao mới" trần trong CHANGELOG v3 (l.644) là ghi chép lịch sử, không phải nội dung spec ✓ · R1B-13/R1B-15 — M4 clock-morph spec cụ thể + P14 "style frame bắt buộc" (l.473); M1 keyframe map 5:04–5:10 (l.263–264) + P11 (l.470) ✓ · R1B-9 — C7 "slow-mo chỉ còn S7/S13/S17" (l.509); M1 "freeze-frame, KHÔNG slow-mo" (l.263), M4 "freeze/strobe, KHÔNG slow-mo" (l.276) ✓.

---

## 2. KIỂM TRA LỖI MỚI DO FIX GÂY RA

- **Timestamp S27/S28 vs transition map:** transition map đủ **28/28 biên** (S0→S1…→S18→S24→S25→S26→**S27→S28**→S19→…→S23), chuỗi liên tục đúng thứ tự. Kiểm tra bằng script: 29 scene nối nhau **không gap/không chồng lấn**.
- **Tổng thời lượng:** cộng script đủ **380s** ✓ (S0–S18 = 250s, S24–S28 = 80s, S19–S23 = 50s). Claim "380s" ở CHANGELOG v4 (l.701) đúng.
- **Text #47–#49 gỡ khỏi §2:** chỉ còn gạch ngang trong §2 (l.415–417, scene "—"); **không scene nào còn tham chiếu**; "XE ĐẠP · TURIN 2018" (#20) giờ chỉ xuất hiện ở S17 (l.216) + §2 (l.388) — M3 mới không dính tàn dư xe đạp.
- **Rule sắt #4 cho Act IV mới:** mọi chuỗi text trong S24–S28 đều có mặt trong §2 (đếm chéo: S24→#27–#33, S25→#34–#38+#56–#59+#62–#64, S26→#39–#43+#60–#61, S27→#44–#46, S28→#50–#52+#65–#67). 0 text lậu.
- **Cap scene §1:** giữ "5–22s" (l.78), mọi scene hiện ≤22s (S13 = 22s lớn nhất) — nhất quán với v4 (S27/S28 = 13s). Claim "5–26s" của CHANGELOG v3 đã bị v4 ghi đè đúng.

---

## 3. KIỂM TRA 3 SỐ LIỆU MỚI (§10 STATS_VERIFIED: 2009/2011/2015)

- **§10 có đầy đủ trạng thái VERIFIED + mô tả + nguồn cho cả 3 năm** (l.150–156): 2009 (chung kết thua Barcelona — 3 nguồn), 2011 (bán kết thua Barcelona 1-3 — sportsmole + skysports), 2015 (bán kết thua Juventus 2-3 — nguồn chính là Quora, có ghi "cross-check với kết quả lượt đi/về trên các nguồn bóng đá phổ thông").
- **Lưu ý (không chặn):** nguồn bán kết 2015 là Quora — yếu nhất trong 3, nhưng có và ghi rõ là cross-check. R1A-5 đã PASS theo đúng phương án (a) mà reviewer A đề xuất.

---

## 4. LỖI MỚI PHÁT HIỆN (1 lỗi, nhỏ)

- **[MỚI — nhỏ] §2 line 696 (v4 sync note):** "§2: #47–#49 gỡ (đánh dấu, giữ số thứ tự); #50–#52 chuyển sang S28; thêm #53–#67" — note này đúng, nhưng **#62–#64 chỉ có 3 narrative mới trong khi CHANGELOG v4 mục 7 claim "Text narrative mới vào §2 (#62–#64)"** — kiểm tra thực tế: 4 narrative = #62 + #63 + #38 (DUY NHẤT, giữ nguyên) + #64. Nội dung ĐÚNG (đủ 4 narrative, #38 được cập nhật note thay vì tạo số mới — đúng quyết định ở v4 mục 22). Lỗi chỉ ở cách diễn đạt của note/changelog, không phải ở spec. Sửa: đổi note thành "thêm #53–#67 (trong đó #62/#63/#64 là narrative mới S25, #38 dùng lại cho beat 3)".

**Không phát hiện lỗi fix sai nào** (10/10 mẫu PASS + 9 spot-check PASS, không có fix "cho có").

---

*Kết luận: CHANGELOG v4 trung thực với treatment thực tế. Tổng 380s cộng đủ, transition 28/28 liền mạch, rule sắt #4 giữ được cho Act IV mới, gate nhạc R1B-11 đã ghi vào §5 + §6, các việc chờ khác không phát sinh. Sửa nhanh 1 lỗi diễn đạt ở mục 4 rồi trình anh Dũng theo quy trình đã chốt (chưa duyệt thì chưa build; sau khi anh duyệt mới push PROCESS.md + GitHub).*
