#!/bin/bash
# Regenerates public/v3/clip01..16.mp4 from the CC BY 3.0 source footage.
# Source: "All 48 goals of Cristiano Ronaldo, in 35 league matches for
# Real Madrid (2014-15)" via Wikimedia Commons (CC BY 3.0).
# Attribution required if you publish: credit the uploader, link the license.
set -e
SRC="${1:-$HOME/workspace/cr7-48-goals.mp4}"
OUT="$(dirname "$0")/../public/v3"
mkdir -p "$OUT"
i=1
for t in 4 20 36 52 68 84 100 116 132 148 164 180 196 212 228 244; do
  n=$(printf "%02d" $i)
  ffmpeg -y -v error -ss $t -i "$SRC" -t 4 \
    -c:v libx264 -crf 23 -preset veryfast -c:a aac \
    -movflags +faststart "$OUT/clip$n.mp4"
  i=$((i+1))
done
echo "Done: $OUT/clip01..16.mp4"
