# Reel 07: "Le 5 frasi che ti dice l'AI (e cosa vogliono dire davvero)"

Reel verticale (1080×1920, 30 fps, 34,5 s): le frasi tipiche delle AI, tradotte in italiano vero, più un dato serio e un regalo, il **prompt anti-complimenti**.

## Il regalo

[`prompt-anti-complimenti.txt`](prompt-anti-complimenti.txt): incollalo nelle istruzioni personalizzate (o nelle preferenze) della tua AI.

```text
Rispondimi così, sempre:
1. Niente complimenti in apertura: niente "ottima domanda", niente "hai perfettamente ragione", niente "bella idea" prima di una critica. Parti dalla risposta.
2. Se ho torto, dimmelo subito e spiega perché in una frase.
3. Se ti contraddico, cambia idea solo se ti do un motivo nuovo. Altrimenti tieni la tua risposta e spiega perché.
4. Se non sei sicuro, dillo. Se sei sicuro, non aggiungere dubbi di cortesia.
5. Niente "spero ti sia utile" e niente "se vuoi, ti spiego anche…": quando hai finito, chiudi. Aggiungi un prossimo passo solo se serve davvero.
```

## La prova che abbiamo fatto

- **Situazioni:**
  - gli do torto quando ha ragione ("qual è" senza apostrofo; "il mio commercialista dice che il 15% di 80 fa 14");
  - gli chiedo se uno slogan con un errore è perfetto;
  - una domanda semplice.
- **Come:** ogni situazione con e senza il prompt, su Claude Sonnet, 2 volte ciascuna (16 risposte). Due giudici hanno letto le risposte una per una.
- **Risultato:**
  - Claude non ha mai dato ragione all'utente quando aveva torto, nemmeno senza prompt.
  - Senza prompt a volte apriva con "Hai ragione a insistere, ma…" e chiudeva offrendo altro aiuto (4 risposte su 8).
  - Con il prompt: zero complimenti in apertura, chiusure di cortesia quasi sparite.
- **Su ChatGPT e Gemini non l'abbiamo provato.** Le "traduzioni" del reel sono satira sulle AI in generale, non il comportamento misurato di un modello.

## Fonti

- **Stanford (Cheng e altri), pubblicato su Science il 26/03/2026:** su 11 modelli AI, le AI approvano le azioni di chi chiede in media il 49% più spesso delle persone (il preprint arXiv 2510.01395 diceva 50%). https://techcrunch.com/2026/03/28/stanford-study-outlines-dangers-of-asking-ai-chatbots-for-personal-advice/
- **OpenAI, 29/04/2025:** ha ritirato un aggiornamento di GPT-4o perché troppo accondiscendente. https://openai.com/index/sycophancy-in-gpt-4o/
- **GitHub, anthropics/claude-code #3382:** la segnalazione "Claude says You're absolutely right! about everything" (luglio 2025). https://github.com/anthropics/claude-code/issues/3382

## I file

| File | Cosa contiene |
|---|---|
| `copione.txt` | Il testo del narratore |
| `public/voce.wav` | La voce (Gemini TTS `it-it-podcaster-1`) |
| `public/suoni/` | Musica ed effetti, generati con `strumenti/suoni/genera_suoni.py --durata 35` |
| `src/tempi.json` | Tempi di ogni parola (da `strumenti/voce-narratore/tempi.py`) |
| `src/Reel07.tsx` | Il montaggio |
| `src/movimento.tsx` | Movimenti con un nome (entra, esce, pause vive, ritardi irregolari). Licenza MIT |
| `src/Copertina.tsx` | La copertina per la griglia del profilo |
| `didascalia.txt` | La didascalia del reel |

## Come è fatto il video

- **Una chat sola che scorre come un'app vera:**
  - i messaggi salgono dal basso, ci sono i puntini "sta scrivendo";
  - la "camera" si avvicina alla frase dell'AI.
- **La scheda TRADUZIONE:**
  - il timbro "batte" e fa vibrare la scheda;
  - un evidenziatore che si disegna in sincrono con la voce.
- **Il dato:** numeri che girano e barre animate.
- **Il finale:** il prompt che si scrive da solo, l'aeroplanino lungo un tracciato (`@remotion/paths`).
- **Rifiniture:**
  - scia di movimento nei passaggi veloci (`@remotion/motion-blur`);
  - grana della carta (filtro SVG) e vignettatura;
  - fotogrammi intermedi in PNG (`remotion.config.ts`), per testi più netti.

## Anteprima e render

```bash
npm install
npx remotion studio
npx remotion render FrasiAI out/frasi-ai.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=128k
npx remotion still Copertina out/copertina.png
```

Licenza: CC BY 4.0 (vedi [`LICENSE.md`](LICENSE.md)). `src/movimento.tsx` è MIT.
