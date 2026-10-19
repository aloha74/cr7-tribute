# REVIEW VÒNG 2C — VERIFY 4 FIX CUỐI TREATMENT V6 (REVIEWER ĐỘC LẬP MỚI)

> Ngày: 17/10/2026 · Đối tượng: `TREATMENT_V6.md` bản + CHANGELOG v5 · Đã đọc: `TREATMENT_V6.md` toàn văn, `REVIEW_R2_B.md` (3 điểm yêu cầu sửa), `REVIEW_R2_A.md` (note nhỏ mục 4) · Chưa từng review bản này.
> Phương pháp: đối chiếu từng claim của CHANGELOG v5 với text spec thực tế + kiểm tra hồi quy bằng script (timestamp, tổng thời lượng, text §2).

## VERDICT: **ĐẠT — đủ điều kiện trình chủ nhân duyệt**

4/4 điểm FIX đúng như CHANGELOG v5 claim, 0 lỗi hồi quy, tổng thời lượng 380s còn nguyên, chuỗi timestamp không gap/không chồng lấn.

---

## 1. S24 — RÚT PARADE BAR + MỞ BẰNG GRAMMAR KHÁC (R2B-câu 3): **PASS**

| Yêu cầu | Đối chiếu trong treatment | Kết quả |
|---|---|---|
| 3s đầu (4:10–4:13) mở bằng grammar KHÁC bar chart: số "6" slam + "6 MÙA LIÊN TIẾP" | S24 NỘI DUNG (l.234): "4:10–4:13: ... **grammar MỚI mở S24 (R2B-câu 3 — KHÔNG phải bar chart):** số **'6'** khổng lồ **counter-slam từ trên xuống** (scale 8×, Snappy, §2 #68) + stamp **'6 MÙA LIÊN TIẾP'** (#28) — khán giả đọc số TRƯỚC, chart sau; **3s đầu không có một cột bar nào** = không cảm giác 'xem rồi' sau S8" | PASS |
| 6 cột bar mọc dồn ~8s (không còn parade 13s) | "4:13–4:21: **Dataviz nhanh dồn (T14):** 6 cột bar **mọc dồn ~8s** (mỗi cột ~1.3s, stagger 12f — **KHÔNG còn parade 13s**, R2B-câu 3)" | PASS |
| Beat "140 vs 129" kéo dài 3s → 6s | "4:21–4:27: **hero beat kéo dài (6s — thời gian tiết kiệm từ parade đổ vào đây):** ... 2 counter so sánh: **'140'** (gold, lớn) vs **'129'** (grayscale, nhỏ) ... counter '140' chạy chậm, hold ≥2s để đọc" | PASS |
| S24 vẫn 20s, tổng video vẫn 380s | S24 header 4:10–4:30 = 20s ✓; script cộng đủ 380s (xem mục 5) | PASS |
| #68 `6` có trong §2 | Row 68: `6` — S24 (counter số mùa slam mở chương — cùng số liệu với #28) ✓ | PASS |

---

## 2. S28 — EXIT BEAT CHO SILHOUETTE (R2B-câu 5): **PASS**

| Yêu cầu | Đối chiếu trong treatment | Kết quả |
|---|---|---|
| Silhouette exit beat: tan thành hạt giấy trong SIL-2 (5:28–5:30), tụ thành vòng tròn SIUUU | S28 NỘI DUNG (l.279): "**5:28–5:30 — SIL-2 + EXIT BEAT (R2B-câu 5):** ... Silhouette **tan thành hạt giấy** (particle dissolve, ~120 hạt, T5 — theo tiền lệ S5→S6): hạt giấy bay lên, **tụ thành vòng tròn giấy SIUUU** → 5:30 vòng tròn **xé mở** sang S19 — 'người kể chuyện hóa thân thành khoảnh khắc đỉnh', khép arc nhân vật" | PASS |
| Spec rõ "không cạnh tranh SIUUU" | Cùng đoạn: "**Không cạnh tranh SIUUU:** diễn ra trong near-silence, không SFX lớn, không text mới — chỉ hạt giấy + halo gold nhẹ." KỸ THUẬT thêm T5 (particle dissolve) + T16 (SIL-2) + T19 (build vào one hero impact); WHY ghi "kết bằng SIL-2 để SIUUU giữ nguyên là one hero impact duy nhất" | PASS |
| Silhouette quay lại ở cuối M4 trước khi exit | M4 (l.277): "silhouette 'người dẫn chuyện' quay lại — bước vào đứng cạnh khung nhìn về 2 khoảnh khắc quyết định, rồi bước về phía camera (push-in nhẹ, stop-motion)" — khớp CHANGELOG v5 mục 2 | PASS |
| Transition S28→S19 cập nhật theo | Bản đồ transition (l.348): "S28→S19 — **Tan hạt→xé (T5→T21):** silhouette tan thành hạt giấy trong SIL-2 (5:28–5:30) — hạt tụ thành vòng tròn giấy → vòng tròn **xé mở** sang SIUUU (J2 audio 5:29.6 vào trước)" | PASS |

---

## 3. S25/S26 — PHÂN TẦNG ĐỌC (R2B-câu 6): **PASS**

| Yêu cầu | Đối chiếu trong treatment | Kết quả |
|---|---|---|
| Luật phân tầng đọc spec cụ thể (1 hero 100%, annotation fade 40% sau 1.5s) | S25 (l.241): "**LUẬT PHÂN TẦNG ĐỌC (R2B-câu 6) — áp cứng cho cả 4 beat:** một thời điểm chỉ **1 text layer làm hero (scale/opacity 100%)**... **0.0–1.5s** (đầu beat) — counter số = hero (100%, slam vào), annotation chi tiết hiện 100% dưới/phải số; **1.5s** — annotation **fade về 40%**, counter số thu về 40% (scale 70%), **narrative word-focus slam vào làm hero mới (100%)**... Không bao giờ có 2 layer cùng 100% trong một frame". S26 (l.256): cùng luật, phiên bản split-screen — "mỗi cái hiện 100% trong 1.5s rồi fade về 40%" | PASS |
| #39 gộp 1 dòng | §2 row 39: `ATLETICO` · `25 BÀN / 35 TRẬN` — "(gộp một dòng duy nhất — R2B-câu 6)" ✓; S26 NỘI DUNG: "hero = **'ATLETICO'** + **'25 BÀN / 35 TRẬN'** (**gộp một dòng duy nhất**, §2 #39)" ✓ | PASS |
| #42 gộp 1 dòng (nhất quán) | §2 row 42: `BAYERN` · `9 BÀN / 8 TRẬN` — "(gộp một dòng duy nhất, nhất quán — R2B-câu 6)" ✓; S26 NỘI DUNG: "hero = **'BAYERN'** + **'9 BÀN / 8 TRẬN'** (**gộp một dòng duy nhất**, §2 #42 — nhất quán)" ✓ | PASS |

---

## 4. NOTE CHANGELOG V4 VỀ #62–#64/#38 (R2A-mục 4): **PASS**

| Yêu cầu | Đối chiếu trong treatment | Kết quả |
|---|---|---|
| Sửa câu chữ note v4 thành rõ ràng: #62/#63/#64 là narrative mới S25, #38 `DUY NHẤT` dùng lại cho beat 3 | Note đồng bộ v4 (l.694) hiện đọc: "§2: #47–#49 gỡ (đánh dấu, giữ số thứ tự); #50–#52 chuyển sang S28; thêm #53–#67 (trong đó **#62/#63/#64 là narrative mới S25 — #38 `DUY NHẤT` dùng lại cho beat 3, không tạo số mới**; có #67 `120:00` ...)" — **đã sửa trực tiếp trong note v4**, đúng wording R2A đề xuất | PASS |

---

## 5. KIỂM TRA HỒI QUY (script): **PASS**

- **Tổng thời lượng:** 29 scene (S0–S23) cộng đủ **380s** (script: S0 0–5 = 5s, còn lại 375s; không gap/không chồng lấn giữa các scene liên tiếp).
- **S24 nội bộ:** 4:10–4:13 (3s slam mở chương) / 4:13–4:21 (8s bars dồn) / 4:21–4:27 (6s hero beat) / 4:27–4:30 (3s silhouette) = 20s ✓; biên S24 4:30 = S25 bắt đầu 4:30, không chồng lấn do rút parade.
- **Text #68:** có trong §2 (row 68), được S24 tham chiếu (§2 #68); "0 text lậu" — thêm duy nhất #68, là số đã có trong #28.
- **`DUY NHẤT`:** on-screen chỉ 1 lần duy nhất (beat 3 S25, #38); chữ "duy nhất" ở header beat 3 (l.246) là văn xuôi mô tả, không phải text màn hình.
- **"VUA CHAMPIONS LEAGUE" slam + taiko downbeat 4:10 (cú reframe R2B-câu 7):** vẫn còn nguyên ở đầu S24.

---

## KẾT LUẬN

CHANGELOG v5 trung thực với treatment thực tế: 4/4 điểm sửa đúng spec, không gây ra gap/chồng lấn timestamp, không thêm số liệu mới, SIUUU giữ nguyên là one hero impact duy nhất, rule "only-the-user's-words" (§2) được giữ. **ĐẠT — đủ điều kiện trình chủ nhân duyệt** (theo quy trình đã chốt: chưa duyệt thì chưa build).

*Reviewer vòng 2C — 17/10/2026. Xác minh độc lập, không chê lại từ đầu.*
