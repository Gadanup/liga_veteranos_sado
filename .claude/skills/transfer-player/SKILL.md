---
name: transfer-player
description: Register a mid-season player transfer in Liga Veteranos do Sado — generates reviewed SQL for the current players model (team_id / previousClub / transferDate) and flags side effects (suspensions, events, photo). Use for "transfer X to Y", "transferência", "mudou de equipa".
---

# Transfer a player

You produce SQL + a short impact report. **Never run writes against Supabase** (production). The user runs the SQL.

## Current model (until `player_registrations` from `docs/04_DATA_ENTRY.md` E7 exists)

- `players.team_id` = new team (season-specific `teams.id`)
- `players."previousClub"` = old team id — **only one is stored**
- `players."transferDate"` = date the transfer takes effect (events before it count for the old team)

## Steps

1. Get: player name, destination team, date. Default date = today; warn if outside the season's transfer window (check `public/docs/CALENDARIO_*.xlsx` notes or ask; 2025/26 window was 25/01–25/02).
2. Generate lookup SQL first so the user can confirm ids:
   ```sql
   select p.id, p.name, p.team_id, t.short_name, p."previousClub", p."transferDate"
   from players p join teams t on t.id = p.team_id
   where p.name ilike '%<name>%';

   select id, short_name from teams
   where season = (select id from seasons where is_current) order by short_name;
   ```
3. **Stop and warn** if the player already has `previousClub` set this season: a second transfer overwrites the first, and his events at the first club would be attributed wrongly. Recommend doing E7 or accept the loss knowingly.
4. Transfer SQL:
   ```sql
   update players
   set "previousClub" = team_id, team_id = :to_team_id, "transferDate" = ':date'
   where id = :player_id
   returning id, name, team_id, "previousClub", "transferDate";
   ```
5. Impact checks to include:
   ```sql
   -- active suspensions (they follow the player; discipline page shows them under both teams if earned before the date)
   select * from suspensions where player_id = :player_id and active;
   -- events after the transfer date recorded for the old team's matches (would now be misattributed)
   select e.*, m.match_date, m.home_team_id, m.away_team_id
   from match_events e join matches m on m.id = e.match_id
   where e.player_id = :player_id and m.match_date >= ':date';
   ```
6. Photo: tell the user to copy the photo to `public/team_photos/<newTeamFolder>/` and update `photo_url` if the folder is part of the path.
