#!/bin/bash
# Contact sheet every 10s from the v4 draft, for round-2 review.
set -e
OUT=/tmp/v4r2
mkdir -p $OUT
i=0
for t in $(seq 5 10 295); do
  ffmpeg -y -v error -ss $t -i ~/workspace/cr7-tribute/out/cr7-v4-draft.mp4 \
    -frames:v 1 -vf scale=480:270 $OUT/f$(printf "%03d" $i).png
  i=$((i+1))
done
# 5 cols; build explicit xstack layout
files=($OUT/f*.png)
total=${#files[@]}
n=0; s=0
while [ $n -lt $total ]; do
  inputs=""; layout=""; idx=0; xpos=()
  for k in $(seq 0 29); do
    j=$((n+k)); [ $j -ge $total ] && break
    inputs="$inputs -i ${files[$j]}"
    c=$((k%5)); r=$((k/5))
    x=$((c*480)); y=$((r*270))
    [ -n "$layout" ] && layout="${layout}|"
    layout="${layout}${x}_${y}"
    idx=$((idx+1))
  done
  ffmpeg -y -v error $inputs -filter_complex "xstack=inputs=${idx}:layout=${layout}" $OUT/sheet$s.png
  n=$((n+idx)); s=$((s+1))
done
ls $OUT/sheet*.png
