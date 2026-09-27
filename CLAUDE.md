# Liga Veteranos do Sado — Project rules for Claude

Public site + light admin for the Setúbal veterans football league. Small team, PRs into `main`.
**Work follows `docs/IMPLEMENTATION_PLAN.md`** (numbered steps, e.g. "step 2.2.1"; tick the checkbox in the same PR). Read `docs/01_APP_OVERVIEW.md` before non-trivial work. Improvement backlog: `docs/02_IMPROVEMENTS.md` (IDs like `M3`, `B1`). Design direction: `docs/03_UI_REDESIGN.md`. Data-entry plan: `docs/04_DATA_ENTRY.md`.

## This project differs from the Growth-Project defaults

The global CLAUDE.md describes a Vite + React Router + TS template. **This app is Next.js 14 App Router, mostly JavaScript.** Apply the global conventions (import order, hook structure, named exports, no `any`, strings in constants, React Query for server state) to **new or rewritten code**, but:

- Routes live in `src/app/**/page.jsx` (Next.js). Keep pages thin. Target structure is in `IMPLEMENTATION_PLAN.md` §1.1 (`api/`, `components/ui`, `components/layout`, `constants/`, `modules/<feature>/`, `theme/`, `utils/`); old `components/features/**` is removed only when its page is rewritten.
- No React Router, no Vite. Use `next/navigation` (`useRouter`, `useSearchParams`, `useParams`).
- **JavaScript only** (`.js/.jsx`) — TypeScript was not approved (2026-09-27). `src/types/database.types.ts` is a schema reference, not imported by JS.
- Approved stack additions: **React Query** (`@tanstack/react-query`), **Vitest + React Testing Library**, **Supabase Storage** for images. Any other new dependency still needs the user's OK.
- Do not refactor surrounding code while fixing something else — the app has no tests, so every unrelated change is a regression risk.

## Git & PRs

- Follow `CONTRIBUTING.md`: branches `<type>/<plan-step>-<desc>` from latest `origin/main`, Conventional Commits `<type>(<scope>): <subject>`, PR body from `.github/pull_request_template.md`, squash merge. Use the `/ship` skill. Never push to `main`.

## Commands

- `npm run dev` — local dev (uses production Supabase! see Safety)
- `npm run build` — must pass before any PR
- `npm run lint` — 0 errors expected (warnings exist, don't add new ones)
- `npm test` — Vitest (once step 1.2.1 is done)

## Safety

- The Supabase project is **production**. Never run insert/update/delete against it from scripts or the CLI. Generate SQL for the user to review and run.
- Admin checks in the UI (`useIsAdmin`) are cosmetic — real protection is RLS. Never "fix" a permission error by loosening RLS. Since 2026-09-27 every table has RLS: public read, writes only when `public.is_admin()` (email in `admin_users`) — `docs/db/01_security_fix.sql`, verified by `docs/db/02_verify_security.sql`. New tables must get the same `public_read` / `admin_write` policies.
- Reading DB metadata is fine with `npx supabase db query --linked --project-ref dmsocybvdzdzafpemybt "<select …>"` (read-only SELECTs only). Regenerate types after schema changes: `npx supabase gen types typescript --project-id dmsocybvdzdzafpemybt --schema public > src/types/database.types.ts`.
- `dayjs` is imported everywhere but only installed transitively via `@mui/toolpad`. Add it to `package.json` before removing toolpad.

## Domain rules (read before touching data logic)

- `seasons.id` is the year the season starts (e.g. `2025` = 2025/2026). Current season = `is_current = true`. Never hardcode a season in code.
- `teams` has **one row per team per season** (`teams.season`). A `team_id` always implies a season.
- `players` rows are **per season**: each season a new row is created for every registered player (the same person has one row per season, not linked). 41 rows have `team_id = null`.
- `players.team_id` = current team; `previousClub` + `transferDate` = the one previous team this season. A player's team for a past event: `transferDate && event_date < transferDate ? previousClub : team_id`.
- `matches.competition_type`: `"League" | "Cup" | "Supercup"`. League uses `week`; cup uses `round` (`"8"`, `"4"`, `"2"`, `"1"` for knockout; `"Semi 1"`, `"Semi 2"`/`"Semifinal"`, `"Final"` for League Cup) and `group_name` for group stage. `seasons.cup_group_stage` selects the cup format.
- `match_events.event_type`: `1` goal, `2` yellow, `3` red, `4` own goal, `5` double yellow. No `team_id` on events.
- `league_standings` / `discipline_standings` are **tables** filled by DB triggers (on `matches`, `match_events`, `team_punishments`); `points` and `calculated_points` are generated columns (`wins*3+draws`, `red*20+yellow*5+other_punishments`). Triggers only UPDATE existing rows — each team needs a row per season. Schema: `src/types/database.types.ts`; triggers/policies: `docs/db/`.
- League standings order: points → H2H points → H2H goal diff → H2H away goals → overall goal diff → goals for. Excluded teams and teams with 0 games go last. Logic in `src/app/liga/classificacao/page.jsx`.
- Discipline: 3 yellows = suspension (warning shown at 2, 5, 8…). Suspensions are created/deactivated manually.
- UI language is **European Portuguese** (Jornada, Época, Taça, Supertaça, Classificação, Golos, Equipa). Code and docs in English.

## Mobile rules (the #1 recurring problem)

- Breakpoints come only from the MUI theme (`theme.breakpoints`). Never use `window.innerWidth` in render, never hardcode `768`/`599`.
- Prefer responsive `sx` values (`{ xs: ..., md: ... }`) over `isMobile ? a : b` props.
- No hover-only interactions; tap targets ≥ 44px; no fixed pixel widths on content containers.
- Check every UI change at 360px, 390px, 768px and desktop widths.

## Images

- Player/team images are in `public/` today. New images: WebP, ≤ 400px wide, `camelCase` filename under `public/team_photos/<teamFolder>/`.
