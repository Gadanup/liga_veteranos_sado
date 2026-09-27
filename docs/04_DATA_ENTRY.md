# 04 — Making Data Entry Less Painful

> Season setup, players, transfers, results, suspensions: today almost all of this is done by hand in the Supabase dashboard (plus committing photos to git and redeploying).
> This doc lists the pain points, then proposes fixes in 3 tiers, so we can start small.
> **Nothing applied yet.** Items marked 🗄 need a DB change — do those on a staging copy first (see `02_IMPROVEMENTS.md` S4).

---

## 1. Current workflows and their pain

| Task | How it's done today | Pain |
|---|---|---|
| **New season** | Insert `seasons` row, flip `is_current`; insert a **new `teams` row for every team** (logo, stadium, jerseys, manager…) copying last year's; update every player's `team_id` (or create players again?); set `joker`; edit hardcoded season strings in code (nav, PDF, docs, Supertaça link) and redeploy | Dozens of manual rows, easy to forget a team/player, code change needed |
| **New player** | Insert `players` row; export/crop photo; commit PNG to `public/team_photos/<team>/<name>.png`; type the path into `photo_url`; deploy | Needs a developer + git + deploy for every signing. Photos not resized (avg 274 KB, up to 8.6 MB) |
| **Transfer** | Edit player: `previousClub = old team id`, `team_id = new team id`, `transferDate`; move/copy the photo | Only **one** previous club is remembered; every screen reinterprets these 3 fields (source of recent bug fixes) |
| **Fixtures** | Draw done in an external app → Excel (`CALENDARIO_2025-2026.xlsx`) → matches created one by one in the calendar "Criar jogo" dialog or in the dashboard | ~160 league matches + cup, one dialog each |
| **Result + events** | Match page → Edit → type score → Events tab → pick player in a long dropdown + event type + minute → "Adicionar" → repeat per event | Many taps per goal; nothing checks that goals = score; suspended players hidden |
| **Suspensions** | Discipline modal: add suspension by hand when 3rd yellow/red; later deactivate by hand | Easy to forget to create **or** to deactivate; `matches_suspended` isn't used |
| **Season end** | Fill `season_winners` by hand (winners, top-3 scorers + goals, discipline) | All of it is already computable from the data |

---

## 2. Tier 1 — Quick wins (no schema change, days)

| ID | Item |
|---|---|
| E1 | **SQL helpers** (Supabase SQL editor / migration) run by an admin: `start_new_season(new_season_id, description)` — creates the season, copies all non-excluded teams from the current season with the same attributes, flips `is_current`, **and inserts the per-team rows in `league_standings` and `discipline_standings`** (the triggers only update existing rows — forgetting this hides the team from the tables). Returns the old→new team id map. *(Player handling depends on the open question in `01_APP_OVERVIEW.md` §8.)* |
| E2 | **Remove every season hardcode** from code (`01_APP_OVERVIEW.md` §7) → new season = no deploy. Add `seasons.supercup_match_id`, `seasons.regulation_url`, `seasons.registration_form_url`, `seasons.calendar_url`, `seasons.transfer_window_start/end`. |
| E3 | **Quick result entry** in the edit dialog: score steppers (− / +), and for each goal a player picker **filtered to the scoring team**, with search (MUI `Autocomplete`), sorted by who played/scored before. Warning chip when *goal events ≠ score*. |
| E4 | Show **all** registered players in the event picker (don't hide currently-suspended ones — mark them instead). |
| E5 | **Photo pipeline script**: `npm run photos:optimize` → resizes every PNG in `public/team_photos` to 400 px WebP. One-off 116 MB → ~10 MB. |
| E6 | Claude Code skills (see §5) that generate reviewed SQL for new season / transfer / new players from a pasted list. |

## 3. Tier 2 — Fix the model (🗄 schema changes, the real fix)

### E7 🗄 `player_registrations` — transfer history
```sql
create table player_registrations (
  id          bigint generated always as identity primary key,
  player_id   bigint not null references players(id),
  team_id     bigint not null references teams(id),   -- season-specific team row
  season      bigint not null references seasons(id),
  joker       boolean not null default false,
  shirt_number smallint,
  valid_from  date not null,
  valid_to    date,                                   -- null = still registered
  unique (player_id, season, valid_from)
);
```
- A transfer = set `valid_to` on the current registration + insert a new one. **Unlimited history**, and past seasons keep their squads.
- Squad of a team = registrations with that `team_id`. "Team at date X" = the registration whose range contains X — **one SQL function**, used by every screen instead of 4 JS re-implementations.
- Migration: one registration per existing player (+ one for `previousClub` using `transferDate`). Keep `players.team_id/previousClub/transferDate` during the transition, remove later.

### E8 🗄 `match_events.team_id`
Filled automatically by a trigger (`team at match date` from E7) and editable. Goalscorers, discipline and match page then read it directly — no more transfer logic in the frontend. Backfill once with the same function.

### E9 🗄 Stable team identity (`clubs`) — optional
Add `teams.club_id` (or a `slug` like `sport-clube-sado`) so the same club is linked across seasons: stable URLs (`/equipas/sport-clube-sado`), all-time stats, history page from data instead of the hardcoded blogspot list. Also allows **name aliases** ("SPORT SADO", "IDOLOS PRAÇA" in the Excel ↔ `short_name` in the DB) for imports.

### E10 🗄 Automatic suspensions
Trigger on `match_events` insert:
- 3rd/6th/9th yellow (league) → insert suspension (1 match), red / double yellow → suspension (N matches per regulation).
- Suspension auto-expires: `active` becomes a computed status = team has played ≥ `matches_suspended` matches after `suspension_date`.
- Admin UI still allows manual suspensions (reason, extra matches) and overrides.
> The yellow-card rule must be confirmed against the regulation (league-only? reset for cup?) before automating.

### E11 🗄 Season winners computed
A view (or a "Fechar época" admin button that snapshots it) computing league/cup/supercup winners, top scorers and discipline winner from existing tables → `season_winners` never typed again.

## 4. Tier 3 — Admin area in the app (`/admin`)

A small, mobile-friendly back office, only for admins (protected by RLS, see S1):

| Screen | What it does |
|---|---|
| **Épocas → Nova época (wizard)** | 1) name + dates + transfer window → 2) pick teams from last season (checkboxes, edit stadium/manager/jerseys inline, add new team) → 3) carry players over: each team's list pre-filled from last season, untick who left, mark jokers → 4) review summary → create. Calls E1/E7 functions in one transaction. |
| **Jogadores** | Search by name, filter by team. Add player (name, team, joker, photo). **Bulk add**: paste a list from the registration forms/WhatsApp ("Nome;Equipa;Joker") → preview → insert. Photo upload with crop → Supabase Storage, auto-resized (removes git/deploy from the loop). |
| **Transferências** | Player autocomplete → destination team → date (validated against the season's transfer window, e.g. 25/01–25/02) → shows what changes (events/suspensions stay with old team) → confirm. |
| **Calendário → Gerar / Importar** | Either **generate** a double round-robin from the season's teams (with constraints like "max 3 home games in Pinhal Novo per round", "Curvas & Santo Ovídio alternate") or **import CSV** (`jornada;data;hora;casa;fora;campo`) with a preview and team-name matching. Replaces ~160 manual inserts. |
| **Jogo (resultado rápido)** | E3 as a full-screen mobile form: score, goal scorers per team, cards, done — designed to be filled at the pitch on a phone. |
| **Disciplina** | List of automatic suspensions (E10) with "served / pending" state, manual add/override, team punishments. |
| **Fechar época** | Review computed winners (E11), confirm, archive. |

---

## 5. Claude Code skills & rules created for the project

Added in `.claude/skills/` (usable by both of you in Claude Code with `/<name>`):

| Skill | Use |
|---|---|
| `/new-season` | Walks through the new-season checklist; generates the SQL to create the season + copy teams + carry players, for review before running; lists code hardcodes still to update. |
| `/transfer-player` | Given "player X from team A to team B on date D", generates the SQL (current model) and checks for pending suspensions / events after the date. |
| `/add-players` | Turns a pasted list (names + team + joker) into reviewed `insert` SQL and a checklist for photos (naming + resize). |
| `/mobile-check` | Reviews a page/component against this project's mobile rules (breakpoints, no `window.innerWidth`, tap targets, etc.). |

And a project `CLAUDE.md` with this app's real stack and conventions (Next.js App Router, not Vite), so Claude doesn't apply the Growth-Project defaults blindly.

> Skills generate SQL **for you to review and run** in the Supabase SQL editor — they never write to the database themselves.

---

## 6. Suggested order

1. E2 + E5 + E3/E4 (no DB change, immediate relief).
2. On a staging copy: E7 + E8 (+ backfill) → switch screens to read from them → then E10, E11.
3. Admin area screens in the order they'll be needed next: **Nova época** + **Jogadores** (before registrations open) → **Calendário import/generate** → **Transferências** (before the January window) → the rest.
