# Reel 03 — "Cancellare una API key da GitHub non basta"

Reel verticale (1080×1920, 30 fps, 30 s) sulla sicurezza delle chiavi API: storia dei commit, cambiare la chiave, `.env`, `.gitignore`, frontend.
Il regalo è [`strumenti/sicurezza/controlla-segreti.py`](../strumenti/sicurezza/controlla-segreti.py): l'uscita che si vede nel video è quella vera, presa su un repository di prova con una chiave finta.

| File | Cosa contiene |
|---|---|
| `copione.txt` | Il testo del narratore: 6 paragrafi, uno per scena |
| `public/voce.wav` | La voce (Gemini `it-it-podcaster-1`, 29,4 s) |
| `public/suoni/` | Musica ed effetti, generati con `strumenti/suoni/genera_suoni.py` |
| `src/tempi.json` | Tempi di ogni parola (da `tempi.py`) |
| `src/Reel03.tsx` | Il montaggio: 6 scene, sottotitoli ("punto env" diventa `.env`), loop sul primo fotogramma |
| `src/Copertina.tsx` | La copertina per la griglia del profilo (sicura nel ritaglio 3:4) |
| `didascalia.txt` | Didascalia: 5 regole, la fonte del "meno di un minuto", lo script, il prompt per Claude Code |

Le chiavi a schermo sono finte e mascherate (`AIzaSy•••`): non hanno il formato di una chiave vera, così né GitHub né `controlla-segreti.py` le segnalano.

## Anteprima e render

```powershell
npm install
```
```powershell
npx remotion studio
```
```powershell
npx remotion render ChiaviApi out\chiavi-api.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=128k
```
```powershell
npx remotion still Copertina out\copertina.png
```

Se rigeneri la voce, aggiorna i tempi in cima a `src/Reel03.tsx` (`S`, `NON_BASTA`, `BOT`, `MINUTO`, `REGOLE`…): `tempi.py` stampa l'inizio di ogni paragrafo.

Fonti dei fatti nel copione e nella didascalia:
- chiave AWS su GitHub usata in meno di un minuto: [Comparitech](https://comparitech.com/blog/information-security/github-honeypot);
- variabili `VITE_` nel codice del browser: [documentazione di Vite](https://vite.dev/guide/env-and-mode);
- protezione di GitHub sui repository pubblici: [GitHub blog](https://github.blog/news-insights/product-news/keeping-secrets-out-of-public-repositories/).
