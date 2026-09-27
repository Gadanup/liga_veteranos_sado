# Implementation Plan

> The single ordered plan for everything we're improving: fixes, code structure, mobile, UI redesign, database and admin tools.
> Work through it step by step and reference steps precisely ("let's do step 2.3.1").
> Details live in the other docs; this file says **what, in which order, and when it's done**:
> backlog IDs (`B1`, `M3`, `C1`…) → `02_IMPROVEMENTS.md` · screens (§4.x) → `05_SCREEN_SPECS.md` · data entry (`E1`…) → `04_DATA_ENTRY.md`.

---

## 0. Decisions (2026-09-27)

| Topic | Decision |
|---|---|
| Approach | **Incremental** inside the current Next.js app. The site keeps working and ships after every step. |
| Deadline | **Season 2026/27 setup in 1–3 months** → milestone **"Season-ready"** (end of Phase 3) comes before the public redesign is finished. |
| React Query | ✅ approved (`@tanstack/react-query`) |
| Tests | ✅ Vitest + React Testing Library |
| Photos | ✅ Supabase Storage (upload from the admin area) |
| TypeScript | ❌ not now — new code stays **JavaScript** (`.js/.jsx`). `src/types/database.types.ts` stays as the schema reference. |
| Admin area | ✅ full `/admin` back office (Phase 3) |
| Language | UI in European Portuguese; code/docs in English |

## 1. How we work (every step)

Full conventions (branch names, commit format, PR template, merging): **`CONTRIBUTING.md`**. Claude uses the `/ship` skill.

1. Branch from `main`: `<type>/<step>-<short-name>` (e.g. `fix/0.2.1-taca-season-key`, `feat/1.3.1-app-shell`).
2. One step (or a few tiny ones) per PR. No unrelated refactors.
3. Before merging: `npm run build` ✅ · `npm run lint` (no new warnings) ✅ · `npm test` ✅ (from Phase 1) · `/mobile-check` on changed UI.
4. Test on a **real phone using the Vercel Preview URL** of the PR, plus 360 / 390 / 768 / 1440 px in the browser.
5. DB changes: numbered SQL file in `docs/db/` (`NN_name.sql`) + rollback + verify script → run on **staging** first (step 0.1.3), then production via SQL Editor. Regenerate `src/types/database.types.ts` after.
6. Tick the checkbox here in the same PR.

Sizes: **S** ≈ an evening · **M** ≈ 2–3 evenings · **L** ≈ a week of evenings.

---

## Phase 0 — Safety net & quick fixes  *(~1 week)*

Goal: fix known bugs and risks without changing how anything looks.

### 0.1 Security & environment
- [x] **0.1.0** Project audit docs, DB types, Claude rules/skills, commit & PR conventions (`CONTRIBUTING.md`, PR template) — *branch `docs/project-audit`*
- [x] **0.1.1** RLS + permissions fix (S1) — *done 2026-09-27*
- [x] **0.1.2** Disable public sign-ups in Supabase Auth; add Vercel env vars `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production + Preview); commit `src/lib/supabase.ts` reading from env + `.env.example` (S2). **S**
  *Done when:* Preview and Production deploys load data; no key in source.
- [ ] **0.1.3** Staging Supabase project (free plan allows 2): copy schema + a sample of data; `.env.local` for dev points to staging (S4). **M**
  *Done when:* `npm run dev` never touches production; DB scripts are tested there first.

### 0.2 Bug fixes (no UI change)
- [ ] **0.2.1** `/taca` season switch keeps old data → `key={currentSeason.id}` (B1). **S**
- [ ] **0.2.2** Cup views query non-existent `start_year/end_year` → `start_date/end_date` (B14). **S**
- [ ] **0.2.3** Calendars: `router.replace` for `?week=` (B9); cup week keys independent of screen width (B10). **S**
- [ ] **0.2.4** Match page: "Jogo não encontrado" + render `error` state (B11); don't hide currently-suspended players in the event editor (B5/E4). **S**
- [ ] **0.2.5** Suspensions fetched once per calendar page instead of per card (P7). **S**

### 0.3 Dependencies & dead code
- [ ] **0.3.1** Add `dayjs` to `package.json`, then remove `@mui/toolpad`, `@supabase/auth-helpers-nextjs`, `html2canvas`, `pdf-lib`, `lucide-react`, `react-material-ui-carousel` (keep `@mui/material-nextjs`, `@supabase/ssr` for later) (D1). **S**
  *Done when:* build passes, bundle smaller, every page still works.
- [ ] **0.3.2** Delete `components/Footer.jsx`, unused import in `app/page.js`; `/taca/sorteio` → redirect to `/taca?season=2024`, delete `useCupMatches` + sorteio components (D2, D3). **S**
- [ ] **0.3.3** Lazy-load `jspdf` on click (P3). **S**

---

## Phase 1 — Foundations  *(~2 weeks)*

Goal: the new structure, theme, shell and data layer, so every later step builds on the same base. Old pages keep working inside the new shell.

### 1.1 Target folder structure (created progressively, not moved all at once)
```
src/
  app/                    ← routes only (thin pages), incl. app/admin/**
  api/                    ← Supabase calls + React Query keys, one file per domain
    queryKeys.js  seasons.js  matches.js  standings.js  teams.js  players.js
    events.js  discipline.js  cup.js  history.js  storage.js
  components/
    ui/                   ← shared kit (05_SCREEN_SPECS §3): TeamBadge, MatchCard, StandingsTable…
    layout/               ← AppShell, TopBar, BottomNav, Sidebar, MoreSheet, PageHeader
  constants/  const.js (PT strings)  enum.js (competition, event types, rounds)
  hooks/                  ← app-level: useSelectedSeason, useIsAdmin  (+ test/)
  lib/        supabaseClient.js  queryClient.js
  modules/<feature>/      ← home, standings, fixtures, match, team, scorers, discipline,
    components/ hooks/      cup, gallery, history, info, admin/{seasons,players,transfers,
                            fixtures,results,discipline}
  theme/      theme.js  (createTheme, 05_SCREEN_SPECS §1.1)
  types/      database.types.ts  (generated, reference only)
  utils/      pure logic (+ test/)
```
Old `components/features/**` and `hooks/**` are deleted **as each page is rewritten** (Phase 4), never in bulk.

### 1.2 Tooling & data layer
- [ ] **1.2.1** Vitest + React Testing Library setup (`npm test`), jsdom, path alias `@/`. **S**
- [ ] **1.2.2** React Query: `lib/queryClient.js`, provider, `api/queryKeys.js`, `api/seasons.js` + `useGetSeasons`. **S**
- [ ] **1.2.3** `useSelectedSeason()` (URL `?epoca=`, alias `season`, `router.replace`) + tests (C3). **S**
- [ ] **1.2.4** `constants/enum.js` (competition types, event types 1–5, cup rounds) and `constants/const.js` (start with shared strings) (C6). **S**
- [ ] **1.2.5** Extract pure logic to `utils/` **with tests**, no behaviour change (C5):
  `sortStandings` + H2H tiebreaker (from `classificacao/page.jsx`), `buildFormGuide`, `playerTeamAtDate`, yellow-card suspension rule. **M**
  *Done when:* current table order is reproduced by the tests for 2024 and 2025 data samples.

### 1.3 Theme & shell
- [ ] **1.3.1** `theme/theme.js` (light + dark, typography, breakpoints, component defaults) + Barlow Condensed via `next/font` (§1.1–1.2). **S**
- [ ] **1.3.2** Server `app/layout.js` + client `AppProviders` (AppRouterCacheProvider → ThemeProvider → CssBaseline → QueryClientProvider), `metadata`, `viewport`; remove DOM margin hack (M2, P6). **M**
- [ ] **1.3.3** `AppShell`: TopBar with global SeasonSwitcher, **BottomNav** (mobile), **Sidebar** (desktop, no hover-expand), **Mais** sheet; `navigationConfig` as single source; Supertaça link temporarily unchanged (§2, M4). **M**
  *Done when:* every existing page renders correctly inside the shell at 360 / 1440 px.
- [ ] **1.3.4** Replace every `window.innerWidth` / hardcoded `768`/`599` with theme breakpoints — mechanical, no redesign (M1). **M**

### 1.4 UI kit
- [ ] **1.4.1** Base kit: `TeamBadge`, `PlayerAvatar`, `PageHeader`, `SectionCard`, `StatTile`, `EmptyState`, `ErrorState`, skeletons, `ResponsiveDialog`, `SegmentedTabs` (§3). **M**
- [ ] **1.4.2** Match & table kit: `MatchCard` (all variants), `StandingsTable`, `FormGuide`, `WeekStrip`, `EventTimeline` (§3) + component tests for the tricky bits (ties, penalties, excluded teams). **L**
- [ ] **1.4.3** Hidden `/dev/ui` page showing all components (admin-only). **S**

---

## Phase 2 — Database & data model  *(~2 weeks, can run in parallel with 1.3/1.4)*

Goal: remove the causes of manual work and transfer bugs. Every step = `docs/db/NN_*.sql` + rollback + verify, staging first.

- [ ] **2.1.1** Season settings columns: `seasons.supercup_match_id`, `regulation_url`, `registration_form_url`, `calendar_url`, `transfer_window_start/end` (E2). **S**
- [ ] **2.1.2** Remove every season hardcode from code using 2.1.1 (nav "Época", PDF header, docs page, Supertaça link → `/supertaca` route, stadium rule in `MatchHeader`) (C7, §4.10). **M**
  *Done when:* `grep -rnE "20[0-9]{2}/(20)?[0-9]{2}|jogos/[0-9]+" src` finds nothing season-specific.
- [ ] **2.2.1** Standings triggers: recalc on **DELETE** (B15); auto-create `league_standings`/`discipline_standings` rows when a team is inserted (B17); decide double-yellow rule and apply (B16 — confirm with regulation). **M**
- [ ] **2.2.2** `match_events.team_id` + trigger filling it from `playerTeamAtDate` + one-off backfill (E8). **M**
- [ ] **2.2.3** Switch goalscorers, discipline, match page and event editor to read `match_events.team_id` (B2, B3, B4) — delete the duplicated transfer logic. **M**
- [ ] **2.3.1** Supabase Storage buckets `players/`, `teams/`, `rosters/` (public read, admin write policies) + `api/storage.js` upload helper with client-side resize to WebP ≤ 400 px (P2, E5). **M**
- [ ] **2.3.2** Migrate existing `public/team_photos`, `team_logos`, `team_roster` to Storage (script: optimize → upload → update URLs in DB, on staging first), then remove them from the repo (P1). **M**
- [ ] **2.4.1** SQL aggregations: top scorers view/RPC, discipline at-risk view, history page single query (P5). **M**
- [ ] **2.5.1** *(optional, decide at this point)* `player_registrations` transfer history (E7) and stable club identity/slug (E9). **L**

---

## Phase 3 — Admin area  *(~3 weeks)* → 🏁 **Milestone: Season-ready**

Goal: a new season, players, transfers, fixtures and results can be managed from the app, on a phone, without SQL. Built with the Phase 1 kit. Specs: `04_DATA_ENTRY.md` Tier 3.

- [ ] **3.1.1** `/admin` layout: route guard (redirect to login if not admin), admin home with shortcuts; login redirect back via `?next=` (§4.15). **S**
- [ ] **3.2.1** **Nova época** wizard: dates/transfer window → pick & edit teams from last season → carry players into new rows (per-season model) → review → create in one DB function (E1). **L**
- [ ] **3.3.1** **Jogadores**: search/filter, add/edit player, joker (max 2 per team), photo upload (2.3.1). **M**
- [ ] **3.3.2** Bulk add: paste list → preview with team matching/aliases → insert (E6 / `/add-players` logic). **M**
- [ ] **3.4.1** **Calendário**: import CSV (`jornada;data;hora;casa;fora;campo`) with preview; **generate** double round-robin with constraints as a second option. **L**
- [ ] **3.5.1** **Resultado rápido**: score steppers, goal scorers per team (autocomplete), cards, warning when goals ≠ events (E3, B6). Replaces the match-page edit dialog. **M**
- [ ] **3.6.1** **Transferências**: player → destination team → date (validated against transfer window), impact preview (uses 2.2.2). **M**
- [ ] **3.7.1** **Disciplina**: automatic suspensions trigger (3 yellows / red / double yellow per regulation) + auto-expiry by matches played; admin override/manual add (E10). **L**
- [ ] **3.8.1** Admin docs: short "how to start a season" guide in `docs/ADMIN_GUIDE.md` (PT). **S**

🏁 **Season-ready check**: create season 2026/27 on **staging** end-to-end from the admin area (teams, players with photos, fixtures, a result, a transfer, a suspension) → then do it for real on production.

---

## Phase 4 — Public redesign, page by page  *(ongoing, 1 page ≈ 1 PR)*

Each page: rewrite into `modules/<feature>`, use kit + React Query + `useSelectedSeason`, delete the old components it replaces, meet the **definition of done** in `05_SCREEN_SPECS.md` §6.

- [ ] **4.1** Classificação + CompareTeamsDialog (§4.2) — fixes M3, B12
- [ ] **4.2** Calendário Liga + Taça (§4.3, §4.9) — M7, B8
- [ ] **4.3** Jogo + Supertaça (§4.4, §4.10) — M5
- [ ] **4.4** Início — new home (§4.1); `/` stops being the standings page
- [ ] **4.5** Equipa + new Equipas list (§4.5, §4.12)
- [ ] **4.6** Marcadores Liga/Taça + PlayerSheet (§4.6)
- [ ] **4.7** Disciplina + TeamDisciplineSheet (§4.7) — splits the 2038-line modal (C4)
- [ ] **4.8** Taça: League Cup + knockout (§4.8)
- [ ] **4.9** Galeria, Histórico, Informação, Admin login (§4.11–4.15)

---

## Phase 5 — Polish & cleanup

- [ ] **5.1** PWA: manifest, icons, `theme-color`, "Adicionar ao ecrã principal" (M10).
- [ ] **5.2** Open Graph images / per-page metadata for WhatsApp previews (§4.4).
- [ ] **5.3** Dark mode review on every page.
- [ ] **5.4** Server Components + `revalidate` for read-only pages (P4).
- [ ] **5.5** Remove Tailwind, `styles/theme.js`, `ThemeWrapper`, leftover `components/features/**`, `hooks/**` (C11, D4).
- [ ] **5.6** Fechar época: computed season winners (E11) + history from DB.
- [ ] **5.7** Clean stale git branches (D5); update `README.md` and `01_APP_OVERVIEW.md`.

---

## Timeline at a glance

```
Week   1     2     3     4     5     6     7     8     9    10+
P0   ████
P1         ██████████
P2               ██████████          (parallel with P1 kit)
P3                           ███████████████  🏁 Season-ready
P4                                             ██████████████ →
P5                                                        ███ →
```
If the season date moves closer: do **0.x → 1.2 → 2.1 → 2.2.1 → 3.1 → 3.2 → 3.3 → 3.5** first (the minimum to run a season from the app) and push the rest back.
