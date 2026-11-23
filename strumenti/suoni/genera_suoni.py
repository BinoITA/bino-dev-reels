# © 2026 BinoITA (bino.dev, @bino.devs) — licenza MIT — https://github.com/BinoITA/bino-dev-reels
"""Effetti sonori e base musicale generati col codice (numpy): nessuna licenza da rispettare, sono nostri.

Uso (con l'ambiente di strumenti/voce-narratore, che ha numpy e soundfile):
    python genera_suoni.py cartella_uscita --durata 20 --bpm 100
    python genera_suoni.py --inviluppo voce.wav -o volume.json      # volume della voce per frame (30 fps)

Crea: whoosh.wav, pop.wav, click.wav, digitazione.wav, ding.wav, timbro.wav, musica.wav
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 44100
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def normalizza(x, picco=0.9):
    m = np.max(np.abs(x)) or 1
    return (x / m * picco).astype("float32")


def passa_basso(x, taglio):
    """Filtro passa-basso a un polo (semplice ma sufficiente)."""
    a = np.exp(-2 * np.pi * taglio / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def passa_alto(x, taglio):
    return x - passa_basso(x, taglio)


def whoosh():
    d = 0.45
    n = rng.standard_normal(len(t(d)))
    # rumore filtrato con taglio che sale e scende
    env = np.sin(np.linspace(0, np.pi, len(n))) ** 2
    lento = passa_basso(n, 900)
    veloce = passa_basso(n, 3500)
    mix = np.linspace(0, 1, len(n))
    x = (lento * (1 - mix) + veloce * mix) * env
    return normalizza(x, 0.8)


def pop():
    tt = t(0.12)
    f = 900 * np.exp(-tt * 30) + 250
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 35)
    return normalizza(x, 0.8)


def click():
    tt = t(0.04)
    x = rng.standard_normal(len(tt)) * np.exp(-tt * 260) + np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 180) * 0.6
    return normalizza(passa_alto(x, 1500), 0.7)


def digitazione(durata=2.0):
    x = np.zeros(int(durata * SR))
    pos = 0.0
    while pos < durata - 0.05:
        k = click() * rng.uniform(0.4, 1.0)
        i = int(pos * SR)
        x[i : i + len(k)] += k[: len(x) - i]
        pos += rng.uniform(0.055, 0.12)
    return normalizza(x, 0.6)


def ding():
    tt = t(1.2)
    x = sum(np.sin(2 * np.pi * f * tt) * a for f, a in [(1320, 1), (2640, 0.35), (3960, 0.12)])
    return normalizza(x * np.exp(-tt * 4) * (1 - np.exp(-tt * 400)), 0.7)


def timbro():
    tt = t(0.35)
    f = 140 * np.exp(-tt * 12) + 45
    corpo = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14)
    attacco = passa_basso(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 60)
    return normalizza(corpo + attacco * 0.5, 0.9)


def nota(freq, dur, vol=1.0):
    tt = t(dur)
    voce = sum(np.sin(2 * np.pi * freq * m * tt + rng.uniform(0, 6)) / m**1.6 for m in (1, 2, 3, 4))
    voce += np.sin(2 * np.pi * freq * 1.004 * tt) * 0.5  # leggero chorus
    env = np.minimum(1, tt / 0.25) * np.exp(-tt * 0.6)
    return voce * env * vol


def musica(durata, bpm):
    """Base lo-fi tranquilla: accordi morbidi, cassa leggera, charleston. Va tenuta bassa sotto la voce."""
    out = np.zeros(int((durata + 2) * SR))
    battito = 60 / bpm
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    accordi = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 64]]  # Am7 Fmaj7 Cmaj7 G6
    batt_acc = 4
    i = 0
    pos = 0.0
    while pos < durata:
        for m in accordi[i % 4]:
            n = nota(hz(m), battito * batt_acc + 0.5, 0.16)
            k = int(pos * SR)
            out[k : k + len(n)] += n[: len(out) - k]
        b = nota(hz(accordi[i % 4][0] - 12), battito * batt_acc, 0.35)
        k = int(pos * SR)
        out[k : k + len(b)] += b[: len(out) - k]
        pos += battito * batt_acc
        i += 1
    # ritmo
    cassa_t = t(0.25)
    cassa = np.sin(2 * np.pi * np.cumsum(110 * np.exp(-cassa_t * 25) + 45) / SR) * np.exp(-cassa_t * 16) * 0.55
    hat_t = t(0.05)
    hat = passa_alto(rng.standard_normal(len(hat_t)), 6000) * np.exp(-hat_t * 90) * 0.12
    b = 0
    while b * battito < durata:
        k = int(b * battito * SR)
        if b % 2 == 0:
            out[k : k + len(cassa)] += cassa[: len(out) - k]
        for off in (0, 0.5):
            kk = int((b + off) * battito * SR)
            out[kk : kk + len(hat)] += hat[: len(out) - kk] * (1 if off else 0.7)
        b += 1
    out = passa_basso(out, 5000)[: int(durata * SR)]
    sfuma = int(1.5 * SR)
    out[:sfuma] *= np.linspace(0, 1, sfuma)
    out[-sfuma:] *= np.linspace(1, 0, sfuma)
    return normalizza(out, 0.8)


def inviluppo(audio, fps=30):
    x, sr = sf.read(audio, dtype="float32", always_2d=True)
    x = x.mean(axis=1)
    per = sr / fps
    valori = []
    for f in range(int(len(x) / per) + 1):
        pezzo = x[int(f * per) : int((f + 1) * per)]
        valori.append(float(np.sqrt(np.mean(pezzo**2))) if len(pezzo) else 0.0)
    m = max(valori) or 1
    return [round(v / m, 3) for v in valori]


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("cartella", nargs="?")
    ap.add_argument("--durata", type=float, default=20)
    ap.add_argument("--bpm", type=float, default=100)
    ap.add_argument("--inviluppo", help="audio di cui calcolare il volume per frame")
    ap.add_argument("-o", "--out", default="volume.json")
    a = ap.parse_args()

    if a.inviluppo:
        Path(a.out).write_text(json.dumps(inviluppo(a.inviluppo)), encoding="utf-8")
        print(f"Fatto: {a.out}")
        return

    cart = Path(a.cartella or ".")
    cart.mkdir(parents=True, exist_ok=True)
    for nome, fn in [("whoosh", whoosh), ("pop", pop), ("click", click), ("digitazione", digitazione), ("ding", ding), ("timbro", timbro)]:
        sf.write(cart / f"{nome}.wav", fn(), SR)
    sf.write(cart / "musica.wav", musica(a.durata, a.bpm), SR)
    print(f"Fatto: suoni e musica ({a.durata:.0f} s, {a.bpm:.0f} bpm) in {cart}")


if __name__ == "__main__":
    main()
