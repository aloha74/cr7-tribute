# BIÊN BẢN REVIEW 2 VÒNG — Paper-cut assets CR7 v6 (19/10/2026)

> Quy tắc: 2 vòng review ĐỘC LẬP, ĐỐI KHÁNG. Mỗi figure: đếm **tay / chân / bàn tay / bàn chân** bằng mắt và ghi số lượng. Đối chiếu spec treatment §3.2 từng dòng. Reviewer vòng 2 không xem kết quả vòng 1 trước (vòng 2 dùng phương pháp đếm độc lập: visual-grounding count trên các ảnh nhiều figure + đọc lại ảnh fresh). FAIL = vẽ lại.

## VÒNG 1 (ngay sau generate, đọc ảnh + đếm bằng mắt)

| Mã | Đếm chi (tay/chân/bàn tay/bàn chân) | Đối chiếu spec | Kết quả |
|---|---|---|---|
| P1 | Pose1: 2/2/2/2 · Pose2: 2/2/2/2 · Pose3: 2/2/2/2 | 3 pose: quét đường (có chổi) / đá bóng / chạy dốc; không chữ; paper-cut đỏ-đen-gold | PASS |
| P2 (v1) | n/a (không figure) | **7 markers đỏ** ≠ spec 5 thành phố | **FAIL → vẽ lại** |
| P3 | 2/2/2/2 (tay phải giơ, tay trái sau; chân phải đá, chân trái trụ) | sân mưa + khung thành + penalty pose; không logo/chữ | PASS |
| P4 | n/a | 3 vụ nổ tăng dần trái→phải + 3 khung thành; không chữ/số | PASS (note: bóng hơi bầu dục — dùng P10 cho shot bóng chuẩn) |
| P5 | chính: 2/2/2/2 · tường rào 3 người: mỗi người 2 tay giơ | đá phạt + hàng rào + lưới; không logo/chữ | PASS |
| P6 | 2/2/2/2 (2 tay giơ nâng cúp) | nâng cúp gold + halo; nhìn từ sau; không chữ/logo | PASS |
| P7 | n/a | 3 cúp gold + halo + đế; không chữ (năm gắn ở build) | PASS |
| P8 | 2/2/2/2 (2 bàn tay mở; 2 giày) | xe đạp + bóng ngũ giác + đường cong gold; không chữ/logo | PASS |
| P9 | n/a | vòng tròn giấy xé lộ đỏ + mảnh gold; không chữ | PASS |
| P10 | n/a | bóng cổ điển ngũ giác/lục giác + gold crescent | PASS |
| P11 | 2/2/2/2 | header đỉnh bật + thước đứng không số + line đỏ (đầu) + line vàng (chân); không chữ | PASS |
| P12 | 6 figure × (2/2/2/2) | 6 pose đảo chân thành hàng; bóng gold giữa; không chữ | PASS (note: viền đỏ nhẹ trên kit) |
| P13 | 2/2/2/2 | viền trắng báo chí + freeze đánh đầu; không caption (gắn ở build) | PASS |
| P14 | 2/2/2/2 | đồng hồ không số + kim đỏ + CR7 penalty + vòng cấm; không chữ | PASS |
| SIL-CR7-ENTRY | 2/2/2/2 | silhouette đứng, đầu ngước, viền gold; không chữ | PASS |
| SIL-CR7-WALK | 3 pose × (2/2/2/2) | 3 pose đi, profile phải, viền gold | PASS |
| SIL-CR7-STAND | 2/2/2/2 | đứng thẳng facing viewer, tay buông; không chữ | PASS |
| SIL-CR7-RETURN | 2/2/2/2 (2 nắm đấm; 2 giày) | bước về phía viewer 3/4; viền gold | PASS |
| SF-S27-M1 | 2/2/2/2 | freeze đỉnh bật + thước + 2 line (đỏ đầu / vàng chân); không số | PASS |
| SF-S28-M4 | figure nhỏ: 2/2/2/2 | đồng hồ → kim dài vẽ vòng cấm → sơ đồ sân mini + chấm 11m gold; không chữ/số | PASS |

**P2 v2 (vẽ lại):** 5 markers đỏ, đường thứ 5 vẽ dở tuột khỏi mép bản đồ, bóng + vệt gold → **PASS vòng 1 (bản v2).**

## VÒNG 2 (độc lập — đếm bằng visual-grounding trên ảnh nhiều figure + đọc lại fresh từng ảnh)

| Mã | Phương pháp vòng 2 | Đếm vòng 2 | Kết quả |
|---|---|---|---|
| P1 | visual-grounding count | 6 tay + 6 chân / 3 pose = 2+2 mỗi pose | PASS |
| P2 (v2) | đọc fresh, đếm markers | 5 markers đỏ; đường thứ 5 dở | PASS |
| P3 | đọc fresh | 2 tay (2 bàn tay mở), 2 chân (2 giày) | PASS |
| P4 | đọc fresh | 3 vụ nổ + 3 khung thành, không chữ | PASS (giữ note bóng bầu dục) |
| P5 | visual-grounding count | 8 tay + 8 chân / 4 người = 2+2 mỗi người | PASS |
| P6 | đọc fresh | 2 tay giơ nâng cúp, 2 chân, 2 bàn chân | PASS |
| P7 | đọc fresh | 3 cúp, không chữ/logo | PASS |
| P8 | đọc fresh | 2 tay (2 bàn tay mở), 2 chân (2 giày) | PASS |
| P9 | đọc fresh | vòng tròn xé, không chữ | PASS |
| P10 | đọc fresh | bóng chuẩn, gold crescent | PASS |
| P11 | đọc fresh | 2 tay, 2 chân; thước không số; 2 line | PASS |
| P12 | visual-grounding count | 12 tay + 12 chân / 6 figure = 2+2 mỗi figure | PASS (giữ note viền đỏ kit) |
| P13 | đọc fresh | 2 tay, 2 chân; viền trắng; không chữ | PASS |
| P14 | đọc fresh | 2 tay, 2 chân; đồng hồ không số; không chữ | PASS |
| SIL-CR7-ENTRY | đọc fresh | 2 tay, 2 chân, 2 bàn chân | PASS |
| SIL-CR7-WALK | visual-grounding count | 6 tay + 6 chân / 3 pose = 2+2 mỗi pose | PASS |
| SIL-CR7-STAND | đọc fresh | 2 tay, 2 chân | PASS |
| SIL-CR7-RETURN | đọc fresh | 2 tay, 2 chân | PASS |
| SF-S27-M1 | đọc fresh | 2 tay, 2 chân; đủ 3 element keyframe map | PASS |
| SF-S28-M4 | đọc fresh | figure 2 tay 2 chân; đủ 3 phase clock morph | PASS |

## TỔNG KẾT
- **20/20 asset PASS cả 2 vòng.** 1 lần FAIL ở vòng 1 (P2 v1: 7 markers ≠ spec 5) → đã vẽ lại, bản v2 PASS cả 2 vòng; file v1 đã xóa.
- **Không có asset nào chưa đạt ở trạng thái cuối.** 2 lưu ý không phải FAIL (đã ghi trong ASSET_MANIFEST): P4 bóng bầu dục (dùng P10 cho shot bóng chuẩn), P12 viền đỏ kit (trong tông dự án).
- Kích thước ảnh không đồng nhất (1920×1280 chủ đạo; P6/SIL-STAND/SIL-ENTRY portrait 1280×1792/1920; P9/SIL-RETURN vuông; style frame 2048×1152 16:9) — team build crop/scale theo layout, đã ghi trong manifest.
