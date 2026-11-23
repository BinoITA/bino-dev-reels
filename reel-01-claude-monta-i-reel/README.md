# Reel 01 — "Claude monta i reel"

Reel verticale (1080×1920, 30 fps, 30 s) fatto interamente con il codice: Remotion + voce Gemini + sottotitoli generati.

| File | Cosa contiene |
|---|---|
| `copione.txt` | Il testo del narratore: un paragrafo per ogni scena |
| `public/voce.wav` | La voce (Gemini TTS, voce `it-it-podcaster-1`) |
| `src/tempi.json` | Tempi di ogni parola, usati per i sottotitoli e per i tagli |
| `src/Reel.tsx` | Il montaggio: scene, voce, sottotitoli |
| `src/scene/` | Le 5 scene: Gancio, NienteDaCommentare, Catena, Regista, Chiusura |
| `didascalia.txt` | La didascalia del reel, con il prompt dato a Claude |

## Anteprima e render

```bash
npm install
npx remotion studio
npx remotion render ClaudeMontaIReel out/claude-monta-i-reel.mp4 --crf=18
```

## Cambiare il copione

Dalla cartella `strumenti/voce-narratore` (vedi il suo README per l'installazione):

```bash
python narra.py -m gemini -f ../../reel-01-claude-monta-i-reel/copione.txt -o ../../reel-01-claude-monta-i-reel/public/voce.wav
python tempi.py ../../reel-01-claude-monta-i-reel/public/voce.wav ../../reel-01-claude-monta-i-reel/copione.txt -o ../../reel-01-claude-monta-i-reel/src/tempi.json
```

`tempi.py` stampa quando inizia ogni paragrafo: se le pause cambiano, aggiorna `from` e
`durationInFrames` delle scene in `src/Reel.tsx` (secondi × 30 = frame).

## Il prompt

Il prompt dato a Claude Code è in [`didascalia.txt`](didascalia.txt). Le skill ufficiali di Remotion
(`npx skills add remotion-dev/skills`) aiutano Claude a seguire le buone pratiche.
