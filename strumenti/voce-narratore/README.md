# Voce narratore

Due script Python:

- **`narra.py`**: copione → file audio con una voce AI in italiano
- **`tempi.py`**: audio + copione → tempi di ogni parola (JSON nel formato `Caption` di `@remotion/captions`)

## Installazione

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Per **Kokoro** (locale) scarica in `modelli/` i due file della
[release model-files-v1.0](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0):
`kokoro-v1.0.onnx` (310 MB) e `voices-v1.0.bin` (27 MB).

Per **Gemini** metti `GEMINI_API_KEY=...` in un file `.env` nella radice del repository
(chiave gratuita su https://aistudio.google.com).

## narra.py

| Motore | Dove gira | Qualità | Limiti |
|---|---|---|---|
| `kokoro` (default) | in locale, CPU | discreta | nessuno |
| `gemini` | online (Google) | ottima, 50+ voci italiane native | piano gratuito con poche richieste al giorno |

```bash
python narra.py -f copione.txt -o prova.wav                 # Kokoro, per le prove
python narra.py -m gemini -f copione.txt -o finale.wav      # Gemini, versione finale
python narra.py -m gemini --voci                            # elenca le voci italiane
```

Opzioni utili: `-v VOCE`, `--stile "calm and mysterious"` (Gemini), `-s 1.1` velocità (Kokoro).
Nel copione **una riga vuota = nuovo paragrafo** (pausa del narratore).
`pronuncia.json` corregge le parole che Kokoro legge male (es. "Claude" → "Clod").

## tempi.py

```bash
python tempi.py voce.wav copione.txt -o tempi.json
```

Whisper (modello `small`, CPU) ascolta l'audio e trova inizio e fine di ogni parola; il **testo**
dei sottotitoli però viene dal copione, così è sempre scritto giusto.
Stampa anche l'inizio di ogni paragrafo, utile per tagliare le scene.
