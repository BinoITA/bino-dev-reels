"""Tempi parola per parola di una narrazione, allineati al copione (per i sottotitoli dei reel).

Whisper (in locale, CPU) ascolta l'audio e dice quando inizia e finisce ogni parola.
Il testo però lo prendiamo dal COPIONE, non dalla trascrizione: così i sottotitoli
sono sempre scritti giusti anche se Whisper sente male una parola.

Uso:
    python tempi.py voce.wav copione.txt -o tempi.json

Uscita (JSON):
    durataMs   durata dell'audio
    paragrafi  [{indice, testo, startMs, endMs}]   -> uno per paragrafo del copione (= scena)
    captions   [{text, startMs, endMs, timestampMs, confidence, pageBreakAfter?}]
               nel formato Caption di @remotion/captions (spazio davanti a ogni parola)
"""

import argparse
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path


def normalizza(parola: str) -> str:
    p = unicodedata.normalize("NFKD", parola.lower())
    p = "".join(c for c in p if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9']", "", p.replace("’", "'"))


def parole_copione(testo: str):
    """[(parola_originale, indice_paragrafo)] mantenendo la punteggiatura per i sottotitoli."""
    paragrafi = [p.strip() for p in testo.replace("\r\n", "\n").split("\n\n") if p.strip()]
    out = []
    for i, par in enumerate(paragrafi):
        for w in par.split():
            out.append((w, i))
    return paragrafi, out


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Tempi parola per parola allineati al copione")
    ap.add_argument("audio")
    ap.add_argument("copione")
    ap.add_argument("-o", "--out", default="tempi.json")
    ap.add_argument("--modello", default="small", help="modello Whisper (default small; medium è più preciso ma lento)")
    a = ap.parse_args()

    from faster_whisper import WhisperModel

    testo = Path(a.copione).read_text(encoding="utf-8")
    paragrafi, copione = parole_copione(testo)

    # leggo e ricampiono l'audio io (16 kHz mono): evita problemi di versione con PyAV
    import numpy as np
    import soundfile as sf

    audio, sr = sf.read(a.audio, dtype="float32", always_2d=True)
    audio = audio.mean(axis=1)
    if sr != 16000:
        t_out = np.arange(int(len(audio) * 16000 / sr)) / 16000
        audio = np.interp(t_out, np.arange(len(audio)) / sr, audio).astype("float32")

    modello = WhisperModel(a.modello, device="cpu", compute_type="int8")
    segmenti, info = modello.transcribe(
        audio, language="it", word_timestamps=True, initial_prompt=" ".join(paragrafi), vad_filter=False
    )
    sentite = [w for s in segmenti for w in (s.words or [])]
    durata_ms = int(info.duration * 1000)

    # allineamento copione <-> parole sentite
    norm_c = [normalizza(w) for w, _ in copione]
    norm_s = [normalizza(w.word) for w in sentite]
    tempi = [None] * len(copione)
    sm = difflib.SequenceMatcher(a=norm_c, b=norm_s, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                w = sentite[j1 + k]
                tempi[i1 + k] = (w.start, w.end)
        elif tag == "replace":
            # blocchi di lunghezza diversa: spalmo il tempo del blocco sentito sulle parole del copione
            inizio, fine = sentite[j1].start, sentite[j2 - 1].end
            passo = (fine - inizio) / (i2 - i1)
            for k in range(i2 - i1):
                tempi[i1 + k] = (inizio + k * passo, inizio + (k + 1) * passo)

    # parole del copione non sentite: le metto tra le vicine
    for i, t in enumerate(tempi):
        if t is None:
            prima = next((tempi[j][1] for j in range(i - 1, -1, -1) if tempi[j]), 0.0)
            dopo = next((tempi[j][0] for j in range(i + 1, len(tempi)) if tempi[j]), info.duration)
            tempi[i] = (prima, max(prima + 0.05, min(dopo, prima + 0.3)))

    allineate = sum(1 for tag, i1, i2, *_ in sm.get_opcodes() if tag == "equal" for _ in range(i2 - i1))

    captions = []
    for k, ((parola, par), (s, e)) in enumerate(zip(copione, tempi)):
        c = {
            "text": (" " if captions else "") + parola,
            "startMs": round(s * 1000),
            "endMs": round(e * 1000),
            "timestampMs": round((s + e) / 2 * 1000),
            "confidence": None,
        }
        if k + 1 < len(copione) and copione[k + 1][1] != par:
            c["pageBreakAfter"] = True
        captions.append(c)

    out_par = []
    for i, p in enumerate(paragrafi):
        idx = [k for k, (_, par) in enumerate(copione) if par == i]
        out_par.append({
            "indice": i,
            "testo": p,
            "startMs": captions[idx[0]]["startMs"],
            "endMs": captions[idx[-1]]["endMs"],
        })

    Path(a.out).write_text(
        json.dumps({"durataMs": durata_ms, "paragrafi": out_par, "captions": captions}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Fatto: {a.out} | durata {durata_ms / 1000:.1f} s | {len(copione)} parole, "
          f"{allineate} riconosciute esatte da Whisper")
    for p in out_par:
        print(f"  paragrafo {p['indice'] + 1}: {p['startMs'] / 1000:6.2f}s -> {p['endMs'] / 1000:6.2f}s  {p['testo'][:60]}")


if __name__ == "__main__":
    main()
