---
name: sync-trello
description: Create or re-sync the Liga Veteranos do Sado Trello board as a READ-ONLY MIRROR of docs/ROADMAP.md and docs/backlog.md (lists, labels, cards with details). Needs the Trello MCP connector in the session. Use for "sync trello", "update the board", "cria o trello".
---

# Sync the Trello board (mirror of ROADMAP.md)

`docs/ROADMAP.md` is the **only source of truth**. The board is a visual mirror, regenerated from the repo. Never read status *from* Trello back into the repo, and never let the board become the tracker.

## 0. Preconditions
- Trello tools must be available (MCP connector). If not: stop and tell the user to start a new session with the Trello connector enabled (`/mcp` to check).
- Work from the latest `origin/main` (`git fetch -q origin`; read `docs/ROADMAP.md` and `docs/backlog.md` from `origin/main`, e.g. `git show origin/main:docs/ROADMAP.md`). If the user says a docs PR is not merged yet, use that branch instead.
- Workspace: **Liga de Veteranos do Sado** (ask the user to pick if several).

## 1. Board
- Name: **`Liga Veteranos do Sado — Roadmap`**. Find it by name; create it only if it does not exist (never create a duplicate).
- Description: `Espelho de docs/ROADMAP.md (GitHub Gadanup/liga_veteranos_sado). Não mover cartões aqui — o estado muda no ROADMAP via PR. Sincronizado com /sync-trello.`

## 2. Lists (in this order; create missing, keep existing)
1. `ℹ️ Leia-me`
2. `🔥 Agora (NOW)`
3. `⏭️ A seguir (NEXT)`
4. `❓ Bloqueado (perguntas)`
5. `🗺️ Fase 1 — Fundações`
6. `🗄️ Fase 2 — Base de dados`
7. `🛠️ Fase 3 — Área de admin`
8. `🎨 Fase 4 — Redesign`
9. `✨ Fase 5 — Polimento`
10. `✅ Feito (DONE)`

## 3. Labels (create missing)
- Owners: `Claudio` (blue) · `Ricardo` (green) · `Livre` (grey)
- Severity (from backlog cards): `🔴 Crítico` (red) · `🟠 Alto` (orange) · `🟡 Médio` (yellow) · `⚪ Baixo` (black/none)
- Area: `Mobile` · `Segurança` · `BD` · `Performance` · `SEO` · `Código` · `Build` · `A11y` (sky/purple/pink/lime… any distinct colours)

## 4. Cards
**Card key** (for idempotency) = the first token of the title: a step ID (`1.2.1`), backlog IDs (`[B14]`), a question (`[Q1]`), or a PR (`#127`). Match existing cards by key; update instead of duplicating.

| Source in ROADMAP.md | List | Title | Description | Labels |
|---|---|---|---|---|
| Leia-me (fixed) | `ℹ️ Leia-me` | `📌 Fonte da verdade: docs/ROADMAP.md` | How the flow works (ROADMAP NOW/NEXT/DONE, `/next`, `/ship`, PR moves item to DONE) + link `https://github.com/Gadanup/liga_veteranos_sado/blob/main/docs/ROADMAP.md` | — |
| NOW rows | `🔥 Agora` | item text, prefixed by its backlog IDs if any | row details + full backlog card(s) text for each ID + GitHub links | owner, severity, area |
| NEXT items (numbered) | `⏭️ A seguir` | `N. <short title>` (keep order via position) | item text + backlog card text for each ID mentioned | owner if given, else `Livre` |
| Blocked table | `❓ Bloqueado` | `[Qn] <question>` | question + "Bloqueia: …" + who answers | — |
| LATER steps | the phase list | `<step> <short title>` (one card per step, e.g. `2.2.1 Triggers de classificação`) | step text + backlog card text for every ID in it | severity = highest of its IDs; area |
| DONE rows | `✅ Feito` | `#<PR> <what>` (or date + what if no PR) | date + what + PR link `https://github.com/Gadanup/liga_veteranos_sado/pull/<n>` | — |

- Backlog card text = the section `#### \`[ID]\` …` in `docs/backlog.md` up to the next `---` (problem, evidence, fix, risk). Keep Markdown.
- Card titles in Portuguese where the backlog already has PT titles; descriptions may stay in English (as in the docs).
- Order cards inside each list exactly as in ROADMAP.md.

## 5. Re-sync rules
- Card exists with same key → update title/description/labels/list/position.
- Card on the board but its key is no longer in the target list → move it to the right list (e.g. NOW → DONE). If the key no longer exists anywhere in ROADMAP → **archive** it (never delete).
- Never touch cards/lists created by people that have no key — list them in the report instead.
- Do everything in batches; if the connector rate-limits, pause and continue.

## 6. Report
Board URL, then counts per list (created / updated / moved / archived), and anything skipped. Remind: "o estado muda no ROADMAP.md via PR; depois corre /sync-trello de novo".
