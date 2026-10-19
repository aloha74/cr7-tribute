# Nghiên cứu phong cách Vox Explainer — ngữ pháp visual cho video tribute CR7 (Remotion)

Ngày nghiên cứu: 17/10/2026. Phương pháp: đọc thật các nguồn qua browser (không đoán).

## Nguồn chính
- `VOX-STYLE.md` — repo matt-j-penny/vox-style-video (https://github.com/matt-j-penny/vox-style-video/blob/main/VOX-STYLE.md): locked visual system — 3-layer model, motion language, typography, palette, pacing.
- `prompt-guide.md` — skill vox-explainer của advibly/skills (https://github.com/advibly/skills/blob/HEAD/vox-explainer/references/prompt-guide.md): trục MOVEMENT (parallax từng lớp), một camera move + một action cluster mỗi shot.
- Kapwing "How to Make Vox-Style Animations" (https://www.kapwing.com/resources/how-to-make-informational-videos-like-vox/): đặc trưng Vox + prompt "build-on assembly" + "living poster".
- Storybench phỏng vấn Joey Sendaydiego, art director Vox (2024) (https://www.storybench.org/how-vox-uses-animation-to-make-complicated-topics-digestible-for-everyone/): anchor visual, construction-paper, paper clock → pie chart, triết lý "đừng quá hoàn hảo", retention ~4 phút.
- `SKILL.md` — repo Alisa0808/vox-director (https://github.com/Alisa0808/vox-director): tách LOOK khỏi MOTION, cadence cắt 4–6s, beat = 2 shot (wide+detail), local keyframe engine (fly_in/slap/drop/pop_settle), theme presets.
- NoFilmSchool "How to Create Vox Style Maps in After Effects" (https://nofilmschool.com/how-create-vox-style-map-animations-after-effects): map comps, posterize 10fps, film grain 35%.
- Tutorial Vox Title Animation của Mapal Berenson (mapal.studio): text reveal, highlighter, animated focus state, match-cut.
- Paper CHI'21 "Communicating with Motion" (design space animated data video): decode trục trước, camera zoom vào điểm dữ liệu, annotation.

## 1. Paper-cut / paper-collage
- **Mô hình 3 lớp:** (1) background paper world — giấy ấm + grain + halftone mờ + vignette; (2) midground — cutout grayscale, tương phản cao, silhouette sạch, cạnh giấy hơi rách; (3) foreground graphics — nhãn, mũi tên, vòng tròn vẽ tay, thẻ, map, có thể che một phần midground để tạo sâu.
- **Parallax:** camera di chuyển → từng lớp giấy di chuyển tốc độ khác nhau, phải gọi tên rõ từng lớp. Không trượt cả khung.
- **Rack-focus:** đổi trọng tâm bằng blur + giảm opacity/contrast phần cũ; phần mới trượt vào mềm rồi nét dần; nhãn foreground "stamp" xuống với overshoot nhẹ.
- **Motion language:** entrances = paper slides, stamped labels, drawn circles, radar rings, pasted documents, sketched arrows; holds = parallax nhẹ, drift nhẹ, settling; exits = mờ mềm, giảm contrast, trôi vào nền. CẤM: hard cut mạnh, fast zoom, glossy transition, lens flare, 3D photoreal.
- **Build-on assembly:** khung mở = nền giấy trống (+scaffolding cố định như timeline/map); phần tử vào từng cái, back-to-front, theo thứ tự kể chuyện; mỗi lần vào có bounce thủ công nhỏ + bóng lớp thật; vào đủ thì đứng yên → "living poster" chỉ còn micro-motion (góc giấy nhấc, halftone shimmer, bóng thở).
- **Stop-motion cadence:** slide/drop/snap, không mượt CGI; posterize 10fps cho cảm giác thủ công.
- **Ví dụ Vox:** "Teaching in the US vs. the rest of the world" (toàn bộ bằng construction paper thủ công); "Why we all need subtitles now"; "Computers just got a lot better at writing" (motif flying text làm anchor); video Fred Hampton (phong cách protest poster thập niên 60).

## 2. Whiteboard / dataviz
- Trục/nhãn vẽ trước, dữ liệu hiện sau (trục "blink" thu hút chú ý).
- Mỗi cụm narration → một hành động visual duy nhất; không hiện cả chart cùng lúc.
- Bar chart mọc từ baseline (ease-out), lệch pha theo narration; counter chạy số trên đỉnh cột.
- Line chart vẽ dần bằng stroke animation; điểm dữ liệu "đóng dấu" tại mốc được nhắc.
- Annotation thủ công: vòng tròn vẽ tay, mũi tên phác, nhãn dán — giữ chất giấy.
- Camera zoom vào dữ liệu chính trong khi context fade out; zoom-out khi cần tổng quan.
- Biến vật thể thành biểu đồ: ví dụ đỉnh — đồng hồ giấy biến thành pie chart (so sánh giờ làm Mỹ vs thế giới).
- Map Vox: dashed-line vẽ biên giới/đường bay, mask reveal, desaturate + grain cho archival feel.

## 3. Pacing & text-on-screen
- Đơn vị beat: section 5–10s; beat visual 2–3s / 5–8 từ nói.
- Cadence: cắt mỗi 4–6s; shot tĩnh >7s là dead air. Beat 8–10s = 2 shot: wide (establishing + headline) + detail cut-in (không headline); visual cắt giữa câu nói.
- Một camera move + một action cluster mỗi shot; đổi camera move giữa beat kề nhau, không lặp; static dành cho payoff.
- Kết mỗi scene trên khung ổn định để nối tiếp — một vũ trụ visual liên tục.
- Chuyển cảnh: simple cuts (paper assembly đã đủ chuyển động).
- Text-on-screen: 1–8 từ; dạng nhãn lớn/stamp/price tag/callout/headline; headline beat-1 là hook ≤3s. Kỹ thuật: highlighter effect, word focus, flying text motif, kinetic type (text reveal từng chữ, match-cut, animated focus state = rack-focus cho chữ).
- Audio: SFX giấy subtle (slide/stamp/tape/pin); nhạc duck dưới narration.
- Triết lý: đo bằng retention; mỗi video tìm một "anchor" visual độc đáo và bám suốt; đừng quá hoàn hảo ("trông như quảng cáo"); chừa negative space.

## 4. Màu sắc & texture
- Nền: warm off-white/cream + grain + halftone mờ + vignette nhẹ.
- Cutout: grayscale/black ink.
- Accent: chỉ 1–2 màu muted (dusty coral, faded navy, sage, một vàng ấm restrained); text đen/trắng ngà/editorial red.
- CẤM: neon gradient, UI bóng bẩy, palette bão hòa.
- Texture: newsprint, halftone photo, faded maps, paper grain thấy được; 16mm film grain overlay ~35% + posterize 10fps.

## 5. Áp dụng cho CR7 (Remotion) — palette đỏ-đen-gold của kênh
1. Poster trước, motion sau: thiết kế mỗi scene như collage tĩnh hoàn chỉnh (3 lớp + headline 1–8 từ + 1 accent gold) rồi mới animate.
2. Assemble back-to-front: nền → lót → hero cutout (spring bounce + drop-shadow) → thẻ CLB (stamp overshoot) → dây nối (SVG strokeDashoffset) → số chốt (highlight). Xong đứng yên, chỉ micro-motion.
3. Parallax theo lớp: `translateX(camera * parallax)` với hệ số 0.3/0.6/1.0; bóng giấy bằng drop-shadow.
4. Dataviz thay card tĩnh: bar chart bàn thắng theo CLB mọc lệch pha 12 frame + counter chạy số (cột Real gold, còn lại grayscale); line chart tích lũy vẽ dần + stamp mốc năm; quả bóng giấy xé đôi lộ pie chart tỉ lệ chân phải/trái/đầu.
5. Cadence 4–6s/shot, 2 shot/beat (wide headline + detail), cắt giữa phách nhạc; simple cut.
6. Text graphic 1–4 từ: stamp vào, highlighter quét gold, word-focus (mờ chữ cũ, nét chữ chốt); motif chữ bay ("DISCIPLINA", "FOME"...) làm anchor xuyên suốt.
7. Texture: paper texture multiply 0.15–0.35; halftone dots (radial-gradient lặp hoặc SVG filter); film grain opacity 0.08–0.12 animate stepped mỗi 2–3 frame (cutting on twos: `Math.floor(frame/2)*2`).
8. SFX giấy subtle đồng bộ từng lần vào.
9. Giữ chất editorial thô, negative space, không nhồi kín khung.
