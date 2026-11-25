# Reel 05: "Smetti di pagare queste 3 app"

Reel verticale (1080×1920, 30 fps, 31 s): 3 app che la gente paga, rifatte gratis con Claude.
Le app sono vere e stanno in `app/`, un file HTML ciascuna.

| App | Cosa fa |
|---|---|
| `app/qr.html` | QR code **statico**: il link è dentro il disegno, quindi non scade. Colori a scelta, PNG da 1200 px e SVG, avviso se il contrasto è basso. Libreria `qrcode-generator` (MIT) da jsDelivr |
| `app/pdf.html` | Unisce PDF e foto JPG/PNG in un solo PDF, nell'ordine scelto. Tutto nel browser, nessun caricamento. Libreria `pdf-lib` (MIT) da jsDelivr |
| `app/spese.html` | Divide le spese: conti in centesimi, il minimo di bonifici per andare pari, salvataggio nel browser. "Copia il riepilogo" dà il testo per il gruppo. Il link con i dati compare solo se la pagina è su un sito pubblico (https) |

| File del reel | Cosa contiene |
|---|---|
| `copione.txt` | Il testo del narratore: 6 paragrafi, uno per scena |
| `public/voce.wav` | La voce (Gemini `it-it-podcaster-1`, 30,6 s) |
| `public/suoni/` | Musica ed effetti, generati con `strumenti/suoni/genera_suoni.py --durata 31` |
| `src/tempi.json` | Tempi di ogni parola (da `tempi.py`) |
| `src/Reel05.tsx` | Il montaggio: 6 scene, le app ricostruite con gli stessi testi e conti, QR vero (porta al GitHub pubblico), loop sul primo fotogramma |
| `src/Copertina.tsx` | La copertina per la griglia del profilo (sicura nel ritaglio 3:4) |
| `didascalia.txt` | Didascalia con le 3 app spiegate e i 3 prompt |

## Provare le app

Basta aprire il file con il browser. Per provarle come su un sito: `python -m http.server 8765 --directory app`, poi `http://localhost:8765/qr.html`.

## Anteprima e render

```powershell
npm install
```
```powershell
npx remotion studio
```
```powershell
npx remotion render AppGratis out\app-gratis.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=128k
```
```powershell
npx remotion still Copertina out\copertina.png
```

Se rigeneri la voce, aggiorna i tempi in cima a `src/Reel05.tsx` (`S`, `GRATIS`, `SCADERE`, `NON_SCADE`…): `tempi.py` stampa l'inizio di ogni paragrafo.

Fonti dei fatti nel copione e nella didascalia:
- i QR dinamici creati durante la prova di 14 giorni vengono disattivati, quelli statici no: [QR Code Generator, assistenza](https://support.qr-code-generator.com/hc/en-us/articles/7665013224205);
- limite giornaliero di spese nella versione gratuita di Splitwise (3-4 al giorno, secondo recensioni e segnalazioni degli utenti): [Money Crashers](https://www.moneycrashers.com/splitwise-review/). Nel video non si nomina nessun servizio.
