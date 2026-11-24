#!/usr/bin/env python3
# © 2026 BinoITA (bino.dev, @bino.devs) — MIT. Se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels".
"""
controlla-segreti.py - controlla un progetto prima del push: chiavi API nei file,
chiavi rimaste nella storia dei commit, file .env caricati su git e chiavi che
finirebbero nel codice del browser (frontend).

Gira sul tuo computer, non manda niente a nessuno, usa solo Python 3 (nessuna
installazione). Le chiavi trovate non vengono mai stampate per intero.

Cosa controlla
  1. CHIAVI NEI FILE      chiavi di Anthropic, OpenAI, Google/Gemini, GitHub, AWS,
                          Stripe, Slack, Hugging Face e chiavi private nei file del progetto.
  2. STORIA DEI COMMIT    le stesse chiavi in qualsiasi commit passato: cancellarle
                          dal file non le toglie dalla storia.
  3. FILE .ENV            che i .env siano esclusi da git e non siano mai stati caricati.
  4. FRONTEND             variabili come VITE_..._KEY o NEXT_PUBLIC_..._SECRET: quelle
                          finiscono nel codice che scarica il browser, cioè sono pubbliche.

Se trova una chiave: CAMBIALA (revocala e creane una nuova) dal sito del servizio.
Cancellarla dal file o dalla storia non basta, perché chi l'ha copiata ce l'ha ancora.

Uso (dalla cartella del progetto; su Windows "python", sul Mac "python3")
  python controlla-segreti.py                 # tutto il progetto, storia compresa
  python controlla-segreti.py percorso/progetto
  python controlla-segreti.py --senza-storia  # più veloce, salta la storia dei commit
  python controlla-segreti.py --staged        # solo i file pronti per il commit
  python controlla-segreti.py --installa-hook # lo esegue da solo prima di ogni commit

Una riga che contiene "controlla-segreti: ignora" viene saltata (utile per esempi finti
nella documentazione). Codice di uscita: 0 tutto pulito, 1 problemi trovati.

Non è un antivirus né una garanzia: riconosce i formati di chiave più diffusi. Per
controlli più completi esiste gitleaks (https://github.com/gitleaks/gitleaks).
"""

import argparse
import os
import re
import subprocess
import sys

IGNORA = "controlla-segreti: ignora"
MAX_BYTE = 2_000_000
CARTELLE_SALTATE = {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build",
                    ".next", "out", ".cache", "coverage", "vendor"}

# (nome, espressione). L'ordine conta: le più specifiche prima.
CHIAVI = [
    ("chiave Anthropic", r"sk-ant-[A-Za-z0-9_\-]{20,}"),
    ("chiave OpenAI", r"sk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_\-]{32,}"),
    ("chiave Google / Gemini", r"AIza[0-9A-Za-z_\-]{35}"),
    ("token GitHub", r"(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})"),
    ("chiave AWS", r"(?:AKIA|ASIA)[0-9A-Z]{16}"),
    ("chiave Stripe", r"(?:sk|rk)_live_[0-9A-Za-z]{20,}"),
    ("token Slack", r"xox[abprs]-[0-9A-Za-z\-]{10,}"),
    ("token Hugging Face", r"hf_[A-Za-z0-9]{30,}"),
    ("chiave privata", r"-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----"),
]
CHIAVI_RE = [(n, re.compile(e)) for n, e in CHIAVI]
# Assegnazioni sospette: api_key = "…lungo…". Solo avviso, possono essere falsi allarmi.
ASSEGNAZIONE_RE = re.compile(
    r"""(?i)\b[\w.-]*(?:api[_-]?key|secret|token|password|passwd)[\w.-]*\s*[:=]\s*["']([^"'\s$<{]{20,})["']""")
SEGNAPOSTO_RE = re.compile(r"(?i)(?:x{6,}|\*{4,}|your|tua|inserisci|example|esempio|changeme|placeholder|dummy|\.\.\.)")

PREFISSI_PUBBLICI = re.compile(
    r"\b((?:VITE|NEXT_PUBLIC|REACT_APP|EXPO_PUBLIC|PUBLIC|NUXT_PUBLIC|GATSBY|VUE_APP)_[A-Z0-9_]*"
    r"(?:KEY|SECRET|TOKEN|PASSWORD|PRIVATE)[A-Z0-9_]*)\b")
ENV_RE = re.compile(r"(?:^|/)\.env(?:\.[\w.-]+)?$")
ENV_ESEMPIO_RE = re.compile(r"\.(?:example|sample|template|dist|defaults)$", re.I)


def colore(testo, codice):
    if not sys.stdout.isatty() or os.environ.get("NO_COLOR"):
        return testo
    return f"\033[{codice}m{testo}\033[0m"


ROSSO, GIALLO, VERDE, GRIGIO = "31;1", "33;1", "32;1", "90"


def maschera(s):
    return s[:6] + "…" + f"({len(s)} caratteri)" if len(s) > 10 else "…"


def git(cartella, *argomenti):
    try:
        r = subprocess.run(["git", "-C", cartella, *argomenti], capture_output=True, text=True,
                           encoding="utf-8", errors="replace")
    except FileNotFoundError:
        return None
    return r.stdout if r.returncode == 0 else None


def cerca_nella_riga(riga):
    if IGNORA in riga:
        return []
    trovate = []
    for nome, rx in CHIAVI_RE:
        for m in rx.finditer(riga):
            if not any(m.start() >= a and m.end() <= b for _, _, a, b in trovate):
                trovate.append((nome, m.group(0), m.start(), m.end()))
    if not trovate:
        m = ASSEGNAZIONE_RE.search(riga)
        if m and not SEGNAPOSTO_RE.search(m.group(1)):
            trovate.append(("possibile segreto (da controllare)", m.group(1), m.start(1), m.end(1)))
    return [(n, v) for n, v, _, _ in trovate]


def file_da_controllare(cartella, in_git, solo_staged):
    if in_git:
        if solo_staged:
            out = git(cartella, "diff", "--cached", "--name-only", "--diff-filter=ACMR") or ""
        else:
            out = (git(cartella, "ls-files", "--cached", "--others", "--exclude-standard") or "")
        return [f for f in out.splitlines() if f.strip()]
    elenco = []
    for radice, cartelle, files in os.walk(cartella):
        cartelle[:] = [c for c in cartelle if c not in CARTELLE_SALTATE]
        for f in files:
            elenco.append(os.path.relpath(os.path.join(radice, f), cartella).replace(os.sep, "/"))
    return elenco


def leggi_testo(percorso):
    try:
        if os.path.getsize(percorso) > MAX_BYTE:
            return None
        with open(percorso, "rb") as f:
            dati = f.read()
    except OSError:
        return None
    if b"\0" in dati[:4096]:
        return None
    return dati.decode("utf-8", errors="replace")


def controlla_file(cartella, elenco):
    problemi, avvisi = [], []
    for rel in elenco:
        if any(p in CARTELLE_SALTATE for p in rel.split("/")[:-1]):
            continue
        testo = leggi_testo(os.path.join(cartella, rel))
        if testo is None:
            continue
        # Nel .env le chiavi ci devono stare: lì si controlla solo che il .env sia escluso da git.
        e_env = bool(ENV_RE.search(rel)) and not ENV_ESEMPIO_RE.search(rel)
        for n, riga in enumerate(testo.splitlines(), 1):
            for nome, valore in ([] if e_env else cerca_nella_riga(riga)):
                voce = f"{rel}:{n}  {nome}  {maschera(valore)}"
                (avvisi if nome.startswith("possibile") else problemi).append(voce)
            for m in PREFISSI_PUBBLICI.finditer(riga):
                if IGNORA not in riga:
                    avvisi.append(f"{rel}:{n}  {m.group(1)} finisce nel codice del browser: è pubblica")
    return problemi, avvisi


def controlla_storia(cartella):
    out = git(cartella, "log", "--all", "-p", "--no-color", "--no-ext-diff", "--unified=0",
              "--format=@@COMMIT@@ %h %ad %s", "--date=short")
    if out is None:
        return [], 0
    problemi, visti, commit, file_corrente, n_commit = [], set(), "", "", 0
    for riga in out.splitlines():
        if riga.startswith("@@COMMIT@@ "):
            commit = riga[11:]
            n_commit += 1
        elif riga.startswith("+++ "):
            file_corrente = riga[6:] if riga.startswith("+++ b/") else riga[4:]
        elif riga.startswith("+") and not riga.startswith("+++"):
            for nome, valore in cerca_nella_riga(riga[1:]):
                if nome.startswith("possibile"):
                    continue
                chiave = (valore, file_corrente)
                if chiave in visti:
                    continue
                visti.add(chiave)
                problemi.append(f"commit {commit.split(' ')[0]} ({' '.join(commit.split(' ')[1:])[:50]})\n"
                                f"      {file_corrente}  {nome}  {maschera(valore)}")
    return problemi, n_commit


def controlla_env(cartella, in_git, elenco):
    problemi, ok = [], []
    if not in_git:
        return problemi, ["non è un repository git: controllo dei .env saltato"]
    tracciati = [f for f in (git(cartella, "ls-files") or "").splitlines()
                 if ENV_RE.search(f) and not ENV_ESEMPIO_RE.search(f)]
    for f in tracciati:
        problemi.append(f"{f} è caricato su git: toglilo (git rm --cached {f}) e CAMBIA le chiavi dentro")
    storia = git(cartella, "log", "--all", "--format=", "--name-only", "--diff-filter=A") or ""
    passati = sorted({f for f in storia.splitlines() if ENV_RE.search(f) and not ENV_ESEMPIO_RE.search(f)}
                     - set(tracciati))
    for f in passati:
        problemi.append(f"{f} è stato caricato in un commit passato: le chiavi dentro vanno CAMBIATE")
    locali = []
    for radice, cartelle, files in os.walk(cartella):
        cartelle[:] = [c for c in cartelle if c not in CARTELLE_SALTATE]
        for f in files:
            rel = os.path.relpath(os.path.join(radice, f), cartella).replace(os.sep, "/")
            if ENV_RE.search(rel) and not ENV_ESEMPIO_RE.search(rel):
                locali.append(rel)
    for f in locali:
        if f in tracciati:
            continue
        if git(cartella, "check-ignore", "-q", f) is None:
            problemi.append(f"{f} NON è nel .gitignore: al prossimo 'git add .' finisce su GitHub")
        else:
            ok.append(f"{f} è escluso da git")
    if not locali and not tracciati and not passati:
        ok.append("nessun file .env nel progetto")
    return problemi, ok


def installa_hook(cartella):
    radice = (git(cartella, "rev-parse", "--show-toplevel") or "").strip()
    if not radice:
        print("Non è un repository git: niente hook da installare.")
        return 2
    hooks = (git(cartella, "rev-parse", "--git-path", "hooks") or ".git/hooks").strip()
    hooks = hooks if os.path.isabs(hooks) else os.path.join(radice, hooks)
    os.makedirs(hooks, exist_ok=True)
    percorso = os.path.join(hooks, "pre-commit")
    script = os.path.abspath(__file__).replace("\\", "/")
    py = "python3" if sys.platform != "win32" else "python"
    if os.path.exists(percorso):
        print(f"Esiste già un hook pre-commit ({percorso}): non lo sovrascrivo. Aggiungi tu questa riga:")
        print(f'  {py} "{script}" --staged || exit 1')
        return 1
    with open(percorso, "w", encoding="utf-8", newline="\n") as f:
        f.write(f'#!/bin/sh\n# Installato da controlla-segreti.py\n{py} "{script}" --staged || exit 1\n')
    os.chmod(percorso, 0o755)
    print(f"Fatto: prima di ogni commit verranno controllati i file in arrivo ({percorso}).")
    return 0


def sezione(titolo):
    print("\n" + colore(titolo, "1"))


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Controlla chiavi API e segreti prima del push.")
    ap.add_argument("cartella", nargs="?", default=".")
    ap.add_argument("--senza-storia", action="store_true", help="non controllare la storia dei commit")
    ap.add_argument("--staged", action="store_true", help="solo i file pronti per il commit (per l'hook)")
    ap.add_argument("--installa-hook", action="store_true", help="esegui il controllo prima di ogni commit")
    a = ap.parse_args()
    cartella = os.path.abspath(a.cartella)

    if a.installa_hook:
        sys.exit(installa_hook(cartella))

    in_git = git(cartella, "rev-parse", "--is-inside-work-tree") is not None
    elenco = file_da_controllare(cartella, in_git, a.staged)
    print(colore(f"controlla-segreti · {os.path.basename(cartella)} · {len(elenco)} file", "1"))

    totale = 0
    sezione("1. Chiavi nei file")
    problemi, avvisi = controlla_file(cartella, elenco)
    for p in problemi:
        print("  " + colore("✗ " + p, ROSSO))
    if not problemi:
        print("  " + colore("✓ nessuna chiave nei file", VERDE))
    totale += len(problemi)

    if a.staged:
        for v in avvisi:
            print("  " + colore("! " + v, GIALLO))
        if problemi:
            print(colore("\nCommit bloccato: togli la chiave dal file e mettila nel .env.", ROSSO))
        sys.exit(1 if problemi else 0)

    sezione("2. Storia dei commit")
    if a.senza_storia or not in_git:
        print("  " + colore("- saltata", GRIGIO))
    else:
        storici, n_commit = controlla_storia(cartella)
        for p in storici:
            print("  " + colore("✗ " + p, ROSSO))
        if storici:
            print("  " + colore("  → cancellarla non basta: va CAMBIATA sul sito del servizio", ROSSO))
        else:
            print("  " + colore(f"✓ nessuna chiave in {n_commit} commit", VERDE))
        totale += len(storici)

    sezione("3. File .env")
    problemi_env, ok_env = controlla_env(cartella, in_git, elenco)
    for p in problemi_env:
        print("  " + colore("✗ " + p, ROSSO))
    for o in ok_env:
        print("  " + colore("✓ " + o, VERDE))
    totale += len(problemi_env)

    sezione("4. Frontend e avvisi")
    for v in avvisi:
        print("  " + colore("! " + v, GIALLO))
    if not avvisi:
        print("  " + colore("✓ nessuna chiave che finisce nel browser", VERDE))

    print()
    if totale:
        print(colore(f"{totale} problema/i. Se una chiave è uscita, cambiala subito: chi l'ha copiata ce l'ha ancora.", ROSSO))
    else:
        print(colore("Tutto pulito." + (f" {len(avvisi)} avviso/i da guardare." if avvisi else ""), VERDE))
    sys.exit(1 if totale else 0)


if __name__ == "__main__":
    main()
