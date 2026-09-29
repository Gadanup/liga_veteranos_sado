# 02 — Improvement Points

> ⚠️ **Superseded by `06_AUDIT_BACKLOG.md` (2026-09-29).**
> That document carries every item below **plus** the findings of the 2026-09-29 audit, says which
> ones were re-verified against the current code, and is the version mirrored on the Trello board.
> **Work from `06` and from Trello.** This file is kept for the original reasoning and the root-cause
> analysis in §3 ("why mobile keeps breaking"), which `06` references instead of repeating.
> IDs are the same in both (`M3`, `B1`, `P7`…), so nothing has to be renumbered.

> Prioritised list of what to improve: bugs, mobile, code, structure, performance, security.
> Each item has an ID so we can say "let's do M3" or "B2".
> **Nothing in this document has been applied yet.** Every change should be done in its own small PR and checked with `npm run build` + a manual pass on a phone-sized viewport.

Priority: 🔴 do first · 🟠 soon · 🟡 when touching that area · ⚪ nice to have

---

## 1. Security & data safety (verify first)

| ID | Pri | Issue | Where | Proposal |
|---|---|---|---|---|
| S1 | ✅ | ~~RLS off on 12 tables + anon key could INSERT/UPDATE/DELETE/TRUNCATE everything; admin emails public; season_winners writable by any user.~~ **Fixed 2026-09-27** with `docs/db/01_security_fix.sql`, verified by `02_verify_security.sql` (all OK). | whole DB | Remaining: turn off public sign-ups in Auth settings; new tables must get the same `public_read`/`admin_write` policies. |
| S2 | 🟠 | Supabase URL + anon key are hardcoded in `src/lib/supabase.ts` and the code *assigns* to `process.env`. `.env.local` exists but is ignored. | `src/lib/supabase.ts` | Read from `process.env.NEXT_PUBLIC_SUPABASE_*` (the commented block already does it) and add `.env.example`. Set the env vars in Vercel **before** merging. Anon key isn't secret, but this is what allows a staging project. |
| S3 | 🟡 | `admin_users` lookup uses `.eq("email", user.email)`; emails differing only in case won't match. | `useIsAdmin`, login page | Compare lower-cased or store lower-cased. |
| S4 | ⚪ | No staging DB — admin testing happens on production data. | — | Create a free second Supabase project for testing (branching or `pg_dump` of schema + sample data). |

---

## 2. Bugs found while reading the code

| ID | Pri | Bug | Where |
|---|---|---|---|
| B1 | 🔴 | **Switching season on `/taca` between two seasons of the same format doesn't reload data.** `LeagueCupView`/`KnockoutCupView` copy the `currentSeason` prop into state on mount only and there's no `key`, so they keep showing the previous season. | `app/taca/page.jsx:203-206` → add `key={currentSeason.id}` (1-line fix) |
| B2 | 🟠 | Goalscorer lists credit goals to the player's **current** `team_id`. A player who transferred mid-season shows all goals under the new team, and old seasons show the player's *current* team. | `hooks/liga/marcadores/useGoalscorersData.js`, `hooks/taca/marcadores/useCupGoalscorersData.js` |
| B3 | 🟠 | Match event team attribution relies on `team_id`/`previousClub`. If the same player appears in both lists (transfer between the two teams playing), they're forced into "home". A player with 2 transfers in a season loses history. | `app/jogos/[id]/page.jsx:127-144`, `components/features/jogos/EditMatchDialog.jsx:122-133` |
| B4 | 🟠 | Match page loads **all players of all seasons** (`players` without filter) just to split home/away. | `app/jogos/[id]/page.jsx:111-113` |
| B5 | 🟠 | Suspended players are hidden from the event editor *at the time you edit*, not at the time of the match. Editing an old match after a player got suspended means you can't add his goal. | `components/features/jogos/EditMatchDialog.jsx:136-141` |
| B6 | 🟡 | Result (`home_goals`) and events are saved independently: nothing warns when 3–1 is saved with 2 goal events. | `EditMatchDialog.jsx` |
| B7 | 🟡 | "At risk" players (next yellow = suspension) count yellows from **all competitions** of the season and iterate all players ever. Confirm this is the rule (league-only?). | `hooks/liga/disciplina/useDisciplineData.js:96-138` |
| B8 | 🟡 | Team links use the raw `short_name` in the URL (`/equipas/${short_name}`) without `encodeURIComponent` in some places (names with accents/spaces like "Águias S. Gabriel"). Works in most browsers but fragile; renaming a team breaks shared links. | `ClassificationRow.jsx:190`, others |
| B9 | 🟡 | `calendário` page calls `router.push` on every load to write `?week=`, adding a history entry → the phone "back" button needs 2 taps. Use `router.replace`. | `app/liga/calendario/page.jsx:123`, `app/taca/calendario/page.jsx:144` |
| B10 | 🟡 | Cup calendar week keys depend on `window.innerWidth` **at fetch time** ("1" on mobile vs "Jornada 1" on desktop) → a URL shared from a phone doesn't resolve on desktop and vice-versa. | `app/taca/calendario/page.jsx:78-87` |
| B11 | 🟡 | `/jogos/[id]` page: "Carregar dados do Jogo" shown when match not found (should be "Jogo não encontrado"); `error` state is set but never rendered. | `app/jogos/[id]/page.jsx:210-218` |
| B12 | ⚪ | `ClassificationRow` hover effect is done with `onMouseEnter` mutating `style` → on touch devices the row stays "lifted" after tapping. | `ClassificationRow.jsx:210-222`, `ClassificationTable.jsx:110-117` |
| B13 | ⚪ | `window.confirm` used to delete punishments — works, but inconsistent with the rest (MUI dialogs). | `EnhancedDisciplineModal.jsx:429` |
| B14 | 🟠 | `LeagueCupView` and `KnockoutCupView` select `start_year, end_year` from `seasons` — **those columns don't exist** (`start_date`, `end_date`). The query errors silently, so their internal season list is always empty. | `LeagueCupView.jsx:60`, `KnockoutCupView.jsx:90` |
| B15 | 🟠 | **Deleting a played match doesn't update the league table**: the standings trigger fires on `INSERT, UPDATE` only (not `DELETE`), so the table stays stale until another match is edited. | DB trigger `trigger_recalculate_league_standingsnew` |
| B16 | 🟡 | Discipline points count `event_type = 3` (red) and `2` (yellow) only — **double yellow (`5`) isn't counted** anywhere in `discipline_standings`. Confirm the rule (e.g. = 1 red or 2 yellows). | DB function `update_discipline_standings()` |
| B17 | 🟡 | Standings rows are only UPDATEd by the triggers — if a team's `league_standings`/`discipline_standings` row wasn't inserted at season start, the team silently doesn't appear. | DB triggers (see `04_DATA_ENTRY.md` E1) |
| B18 | ⚪ | `update_discipline_standings()` recomputes **all seasons** on every event insert; `reset_and_recalculate_league_standings()` loops match-by-match with ~6 UPDATEs each. Fine at this size, but a set-based rewrite (or views) would be simpler and removes the "rows must exist" problem. | DB |

---

## 3. Mobile (the historical pain point)

### Root causes — why mobile keeps breaking
1. **Three different mobile breakpoints**: `layout.js` uses `≤599`, most components `≤768`, `Nav` uses MUI `sm` (600). Between 600 and 768 px (large phones in landscape, small tablets) the app is half "mobile" and half "desktop".
2. **`window.innerWidth` read during render** in 13 components (`MatchHeader`, `MatchStatistics`, `TeamSquads`, `WeekNavigator`, `CalendarHeader`, `EditMatchDialog`, `TeamSelectors`, …). It is not reactive: rotating the phone or resizing doesn't update the layout, and it's the reason some pages must be client-only.
3. **Layout margins set by DOM manipulation** (`document.querySelector(".main-content").style...` in `layout.js`). On first paint the content has no top margin → it renders *under* the fixed app bar and then jumps (layout shift).
4. **JS-driven layout instead of CSS**: `isMobile ? A : B` props passed through 42 files, and a separate `viewportWidth` → grid-template map in the league table. MUI's responsive `sx` values (`{ xs: …, md: … }`) do this in CSS with zero JS.
5. **Hover-only interactions** (tooltips for form guide, hover to expand drawer, `onMouseEnter` styles) have no touch equivalent.

### Items

| ID | Pri | Item |
|---|---|---|
| M1 | 🔴 | Add a real MUI theme (`createTheme` + `ThemeProvider`) with **one** set of breakpoints, and replace every `window.innerWidth` / `useMediaQuery("(max-width: 768px)")` with `sx={{ prop: { xs, sm, md } }}` or `useMediaQuery(theme.breakpoints.down("md"))`. |
| M2 | 🔴 | Replace the DOM margin hack in `layout.js` with a proper layout: `Toolbar` spacer + `Box component="main"` with responsive `ml`. Remove the "drawer expands on hover and pushes the whole page" behaviour (it reflows every page on each mouse pass) — overlay the drawer instead. |
| M3 | 🔴 | **League table on phones shows only logos, no team names** (the name column is 50 px and name is hidden on `xs`). This is the home page. Proposal: on `xs` show `Pos · Logo + short name · J · DG · Pts`, with W/D/L/G behind a tap (expand row) or horizontal scroll with a sticky team column. |
| M4 | 🟠 | **Mobile bottom navigation** (Liga · Taça · Jogos · Equipas · Mais) instead of a full-screen modal menu. Thumb-reachable and always visible. |
| M5 | 🟠 | Match page on mobile: header uses fixed `width: 160px` blocks and 11 px text; events/squads columns side-by-side. Stack vertically, use a single timeline of events (home left / away right), squads as tabs. |
| M6 | 🟠 | Admin dialogs: `CreateMatchDialog` / cup dialogs aren't `fullScreen` on mobile (the edit one is). Use `fullScreen={isSmall}` everywhere + native `type="date"` / `type="time"` inputs. |
| M7 | 🟠 | Calendar: swipe between matchweeks + a horizontally scrollable chip list of weeks (current week centred) instead of only prev/next arrows. |
| M8 | 🟡 | Touch targets: several icon buttons/chips are < 40 px; form-guide dots 18 px with hover tooltip. Minimum 44 px tap targets; replace hover tooltips with tap/expand. |
| M9 | 🟡 | Big decorative headings (e.g. "Jornada X" at 48 px, 30 % opacity) push content below the fold on phones. |
| M10 | 🟡 | Add `viewport` + `theme-color` metadata and a web manifest → "Add to home screen" makes it feel like an app (see `03_UI_REDESIGN.md`). |

---

## 4. Code quality

| ID | Pri | Item |
|---|---|---|
| C1 | 🟠 | **Introduce React Query** (`@tanstack/react-query`): one `useGetSeasons()` instead of the same `fetchSeasons` copy-pasted in 9 pages; caching between page navigations; `invalidateQueries` after admin mutations instead of manual `onUpdate` → refetch chains. *(new dependency — needs your OK)* |
| C2 | 🟠 | Move Supabase queries out of components into `src/api/` (query keys + functions), hooks in `src/hooks/` or per feature. Components become presentational. |
| C3 | 🟠 | **Selected season in the URL** everywhere (`?season=2025`) via one `useSelectedSeason()` hook. Today some pages use the URL, some local state; switching page resets the season. |
| C4 | 🟠 | Split the giant components: `EnhancedDisciplineModal.jsx` (2038 lines) → tabs as separate components + hooks; `MatchCard`/`CupMatchCard` (~630 lines each, ~90 % identical) → one `MatchCard` with a `variant`; `EditMatchDialog` (liga) vs `EditCupMatchDialog` vs `jogos/EditMatchDialog` → one form. |
| C5 | 🟠 | Pure domain logic into `src/utils/` + unit tests: standings sort & H2H tiebreaker (`classificacao/page.jsx:175-304`), form guide, "which team was this player on at date X", yellow-card suspension rule. These are the rules that break silently. |
| C6 | 🟡 | Constants: event types (`1..5`) are redefined in several files; competition types as raw strings `"League" | "Cup" | "Supercup"`; round names `"Semi 1" | "Semifinal" | "Final"`. → `constants/enum.ts`. UI strings (Portuguese) → `constants/const.ts`. |
| C7 | 🟡 | Remove season hardcodes (see `01_APP_OVERVIEW.md` §7): read from `seasons` (`is_current`, `description`), add `seasons.supercup_match_id`, `seasons.regulation_url`, etc. |
| C8 | 🟡 | TypeScript migration, incrementally: generate `database.types.ts`, turn on `allowJs` + `strict` for new files, convert `lib/`, `api/`, `utils/` first. Fix `@types/react` 17 → 18. |
| C9 | 🟡 | Error handling: 38 `console.error` with silent empty UI. Surface errors with the shared `ErrorMessage` / a snackbar; React Query gives `isError` for free. |
| C10 | ⚪ | Tests (Vitest + RTL) starting with C5 utilities, then hooks. None exist today. |
| C11 | ⚪ | Pick **one** styling approach: MUI `sx`/`styled` + theme tokens. Remove Tailwind (only 1 class used) and raw `style={{}}` (≈ 100 occurrences, mostly league table + cup groups). |

---

## 5. Structure & dead code

| ID | Pri | Item |
|---|---|---|
| D1 | 🟠 | Remove unused deps: `@mui/toolpad`, `@mui/material-nextjs`*, `@supabase/auth-helpers-nextjs`, `@supabase/ssr`*, `html2canvas`, `pdf-lib`, `lucide-react`, `react-material-ui-carousel`. ⚠ **`dayjs` is only installed because of `@mui/toolpad`** → add `dayjs` explicitly *before* removing toolpad or the build breaks. (*keep if we adopt them in P2/S2) |
| D2 | 🟡 | Delete unused `components/Footer.jsx` (414 lines, stale season), and decide on `/taca/sorteio` + `hooks/taca/sorteio/useCupMatches.js` (legacy 2024 bracket, hardcoded) — either delete or make it season-driven and reuse in `KnockoutCupView`. |
| D3 | 🟡 | `src/app/page.js` imports `supabase` without using it; `ThemeWrapper` context is only used by one page — remove after M1. |
| D4 | 🟡 | Align folder structure with the Growth-Project convention, adapted to Next.js: `app/` stays for routes (thin), `src/modules/<feature>/{components,hooks}` for features, `src/api`, `src/constants`, `src/utils`, `src/types`. Can be done feature by feature. |
| D5 | ⚪ | Clean ~50 stale remote branches. |

---

## 6. Performance

| ID | Pri | Item |
|---|---|---|
| P1 | 🔴 | **Images**: 429 player photos in `public/` = 116 MB, avg 274 KB, one 8.6 MB. They're rendered with `<img>`/`Avatar` at 24–80 px. On mobile data this is the single biggest slowness. → Convert to WebP ≤ 400 px (≈ 20–40 KB each) and/or use `next/image`. Also bloats the git repo. |
| P2 | 🟠 | Move photos/logos to **Supabase Storage** (bucket `players/`, `teams/`) — upload from the admin UI, no commit/deploy needed for a new photo. (Ties into `04_DATA_ENTRY.md`.) |
| P3 | 🟠 | `jspdf` is bundled in the match page (335 kB first load). Load it with `await import("jspdf")` only when the user taps "download". |
| P4 | 🟡 | Server Components for read-only pages (standings, calendar, team, history) with `revalidate` → HTML arrives with data, great on slow phones, and better SEO/link previews. Requires moving the client layout (`layout.js` is `"use client"`) to a server layout + client `Nav`. |
| P5 | 🟡 | Aggregate in SQL instead of JS: goalscorers (`match_events` counted client-side in batches of 1000), discipline at-risk list, history page (N+1 team queries per top scorer). Create views/RPCs. |
| P7 | 🟠 | Every calendar `MatchCard` / `CupMatchCard` runs **its own** `suspensions` query on mount (N+1: 6–7 queries per matchweek, more on the cup pages). Fetch active suspensions once per page and pass them down. | `liga/calendario/MatchCard.jsx:50-76`, `taca/calendario/CupMatchCard.jsx` |
| P6 | ⚪ | `document.title` set in `useEffect` → use Next `metadata` per route (proper titles on shared links: "Sado 2-1 Pontes · Jornada 5"). |

---

## 7. Suggested order of work

1. **Safety net**: ~~S1~~ (done), B1 (1-line fix), D1 with `dayjs` fix, S2.
2. **Foundation**: M1 (MUI theme + breakpoints), M2 (layout), C1/C2/C3 (React Query + api layer + season hook) on one page first (Classificação) as the template.
3. **Mobile pass page by page**: Classificação (M3) → Calendário (M7) → Jogo (M5) → Equipa → Taça → Disciplina.
4. **Data entry** improvements (see `04_DATA_ENTRY.md`) — they need the DB changes, so do them before next season's registration window.
5. **Redesign** (see `03_UI_REDESIGN.md`) applied as part of each page's mobile pass, not as a separate big-bang.
