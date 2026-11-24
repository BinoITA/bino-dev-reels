# Reel 04: "Fanno pagare 79 euro per questo. Te lo smonto gratis."

Cartone 3D verticale, 1080×1920 a 30 fps, 29 secondi.
È fatto solo di codice: forme base di Three.js dentro Remotion (`@remotion/three`), niente Blender e niente modelli scaricati.

## Perché esiste

C'è chi vende a 79 € un corso per fare cartoni 3D con Claude.
Noi mostriamo il metodo gratis, con un personaggio e un mondo nostri: niente del loro video viene copiato.

## I file

| File | Cosa contiene |
|---|---|
| `copione.txt` | Il testo del narratore: 6 paragrafi |
| `public/voce.wav` | La voce (Gemini `it-it-podcaster-1`, 28,2 s) |
| `public/suoni/` | Musica ed effetti generati con `strumenti/suoni/genera_suoni.py` |
| `src/mondo.tsx` | **Bino** e **la piazzetta**: solo cubi arrotondati, cilindri, capsule, sfere, coni. Luci "diorama al tramonto" |
| `src/anima.ts` | Animazione da cartone come funzioni del frame: camminata con peso, schiaccia e allunga, anticipazione, antenna che oscilla, ciglia, saluto, salto, esploso |
| `src/Reel04.tsx` | Il montaggio: telecamera per inquadrature, recitazione di Bino, etichette che seguono i pezzi 3D, codice, adesivi, sottotitoli |
| `src/Copertina.tsx` | La copertina (titolo dentro il ritaglio 3:4) |
| `inquadra.mjs` | Calcola dove mettere la telecamera perché il personaggio stia tra i titoli e i sottotitoli |
| `didascalia.txt` | Didascalia con il prompt per partire |

## Come è stato reso "bello"

Le scelte vengono da quattro ricerche fatte con agenti:

- **Personaggio "chibi":**
  - testa grande e forme arrotondate (`RoundedBoxGeometry`, `CapsuleGeometry`);
  - contorno da fumetto solo sull'eroe (stessa forma, più grande, vista dall'interno);
  - faccia su uno schermo, con tre espressioni e la lampadina-antenna come firma.
- **Animazione con i principi classici:**
  - fase unica per la camminata;
  - volume costante quando schiaccia e allunga;
  - anticipazione prima dei gesti;
  - antenna che oscilla in ritardo;
  - battiti di ciglia a intervalli naturali;
  - esploso coreografato.

  Tutto è calcolato dal frame, mai da `useFrame` o da numeri casuali.
- **Luci:**
  - sole caldo con ombre morbide;
  - luce fredda di contorno;
  - cielo e terra di colori diversi;
  - tone mapping ACES;
  - niente post-produzione 3D, che è rischiosa in Remotion; la vignettatura è un overlay 2D.
- **Telecamera:**
  - inquadrature con easing;
  - teleobiettivo (fov 22) sull'esploso, così lo sfondo disturba meno;
  - posizioni calcolate con `inquadra.mjs`.

## Anteprima e render

```powershell
npm install
```
```powershell
npx remotion studio
```
```powershell
npx remotion render Cartoni3D out\cartoni-3d.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=128k
```
```powershell
npx remotion still Copertina out\copertina.png
```

Il 3D ha bisogno di WebGL nel browser che fa il render: `remotion.config.ts` imposta `Config.setChromiumOpenGlRenderer("angle")`.
Il render completo richiede circa 10 minuti.
