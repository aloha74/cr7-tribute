#!/bin/bash
# CR7 v6 render — chunked WITH audio (AudioBed: score + SFX stems baked via Remotion).
# Lesson from v5 #11: chunk to survive service restarts.
# Usage: ./tools/render-v6.sh
set -e
cd ~/workspace/cr7-tribute
export TMPDIR=~/workspace/.tmp
mkdir -p "$TMPDIR" out/v6-chunks

CHUNKS=4
FRAMES_PER_CHUNK=2850  # 11400 / 4 = 95s each

for i in $(seq 0 $((CHUNKS-1))); do
  START=$((i * FRAMES_PER_CHUNK))
  OUT="out/v6-chunks/chunk-$i.mp4"
  if [ -f "$OUT" ]; then echo "chunk $i exists, skipping"; continue; fi
  echo "=== rendering chunk $i (frames $START-$((START+FRAMES_PER_CHUNK-1))) ==="
  npx remotion render CR7V6 "$OUT" \
    --frames=$START-$((START+FRAMES_PER_CHUNK-1)) \
    --concurrency=2 \
    --log=verbose 2>&1 | tail -3
done

echo "=== concatenating (video+audio, stream copy) ==="
printf "file '%s'\n" $(for i in $(seq 0 $((CHUNKS-1))); do echo "v6-chunks/chunk-$i.mp4"; done) > out/v6-chunks/list.txt
ffmpeg -y -f concat -safe 0 -i out/v6-chunks/list.txt -c copy out/cr7-v6.mp4

echo "=== done: out/cr7-v6.mp4 ==="
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,duration -of default=noprint_wrappers=1 out/cr7-v6.mp4
