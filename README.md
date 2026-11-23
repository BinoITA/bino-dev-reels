# bino.dev — il codice dei reel

Qui c'è **tutto il codice** dei reel di [@bino.devs](https://www.instagram.com/bino.devs/) su Instagram.
Niente "commenta per ricevere": prendi, usa, modifica.

> **Gratis, ma con i crediti.** Se usi questi reel o il loro codice (anche modificati, anche nei tuoi video)
> **devi citare bino.dev**, per esempio nella didascalia:
> *"Basato sul reel di @bino.devs (bino.dev) — github.com/BinoITA/bino-dev-reels — CC BY 4.0"*.
> Dettagli in [`LICENSE.md`](LICENSE.md).

Ogni reel è fatto interamente con il codice:

- **video**: [Remotion](https://www.remotion.dev) (React), scritto da Claude Code
- **voce**: Gemini TTS (piano gratuito) oppure [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) in locale
- **sottotitoli parola per parola**: [faster-whisper](https://github.com/SYSTRAN/faster-whisper) in locale, allineato al copione
- **musica ed effetti sonori**: generati col codice (numpy), quindi senza problemi di licenza

## Reel

| # | Reel | Cartella |
|---|---|---|
| 01 | Claude monta i reel | [`reel-01-claude-monta-i-reel`](reel-01-claude-monta-i-reel) |
| 02 | 10 stili di animazione con Claude | [`reel-02-dieci-stili`](reel-02-dieci-stili) |

## Come si usa

Ti servono [Node.js](https://nodejs.org) (20 o più) e, per la voce, Python 3.10+.

**1. Il video**

```bash
cd reel-01-claude-monta-i-reel
npm install
npx remotion studio          # anteprima nel browser
npx remotion render ClaudeMontaIReelV2 out/reel.mp4   # crea l'MP4
```

**2. Le skill di Remotion per Claude Code** (consigliate se vuoi far modificare il video a Claude)

```bash
npx skills add remotion-dev/skills
```

**3. Voce, tempi delle parole, musica ed effetti** (solo se cambi il copione)

```bash
cd strumenti/voce-narratore
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Poi vedi [`strumenti/voce-narratore/README.md`](strumenti/voce-narratore/README.md).
Musica ed effetti: [`strumenti/suoni/genera_suoni.py`](strumenti/suoni/genera_suoni.py) (stesso ambiente Python).
Per Gemini serve una chiave gratuita di [Google AI Studio](https://aistudio.google.com) in un file `.env`
nella radice del repository (copia `.env.example`).

## Licenze e crediti

- **Reel** (`reel-*/`: scene, grafica, copioni, voce, musica): **CC BY 4.0**. Puoi usarli anche per guadagnare, ma **devi citare bino.dev** in modo visibile.
- **Strumenti** (`strumenti/`): **MIT**. Va lasciata la nota di copyright in ogni copia del codice.
- Nome **bino.dev** e logo **`<b/>`**: non inclusi nelle licenze.
- Come dare i crediti, con righe pronte da copiare: [`LICENSE.md`](LICENSE.md).
- **Remotion** ha una sua licenza: gratis per singoli e team fino a 3 persone,
  a pagamento per aziende più grandi. Leggila su https://www.remotion.dev/license.
- La voce dei reel è generata con AI.
