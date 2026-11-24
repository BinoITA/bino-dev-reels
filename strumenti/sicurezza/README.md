# controlla-segreti.py

Controlla un progetto prima del push. Gira sul tuo computer, non manda niente a nessuno e usa solo Python 3, quindi non c'è niente da installare.
È stato fatto con Claude per il reel 03 di @bino.devs. Licenza MIT.

| Controllo | Cosa cerca |
|---|---|
| 1. Chiavi nei file | Chiavi di Anthropic, OpenAI, Google/Gemini, GitHub, AWS, Stripe, Slack, Hugging Face, chiavi private |
| 2. Storia dei commit | Le stesse chiavi in qualsiasi commit passato: cancellarle dal file non le toglie dalla storia |
| 3. File `.env` | Che i `.env` siano esclusi da git e non siano mai stati caricati |
| 4. Frontend | Variabili come `VITE_..._KEY` o `NEXT_PUBLIC_..._SECRET`, che finiscono nel codice del browser |

Le chiavi trovate non vengono mai stampate per intero.

## Uso

Dalla cartella del progetto. Su Windows si usa `python`, sul Mac `python3`.

**Controllo completo, storia compresa:**

```powershell
python controlla-segreti.py
```

**Solo i file, senza la storia (più veloce):**

```powershell
python controlla-segreti.py --senza-storia
```

**Controllo automatico prima di ogni commit:** il commit viene bloccato se c'è una chiave nei file in arrivo.

```powershell
python controlla-segreti.py --installa-hook
```

Codice di uscita: 0 se è tutto pulito, 1 se ci sono problemi.

Per gli esempi finti nella documentazione, una riga che contiene `controlla-segreti: ignora` viene saltata.

**Se trova una chiave:** cambiala dal sito del servizio, cioè revocala e creane una nuova. Cancellarla dal file o dalla storia non basta, perché chi l'ha copiata ce l'ha ancora.

**Limiti:** non è una garanzia, riconosce i formati di chiave più diffusi. Per controlli più completi c'è [gitleaks](https://github.com/gitleaks/gitleaks).

## Lo usiamo anche noi

Prima di ogni push sul repository pubblico `bino-dev-reels`, al posto del controllo a mano con grep.
