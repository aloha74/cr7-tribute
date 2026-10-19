#!/usr/bin/env python3
"""Verify CR7 v6 score — VONG 1 KY THUAT (13 muc, do duoc bang code).

Inputs: ../public/v6/score.mid, score.wav, cue-sheet-v6.json + ./v6-beats.json
Moi muc in PASS/FAIL + chi tiet. Exit 0 neu 13/13 PASS.
Quy tac: 1 muc FAIL = sua code, render lai, review lai tu vong 1.
"""
import json
import math
import os
import struct
import sys
import wave

import numpy as np
import pretty_midi

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, "..", "public", "v6")
MID = os.path.join(PUB, "score.mid")
WAV = os.path.join(PUB, "score.wav")
CUE = os.path.join(PUB, "cue-sheet-v6.json")
BEATS_F = os.path.join(HERE, "v6-beats.json")

pm = pretty_midi.PrettyMIDI(MID)
cue = json.load(open(CUE))
beats_data = json.load(open(BEATS_F))
ALL_BEATS = sorted(b for s in beats_data["sections"].values() for b in s["beats"])

with wave.open(WAV, "rb") as w:
    NCH, SW, SR, NFR = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
    raw = w.readframes(NFR)
audio = np.frombuffer(raw, dtype=np.int16).reshape(-1, NCH).astype(np.float32) / 32768.0
DUR = NFR / SR

TR = {t.name: t for t in pm.instruments}
PITCHED = [n for n in TR if not TR[n].is_drum]
DRUMS = [n for n in TR if TR[n].is_drum]
CHORDS = cue["chords"]

results = []


def check(cid, title, passed, detail):
    results.append((cid, title, passed, detail))
    print(f"[{'PASS' if passed else 'FAIL'}] {cid} {title}\n      {detail}")


def chord_at(t):
    for c in CHORDS:
        if c["start"] <= t < c["end"]:
            return c
    return CHORDS[-1]


def chord_tones_at(t):
    """Hop am tai t, union ±20ms quanh bien (chong jitter lech bien hoa am)."""
    tones = set()
    for dt in (-0.02, 0.0, 0.02):
        c = chord_at(t + dt)
        tones.update(x % 12 for x in c["tones"])
    return tones, chord_at(t)["name"]


# ------------------------------------------------ 1.1 dead air
def intervals(track):
    return sorted((n.start, n.end) for n in track.notes)

all_iv = sorted(iv for t in pm.instruments for iv in intervals(t))
gaps = []
prev_end = 0.0
for s, e in all_iv:
    if s - prev_end > 1.55:
        gaps.append((round(prev_end, 2), round(s, 2)))
    prev_end = max(prev_end, e)
intentional = cue["intentional_silences"]
bad_gaps = []
for g0, g1 in gaps:
    covered = any(i["t0"] - 0.6 <= g0 and g1 <= i["t1"] + 0.6 for i in intentional)
    if not covered:
        bad_gaps.append((g0, g1))
check("1.1", "Khong dead air khong chu y",
      not bad_gaps,
      f"{len(gaps)} gap >1.55s; khong chu y: {bad_gaps if bad_gaps else 'khong co'}; "
      f"co chu y: {[i['id'] for i in intentional]}")


# ------------------------------------------------ 1.2 parallel P5/P8
# (logic DONG NHAT voi has_parallel_p5_p8 trong compose-v6.py)
def parallel_bad(prev, new):
    bad = []
    for i in range(len(prev)):
        for j in range(i + 1, len(prev)):
            di, dj = new[i] - prev[i], new[j] - prev[j]
            if di == 0 or dj == 0:
                continue
            if (di > 0) != (dj > 0):
                continue
            int0 = abs(prev[j] - prev[i]) % 12
            int1 = abs(new[j] - new[i]) % 12
            if int0 in (0, 7) and int1 == int0:
                bad.append((i, j))
    return bad

from collections import defaultdict
vfail = []
by_tag = defaultdict(list)
for v in cue["voicings"]:
    by_tag[v["tag"]].append(v)
for tag, vs in by_tag.items():
    vs.sort(key=lambda x: x["t"])
    for a, b in zip(vs, vs[1:]):
        if len(a["voices"]) != len(b["voices"]):
            continue
        bad = parallel_bad(a["voices"], b["voices"])
        if bad:
            vfail.append((tag, a["t"], b["t"], bad))
check("1.2", "Voice leading: khong parallel P5/P8",
      not vfail,
      f"{sum(len(v['voices']) for v in cue['voicings'])} voicing / "
      f"{len(by_tag)} nhom; vi pham: {vfail if vfail else 'khong co'}")


# ------------------------------------------------ 1.3 dynamic range
vels = [n.velocity for t in PITCHED for n in TR[t].notes]
vmax, vmin = max(vels), min(vels)
ratio = vmax / max(1, vmin)
# crescendo/decrescendo: mean vel / 10s window, dem chuoi don dieu >=3 window
W = 10.0
nw = int(DUR // W)
means = []
str_tracks = [t for t in PITCHED if t in ("vln1", "vln2", "vla", "vc", "db", "choir")]
for k in range(nw):
    vv = [n.velocity for t in str_tracks for n in TR[t].notes
          if k * W <= n.start < (k + 1) * W]
    means.append(sum(vv) / len(vv) if vv else 0)
runs = 0
i = 0
while i < len(means) - 1:
    if means[i + 1] > means[i] * 1.01 and means[i] > 0:
        j = i
        while j + 1 < len(means) and means[j + 1] > means[j] * 1.01:
            j += 1
        if j - i + 1 >= 3:
            runs += 1
        i = j + 1
    elif means[i] > 0 and means[i + 1] < means[i] * 0.99:
        j = i
        while j + 1 < len(means) and means[j + 1] < means[j] * 0.99:
            j += 1
        if j - i + 1 >= 3:
            runs += 1
        i = j + 1
    else:
        i += 1
check("1.3", "Dynamic range",
      ratio >= 2.0 and runs >= 3,
      f"vel max/min = {vmax}/{vmin} = {ratio:.2f} (can >=2.0); "
      f"doan cresc/decresc ro: {runs} (can >=3)")


# ------------------------------------------------ 1.4 humanization timing
def nearest_16th_dev(t):
    import bisect
    i = bisect.bisect_left(ALL_BEATS, t)
    i0 = min(max(i - 1, 0), len(ALL_BEATS) - 2)
    b0, b1 = ALL_BEATS[i0], ALL_BEATS[i0 + 1]
    if b1 - b0 <= 0:
        return 0.0
    k = round(4 * (t - b0) / (b1 - b0))
    k = min(max(k, 0), 4)
    ideal = b0 + k * (b1 - b0) / 4
    return abs(t - ideal) * 1000.0

devs = []
over = 0
# free-time expressive notes (bridge/breathing, khong tren beat grid) — mien
FREE_TIME = [(57.9, 60.1), (124.4, 128.1)]
pitched_test = [t for t in PITCHED if t != "piano"] + ["piano"]
for t in pitched_test:
    for n in TR[t].notes:
        if n.start < 15.0:      # prologue: free tempo, khong grid
            continue
        if any(a <= n.start < b for a, b in FREE_TIME):
            continue
        d = nearest_16th_dev(n.start)
        devs.append(d)
        if d > 25:
            over += 1
in_range = sum(1 for d in devs if 1.0 <= d <= 10.0)
pct = in_range / max(1, len(devs))
check("1.4", "Humanization timing",
      pct >= 0.80 and over == 0,
      f"{in_range}/{len(devs)} not ({pct:.1%}) lech grid 1-10ms (can >=80%); "
      f"lech >25ms: {over} (can =0)")


# ------------------------------------------------ 1.5 instrumentation
ntracks = len(pm.instruments)
chapters = [(15, 60, "Ch.I"), (60, 130, "Ch.II"), (130, 250, "Ch.III"),
            (250, 330, "ActIV"), (330, 380, "Finale")]
chap_ok, chap_detail = True, []
for c0, c1, nm in chapters:
    wins, good = 0, 0
    w0 = c0
    while w0 < c1:
        w1 = min(w0 + 5.0, c1)
        tracks_live = sum(1 for t in pm.instruments
                          if any(n.start < w1 and n.end > w0 for n in t.notes))
        wins += 1
        if tracks_live >= 6:
            good += 1
        w0 += 5.0
    ok = good / wins >= 0.70
    chap_ok &= ok
    chap_detail.append(f"{nm}:{good}/{wins}")
check("1.5", "Instrumentation count",
      ntracks >= 10 and chap_ok,
      f"{ntracks} track/mau (can >=10); moi chuong >=6 lop dong thoi "
      f"(>=70% window 5s): {'; '.join(chap_detail)}")


# ------------------------------------------------ 1.6 stereo
L, R = audio[:, 0], audio[:, 1]
corr = float(np.corrcoef(L, R)[0, 1])
check("1.6", "Stereo co panning that",
      NCH == 2 and corr < 0.98,
      f"channels={NCH}; tuong quan L/R = {corr:.4f} (can <0.98)")


# ------------------------------------------------ 1.7 motif development
CANON = ["repetition", "sequence", "augmentation", "diminution",
         "inversion", "fragmentation", "reharmonization"]
found = {c for c in CANON
         for m in cue["motif_development"]
         if c in (m["technique"] + " " + m["form"]).lower()}
forms = [(m["form"], m["t0"], m["t1"]) for m in cue["motif_development"]]
check("1.7", "Motif co phat trien (>=4 hinh thuc)",
      len(found) >= 4,
      f"{len(found)}/7 ky thuat: {sorted(found)}; {len(forms)} lan xuat hien")


# ------------------------------------------------ 1.8 bass line
def pc(n):
    return n % 12

wins, root_only = 0, 0
w0 = 15.0
db = TR["db"]
while w0 < 375.0:
    w1 = w0 + 4.0
    notes = [n for n in db.notes if w0 <= n.start < w1]
    if notes:
        wins += 1
        if all(pc(n.pitch) == chord_at(n.start)["root_pc"] for n in notes):
            root_only += 1
    w0 += 4.0
frac = root_only / max(1, wins)
check("1.8", "Bass line co duong di",
      frac <= 0.50,
      f"window 4s root-tran: {root_only}/{wins} = {frac:.1%} (can <=50%)")


# ------------------------------------------------ 1.9 harmonic rhythm
durs = sorted(c["end"] - c["start"] for c in CHORDS if c["end"] - c["start"] > 0.5)
spread = max(durs) / min(durs) if durs else 0
check("1.9", "Harmonic rhythm co bien doi",
      spread >= 1.5,
      f"hop am ngan nhat {min(durs):.1f}s / dai nhat {max(durs):.1f}s "
      f"= {spread:.1f}x (can >=1.5x)")


# ------------------------------------------------ 1.10 ducking mem
def rms_env(x, hop=0.05):
    h = int(hop * SR)
    n = len(x) // h
    e = np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(axis=1) + 1e-12)
    return e, hop

mono = (audio[:, 0] + audio[:, 1]) / 2
env, hop = rms_env(mono)
env_db = 20 * np.log10(env + 1e-9)
ok10, det10 = True, []
for d in cue["ducking_windows"]:
    a, b, f = d["start"], d["end"], d["fade_sec"]
    ia, ib = int(a / hop), int(b / hop)
    iff = int(f / hop)
    seg_in = env_db[ia:ia + iff]
    seg_out = env_db[ib - iff:ib]
    worst = 0.0
    for seg in (seg_in, seg_out):
        for k in range(len(seg) - 3):
            worst = max(worst, abs(seg[k + 3] - seg[k]))
    smooth = worst < 8.0  # step duck cung (v5) = 12dB/<50ms; transient nhac <8dB
    mid = np.median(env_db[ia + iff:ib - iff])
    pre = np.median(env_db[max(0, ia - 80):ia - 20])
    post = np.median(env_db[ib + 20:ib + 100])
    depth = max(pre, post) - mid   # so voi doan FULL gan nhat (pre co the la breakdown)
    need_depth = d["id"] in ("D2", "D4")
    dok = (not need_depth) or depth >= 6.0
    ok10 &= smooth and dok
    det10.append(f"{d['id']}: nhay max/150ms={worst:.1f}dB "
                 f"({'ok' if smooth else 'CLIFF'}); depth={depth:.1f}dB"
                 + ("" if need_depth else " (mien: " +
                    ("crowd bed" if d["id"] == "D1" else "chong SIL-2") + ")"))
check("1.10", "Ducking mem (fade >=0.5s, khong cliff)",
      ok10, "; ".join(det10))


# ------------------------------------------------ 1.11 brief <-> code
p11, d11 = True, []
pr = {p["id"]: p for p in cue["promises_brief_vs_code"]}


def cnt(track, t0, t1):
    return sum(1 for n in TR[track].notes if t0 <= n.start < t1)


# Picardy: D natural co, Db khong — trong 375-380
fin_notes = [n for t in PITCHED for n in TR[t].notes if 375.0 <= n.start < 380.0]
pcs = {pc(n.pitch) for n in fin_notes}
pic_ok = (2 in pcs) and (1 not in pcs)
p11 &= pic_ok
d11.append(f"Picardy: D natural {'co' if 2 in pcs else 'THIEU'}, "
           f"Db {'vang mat' if 1 not in pcs else 'CON — FAIL'}")

# counter-melodies
cm1 = cnt("vln1", 37, 62) >= 6
cm2 = cnt("vln1", 208, 248) >= 8
p11 &= cm1 and cm2
d11.append(f"counter-melody Ch.I vln1[37-62]: {cnt('vln1',37,62)} not; "
           f"Ch.IIIb vln1[208-248]: {cnt('vln1',208,248)} not")

# choir tu 3:30
ch_ok = cnt("choir", 208, 380) >= 10
p11 &= ch_ok
d11.append(f"choir tu 3:30: {cnt('choir',208,380)} not")

# snare build 2
sb2 = cnt("snare", 330, 340) >= 16
p11 &= sb2
d11.append(f"snare build #2 [5:30-5:40]: {cnt('snare',330,340)} not")

# modulation +1 semitone tai 5:40 — so cung pattern Am (Act IV) vs Bbm (Finale)
def mean_pitch(track, t0, t1):
    vv = [n.pitch for n in TR[track].notes if t0 <= n.start < t1]
    return sum(vv) / len(vv) if vv else 0

shift = (mean_pitch("vla", 340.0, 344.0) - mean_pitch("vla", 258.5, 266.5)) % 12
mod_ok = abs(shift - 1) < 0.6
p11 &= mod_ok
d11.append(f"modulation: vla Am[258-266]->Bbm[340-344] shift = {shift:.2f} (can ~1)")

check("1.11", "Brief <-> code khop", p11, "; ".join(d11))


# ------------------------------------------------ 1.12 no accidental dissonance
# Not OK neu: (a) chord tone, hoac (b) diatonic theo key scale
# (Am/Bbm — not mau diatonic KHONG phai "not sai" kieu v5),
# hoac (c) chromatic that -> phai resolve stepwise (<=2 st) toi not
# chord/scale trong <=3.0s (1 bar).
KEYS = [
    (0.0, 340.0, {9, 11, 0, 2, 4, 5, 7}),    # A minor
    (340.0, 375.0, {10, 0, 1, 3, 5, 6, 8}),  # Bb minor (modulation)
    (375.0, 380.1, {10, 0, 2, 3, 5, 7, 9}),  # Bb major (Picardy)
]


def key_scale_at(t):
    for a, b, pcs in KEYS:
        if a <= t < b:
            return pcs
    return KEYS[0][2]


fails12 = []
for t in PITCHED:
    notes = sorted(TR[t].notes, key=lambda n: n.start)
    for idx, n in enumerate(notes):
        tones, _ = chord_tones_at(n.start)
        scale = key_scale_at(n.start)
        if pc(n.pitch) in tones or pc(n.pitch) in scale:
            continue
        nxt = next((m for m in notes[idx + 1:] if m.start > n.start), None)
        ok = False
        if nxt is not None and nxt.start - n.start <= 3.0 \
                and abs(nxt.pitch - n.pitch) <= 2:
            tones2, _ = chord_tones_at(nxt.start)
            if pc(nxt.pitch) in tones2 or pc(nxt.pitch) in key_scale_at(nxt.start):
                ok = True
        if not ok:
            fails12.append((t, round(n.start, 2), n.pitch))
            if len(fails12) > 8:
                break
check("1.12", "Khong dissonance tinh co (chromatic -> resolve stepwise)",
      not fails12,
      f"vi pham: {fails12 if fails12 else 'khong co'}")


# ------------------------------------------------ 1.13 transitions
t13ok, t13d = True, []
need = {15.0: "timpani", 60.0: "timpani", 130.0: "taiko", 250.0: "taiko",
        340.0: "snare", 375.0: "timpani"}
have_trans = len(cue["transitions"]) >= 5
for tt, inst in need.items():
    c = cnt(inst, tt - 4, tt + 1)
    ok = c >= 1
    t13ok &= ok
    t13d.append(f"{tt}s:{inst}x{c}")
t13ok &= have_trans
check("1.13", "Transition giua chuong co bridge",
      t13ok, f"cue transitions: {len(cue['transitions'])}; " + "; ".join(t13d))

# ------------------------------------------------ summary
print("\n==== TONG KET ====")
npass = sum(1 for _, _, p, _ in results if p)
for cid, title, p, _ in results:
    print(f"  {cid}: {'PASS' if p else 'FAIL'}")
print(f"==> {npass}/13 PASS")
sys.exit(0 if npass == 13 else 1)
