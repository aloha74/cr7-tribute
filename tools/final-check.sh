#!/bin/bash
# CR7 v4 final technical checklist
# Usage: ./final-check.sh <video.mp4>
set -u
F="${1:?usage: final-check.sh <mp4>}"
echo "=== FILE: $F ==="
ls -la "$F" | awk '{print "size_bytes:", $5}'

echo "--- streams (ffprobe) ---"
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,avg_frame_rate,sample_rate,channels -of default=noprint_wrappers=1 "$F"

echo "--- duration ---"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
echo "duration_sec: $DUR"

echo "--- loudness (integrated LUFS, dual-pass ebur128) ---"
ffmpeg -v error -i "$F" -map 0:a -filter:a ebur128=peak=true -f null - 2>&1 | tail -12

echo "--- black frames: first 5 & last 5 (mean brightness) ---"
for S in 0 1 2 3 4; do
  B=$(ffmpeg -v error -ss $S -i "$F" -frames:v 1 -vf "scale=64:36,avgblur=20" -f rawvideo -pix_fmt gray - 2>/dev/null | od -An -tu1 | awk '{s+=$1; n++} END {if(n) printf "%.1f", s/n; else print "NA"}')
  echo "t=${S}s mean: $B"
done
DURINT=${DUR%.*}
for S in 0 1 2 3 4; do
  T=$((DURINT - 5 + S))
  B=$(ffmpeg -v error -ss $T -i "$F" -frames:v 1 -vf "scale=64:36,avgblur=20" -f rawvideo -pix_fmt gray - 2>/dev/null | od -An -tu1 | awk '{s+=$1; n++} END {if(n) printf "%.1f", s/n; else print "NA"}')
  echo "t=${T}s mean: $B"
done

echo "--- metadata tags ---"
ffprobe -v error -show_entries format_tags -of default=noprint_wrappers=1 "$F"
