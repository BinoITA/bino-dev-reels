# © 2026 BinoITA (bino.dev, @bino.devs) — licenza MIT — https://github.com/BinoITA/bino-dev-reels
"""Narratore bino.dev: trasforma un copione in un file audio con una voce AI in italiano.

Due motori:
  kokoro  -> in locale, gratis, senza limiti (ideale per le prove)
  gemini  -> online (Google), voci italiane native, molto più naturale;
             piano gratuito con poche richieste al giorno: usalo per la versione finale.

Esempi:
    python narra.py "Ciao, questo è bino.dev" -o prova.wav
    python narra.py -f copione.txt -v im_nicola -s 1.1 -o voce.wav
    python narra.py -m gemini -f copione.txt -o finale.wav
    python narra.py -m gemini -f copione.txt --stile "calm and mysterious" -o finale.wav
    python narra.py --voci            (voci Kokoro)
    python narra.py -m gemini --voci  (voci italiane Gemini)

Nel copione una riga vuota fa da paragrafo (pausa del narratore).
Con Kokoro le parole lette male si correggono in pronuncia.json (es. "Claude" -> "Clod").
La chiave Gemini si legge da GEMINI_API_KEY in un file .env (cercato risalendo le cartelle).
"""

import argparse
import base64
import json
import re
import sys
from pathlib import Path

CARTELLA = Path(__file__).resolve().parent
MODELLO = CARTELLA / "modelli" / "kokoro-v1.0.onnx"
VOCI = CARTELLA / "modelli" / "voices-v1.0.bin"
PRONUNCIA = CARTELLA / "pronuncia.json"

# voce ufficiale di bino.dev: Gemini podcaster-1 con stile ironico da reel
# (Kokoro if_sara è la "controfigura" femminile per le prove)
VOCE_DEFAULT = {"kokoro": "if_sara", "gemini": "it-it-podcaster-1"}
STILE_DEFAULT = "energetic, slightly ironic, fast social-media pace"
MODELLO_GEMINI = "gemini-3.8-flash-tts"


# ---------------------------------------------------------------- Kokoro (locale)

def correggi_pronuncia(testo: str) -> str:
    """Sostituisce le parole di pronuncia.json (es. Claude -> Clod) prima della sintesi."""
    if not PRONUNCIA.exists():
        return testo
    regole = {k: v for k, v in json.loads(PRONUNCIA.read_text(encoding="utf-8")).items()
              if not k.startswith("_")}
    # prima le parole più lunghe, così "reels" non viene preso da "reel"
    for scritto in sorted(regole, key=len, reverse=True):
        testo = re.sub(rf"(?<!\w){re.escape(scritto)}(?!\w)", regole[scritto], testo, flags=re.IGNORECASE)
    return testo


def carica_kokoro():
    from kokoro_onnx import Kokoro
    if not MODELLO.exists() or not VOCI.exists():
        sys.exit(f"Mancano i file del modello in {MODELLO.parent}. Vedi README.md.")
    return Kokoro(str(MODELLO), str(VOCI))


def narra_kokoro(testo: str, voce: str, velocita: float, pausa: float, out: Path) -> float:
    import numpy as np
    import soundfile as sf

    kokoro = carica_kokoro()
    testo = correggi_pronuncia(testo)
    paragrafi = [p.strip() for p in testo.replace("\r\n", "\n").split("\n\n") if p.strip()]
    pezzi, sr = [], 24000
    for i, par in enumerate(paragrafi):
        audio, sr = kokoro.create(" ".join(par.split()), voice=voce, speed=velocita, lang="it")
        pezzi.append(audio)
        if i < len(paragrafi) - 1:
            pezzi.append(np.zeros(int(sr * pausa), dtype=audio.dtype))
    audio = np.concatenate(pezzi)
    sf.write(out, audio, sr)
    return len(audio) / sr


# ---------------------------------------------------------------- Gemini (online)

def client_gemini():
    from dotenv import find_dotenv, load_dotenv
    from google import genai

    # cerca il .env risalendo le cartelle fino alla radice del progetto
    load_dotenv(find_dotenv(str(CARTELLA / ".env")) or find_dotenv(usecwd=True))
    try:
        return genai.Client(http_options={"api_version": "v1beta"})
    except Exception as e:
        sys.exit(f"Chiave Gemini non trovata: metti GEMINI_API_KEY in un file .env nella radice del progetto. ({e})")


def narra_gemini(testo: str, voce: str, stile: str | None, modello: str, out: Path) -> float:
    client = client_gemini()
    # paragrafi: il testo resta parola per parola, la riga vuota diventa una pausa
    paragrafi = [" ".join(p.split()) for p in testo.replace("\r\n", "\n").split("\n\n") if p.strip()]
    blocco = {"type": "text", "text": " <short pause> ".join(paragrafi)}
    if stile:
        blocco["annotations"] = [{"type": "speech_metadata", "style": stile}]
    try:
        r = client.interactions.create(
            model=modello,
            input=[{"type": "user_input", "content": [blocco]}],
            response_format={"type": "audio"},
            generation_config={"speech_config": [{"voice": voce}]},
        )
    except Exception as e:
        msg = str(e)
        if "429" in msg or "RESOURCE_EXHAUSTED" in msg:
            sys.exit("Limite giornaliero di Gemini raggiunto: riprova domani, o usa -m kokoro per le prove.")
        sys.exit(f"Errore Gemini: {msg[:500]}")
    import soundfile as sf

    out.write_bytes(base64.b64decode(r.output_audio.data))  # WAV 24 kHz mono 16 bit
    return sf.info(out).duration


def voci_gemini():
    client = client_gemini()
    r = client.voices.list(language_code=["it-IT"], page_size=100)
    for v in getattr(r, "voices", None) or []:
        print(f"{v.id:24} {v.gender:7} {v.pitch:7} {v.description}")


# ---------------------------------------------------------------- main

def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Copione -> audio con voce AI in italiano")
    ap.add_argument("testo", nargs="?", help="testo da leggere (oppure usa -f)")
    ap.add_argument("-f", "--file", help="file .txt con il copione (UTF-8)")
    ap.add_argument("-m", "--motore", choices=["kokoro", "gemini"], default="kokoro",
                    help="kokoro = locale e illimitato; gemini = online, più naturale (default kokoro)")
    ap.add_argument("-v", "--voce", help="voce (default: if_sara per kokoro, it-it-podcaster-1 per gemini)")
    ap.add_argument("-o", "--out", default="voce.wav", help="file di uscita .wav (default voce.wav)")
    ap.add_argument("--voci", action="store_true", help="elenca le voci del motore scelto ed esce")
    k = ap.add_argument_group("solo kokoro")
    k.add_argument("-s", "--velocita", type=float, default=1.0, help="velocità, 0.5-2.0 (default 1.0)")
    k.add_argument("-p", "--pausa", type=float, default=0.4, help="secondi di pausa tra paragrafi (default 0.4)")
    g = ap.add_argument_group("solo gemini")
    g.add_argument("--stile", default=STILE_DEFAULT,
                   help=f'tono della lettura (default "{STILE_DEFAULT}"); --stile "" per nessuno')
    g.add_argument("--modello", default=MODELLO_GEMINI, help=f"modello TTS (default {MODELLO_GEMINI})")
    a = ap.parse_args()

    if a.voci:
        if a.motore == "gemini":
            voci_gemini()
        else:
            tutte = sorted(carica_kokoro().get_voices())
            print("Voci italiane:", ", ".join(v for v in tutte if v.startswith(("if_", "im_"))))
            print("Tutte le voci:", ", ".join(tutte))
        return

    if a.file:
        testo = Path(a.file).read_text(encoding="utf-8")
    elif a.testo:
        testo = a.testo
    else:
        ap.error("serve un testo oppure -f copione.txt")
    if not testo.strip():
        sys.exit("Il testo è vuoto.")

    voce = a.voce or VOCE_DEFAULT[a.motore]
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if a.motore == "gemini":
        durata = narra_gemini(testo, voce, a.stile, a.modello, out)
    else:
        durata = narra_kokoro(testo, voce, a.velocita, a.pausa, out)
    print(f"Fatto: {out} ({durata:.1f} s, {a.motore}, voce {voce})")


if __name__ == "__main__":
    main()
