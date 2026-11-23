# Reel 02 — "10 stili di animazione con Claude"

Reel verticale (1080×1920, 30 fps, 20,5 s): lo stesso razzo che decolla, ridisegnato in 10 stili. Tutto in codice: Remotion, SVG, voce Gemini, suoni generati.

| File | Cosa contiene |
|---|---|
| `copione.txt` | Il testo del narratore: un paragrafo per scena (gancio, 10 stili, finale) |
| `public/voce.wav` | La voce (Gemini `it-it-podcaster-1`) |
| `public/suoni/` | Musica ed effetti, generati con `strumenti/suoni/genera_suoni.py` |
| `src/tempi.json` | Tempi di ogni parola (da `tempi.py`): sottotitoli e tagli |
| `src/razzi.tsx` | **I 10 stili del razzo**: un componente SVG per stile |
| `src/Reel02.tsx` | Il montaggio: titolo, lista 1-10, palco, griglia finale, audio |
| `src/Copertina.tsx` | La copertina per la griglia del profilo (sicura nel ritaglio 3:4) |
| `didascalia.txt` | Didascalia con i 10 prompt |

## Anteprima e render

```powershell
npm install
```
```powershell
npx remotion studio
```
```powershell
npx remotion render DieciStili out\dieci-stili.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=128k
```
```powershell
npx remotion still Copertina out\copertina.png
```

Se rigeneri la voce, aggiorna `INIZI`, `GRIGLIA` e gli altri tempi in cima a `src/Reel02.tsx`: `tempi.py` stampa l'inizio di ogni paragrafo.
