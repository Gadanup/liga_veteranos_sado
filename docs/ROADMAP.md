# Roadmap

> **The only place that says what to do next.** Every other doc explains *how* or *why* and never tracks status.
>
> **How to use it**
> 1. Look at **NOW** — pick the item with your name (or claim a free one by writing your name).
> 2. Details of any item → follow its ID to [`backlog.md`](backlog.md) (problems, evidence, fixes) or the step to the reference docs.
> 3. The PR that finishes an item **moves it to DONE in the same PR** (the `/ship` skill does this).
> 4. NOW holds **max 2 items per person**. When yours is done, pull the top of NEXT up.
> 5. Lost? Run **`/next`** in Claude Code — it reads this file, checks git, and tells you what's next.

Doc map: [`README.md`](README.md) · backlog: [`backlog.md`](backlog.md) · reference: [`reference/`](reference/) · SQL: [`db/`](db/) · conventions: [`../CONTRIBUTING.md`](../CONTRIBUTING.md)

---

## 🔥 NOW

| Item | Owner | Details |
|---|---|---|
| Insert the 2026/27 **cup group** fixtures — season starts 17/10 | Claudio | The league is in: 182 matches across 26 matchweeks, verified in the DB on 2026-10-03. `competition_type = 'Cup'` still has 0 matches for 2026. |
| Quick fix: `start_year/end_year` in cup views (B14) | Claudio | [`backlog.md`](backlog.md) B14 · the two #127/#122 regressions in this row were taken by Ricardo |
| *free slot* | Ricardo | pick from NEXT |

---

## ⏭️ NEXT (in order)

1. **Backup routine setup** — `npx supabase link` is done; what remains is the first `supabase/schema.sql` (git) + data dump (private folder). **Blocks parts 2 and 3 of `db/06_discipline_rules.sql`**, which is where most of the discipline work pays off. Replaces the staging project (see Decisions). — *owner: Claudio*
2. **Vercel preview deployments are failing** — every preview since at least #149, including PRs already merged. Reproduced locally: with `.env.local` removed, `npm run build` fails on 15 pages with `Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY`, thrown during prerender. Most likely the Supabase vars are set for **Production** only and not **Preview** in the Vercel project. Until this is fixed, the "tested on a real phone" check cannot be met by any PR — which is the check that catches mobile regressions. — *owner: Claudio*
3. **Apply the SQL already merged** — `db/04_indexes.sql` (#151, biggest win for the least risk) and part 1 of `db/06_discipline_rules.sql` (#152). Parts 2 and 3 wait for item 1.
4. **Phase 0 leftovers — queries**: suspended players hidden from the event editor for old matches (B5). Step 0.2.4b. *(B4 done in #138; P7 + N7 in #150.)*
5. **Phase 1 tooling**: Vitest (1.2.1) → React Query (1.2.2) → `useSelectedSeason` (1.2.3) → constants (1.2.4) → domain utils with tests (1.2.5). **Vitest before any Phase 4 redesign** — the app has no tests, and #145 shipped a crash to production because nothing caught an undefined name.

---

## ❓ Blocked — waiting for an answer

| Question | Blocks | Who answers |
|---|---|---|
| Q6 — Does the registration form collect consent to publish photo and name? | N3 | League |

*Answered:* Q1 double yellow counts as a red, 20 pts, current season onwards (B16) · Q2 yes, the Supertaça counts — cards already did, `matches_played` did not (N5) · Q3 yes, cup yellows count (regulation, Discipline art. 1: "no jogo seguinte (taça ou liga)") (B7) · Q4 domain = `https://liga-veteranos-sado.vercel.app` · Q5 yes, `public/logo/og.jpg` (in #140) · Q7 public sign-ups are off (done in 0.1.2).

---

## 🗺️ LATER — phases and steps

Step IDs are used in branch names (`<type>/<step>-<desc>`). Item IDs (B1, M3…) → [`backlog.md`](backlog.md). Screen § → [`reference/screen-specs.md`](reference/screen-specs.md). E-items → [`reference/data-entry.md`](reference/data-entry.md).

### Phase 1 — Foundations
- **1.2.1** Vitest + RTL (`npm test`) · **1.2.2** React Query + `api/` · **1.2.3** `useSelectedSeason` (C3) · **1.2.4** `constants/enum.js`, `const.js` (C6) · **1.2.5** domain logic → `utils/` with tests (C5)
- **1.3.1** `theme/theme.js` (M1) · **1.3.2** server layout + `AppProviders`, remove DOM margin hack (M2, N2, N9, P6) · **1.3.3** AppShell: bottom nav, sidebar, Mais sheet (M4) · **1.3.4** replace every `window.innerWidth` / 768 (M1)
- **1.4.1** base UI kit · **1.4.2** MatchCard, StandingsTable, FormGuide, WeekStrip, EventTimeline · **1.4.3** `/dev/ui` page

### Phase 2 — Database & data  *(each change: backup first → SQL + rollback + verify → schema.sql updated)*
- **2.0.1** Stop exposing player personal data (N3) · **2.0.2** result validation + CHECK constraints (N4, B6)
- **2.1.1** `seasons` settings columns (E2) · **2.1.2** remove remaining season hardcodes + `/supertaca` route (C7)
- **2.2.1** standings triggers: recalc on delete (B15), auto-create standings rows (B17), double yellow (B16), Supertaça cards (N5) · **2.2.2** `match_events.team_id` + backfill (E8) · **2.2.3** screens read it (B2, B3, B4)
- **2.3.1** Supabase Storage + upload helper (P2) · **2.3.2** convert photos to WebP and migrate (P1)
- **2.4.1** SQL aggregations (P5), indexes (N11), set-based triggers (B18) · **2.5.1** *(optional)* transfer history / stable club id (E7, E9)

### Phase 3 — Admin area → 🏁 Season-ready
- **3.1.1** `/admin` shell + guard · **3.2.1** Nova época wizard (E1) · **3.3.1** Jogadores · **3.3.2** bulk add players
- **3.4.1** Calendário import/generate · **3.5.1** Resultado rápido (E3, B6) · **3.6.1** Transferências · **3.7.1** automatic suspensions (E10) · **3.8.1** `ADMIN_GUIDE.md`

### Phase 4 — Public redesign, one page per PR ([`reference/screen-specs.md`](reference/screen-specs.md) §4, done-criteria §6)
- **4.1** Classificação (§4.2) *(mobile columns done in #124)* · **4.2** Calendário (§4.3, §4.9) *(strip + swipe done in #127)* · **4.3** Jogo + Supertaça (§4.4) · **4.4** Início (§4.1)
- **4.5** Equipa + Equipas (§4.5, §4.12) · **4.6** Marcadores (§4.6) · **4.7** Disciplina (§4.7, C4) · **4.8** Taça (§4.8) · **4.9** Galeria, Histórico, Informação, Login

### Phase 5 — Polish
- ~~**5.1** PWA icons 192/512 + theme-color (M10)~~ *(done in #140)* · **5.2** OG images per page · **5.3** dark mode · **5.4** Server Components + revalidate (P4) · **5.5** remove Tailwind / old theme / old components (C11, D4) · **5.6** Fechar época, computed winners (E11) · **5.7** branch cleanup (D5)
- *Optional:* staging Supabase project (S4) — only if the project grows or DB changes get riskier.

---

## ✅ DONE (newest first)

| Date | What | PR / ref |
|---|---|---|
| 2026-10-03 | Disciplina: adding a punishment refetches instead of reloading the browser (which silently reset the season); the page reads only the selected season's players — step 4.7 partial | #153 |
| 2026-10-03 | Discipline SQL written against the regulation, **not yet applied**: read-only detection views (the 3-yellow rule reproduces 46 of 46 suspensions of 2025) and the corrected calculation — double yellow as a red, 25 pts per suspension game, Supertaça in `matches_played`, `seasons.discipline_locked` so closed seasons are never recalculated. Answers Q1, Q2, Q3 — step 3.7.1 (E10), N5, B16, B7 | #152 |
| 2026-10-02 | The 17 missing indexes (N11), **not yet applied** — 40 foreign keys had no supporting index; `teams` was scanned 4.3M times for 42 rows — step 2.4.1 | #151 |
| 2026-10-01 | One suspensions query per calendar page instead of one per match card (P7, N7) — step 0.2.5 | #150 |
| 2026-10-01 | **M1 closed** — every breakpoint now comes from the theme: Equipas, Galeria and Jogos converted, finishing step 1.3.4 (Liga #145, Taça #146) | #149 |
| 2026-09-30 | Hotfix: league calendar crashed ("useMediaQuery is not defined", regression from #145); ESLint `no-undef` now fails the build on any undefined name | #148 |
| 2026-09-30 | Photos for the new Pontes and Sado players 2026/27 | #147 |
| 2026-09-30 | Server layout with real page metadata and WhatsApp link previews; CSS offsets replace the DOM margin hack; `CssBaseline` moved off `Nav`, so the login page finally gets it (M2, N9, N2, P6) — step 1.3.2 | #144 |
| 2026-09-30 | **Rebrand to the crest's navy and gold**, with a real MUI theme behind it: theme mounted mirroring the old look, then the palette and fonts switched, nav colours read from tokens (M1, C11 partial, closes M10, answers Q5) — step 1.3.1 | #139, #140, #141, #142, #143 |
| 2026-09-30 | Match page fetches only the two squads instead of every player of every season (B4, B8) | #138 |
| 2026-09-30 | Calendars keep the season on back-navigation — `?week=10&season=2025` no longer rewrites itself to the current season (precursor to C3 / step 1.2.3) | #137 |
| 2026-09-30 | Security headers, `poweredByHeader` off, admin check no longer case-sensitive, env-var build failure documented (N6, S3, N12) — step 0.3.4 | #136 |
| 2026-09-30 | `Footer.jsx` and `useCupMatches` deleted, `/taca/sorteio` redirects, unused import dropped (D2, D3) — step 0.3.2 | #135 |
| 2026-09-30 | `jspdf` loads on click: `/jogos/[id]` 335 kB → 224 kB (P3) — step 0.3.3 | #134 |
| 2026-09-30 | Team page mobile pass: calendar as stacked rows (no horizontal scroll), header name full width, page chrome trimmed — step 4.5 partial | #133 |
| 2026-09-30 | Stale hardcoded "qualificou-se automaticamente" note removed from the cup bracket (C7 partial) | #132 |
| 2026-09-30 | Cup knockout rounds labelled "Oitavos de Final"…"Final" instead of "J8"…"J1" — regression from #127 | #130 |
| 2026-09-30 | Match page mobile pass: reactive breakpoints, readable type at 360px, error state resets (M5 minimal, B11 follow-up) | #131 |
| 2026-09-29 | Docs restructure: `ROADMAP.md` as single status, `README.md`, `reference/`, `archive/`; `/next` skill; backup routine replaces staging | #128 |
| 2026-09-29 | `/sync-trello` skill — Trello as a read-only mirror of this file (follow-up to #128, which it missed by a minute) | #129 |
| 2026-09-29 | Calendar matchweek strip, swipe, no giant "Jornada X"; cup week keys independent of screen width (M7, M9, B10) — step 4.2 partial | #127 |
| 2026-09-29 | robots.txt, sitemap.xml, web manifest (N10) — step 0.3.4 | #126 |
| 2026-09-29 | `dayjs` declared, 6 unused deps removed, `.npmrc` legacy-peer-deps (D1, N13) — step 0.3.1 | #125 |
| 2026-09-29 | Standings readable on phones, touch-safe hover, points badge contrast (M3, B12, N8) — step 0.2.6 | #124 |
| 2026-09-29 | Audit backlog (now `backlog.md`) | #119, #123 |
| 2026-09-29 | Match page "Jogo não encontrado" + error state (B11) — step 0.2.4 partial | #122 |
| 2026-09-29 | Calendars use `router.replace` for `?week=` (B9) — step 0.2.3 | #121 |
| 2026-09-29 | `/taca` season switch reloads data (B1) — step 0.2.1 | #120 |
| 2026-09-29 | Supertaça shows the match's own stadium; menu link → 2026/27 match (C7 partial) | #118 |
| 2026-09-28 | Team page no longer crashes without a roster photo | #117 |
| 2026-09-28 | Nav + PDF show the current season instead of 2025/2026 (C7 partial) | #116 |
| 2026-09-28 | Logos of the 3 new 2026/27 teams | #115 |
| 2026-09-28 | Season 2026/27 set up in DB: season, 14 teams, standings rows, Supertaça match 437 (manual) | — |
| 2026-09-27 | Supabase URL/key from env vars; public sign-ups off (S2) — step 0.1.2 | #114 |
| 2026-09-27 | RLS security fix applied and verified (S1) — step 0.1.1 | `docs/db/01_security_fix.sql` |
| 2026-09-27 | Project audit docs, DB types, Claude skills, conventions — step 0.1.0 | #113 |

---

## Decisions

| Date | Topic | Decision |
|---|---|---|
| 2026-09-27 | Approach | **Incremental** inside the current Next.js app; the site ships after every step. |
| 2026-09-27 | Stack | ✅ React Query · ✅ Vitest + RTL · ✅ Supabase Storage · ❌ TypeScript (new code stays JS) · ✅ full `/admin` area |
| 2026-09-29 | Staging DB | ❌ **No staging project for now.** Before any critical DB change: dump **schema** → commit `supabase/schema.sql`; dump **data** → private folder (never git — the repo is public). Every SQL change keeps: one transaction, rollback file, check query, self-rolling-back verify script; avoid match days. |
| 2026-09-29 | Status tracking | This file is the **only** status tracker. `backlog.md` = item details, `reference/` = how/why. The Trello board is a **read-only mirror** generated by `/sync-trello` (needs the Trello connector in the session) — nobody moves cards there. |

Target code structure (created progressively): see [`reference/app-overview.md`](reference/app-overview.md) §9.
