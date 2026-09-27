---
name: new-season
description: Prepare a new Liga Veteranos do Sado season — generates reviewed SQL to create the season, copy teams from the current season, carry players over, and lists the code hardcodes still to update. Use when the user says "new season", "nova época", or "start 2026/2027".
---

# New season setup

You generate SQL and a checklist. **Never execute writes against Supabase** — the project is production. The user runs the SQL in the Supabase SQL editor.

## 1. Gather inputs (ask only for what's missing)

- New season id (= start year, e.g. `2026`) and description (e.g. `2026/2027`).
- Cup format this season: knockout or League Cup (`cup_group_stage`).
- Teams leaving / joining / renamed compared with the current season.
- Players carry-over: **this league creates new player rows each season** (confirmed 2026-09-27, see `docs/01_APP_OVERVIEW.md` §8). Old-season rows must stay untouched — they hold that season's squads and events.
- Players leaving each team (or "none, I'll fix later").

## 2. Generate SQL (one transaction, reviewed)

Read `docs/01_APP_OVERVIEW.md` §4 for columns. Template:

```sql
begin;

insert into seasons (id, description, is_current, cup_group_stage, start_date, end_date)
values (:new_id, ':description', false, :cup_group_stage, ':start_date', ':end_date');

-- copy teams (skip excluded/leaving ones)
insert into teams (season, short_name, name, logo_url, stadium_name, founded, main_color, alternative_color,
                   main_jersey, alternative_jersey, manager_name, manager_photo_url, roster_url, excluded)
select :new_id, short_name, name, logo_url, stadium_name, founded, main_color, alternative_color,
       main_jersey, alternative_jersey, manager_name, manager_photo_url, null, false
from teams
where season = :current_id and not coalesce(excluded, false)
  and short_name not in (/* leaving teams */);

-- old→new team id map (short_name is unique within a season)
create temporary table team_map as
select o.id as old_id, n.id as new_id, n.short_name
from teams o
join teams n on n.short_name = o.short_name and n.season = :new_id
where o.season = :current_id;

-- players: new row per player for the new season (old rows stay with the old season)
insert into players (name, photo_url, team_id, joker)
select p.name, p.photo_url, m.new_id, false
from players p join team_map m on p.team_id = m.old_id
where p.id not in (/* leaving players */);

select * from team_map;   -- review before commit
-- standings rows: the triggers only UPDATE existing rows, so every team needs one
insert into league_standings (team_id, season_year, matches_played, wins, draws, losses, goals_for, goals_against)
select new_id, :new_id, 0, 0, 0, 0, 0, 0 from team_map;
insert into discipline_standings (team_id, season, matches_played, yellow_cards, red_cards, other_punishments, excluded)
select new_id, :new_id, 0, 0, 0, 0, false from team_map;

-- then: update seasons set is_current = (id = :new_id);
commit;
```

- Columns are in `src/types/database.types.ts` — check it (regenerate if stale) before producing SQL.
- Quote camelCase columns (`"previousClub"`, `"transferDate"`).
- Flipping `is_current` is a separate, last step — the site switches season the moment it runs.
- Players are copied from their team **at the end of last season** (`team_id` after transfers). Jokers reset to false — mark them again.

## 3. Checklist to hand back

- [ ] New teams: logo in `public/team_logos/`, row inserted.
- [ ] Jokers marked (max 2 per team, see `JokersInfoCard`).
- [ ] Code hardcodes (until `02_IMPROVEMENTS.md` C7 is done) — grep and list each with file:line:
  `grep -rnE "20[0-9]{2}/(20)?[0-9]{2}|jogos/[0-9]+|season === 20" src`
  (nav "Época", PDF header in `MatchSheetDownload.jsx`, Supertaça link in `navigationConfig.js`, documentation page + `QuickActionsGrid.jsx` files, `SorteioHeader.jsx`).
- [ ] New documents in `public/docs/` (regulation, registration form, calendar).
- [ ] Previous season: `season_winners` row filled.
- [ ] Flip `is_current` last, then check `/`, `/liga/calendario`, `/taca` on a phone.
