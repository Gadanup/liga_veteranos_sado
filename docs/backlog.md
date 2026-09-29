# Backlog — item details (Trello-ready)

> **This file has no status.** What is done, in progress or next lives only in [`ROADMAP.md`](ROADMAP.md). Use this file for the *details* of an item (problem, evidence, fix, risk). The phase lists in §2 and §7 are the audit's original grouping, not current status.

> Full-stack audit of 2026-09-29, branch `main`, commit `a498971`.
> Every item is written as a **Trello card**: one ID, one title, one owner-ready description.
> Docs are in English per `CLAUDE.md`; card titles are kept short so they read well on a board.
>
> **How each item was established**
>
> | Mark | Meaning |
> |---|---|
> | ✅ **Verified 2026-09-29** | Read in the current code, or reproduced by running the build. File/line references are live. |
> | 📄 **From `docs/archive/02_IMPROVEMENTS.md`** | Carried over from the earlier audit, **not** re-verified in this pass. Confirm before scheduling. |
> | ❓ **Unverified** | Could not be checked — no Supabase access token in this environment (`npx supabase db query` → `AccessTokenRequiredError`). |
>
> No writes were made to the database during the audit.
> Related: `docs/archive/02_IMPROVEMENTS.md` (original backlog), `docs/ROADMAP.md` (ordered plan), `docs/reference/screen-specs.md` (redesign specs).
>
> **Changes since the audit was written** (`main` is now `1cf6a1f`)
> - PR #118 (`474087c`) replaced the hardcoded Supercup stadium in `MatchHeader.jsx` with `matches.stadium_name` and added `docs/db/03_supertaca_stadiums.sql`. `[C7]` is updated accordingly, and the SQL files proposed by `[N3]` and `[N4]` are renumbered to `04_` and `05_` so they do not collide.
> - `[N13]` was added while implementing `[D1]`: `npm ci` and `npm install` both fail on a clean clone.
> - `[N1]` was applied (a local untracked directory, so there is nothing to commit). The Phase 1 branches are open as separate PRs.

---

## 1. Board setup

### Lists

| List | What goes in it |
|---|---|
| `Fase 1 — Quick wins & fixes` | Low-risk, ships in ~1 week. Maps to Phase 0 of `docs/ROADMAP.md`. |
| `Fase 2 — Segurança & dados` | RGPD, validation, DB triggers, images. Maps to Phase 2. |
| `Fase 3 — Otimizações` | Server Components, SQL aggregation, PWA, React Query. Maps to Phases 1/5. |
| `Backlog` | Everything not yet scheduled (mostly the Phase 4 redesign items). |
| `Perguntas em aberto` | Blocked on a decision or on information only Ricardo has. |
| `Feito` | — |

### Labels

- **Severity**: `🔴 Crítico` · `🟠 Alto` · `🟡 Médio` · `⚪ Baixo`
- **Area**: `Mobile` · `Segurança` · `BD` · `Performance` · `SEO` · `Código` · `Build` · `A11y`
- **Effort**: `S` (an evening) · `M` (2–3 evenings) · `L` (a week of evenings)
- **Risk**: `Risco baixo` · `Risco médio` · `Risco alto`

### Custom fields (optional)

`Evidence` (text) · `Plan step` (text, e.g. `0.2.1`) · `Verified` (checkbox)

---

## 2. Bulk paste into Trello

Trello creates one card per line when you paste a multi-line block into "Add a card".
Paste each block into the matching list, then open each card and fill the description from §3.

### → `Fase 1 — Quick wins & fixes`

```
[N1] Apagar a pasta app/Information que faz sombra ao src/app
[N2] Layout servidor com metadata, Open Graph e viewport
[M3] Mostrar o nome da equipa na classificação em telemóvel
[B12] Hover da classificação só em dispositivos com rato
[N8] Corrigir o contraste do badge de pontos (2,1:1 falha AA)
[B1] Mudar de época em /taca não recarrega os dados
[B14] Cup views pedem colunas start_year/end_year que não existem
[B9] Calendários: router.replace em vez de router.push no ?week=
[B10] Chaves de jornada da Taça dependem da largura do ecrã
[B11] Página de jogo: "Jogo não encontrado" e estado de erro
[B4] Página de jogo carrega todos os jogadores de todas as épocas
[P7] Suspensões: uma query por página em vez de uma por MatchCard
[N7] MatchCard refaz a query de suspensões a cada render do pai
[P3] Carregar o jspdf só no clique (-119 kB em /jogos/[id])
[D1] Adicionar dayjs e remover as 7 dependências não usadas
[D2] Apagar Footer.jsx e decidir o futuro de /taca/sorteio
[D3] Remover o import não usado de supabase em app/page.js
[N6] Cabeçalhos de segurança e config de imagens no next.config.mjs
[N10] Adicionar robots.txt, sitemap.xml e web manifest
[N12] Documentar que faltar uma env var faz falhar o build inteiro
[N13] npm ci e npm install falham com ERESOLVE numa clonagem limpa
```

### → `Fase 2 — Segurança & dados`

```
[S4] Backup de schema e dados antes de mudanças críticas (substitui staging)
[N3] RGPD: parar de expor birthdate e dados pessoais dos jogadores
[N4] Validar resultados no cliente e adicionar CHECK constraints
[B6] Avisar quando o resultado não bate com os eventos de golo
[B15] Recalcular a classificação quando um jogo é apagado
[N5] Disciplina: Supertaça conta cartões mas não conta jogos
[B16] Duplo amarelo (event_type 5) não é contado em lado nenhum
[B17] Equipas sem linha em league_standings desaparecem da tabela
[N11] Confirmar índices em match_events, matches, players, suspensions
[P1] Converter as 469 fotos PNG (116 MB) para WebP <=400px
[P2] Mover fotos e logos para Supabase Storage
[S3] admin_users: comparação de email sensível a maiúsculas
[B2] Marcadores creditam golos à equipa atual do jogador
[B3] Atribuição de eventos falha em transferências entre as duas equipas
[B5] Jogadores suspensos hoje não podem receber eventos de jogos antigos
[B7] Confirmar se amarelos da Taça contam para a suspensão
[B8] Links de equipa sem encodeURIComponent no short_name
[E2] Colunas de configuração na tabela seasons
[C7] Remover os hardcodes de época que sobram
```

### → `Fase 3 — Otimizações`

```
[M1] Um único conjunto de breakpoints via tema MUI
[M2] Substituir a manipulação do DOM das margens por layout CSS
[N9] Primeira pintura é sempre desktop e salta em telemóvel (CLS)
[P4] Server Components com revalidate nas páginas de consulta
[P5] Agregar marcadores, disciplina e histórico em SQL
[P6] Metadata por rota em vez de document.title
[C1] Introduzir React Query
[C2] Mover as queries Supabase para src/api
[C3] Época na URL em todas as páginas via useSelectedSeason
[C5] Extrair a lógica de domínio para src/utils com testes
[C6] Constantes para event types, competition types e rondas
[C9] Tratar erros em vez de 38 console.error silenciosos
[C10] Vitest e React Testing Library
[M10] PWA leve: manifest, ícones e theme-color
[B18] Reescrever os triggers de standings em SQL set-based
```

### → `Backlog`

```
[M4] Bottom navigation em telemóvel
[M5] Página de jogo: layout mobile empilhado
[M6] Diálogos de admin em fullScreen no telemóvel
[M7] Calendário: swipe e lista de jornadas com scroll
[M8] Tap targets com no mínimo 44px
[M9] Títulos decorativos empurram o conteúdo para fora do ecrã
[C4] Dividir os componentes gigantes (EnhancedDisciplineModal, 2038 linhas)
[C8] Migração incremental para TypeScript (adiada, decisão de 2026-09-27)
[C11] Escolher uma abordagem de estilo e remover Tailwind
[D4] Alinhar a estrutura de pastas com a convenção alvo
[D5] Limpar ~50 branches remotos obsoletos
[B13] window.confirm inconsistente com os diálogos MUI
```

### → `Perguntas em aberto`

```
[Q1] Duplo amarelo: 1 vermelho, 2 amarelos, ou não conta?
[Q2] A Supertaça conta para a classificação disciplinar?
[Q3] Amarelos da Taça contam para os 3 = suspensão?
[Q4] Qual é o domínio público do site (para metadataBase e sitemap)?
[Q5] Existe imagem Open Graph 1200x630 da liga?
[Q6] O formulário de inscrição recolhe consentimento para foto e nome?
[Q7] "Allow new users to sign up" está desligado no Supabase Auth?
[Q8] Correr os Supabase Advisors (Security e Performance) e colar o resultado
[Q9] Correr o Lighthouse mobile no Preview URL depois do N1
```

---

## 3. Cards

Format: **ID · title** → severity, area, effort, risk, plan step, verification mark.

---

### 🔴 Critical

---

#### `[N1]` Apagar a pasta `app/Information` que faz sombra ao `src/app`

`🔴 Crítico` `Build` `S` `Risco baixo` · new step **0.0.1** · ✅ Verified 2026-09-29

**Problem.** An empty, untracked directory `app/Information/` exists at the repo root. Next.js gives the root `app/` precedence over `src/app/`, so `next build` compiles **zero** App Router routes and still exits 0. The pre-PR gate defined in `CLAUDE.md` ("`npm run build` — must pass before any PR") has been validating nothing.

**Evidence.**
- `ls app/` → `Information/` (empty); `git ls-files app` → nothing (untracked, so production on Vercel is unaffected)
- `.next/app-path-routes-manifest.json` → `{}`; `.next/server/app/` does not exist
- Build with the folder present: `Route (pages) ─ ○ /404` only, exit 0
- Build with the folder moved away: 17 routes under `Route (app)`

**Fix.** `rmdir app/Information app`, then re-run the build and confirm 17 routes appear.

**Notes.** Requires `.env.local` to exist (see `[N12]`). Do this card **before** any other — every following PR depends on the build gate actually working.

---

#### `[N2]` Layout servidor com metadata, Open Graph e viewport

`🔴 Alto` `SEO` `S` `Risco baixo` · new step **0.1.4** (brings forward 1.3.2 and 5.2) · ✅ Verified 2026-09-29

**Problem.** `src/app/layout.js` is `"use client"`, so it cannot export `metadata`. The served HTML has no `<title>`, no `description`, no Open Graph and no `theme-color`. The title is set by `document.title` inside a `useEffect`, which crawlers and WhatsApp's link unfurler never run. Links shared in WhatsApp — the league's main distribution channel — render as a bare URL.

**Evidence.** `src/app/layout.js:1` (`"use client"`), `:47` (`document.title` in `useEffect`); `grep -rn "export const metadata" src` → 0 results.

**Fix.** Split into a server `layout.js` (holding `<html>`, `<body>`, `metadata`, `viewport`) and a new client `src/app/AppChrome.jsx` holding the current `Nav` + `.main-content` logic unchanged. Zero visual change. Also unblocks per-route `generateMetadata` (e.g. `"Sado 2-1 Pontes · Jornada 5"`).

**Blocked by.** `[Q4]` (domain for `metadataBase`), `[Q5]` (OG image).

**No conservative alternative exists** — `metadata` cannot be exported from a client component and `head.js` is deprecated in the App Router.

---

#### `[M3]` Mostrar o nome da equipa na classificação em telemóvel

`🔴 Alto` `Mobile` `S` `Risco baixo` · step **4.1**, bring forward to **0.2.6** · ✅ Verified 2026-09-29

**Problem.** Below 600px the standings table gives the team column 50px and does not render the name at all — only the logo. This is the home page (`/` renders the classificação page).

**Evidence.** `src/components/features/liga/classificacao/ClassificationTable.jsx:42` → `header: "35px 50px 35px 35px 35px 35px 45px 35px"`; `ClassificationRow.jsx:277` → `{layout !== "xs" && (` wraps the name.

**Fix.** Column priority on `xs`: `Pos · Logo+Nome · J · DG · P` (grid `28px minmax(0,1fr) 28px 34px 32px` — leaves ~208px for the name at 360px). Add `showWDL` / `showGoals` flags to the layout config and wrap the V/E/D/Golos cells. V/E/D return at `sm` and up.

**Conservative alternative.** Keep 8 columns inside `overflow-x: auto` with a sticky team column. Less work, worse UX for a 10-team table — not recommended.

**Definition of done.** Team names readable at 360, 390 and 768px with no horizontal page scroll.

---

#### `[P1]` Converter as 469 fotos PNG (116 MB) para WebP ≤400px

`🔴 Alto` `Performance` `M` `Risco baixo` · step **2.3.2** (conversion can happen in Phase 1) · ✅ Verified 2026-09-29

**Problem.** `public/` holds 469 PNGs totalling 124 MB (`team_photos` alone = 116 MB). Average 274 KB, largest 8.9 MB (`team_photos/santoovidio/fabioPardete.png`); 15 files exceed 2 MB. They are rendered through raw `<img>` / MUI `Avatar` at 24–80px. On mobile data this is the single biggest cost, and it bloats the git repo.

**Evidence.** `du -sh public/team_photos` → 116M; `find public -type f -printf "%s %p\n" | sort -rn | head`; 64 lint warnings of which 44 are `@next/next/no-img-element`; 47 `<img>` tags, only 2 `next/image` imports.

**Fix.** Offline conversion to WebP at ≤400px wide (expect ~4–6 MB total, a ~95% reduction), update `photo_url` / `logo_url` in the DB via reviewed SQL, then delete the PNGs. Card `[P2]` then moves them to Supabase Storage so new photos need no commit.

**Order.** Conversion and DB URL update can ship before `[P2]`. Do not delete the PNGs until the new URLs are live.

---

### 🟠 High

---

#### `[N3]` RGPD: parar de expor `birthdate` e dados pessoais dos jogadores

`🟠 Alto` `Segurança` `S` `Risco médio` · new step **2.0.1** · ✅ Verified 2026-09-29

**Problem.** `players` has `birthdate`, `nationality`, `height`, `weight` and is `public_read` under the 2026-09-27 RLS policies. The team page does `select("*")`, so every visitor's browser receives the birth dates of a whole squad. The UI never displays them.

**Evidence.** `src/app/equipas/[teamname]/page.jsx:96` and `:113` (`select("*")`); `src/types/database.types.ts:483` (`birthdate: string | null`). Two other `select("*")` calls: `EnhancedDisciplineModal.jsx:316`, `LeagueCupView.jsx:97`.

**Fix (two steps, in order).**
1. Code: replace all four `select("*")` with explicit column lists (`id, name, photo_url, team_id, joker, number, position` for players). Ship and verify in production.
2. DB (`docs/db/04_players_columns.sql`): `revoke select on public.players from anon, authenticated;` then `grant select (<public columns>)`. A per-column `revoke` does not work against a table-level grant — the table grant must be dropped first.

**Risk.** ⚠️ After step 2 any surviving `select("*")` on `players` returns 403. Confirm all call sites first. Rollback: `grant select on public.players to anon, authenticated;`

**Conservative alternative.** Step 1 only — closes the practical exposure, not direct anon-key access.

**Related.** `[Q6]` (consent for photo + name in the registration form).

---

#### `[N4]` Validar resultados no cliente e adicionar CHECK constraints

`🟠 Alto` `BD` `S` `Risco baixo` · new step **2.0.2** · ✅ Verified 2026-09-29

**Problem.** The result form uses `type="number"` with `inputProps={{ min: 0 }}` — an attribute hint MUI does not enforce — and sends `parseInt(value)` straight to Supabase. A negative score is accepted. No CHECK constraints are known to exist on the DB side (see `[N11]`).

**Evidence.** `src/components/features/jogos/EditMatchDialog.jsx:415-435` (fields), `:263-276` (`handleSubmit`).

**Fix.** A `parseScore` helper rejecting anything outside 0–30 or non-integer; reject a half-filled result (one team's goals set, the other empty); plus `docs/db/05_match_constraints.sql` adding `NOT VALID` CHECKs for goals, penalties and `home_team_id <> away_team_id`, validated afterwards once historical rows are confirmed clean.

**Bundle with.** `[B6]` — the same `handleSubmit` is the right place for the goals-vs-events warning.

---

#### `[B6]` Avisar quando o resultado não bate com os eventos de golo

`🟠 Alto` `BD` `S` `Risco baixo` · step **3.5.1** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

**Problem.** The score and the goal events are saved independently. Saving 3–1 with only two goal events raises no warning, so the top-scorer list silently disagrees with the result.

**Fix.** Non-blocking confirm in `handleSubmit`: compare `home_goals + away_goals` against the count of `event_type` 1 and 4. Ship together with `[N4]`.

---

#### `[B15]` Recalcular a classificação quando um jogo é apagado

`🟠 Alto` `BD` `M` `Risco médio` · step **2.2.1** · ✅ Verified 2026-09-29

**Problem.** `trigger_recalculate_league_standingsnew` fires `AFTER UPDATE, INSERT` only. Deleting a played match leaves the league table stale until some other match in that season is edited.

**Evidence.** `docs/db/triggers.txt`; `docs/db/trigger_functions.sql` — the function reads `NEW.season`, which is null on DELETE, which is why DELETE was left out.

**Fix.** Extract the body of `reset_and_recalculate_league_standings()` into `recalc_league_standings_for_season(p_season bigint)`, have the existing trigger call it with `NEW.season`, and add an `AFTER DELETE` trigger calling it with `OLD.season`.

**Before running.** No staging project (decision 2026-09-29, `ROADMAP.md` → Decisions). This is a ~40-line plpgsql refactor on the live standings: back up schema + data first (`[S4]`), ship it with a rollback file and a self-rolling-back verify script that recalculates a season and compares it with the current table, and run it outside match days.

**Interim workaround for the admin.** After deleting a match, edit and re-save another match of the same season to force a recalculation. Add this to `docs/ADMIN_GUIDE.md` (step 3.8.1).

---

#### `[N5]` Disciplina: Supertaça conta cartões mas não conta jogos

`🟠 Alto` `BD` `S` `Risco médio` · step **2.2.1** · ✅ Verified 2026-09-29

**Problem.** In `update_discipline_standings()`, `matches_played` counts only `competition_type IN ('League','Cup')`, but the yellow- and red-card sub-selects have no competition filter and therefore include Supercup cards. The per-match average is computed over inconsistent denominators.

**Evidence.** `docs/db/trigger_functions.sql:136` (yellows, no filter), `:167` (reds, no filter), `:189` (matches, filtered).

**Fix.** Either add `AND m.competition_type IN ('League','Cup')` to both card sub-selects, or add Supercup to the matches sub-select — depending on `[Q2]`.

**Risk.** ⚠️ Changes the published discipline table retroactively. Run the diagnostic query first and agree the numbers before applying:

```sql
select m.competition_type, me.event_type, count(*)
from match_events me join matches m on m.id = me.match_id
group by 1, 2 order by 1, 2;
```

**Blocked by.** `[Q2]`.

---

#### `[B16]` Duplo amarelo (`event_type` 5) não é contado em lado nenhum

`🟠 Alto` `BD` `S` `Risco médio` · step **2.2.1** · ✅ Verified 2026-09-29 (code) / ❓ rule unconfirmed

**Problem.** `update_discipline_standings()` counts `event_type = 2` (yellow) and `= 3` (red). `event_type = 5` (double yellow) contributes zero discipline points and zero cards.

**Evidence.** `docs/db/trigger_functions.sql:136,167`.

**Blocked by.** `[Q1]`. Also decide whether the correction is retroactive or forward-only.

---

#### `[B17]` Equipas sem linha em `league_standings` desaparecem da tabela

`🟠 Alto` `BD` `M` `Risco baixo` · step **2.2.1** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

**Problem.** Both standings triggers only `UPDATE` existing rows. A team whose `league_standings` / `discipline_standings` row was not inserted by hand at season start silently never appears. This will bite during the 2026/27 setup.

**Fix.** Trigger on `teams` INSERT that creates the matching standings rows.

---

#### `[M1]` Um único conjunto de breakpoints via tema MUI

`🟠 Alto` `Mobile` `M` `Risco médio` · step **1.3.1** + **1.3.4** · ✅ Verified 2026-09-29

**Problem.** Three different mobile breakpoints coexist: `layout.js` uses `<= 599`, `Nav` uses MUI `sm` (600) against the **default** theme because no `ThemeProvider` is mounted, and everything else uses `<= 768`. Between 600 and 768px the app is half mobile, half desktop. `window.innerWidth` is read **during render** in 14 files, so it never reacts to rotation or resize.

**Evidence.** `src/app/layout.js:31`; `Nav.jsx:13`; `window.innerWidth` in `MatchHeader.jsx:20`, `EditMatchDialog.jsx:79`, `MatchStatistics.jsx:31`, `TeamSquads.jsx:32`, `TeamSelectors.jsx:32`, `WeekNavigator.jsx:15`, `CalendarHeader.jsx:31`, `CupCalendarHeader.jsx:35`, `jogos/SeasonSelector.jsx:14`, `taca/shared/SeasonSelector.jsx:21`, `galeria/SeasonSelector.jsx:17`, `classificacao/page.jsx:32-33`, `taca/calendario/page.jsx:78`. Raw `useMediaQuery("(max-width: 768px)")` in 8 more files.

**Fix.** `theme/theme.js` with `createTheme` + `ThemeProvider`, then a mechanical replacement pass — responsive `sx` values where the styling differs, `useMediaQuery(theme.breakpoints.down("md"))` only where the component tree differs. No redesign in this card.

---

#### `[M2]` Substituir a manipulação do DOM das margens por layout CSS

`🟠 Alto` `Mobile` `M` `Risco médio` · step **1.3.2** + **1.3.3** · ✅ Verified 2026-09-29

**Problem.** Layout margins are applied with `document.querySelector(".main-content").style.marginLeft/...` inside a `useEffect`. On first paint the content has no top margin, renders under the fixed AppBar, then jumps. The desktop drawer also expands on hover and pushes the whole page, reflowing every route on each mouse pass.

**Evidence.** `src/app/layout.js:41-49`; `Nav.jsx:30-37` (`handleMouseEnter` / `handleMouseLeave`).

**Fix.** `Toolbar` spacer + `Box component="main"` with responsive `ml`; overlay the drawer instead of pushing.

**Depends on.** `[N2]` (server layout) — do `[N2]` first, it is the cheap half of the same change.

---

#### `[N9]` Primeira pintura é sempre desktop e salta em telemóvel (CLS)

`🟠 Alto` `Mobile` `M` `Risco médio` · step **1.3.2** · ✅ Verified 2026-09-29

**Problem.** `useMediaQuery` returns `false` during SSR, so the first painted frame is always the desktop branch; the `.main-content` margin arrives only after hydration. Result: a visible layout jump on every page load on a phone, and a high CLS.

**Evidence.** `Nav.jsx:13`; `layout.js:41-49`. Reasoned from the code — not measured (see `[Q9]`).

**Fixed by.** `[M1]` + `[M2]` together. Kept as its own card because it is the user-visible symptom worth re-checking after those land.

---

#### `[B14]` Cup views pedem colunas `start_year`/`end_year` que não existem

`🟠 Alto` `Código` `S` `Risco baixo` · step **0.2.2** · ✅ Verified 2026-09-29

**Problem.** `LeagueCupView` and `KnockoutCupView` select `start_year, end_year` from `seasons`. Those columns do not exist (`seasons` has `start_date` / `end_date`). The query errors silently and their internal season list is always empty.

**Evidence.** `LeagueCupView.jsx:60`, `KnockoutCupView.jsx:90`; `src/types/database.types.ts:748-756`.

**Fix.** Rename to `start_date, end_date` in both files. One line each.

---

#### `[B1]` Mudar de época em `/taca` não recarrega os dados

`🟠 Alto` `Código` `S` `Risco baixo` · step **0.2.1** · ✅ Verified 2026-09-29

**Problem.** `LeagueCupView` / `KnockoutCupView` copy the `currentSeason` prop into state on mount only, and the parent passes no `key`. Switching between two seasons of the same cup format keeps showing the previous season.

**Evidence.** `src/app/taca/page.jsx:203-206`.

**Fix.** `key={currentSeason?.id}` on both. One line.

---

#### `[B4]` Página de jogo carrega todos os jogadores de todas as épocas

`🟠 Alto` `Performance` `S` `Risco baixo` · step **0.2.x** · ✅ Verified 2026-09-29

**Problem.** `/jogos/[id]` fetches `players` with **no filter at all** (~610 rows across every season) just to split home/away, and fetches `suspensions` with no season filter either.

**Evidence.** `src/app/jogos/[id]/page.jsx:111-113` and `:120`.

**Fix.** Filter by the two `team_id`s (a `currentPlayersResult` query already does exactly this at `:120-123`) and add `.eq("season", …)` to the suspensions query.

---

#### `[P7]` Suspensões: uma query por página em vez de uma por `MatchCard`

`🟠 Alto` `Performance` `S` `Risco baixo` · step **0.2.5** · ✅ Verified 2026-09-29

**Problem.** Every `MatchCard` runs its own `suspensions` query on mount: 6–7 requests per matchweek, more on the cup pages.

**Evidence.** `src/components/features/liga/calendario/MatchCard.jsx:50-76`; same pattern in `taca/calendario/CupMatchCard.jsx`.

**Fix.** Fetch active suspensions once per calendar page and pass them down as a prop. Ship with `[N7]`.

---

#### `[N7]` `MatchCard` refaz a query de suspensões a cada render do pai

`🟠 Alto` `Performance` `S` `Risco baixo` · step **0.2.5** · ✅ Verified 2026-09-29

**Problem.** The suspensions `useEffect` depends on `[match]` — an object prop. If the parent re-creates it on render, the query re-runs on every render, compounding `[P7]`.

**Evidence.** `src/components/features/liga/calendario/MatchCard.jsx:76`.

**Fix.** Disappears with `[P7]` (the query moves to the page). If `[P7]` is deferred, narrow the dependency to `[match.id]`.

---

#### `[N6]` Cabeçalhos de segurança e config de imagens no `next.config.mjs`

`🟠 Alto` `Segurança` `S` `Risco baixo` · new step **0.3.4** · ✅ Verified 2026-09-29

**Problem.** `next.config.mjs` is empty (two lines). No security headers, `poweredByHeader` not disabled, no image configuration.

**Fix.** `poweredByHeader: false`, `images.formats`, and a `headers()` block with `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Strict-Transport-Security`.

**Deliberately excluded: CSP.** With MUI/emotion injecting inline styles, a CSP without `'unsafe-inline'` breaks the stylesheet, and with it the policy protects almost nothing. Revisit after `[C11]` (single styling approach).

---

#### `[N8]` Corrigir o contraste do badge de pontos (2,1:1 falha AA)

`🟠 Alto` `A11y` `S` `Risco baixo` · bundle with `[M3]` · ✅ Verified 2026-09-29

**Problem.** The points badge uses `accent[700]` `#ccad00` on `accent[100]` `#fffaeb` — roughly **2,1:1**, against the WCAG AA minimum of 4,5:1. It is the most important number on the home page. The same gold `#ffd700` on white is ~1,4:1 elsewhere.

**Evidence.** `ClassificationRow.jsx:422-430`; `src/styles/theme.js` (accent scale).

**Fix.** Darken the badge text to ~`#6b5c00` (≈5:1 on `#fffaeb`). Audit the other gold-on-light uses in the same pass.

---

#### `[B2]` Marcadores creditam golos à equipa atual do jogador

`🟠 Alto` `Código` `M` `Risco baixo` · step **2.2.3** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

A player who transferred mid-season has all goals shown under the new team, and past seasons show the player's current team. `hooks/liga/marcadores/useGoalscorersData.js`, `hooks/taca/marcadores/useCupGoalscorersData.js`. Properly fixed by `match_events.team_id` (step 2.2.2).

---

#### `[B3]` Atribuição de eventos falha em transferências entre as duas equipas

`🟠 Alto` `Código` `M` `Risco baixo` · step **2.2.3** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

If a player appears in both squads (transferred between the two teams playing), they are forced into "home". A player with two transfers in a season loses history. `app/jogos/[id]/page.jsx:127-144`, `components/features/jogos/EditMatchDialog.jsx:122-133`. Fixed by step 2.2.2.

---

#### `[B5]` Jogadores suspensos hoje não podem receber eventos de jogos antigos

`🟠 Alto` `Código` `S` `Risco baixo` · step **0.2.4** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

The event editor filters out players suspended **now**, not at the date of the match, so an old match cannot be corrected. `EditMatchDialog.jsx:136-141`.

---

#### `[P2]` Mover fotos e logos para Supabase Storage

`🟠 Alto` `Performance` `M` `Risco baixo` · step **2.3.1** + **2.3.2** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

Buckets `players/`, `teams/`, `rosters/` with public read + admin write, plus an `api/storage.js` upload helper that resizes to WebP ≤400px client-side. Removes the commit-and-deploy cycle for a new photo. Depends on `[P1]`.

---

#### `[N13]` `npm ci` e `npm install` falham com ERESOLVE numa clonagem limpa

`🟠 Alto` `Build` `S` `Risco baixo` · step **0.3.1** · ✅ Verified 2026-09-29

**Problem.** `react-brackets@0.4.7` declares `peerDependencies: { react: "^17.0.0" }` while the project runs React 18. With npm 7+ that is a hard error, so on a clean clone both `npm ci` and a plain `npm install` abort with `ERESOLVE could not resolve`. There is no `.npmrc`, so the `node_modules` in use was installed with a flag nobody recorded, and the install is not reproducible.

**Evidence.** `npm ci --dry-run` → `Fix the upstream dependency conflict, or retry this command with --force or --legacy-peer-deps`. `node -e "require('./node_modules/react-brackets/package.json').peerDependencies"` → `{"react":"^17.0.0","react-swipeable-views":"^0.13.9","styled-components":"^5.1.1"}`. `react-brackets` is genuinely used, by `components/features/taca/sorteio/CupBracket.jsx`.

**Fix (done).** `.npmrc` with `legacy-peer-deps=true`, committed in the `[D1]` branch (`chore/0.3.1-remove-unused-deps`) because that PR cannot otherwise be reproduced.

**Still open.**
1. **Check how Vercel has been coping.** Production deploys work today, so either Vercel applies the flag itself or it resolves differently. Worth confirming — if a future Vercel change stops doing that, deploys break with no code change on our side. The new `.npmrc` makes this moot, but the answer tells us whether it was ever at risk.
2. **Decide about `react-brackets`.** It is unmaintained against React 18 and also wants `styled-components` and `react-swipeable-views`, neither of which is installed. It only renders the desktop knockout bracket. `[D2]` already asks whether `/taca/sorteio` survives at all; if the bracket is rewritten during `4.8`, the dependency and the flag can both go.

**Conservative alternative.** Keep the `.npmrc` and change nothing else. It is one line and it makes every install deterministic.

---

#### `[D1]` Adicionar `dayjs` e remover as 7 dependências não usadas

`🟠 Alto` `Código` `S` `Risco médio` · step **0.3.1** · ✅ Verified 2026-09-29

**Problem.** `@mui/toolpad`, `@supabase/auth-helpers-nextjs`, `html2canvas`, `pdf-lib`, `lucide-react`, `react-material-ui-carousel` are declared and unused.

**⚠️ Order matters.** `dayjs` is imported across the app but only installed transitively via `@mui/toolpad`. Add `dayjs` to `package.json` **first**, in its own commit, or the build breaks.

**Keep** `@mui/material-nextjs` and `@supabase/ssr` — needed for `AppRouterCacheProvider` (step 1.3.2) and Server Components (step 5.4). `@emotion/cache` stays as an emotion peer.

**Note when doing this.** `dayjs` resolves to 1.11.23 once declared directly; toolpad had pinned 1.11.10, so this is a real (if small) version bump of the library behind every date on the site — check the calendar and the match sheet on the Preview. Removing toolpad also drops ~12.7k lines from the lockfile. See `[N13]`: the install only works with `legacy-peer-deps`, so this branch has to carry an `.npmrc`.

---

### 🟡 Medium

---

#### `[B9]` Calendários: `router.replace` em vez de `router.push` no `?week=`

`🟡 Médio` `Mobile` `S` `Risco baixo` · step **0.2.3** · ✅ Verified 2026-09-29

Both calendars `router.push` the `?week=` param on every load, adding a history entry — the phone back button needs two taps. `liga/calendario/page.jsx:123`, `taca/calendario/page.jsx:144`.

---

#### `[B10]` Chaves de jornada da Taça dependem da largura do ecrã

`🟡 Médio` `Mobile` `S` `Risco baixo` · step **0.2.3** · ✅ Verified 2026-09-29

The grouping key is built from `window.innerWidth` **at fetch time** — `"1"` on mobile, `"Jornada 1"` on desktop — so a URL shared from a phone does not resolve on desktop. `taca/calendario/page.jsx:78-87`. Fix: always key on `String(match.week)`, format in the UI.

---

#### `[B12]` Hover da classificação só em dispositivos com rato

`🟡 Médio` `Mobile` `S` `Risco baixo` · bundle with `[M3]` · ✅ Verified 2026-09-29

`onMouseEnter` / `onMouseLeave` mutate `style.transform` and `boxShadow` directly, so on touch devices the row stays "lifted" after a tap. `ClassificationRow.jsx:210-222`, `ClassificationTable.jsx:110-117`. Fix: a `@media (hover: hover)` CSS rule.

---

#### `[B11]` Página de jogo: "Jogo não encontrado" e estado de erro

`🟡 Médio` `Código` `S` `Risco baixo` · step **0.2.4** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

Shows "Carregar dados do Jogo" when the match does not exist; the `error` state is set but never rendered. `app/jogos/[id]/page.jsx:210-218`.

---

#### `[B7]` Confirmar se amarelos da Taça contam para a suspensão

`🟡 Médio` `BD` `S` `Risco médio` · step **2.2.1** · ✅ Verified 2026-09-29 (code) / ❓ rule unconfirmed

The at-risk list counts yellows from **all** competitions in the season and iterates every player of every season (no season filter on `players`). `hooks/liga/disciplina/useDisciplineData.js:85-138`. The threshold logic is `(cards + 1) % 3 === 0`, i.e. a warning at 2, 5, 8 — this matches the documented rule. Blocked by `[Q3]`.

---

#### `[B8]` Links de equipa sem `encodeURIComponent` no `short_name`

`🟡 Médio` `Código` `S` `Risco baixo` · step **4.2** · 📄 From `docs/archive/02_IMPROVEMENTS.md`

`/equipas/${short_name}` is built from the raw name; names with accents or spaces ("Águias S. Gabriel") work in most browsers but are fragile, and renaming a team breaks shared links. `ClassificationRow.jsx:190` and others.

---

#### `[N11]` Confirmar índices em `match_events`, `matches`, `players`, `suspensions`

`🟡 Médio` `BD` `S` `Risco baixo` · step **2.4.1** · ❓ Unverified

Indexes could not be inspected — no Supabase access token in this environment. Likely missing: `match_events(match_id)`, `match_events(player_id)`, `matches(season, competition_type)`, `players(team_id)`, `suspensions(season, active)`.

Diagnostic (read-only):

```sql
select tablename, indexname, indexdef
from pg_indexes where schemaname = 'public' order by 1, 2;

select relname, seq_scan, seq_tup_read, idx_scan
from pg_stat_user_tables where schemaname = 'public'
order by seq_tup_read desc;
```

All five candidates are safe and reversible via `create index concurrently if not exists` (cannot run inside a transaction block).

---

#### `[N10]` Adicionar `robots.txt`, `sitemap.xml` e web manifest

`🟡 Médio` `SEO` `S` `Risco baixo` · new step **0.3.4** · ✅ Verified 2026-09-29

None exist (`find src public -name "robots*" -o -name "sitemap*" -o -name "manifest*"` → only `favicon.ico`). Add them as App Router route files. Depends on `[Q4]` for the base URL. Ships naturally with `[M10]`.

---

#### `[P3]` Carregar o `jspdf` só no clique

`🟡 Médio` `Performance` `S` `Risco baixo` · step **0.3.3** · ✅ Verified 2026-09-29

`import jsPDF from "jspdf"` at module top makes `/jogos/[id]` **335 kB** first-load JS against 216 kB for comparable routes. `MatchSheetDownload.jsx:5`. Fix: `const { default: jsPDF } = await import("jspdf")` inside the click handler. Saves ~119 kB.

**Measured route sizes** (build of 2026-09-29, after removing the shadow dir of `[N1]`):

| Route | First Load JS |
|---|---|
| `/` and `/liga/classificacao` | 216 kB |
| `/liga/disciplina` | 236 kB |
| `/taca/calendario` | 212 kB |
| `/liga/calendario` | 211 kB |
| `/equipas/[teamname]` | 209 kB |
| `/taca` | 207 kB |
| **`/jogos/[id]`** | **335 kB** |
| shared by all | 87,5 kB |

---

#### `[S3]` `admin_users`: comparação de email sensível a maiúsculas

`🟡 Médio` `Segurança` `S` `Risco baixo` · step **0.1.x** · ✅ Verified 2026-09-29

`useIsAdmin` and the login page both use `.eq("email", user.email)`, so an admin whose email differs in case is not recognised. Note the DB side is already correct — `public.is_admin()` uses `lower(...)` on both sides — so this only breaks the **cosmetic** UI check, not the RLS protection. `hooks/admin/useIsAdmin.js:29-33`, `app/(auth)/admin/login/page.jsx:52-56`.

---

#### `[S4]` Backup de schema e dados antes de mudanças críticas (substitui staging)

`🟡 Médio` `Segurança` `S` `Risco baixo` · replaces step **0.1.3** · decision 2026-09-29

**Decision.** No staging Supabase project for now (not worth it for the size of the project; kept as an optional Phase 5 item). Instead, before any critical DB change: dump the **schema** and commit it as `supabase/schema.sql`, and dump the **data** to a private folder outside the repo (never git — the repo is public and the data has personal information). The free plan has no backups, so the data dump is the real safety net.

**How.** One-time `npx supabase link --project-ref dmsocybvdzdzafpemybt` (needs the DB password). Then `npx supabase db dump -f supabase/schema.sql` and `npx supabase db dump --data-only -f <private-folder>/liga_data_YYYY-MM-DD.sql`. Claude can run and verify the dumps once linked. Rules in `CONTRIBUTING.md` §5.

**Affects.** `[B15]`, `[N5]`, `[B16]` no longer wait for staging: backup first, then rollback file + self-rolling-back verify script.

---

#### `[N12]` Documentar que faltar uma env var faz falhar o build inteiro

`🟡 Médio` `Build` `S` `Risco baixo` · docs only · ✅ Verified 2026-09-29

`src/lib/supabase.ts` throws at module level, which runs during "Collecting page data". Without `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` the whole build fails with `Failed to collect page data for /` — reproduced locally (there is no `.env.local` in this checkout).

This is **correct fail-fast behaviour, not a bug** — no code change proposed. The card exists so the failure mode is documented: the vars must be present in Vercel for Production **and** Preview, and in `.env.local` for local builds. Add a line to `README.md` / `CONTRIBUTING.md`.

---

#### `[C7]` Remover os hardcodes de época que sobram

`🟡 Médio` `Código` `M` `Risco baixo` · step **2.1.2** · ✅ Partially verified 2026-09-29

**Already done.** `NavAppBar` reads `currentSeason.description` (commit `14a9ed1`). The Supercup stadium rule in `MatchHeader.jsx` was replaced by `matches.stadium_name` with a fallback to the home team, and the two historical values were stored by `docs/db/03_supertaca_stadiums.sql` (PR #118, commit `474087c`, landed after this audit was written).

**Still hardcoded:** `MatchSheetDownload.jsx:37` ("2025/26" in the PDF header), `navigationConfig.js` (the Supercup link is still a literal `/jogos/<id>`, now pointing at the 2026/27 match — it needs `seasons.supercup_match_id` and a `/supertaca` route), `informacao/documentacao/page.jsx` + `QuickActionsGrid.jsx`, `informacao/sorteio/SorteioHeader.jsx`, `historico/page.jsx`, `hooks/taca/sorteio/useCupMatches.js`. Depends on `[E2]`.

**Done when.** `grep -rnE "20[0-9]{2}/(20)?[0-9]{2}|jogos/[0-9]+" src` finds nothing season-specific.

---

#### `[E2]` Colunas de configuração na tabela `seasons`

`🟡 Médio` `BD` `S` `Risco baixo` · step **2.1.1** · 📄 From `docs/reference/data-entry.md`

`seasons.supercup_match_id`, `regulation_url`, `registration_form_url`, `calendar_url`, `transfer_window_start/end`. Unblocks `[C7]`.

---

#### `[D2]` Apagar `Footer.jsx` e decidir o futuro de `/taca/sorteio`

`🟡 Médio` `Código` `S` `Risco baixo` · step **0.3.2** · ✅ Verified 2026-09-29

`components/Footer.jsx` (414 lines) is imported nowhere and still references season 2024/25 and Supercup `/jogos/233`. `/taca/sorteio` + `hooks/taca/sorteio/useCupMatches.js` are the legacy 2024 bracket with a hardcoded season and match id — either delete or make season-driven.

---

#### `[D3]` Remover o import não usado de `supabase` em `app/page.js`

`🟡 Médio` `Código` `S` `Risco baixo` · step **0.3.2** · ✅ Verified 2026-09-29

`src/app/page.js` imports `supabase` and never uses it. Three-line file.

---

#### `[B18]` Reescrever os triggers de standings em SQL set-based

`🟡 Médio` `BD` `M` `Risco médio` · step **2.4.1** · ✅ Verified 2026-09-29

`update_discipline_standings()` does `UPDATE discipline_standings SET ... WHERE true` — it resets and recomputes **every season** from the full match history on every single card insert, update or delete. `reset_and_recalculate_league_standings()` loops match by match with ~6 UPDATEs each. Fine at this size, but a set-based rewrite (or views) is simpler and removes the "rows must exist" problem behind `[B17]`.

---

### ⚪ Low / later

Carried from `docs/archive/02_IMPROVEMENTS.md`, not re-verified in this pass. They belong on the board but not in the next three phases.

| ID | Title | Area | Effort | Step |
|---|---|---|---|---|
| `[M4]` | Bottom navigation em telemóvel | Mobile | M | 1.3.3 |
| `[M5]` | Página de jogo: layout mobile empilhado | Mobile | M | 4.3 |
| `[M6]` | Diálogos de admin em `fullScreen` no telemóvel | Mobile | S | 3.x |
| `[M7]` | Calendário: swipe e lista de jornadas com scroll | Mobile | M | 4.2 |
| `[M8]` | Tap targets com no mínimo 44px | A11y | S | 4.x |
| `[M9]` | Títulos decorativos empurram o conteúdo para fora do ecrã | Mobile | S | 4.x |
| `[M10]` | PWA leve: manifest, ícones e `theme-color` | Mobile | S | 5.1 |
| `[P4]` | Server Components com `revalidate` nas páginas de consulta | Performance | L | 5.4 |
| `[P5]` | Agregar marcadores, disciplina e histórico em SQL | Performance | M | 2.4.1 |
| `[P6]` | Metadata por rota em vez de `document.title` | SEO | S | 5.2 |
| `[C1]` | Introduzir React Query | Código | M | 1.2.2 |
| `[C2]` | Mover as queries Supabase para `src/api` | Código | M | 1.2.x |
| `[C3]` | Época na URL via `useSelectedSeason` | Código | S | 1.2.3 |
| `[C4]` | Dividir os componentes gigantes | Código | L | 4.7 |
| `[C5]` | Extrair a lógica de domínio para `src/utils` com testes | Código | M | 1.2.5 |
| `[C6]` | Constantes para event types, competition types e rondas | Código | S | 1.2.4 |
| `[C8]` | Migração incremental para TypeScript | Código | L | — (declined 2026-09-27) |
| `[C9]` | Tratar erros em vez de 38 `console.error` silenciosos | Código | M | 4.x |
| `[C10]` | Vitest e React Testing Library | Código | S | 1.2.1 |
| `[C11]` | Escolher uma abordagem de estilo e remover Tailwind | Código | M | 5.5 |
| `[D4]` | Alinhar a estrutura de pastas com a convenção alvo | Código | — | 1.1 |
| `[D5]` | Limpar ~50 branches remotos obsoletos | Código | S | 5.7 |
| `[B13]` | `window.confirm` inconsistente com os diálogos MUI | Código | S | 4.7 |

---

## 4. Open questions (own list on the board)

Each of these blocks at least one card. `[Q1]`–`[Q3]` and `[Q6]` need Ricardo or the league regulation; the rest are lookups.

| ID | Question | Blocks |
|---|---|---|
| `[Q1]` | Duplo amarelo (`event_type` 5): conta como 1 vermelho (20 pts), como 2 amarelos (10 pts), ou não conta? Retroativo ou só daqui para a frente? | `[B16]` |
| `[Q2]` | A Supertaça conta para a classificação disciplinar? Hoje os cartões contam mas os jogos não. | `[N5]` |
| `[Q3]` | Amarelos da Taça contam para os 3 = suspensão? | `[B7]` |
| `[Q4]` | Qual é o domínio público do site? (para `metadataBase` e `sitemap.xml`) | `[N2]`, `[N10]` |
| `[Q5]` | Existe imagem Open Graph 1200×630 da liga? Senão o logo fica com padding branco no WhatsApp. | `[N2]` |
| `[Q6]` | O formulário de inscrição recolhe consentimento para publicação de foto e nome? Se não, `[N3]` sobe de prioridade. | `[N3]` |
| `[Q7]` | "Allow new users to sign up" está desligado no Supabase Auth? Step 0.1.2 está ticado mas convém reconfirmar. | — |
| `[Q8]` | Correr os Supabase Advisors (Security + Performance) e colar o resultado. | `[N11]` |
| `[Q9]` | Correr o Lighthouse mobile no Preview URL **depois** do `[N1]`. | `[N9]` |

---

## 5. Checked and found OK

Recorded so nobody re-audits these.

| Area | Finding |
|---|---|
| Secrets | No `service_role` key anywhere in the source. Only `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, read from `process.env` (`src/lib/supabase.ts`), with `.env.example` committed. `S2` is genuinely done. |
| Write path | There are **no** API routes, server actions or middleware. Every write goes browser → Supabase, protected by RLS. This is the correct Supabase model, not a gap. |
| RLS | `docs/db/01_security_fix.sql` applied 2026-09-27, verified by `02_verify_security.sql` (`verify_report_2026-09-27.txt`, all OK). `public.is_admin()` is `security definer` with `set search_path = ''` and compares `lower(email)` on both sides. ⚠️ `tables_rls.txt`, `policies.txt` and `anon_grants.txt` in `docs/db/` are still the **pre-fix** snapshot — regenerate them. |
| Rate limiting | Not proposed. All reads are public and anonymous through PostgREST; Supabase already applies project-level limits and the audience is a few dozen people per matchweek. The real problem is a page firing 30 queries per navigation — `[P7]`, `[B4]`, `[N7]` are the fix that matters. |
| Viewport meta | Next.js 14 injects `width=device-width, initial-scale=1` by default, so the page is not zoomed out despite `[N2]`. `theme-color` is still missing. |
| Horizontal overflow | Only one `100vw` (`admin/login/page.jsx:76`, a full-screen page) and three fixed `minWidth: 200px` (`MatchCard.jsx:544`, `CupMatchCard.jsx:561`, `GroupStageHeader.jsx:61`). Not a widespread problem. |
| Season label in nav | Already reads `currentSeason.description` (commit `14a9ed1`). Only shown on desktop (`NavAppBar.jsx:184`, `!isMobile`) — minor, folded into `[M2]`. |
| Lint | 64 warnings, 0 errors. 44 are `no-img-element` (→ `[P1]`), the rest `react-hooks/exhaustive-deps`. |

---

## 6. Estimated Lighthouse mobile

⚠️ **Hypothesis, not a measurement.** Reasoned from bundle sizes, query waterfalls and image weights. Replace with real numbers via `[Q9]`.

| Page | Perf. | LCP | CLS | INP | Dominant cause |
|---|---|---|---|---|---|
| `/` (classificação) | ~40–55 | 4–6 s | 0,2–0,4 | 150–300 ms | Static empty shell → 3 chained queries (`seasons` → `matches` → `standings`) only after 216 kB of JS hydrate; ~20 logo PNGs (one 796 kB); `.main-content` margin jump |
| `/equipas/[teamname]` | ~25–40 | 6–10 s | 0,2–0,4 | — | Squad photos averaging 274 KB rendered at 80px; `select("*")` |
| `/jogos/[id]` | ~30–45 | 5–8 s | 0,2–0,4 | 200–400 ms | 335 kB (jspdf) + fetch of every player of every season |

`/` is `○ (Static)` — good TTFB, but the HTML carries no data, so LCP is always post-hydration. `[P4]` (Server Components + `revalidate`) is what fixes this at the root.

---

## 7. Suggested phase order

Slots into `docs/ROADMAP.md`.

**Fase 1 — quick wins (≈1 week, low risk).** `[N1]` first and alone. Then `[N2]`, then the one-liners `[B1]` `[B14]` `[B9]` `[B10]` `[P3]`, then `[M3]`+`[B12]`+`[N8]` as one PR, then `[B4]`+`[P7]`+`[N7]`, then `[D1]`+`[N13]` (with `dayjs` in its own commit) `[D2]` `[D3]`, then `[N6]`+`[N10]`.

> Current status of each item: see [`ROADMAP.md`](ROADMAP.md) (this file no longer tracks it).

**Fase 2 — segurança e dados (≈2 weeks).** `[S4]` first (backup routine — replaces staging, see card). Then `[N3]`, `[N4]`+`[B6]`, `[B15]`+`[N5]`+`[B16]`+`[B17]`, `[N11]`, `[E2]`+`[C7]`, `[P1]`+`[P2]`.

**Fase 3 — otimizações.** `[M1]`+`[M2]`+`[N9]`, `[C1]`–`[C3]`, `[P4]`, `[P5]`, `[M10]`.

> `[P1]` (WebP conversion) does not have to wait for Phase 2 — converting the images and updating the URLs recovers ~95% of the image payload today, independently of the Storage migration.
