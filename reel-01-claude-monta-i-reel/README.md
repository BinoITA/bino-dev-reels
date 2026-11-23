# Reel 01 — "Claude monta i reel"

Reel verticale (1080×1920, 30 fps) fatto interamente con il codice: Remotion + voce Gemini + sottotitoli,
musica ed effetti sonori generati.

Ci sono due versioni:

| Composizione | Stile | Durata | Codice |
|---|---|---|---|
| **`ClaudeMontaIReelV2`** (quella pubblicata) | Editoriale chiaro: carta, testo nero, evidenziatore verde | 19,5 s | `src/v2/` |
| `ClaudeMontaIReel` (prima versione) | Scuro da editor di codice | 30 s | `src/Reel.tsx`, `src/scene/` |

Le anteprime di stile usate per scegliere la grafica sono in `src/anteprime/` (cartella "Anteprime-v2" in Studio).

## File della v2

| File | Cosa contiene |
|---|---|
| `copione-v2.txt` | Il testo del narratore: un paragrafo per ogni scena |
| `public/v2/voce.wav` | La voce (Gemini TTS, voce `it-it-podcaster-1`) |
| `public/v2/suoni/` | Musica ed effetti, generati con `strumenti/suoni/genera_suoni.py` |
| `src/v2/tempi.json` | Tempi di ogni parola (sottotitoli e tagli delle scene) |
| `src/v2/volume.json` | Volume della voce per ogni frame (fa muovere l'onda sonora) |
| `src/v2/ReelV2.tsx` | Tutto il montaggio: 6 scene, passi 1-4, sottotitoli, audio |
| `didascalia.txt` | La didascalia del reel, con il prompt dato a Claude |

## Anteprima e render

```bash
npm install
npx remotion studio
npx remotion render ClaudeMontaIReelV2 out/reel-v2.mp4 --crf=18
```

## Rifare voce, tempi e suoni

Dalla cartella `strumenti/voce-narratore` (vedi il suo README per l'installazione):

```bash
python narra.py -m gemini -f ../../reel-01-claude-monta-i-reel/copione-v2.txt -o ../../reel-01-claude-monta-i-reel/public/v2/voce.wav
python tempi.py ../../reel-01-claude-monta-i-reel/public/v2/voce.wav ../../reel-01-claude-monta-i-reel/copione-v2.txt -o ../../reel-01-claude-monta-i-reel/src/v2/tempi.json
python ../suoni/genera_suoni.py ../../reel-01-claude-monta-i-reel/public/v2/suoni --durata 20 --bpm 96
python ../suoni/genera_suoni.py --inviluppo ../../reel-01-claude-monta-i-reel/public/v2/voce.wav -o ../../reel-01-claude-monta-i-reel/src/v2/volume.json
```

`tempi.py` stampa quando inizia ogni paragrafo: se le pause cambiano, aggiorna l'oggetto `S`
(inizio delle scene, in frame) in cima a `src/v2/ReelV2.tsx`.
