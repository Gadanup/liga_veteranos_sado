# 01 — App Overview

> Snapshot of the app as of 2026-09-26 (branch `feature/h2h-standings-tiebreaker`, commit `4424584`).
> Purpose: a single place to understand what the app is, how it is built and how data flows, before changing anything.

---

## 1. What the app is

Public website for **Liga de Futebol Veteranos do Sado** (Setúbal veterans football league). It covers:

| Area | What users see | Route |
|---|---|---|
| **Liga** | League table (with H2H tiebreaker), fixtures by matchweek, top scorers, discipline table | `/liga/classificacao` (also `/`), `/liga/calendario`, `/liga/marcadores`, `/liga/disciplina` |
| **Taça** | Cup — two formats depending on season: *knockout bracket* or *League Cup* (groups + Final Four). Fixtures + top scorers | `/taca`, `/taca/calendario`, `/taca/marcadores` |
| **Supertaça** | A single match page (hardcoded match id) | `/jogos/256` |
| **Match page** | Score, events (goals/cards), squads, suspended players, PDF match sheet download | `/jogos/[id]` |
| **Team page** | Header, jerseys, next game, calendar tab, squad tab, season/team switchers | `/equipas/[teamname]?season=` |
| **Informação** | Draw/competition rules, documents (regulations, registration form, calendar xlsx) | `/informacao/sorteio`, `/informacao/documentacao` |
| **Galeria** | Team roster photos per season | `/galeria/equipas` |
| **Histórico** | Season winners (DB) + links to old blogspot seasons 2013–2024 (hardcoded) | `/historico` |
| **Admin** | Login (Supabase email/password + `admin_users` whitelist) | `/admin/login` |
| Legacy | Old 2024 knockout bracket (not in nav, hardcoded season `"2024"`) | `/taca/sorteio` |

### Admin capabilities (only visible when logged in as admin)
- Create / edit / delete league matches and cup matches (calendar pages).
- Edit match result, penalties, match-sheet link, and add/remove match events (match page FAB).
- Discipline: add suspensions, deactivate suspensions, add/remove team punishments (discipline modal).

### What admins **cannot** do in the app (done by hand in the Supabase dashboard)
- Create seasons, teams (teams are per-season rows), players.
- Transfers (`players.team_id`, `previousClub`, `transferDate`).
- Player photos, logos, rosters (files committed to `public/`, URL typed into the DB).
- Season winners (`season_winners`), documents, "current season" flag.

---

## 2. Tech stack (actual, not the Growth-Project default)

| Concern | What is used | Notes |
|---|---|---|
| Framework | **Next.js 14.2 (App Router)** | Every page is `"use client"`. The root `layout.js` is also a client component. |
| Language | **JavaScript (JSX)** | Only `src/lib/supabase.ts` is TS. `tsconfig` has `strict: false`. `@types/react` is v17 while React is v18. |
| UI | **MUI v6** + `@mui/icons-material` | **No `ThemeProvider`** — MUI runs on its default theme. |
| Styling | Mix of MUI `sx`, raw inline `style={{}}`, a custom JS theme object (`src/styles/theme.js`) and Tailwind (only used for `bg-background` + base heading styles in `globals.css`). |
| Custom theme | `src/styles/theme.js` (plain object, imported directly in ~every file) + `ThemeWrapper` context (used by one page). |
| Data | **Supabase JS v2** called directly from pages/components inside `useEffect`. No React Query, no caching, no generated types. |
| Auth | Supabase Auth email/password; `admin_users` table as whitelist; check done client-side in `useIsAdmin`. |
| PDF | `jspdf` (match sheet generation, drawn manually with coordinates). |
| Bracket | `react-brackets` (knockout cup desktop). |
| Dates | `dayjs` (transitive dependency — not declared in `package.json`). |
| Fonts | Geist (local woff) via `next/font/local`. |
| Tests | None. |
| Lint | `next/core-web-vitals` — 64 warnings, 0 errors. |
| Build | `next build` passes. Heaviest route `/jogos/[id]` = 335 kB first-load JS (jsPDF bundled eagerly). |

### Declared but unused dependencies
`@mui/toolpad`, `@mui/material-nextjs`, `@supabase/auth-helpers-nextjs`, `@supabase/ssr`, `html2canvas`, `pdf-lib`, `lucide-react`, `react-material-ui-carousel`, (probably) `@emotion/cache`.

---

## 3. Folder structure

```
src/
  app/                       ← Next.js routes (all client components)
    layout.js                ← client layout: Nav + DOM-manipulated margins
    page.js                  ← renders the classificação page
    (auth)/admin/login/
    liga/{classificacao,calendario,marcadores,disciplina}/
    taca/{page, calendario, marcadores, sorteio}/
    jogos/[id]/  equipas/[teamname]/  galeria/equipas/  historico/
    informacao/{sorteio,documentacao}/
  components/
    features/<area>/...      ← ~95 feature components (some 500–2000 lines)
    navigation/              ← Nav, NavAppBar, NavDrawer (desktop), NavMobileModal (mobile), config
    shared/                  ← EmptyState, ErrorMessage, LoadingSkeleton
    Footer.jsx               ← unused
    ThemeWrapper.js
  hooks/                     ← 5 hooks (admin, discipline, goalscorers x2, legacy cup)
  lib/supabase.ts            ← Supabase client (URL + anon key hardcoded)
  styles/theme.js            ← design tokens object
public/
  team_photos/<team>/<player>.png   ← 429 player photos, 116 MB, avg 274 KB, max 8.6 MB
  team_logos/  team_roster/  bolas/  docs/  logo/  fichajogosupertaca/
```

~27k lines of JSX. Biggest files: `EnhancedDisciplineModal.jsx` (2038), `EditMatchDialog.jsx` (817), `MatchCard.jsx` (636), `CupMatchCard.jsx` (633), `PlayersDetailsModal.jsx` (564), `FinalFourBracket.jsx` (560).

---

## 4. Data model (confirmed from generated types, `src/types/database.types.ts`, 2026-09-26)

```
seasons            id (= start year, e.g. 2025), description ("2025/2026"), is_current, cup_group_stage,
                   start_date, end_date, created_at
teams              id, season → seasons.id, short_name, name, logo_url, stadium_name, founded,
                   main_jersey, alternative_jersey, main_color, alternative_color,
                   manager_name, manager_photo_url, roster_url, excluded, excluded_description
                   ⚠ one row PER TEAM PER SEASON
players            id, name, photo_url, team_id → teams.id, joker, previousClub → teams.id, transferDate
                   + unused: number, position, birthdate, nationality, height, weight,
                     goals, assists, appearances, yellow_cards, red_cards
                   ⚠ only ONE previous club — no transfer history
matches            id, season, competition_type ('League' | 'Cup' | 'Supercup' — plain text), week, round,
                   group_name, home_team_id, away_team_id, home_goals, away_goals,
                   home_penalties, away_penalties, match_date, match_time, stadium_name, match_sheet
match_events       id, match_id, player_id, event_type → event_type.id, minute
                   (1 goal, 2 yellow, 3 red, 4 own goal, 5 double yellow)
                   ⚠ no team_id — team is derived from the player at read time
suspensions        id, player_id, suspension_date, matches_suspended, reason, active, season
team_punishments   team_punishment_id, team_id, punishment_type_id, event_date, description,
                   quantity, player_id, match_id, season
punishment_types   punishment_type_id, description, points_added
season_winners     season_id, league/cup/supercup/discipline winner ids, top_scorer_1..3 (+ goals),
                   discipline_yellow_cards, discipline_red_cards, supercup_match_path
cup_group_teams    season, group_name, team_id            (League Cup group draw)
admin_users        id, email
Unused by the app: competition_type, event_type (lookup tables), cup_matches, season_stats

Standings are TABLES maintained by TRIGGERS (not views):
league_standings      id, team_id, season_year, matches_played, wins, draws, losses, goals_for,
                      goals_against, home_*/away_* splits (never filled by the trigger),
                      points = GENERATED (wins*3 + draws)
                      ← trigger reset_and_recalculate_league_standings() on matches INSERT/UPDATE
discipline_standings  team_id (unique), season, matches_played, yellow_cards, red_cards,
                      other_punishments, excluded,
                      calculated_points = GENERATED (red*20 + yellow*5 + other_punishments)
                      ← trigger update_discipline_standings() on match_events and team_punishments
                      ⚠ both triggers only UPDATE existing rows → one row per team per season must be
                        inserted by hand at season start
Views:     cup_group_matches, cup_group_standings
Functions: get_group_standings_for_season, get_group_summary, get_qualified_teams_for_season (unused by app)
Full definitions: docs/db/ (tables_rls.txt, policies.txt, anon_grants.txt, triggers.txt, trigger_functions.sql)
```

### Things in the model that drive most of the complexity
1. **Teams are duplicated per season.** Every season a new row per team → all `team_id` references are season-specific.
2. **Transfers are a single `previousClub` + `transferDate` on the player.** Match page, event editor, discipline and goalscorers each re-implement "which team was this player on when this happened?". The last few bug-fix commits (`Fix issue regarding transfered players`, etc.) are all about this.
3. **`match_events` has no `team_id`**, so the above has to be guessed from the player.
4. **Suspensions are manual** (created by hand, deactivated by hand); `matches_suspended` isn't used to auto-expire.

---

## 5. How a page works (typical pattern)

```
page.jsx ("use client")
  useEffect → supabase.from("seasons")  → pick is_current  (copy-pasted in ~9 pages)
  useEffect[selectedSeason] → supabase.from(...)  → setState
  window.innerWidth / useMediaQuery → isMobile
  render feature components, passing theme / isMobile / router as props
```

- No caching: navigating between pages refetches seasons and everything else every time.
- Errors mostly go to `console.error` (38 calls) and the UI silently shows empty state.

---

## 6. Admin & security model

- `useIsAdmin` → `supabase.auth.getUser()` → looks up `admin_users` by email → toggles admin UI.
- **All protection of writes depends on Supabase RLS.** The client check only hides buttons.
- 🔴 **Checked 2026-09-26: RLS is OFF on 12 tables (matches, match_events, players, teams, suspensions, …) and the public `anon` key has INSERT/UPDATE/DELETE/TRUNCATE on all tables.** Anyone can modify or wipe the data from the browser. `admin_users` (admin emails) is publicly readable; `season_winners` is writable by any logged-in user.
  → ✅ **Fixed 2026-09-27**: `docs/db/01_security_fix.sql` applied; verified with `02_verify_security.sql` (report in `docs/db/verify_report_2026-09-27.txt`). Every table: public read, admin-only write via `public.is_admin()`.

---

## 7. Season-specific values hardcoded in code (must be edited every season)

| File | Value |
|---|---|
| `components/navigation/navigationConfig.js` | Supertaça link `/jogos/256` |
| `components/navigation/NavAppBar.jsx:192` | "Época 2025/2026" |
| `components/features/jogos/MatchSheetDownload.jsx:37` | PDF header "2025/26" |
| `components/features/jogos/MatchHeader.jsx:304,500` | Supertaça stadium by `season === 2024` |
| `components/features/informacao/documentacao/QuickActionsGrid.jsx` | Registration form + calendar file names 2025/2026 |
| `app/informacao/documentacao/page.jsx` | Regulation doc + dates |
| `components/features/informacao/sorteio/SorteioHeader.jsx` | "2025/2026" |
| `app/historico/page.jsx` | Blogspot seasons list |
| `hooks/taca/sorteio/useCupMatches.js` | `season "2024"`, match id `248` |
| `components/Footer.jsx` (unused) | "2024/25", Supertaça `/jogos/233` |

---

## 8. Open questions (to confirm)

1. ~~How are players carried to a new season?~~ **Answered (2026-09-27): a NEW player row is created every season** — players per season: 2024 → 309 rows, 2025 → 261 rows, plus 41 rows with `team_id = null`. So the same person has one `players` row per season (no link between them; career stats across seasons are not possible today — see `04_DATA_ENTRY.md` E7/E9). Original question: Given `teams` is per-season and `players.team_id` points at a season-specific team row: do you (a) create new player rows each season, or (b) update `team_id` to the new season's team row? The answer changes what old-season squads/goalscorers show and the migration plan in `04_DATA_ENTRY.md`.
2. ~~RLS policies~~ **Checked** — see §6 and `docs/db/`.
3. ~~Where is it deployed?~~ **Answered: Vercel.** Env vars `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` must exist in Vercel (Production + Preview) before `src/lib/supabase.ts` reads from env (S2). Staging Supabase project: none yet.
4. ~~Generated Supabase types~~ **Done** → `src/types/database.types.ts`; RLS / grants / triggers dump → `docs/db/`. See "How to generate" below.

### How to generate the DB types (Supabase CLI via npx, no install needed)
Run in a terminal (Git Bash) at the repo root:
```bash
npx supabase login          # opens the browser, one time; stores a token locally
npx supabase gen types typescript --project-id dmsocybvdzdzafpemybt --schema public > src/types/database.types.ts
```
> In Windows PowerShell 5.1 `>` writes UTF-16 — use Git Bash, or pipe to `Out-File -Encoding utf8`.
> Re-run the second command after every schema change. After `login`, Claude can run the generation itself.
