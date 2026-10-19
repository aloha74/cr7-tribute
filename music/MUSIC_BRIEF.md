# BRIEF NHẠC V5 — soạn giao hưởng bằng code (đã kiểm chứng pipeline)

> Chuẩn bị cho bước "soạn nhạc mới 3 chương" của CR7 v5. Pipeline đã chạy thật,
> render ra file nghe được — không phải lý thuyết.

## 1. Vì sao là hướng này

Anh Dũng yêu cầu đích danh (16/10/2026): **tự soạn nhạc bằng code từ các source
GitHub được cộng đồng đánh giá cao**, 3 chương cảm xúc (nhẹ nhàng → bi tráng →
tột đỉnh chiến thắng), và **ở cao trào nhạc dìm xuống để âm thanh gốc của
footage (khán giả bùng nổ) vượt lên** — gây nổi da gà. Không dùng lại nhạc cũ.

## 2. Pipeline đã kiểm chứng hôm nay (16/10/2026)

`sketch-v5.py` → `pretty_midi` (MIDI, sửa được) → synth numpy (WAV 44.1kHz)
- Render thật: `cr7-v5-sketch.wav` — 63.8s, 267 events, 262 nốt MIDI, 4 nhạc cụ,
  peak 0.89 (không clip, không câm). Kiểm tra năng lượng theo section: prologue
  êm (heartbeat trầm) → ch.1 nhẹ → ch.2 dồn → ch.3 sáng/đầy nhất. Arc đúng thiết kế.
- `cr7-v5-sketch.mid` — score dạng MIDI, mở bằng bất kỳ DAW nào để nghe/sửa.
- `cue-map.json` — biên section + cửa sổ ducking, dùng cho edit Remotion.

Chạy lại: `/home/hatch/.musvenv/bin/python sketch-v5.py` (trong thư mục này).

## 3. Stack đề xuất (GitHub, cộng đồng đánh giá cao)

| Lớp | Thư viện | Ghi chú |
|---|---|---|
| Dựng score | `pretty_midi` (github.com/craffel/pretty-midi) | API đơn giản, build nốt/nhạc cụ/tempo bằng code; đã dùng trong sketch |
| Hòa âm/motif | `music21` (github.com/cuthbertLab/music21) | toolkit chuẩn cho lý thuyết nhạc (âm giai, hợp âm, voice-leading); dùng khi cần motif phức tạp |
| Viết MIDI nhẹ | `MIDIUtil` (github.com/MarkCWirt/MIDIUtil) | phương án dự phòng gọn nhẹ |
| Render | synth numpy (trong sketch, zero-dependency) | kiểm soát tuyệt đối, hợp ducking theo code |
| Render nâng cao (tùy chọn) | FluidSynth + SoundFont dàn nhạc (ví dụ GeneralUser GS) | âm thanh thật hơn nhưng nặng, cần cài thêm; synth numpy đủ cho bản đầu |

## 4. Thiết kế nhạc 3 chương (map với TREATMENT_V5.md)

- **Motif "Madeira"** (xương sống cả bản nhạc): A4–C5–B4–A4–G4–A4 — đường lên đầy
  hy vọng. Xuất hiện 3 lần, mỗi lần một diện mạo:
  - Ch. I: strings mềm + piano arpeggio, Am–F–C–G, ~66 BPM — tuổi thơ.
  - Ch. II: biến thể căng (giáng nửa cung ở nốt nhấn), ostinato 8th + timpani,
    Am–Am/G–F–E, ~84 BPM — máu, chấn thương.
  - Ch. III: khải hoàn, brass + 16th ostinato + taiko, Am–Am–F–G, 112→120 BPM —
    hat-trick, Euro, 3-peat, SIUUU. Kết bằng Picardy (kết trưởng) cho cảm giác
    "huyền thoại hoàn tất".
- **Prologue**: heartbeat lub-dub 60 BPM — chữ kinetic rơi theo nhịp tim.
- **Finale (4:10–4:40)**: trống dồn đồng bộ số đếm 0→900+ — viết riêng một track
  percussion, không hòa lẫn vào motif.
- **Ducking windows** (ý đắt nhất của anh Dũng): tại các đỉnh cao trào
  (đá phạt TBN, Wolfsburg, nâng cúp Euro, SIUUU), score tự động hạ −12 dB trong
  3–4 giây để tiếng sân vận động gốc vượt lên. Trong code là metadata
  `DUCK = [(start, end), ...]` — khi dựng Remotion, đặt đúng điểm này để chèn
  audio gốc của footage. Sketch đã demo 2 cửa sổ (44–48s, 54–58s).

## 5. Scale từ sketch (64s) lên full 300s

Giữ nguyên kiến trúc: motif, tiến trình hợp âm, vị trí ducking tương đối.
Nhân thời lượng mỗi section ×~4.7; thêm biến thể (counter-melody ở ch. III,
timpani roll chuyển chương, breakdown 8s trước SIUUU để cú nổ to hơn).
Cue map full 300s = scale tuyến tính từ `cue-map.json`.

## 6. Tiêu chí 2 vòng review cho bước nhạc (theo workflow anh Dũng)

Vòng 1 (kỹ thuật): đủ 3 chương cảm xúc? motif nhận ra được ở cả 3 chương?
ducking đúng điểm cao trào? không đoạn nào nghe như loop đều đều?
Vòng 2 ("có nhàm không"): nghe mù cùng footage — chỗ nào nhạc át tiếng gốc
thì hạ; chỗ nào thiếu "nổi da gà" thì thêm breakdown/trống dồn trước đó 4–8s.

## 7. Giới hạn thành thật

Soạn bằng code + synth ≠ dàn nhạc thật. Cái bán được "chất sử thi" là phối khí:
ostinato dây dồn dập, brass stab đúng nhịp, taiko/timpani, reverb hall, và
động lực học (to–nhỏ tương phản mạnh). Đừng cố giả lập từng nhạc cụ solo —
càng ít nốt đơn độc càng ít lộ chất "máy".
