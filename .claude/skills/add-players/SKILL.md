---
name: add-players
description: Bulk-register players for Liga Veteranos do Sado from a pasted list (registration forms, WhatsApp, Excel) — produces reviewed insert SQL and a photo checklist. Use for "add these players", "inscrições", "novos jogadores".
---

# Add players in bulk

Output SQL for review + a photo checklist. **Never run writes against Supabase** (production).

## Steps

1. Accept any messy list. Normalise each line to `name | team | joker`. Team names from the Excel/forms may be uppercase or abbreviated ("SPORT SADO", "IDOLOS PRAÇA", "BAIRRO SANTOS") — map them to the current season's `teams.short_name`. Show the mapping table and ask about anything ambiguous.
2. Flag likely duplicates: generate a check query
   ```sql
   select id, name, team_id from players
   where name ilike any (array['%<name1>%', '%<name2>%']);
   ```
   A match on an existing player = probably a transfer → use `/transfer-player` instead.
3. Enforce: max 2 jokers per team (count existing `joker = true` for that team).
4. Insert SQL, resolving team by name + current season so ids aren't typed by hand:
   ```sql
   insert into players (name, team_id, joker, photo_url)
   select v.name, t.id, v.joker, v.photo_url
   from (values
     ('João Silva', 'Sport Clube Sado', false, '/team_photos/sportclubesado/joaoSilva.webp')
   ) as v(name, team, joker, photo_url)
   join teams t on t.short_name = v.team
     and t.season = (select id from seasons where is_current)
   returning id, name, team_id;
   ```
   Compare the returned row count with the list length. Match the `photo_url` format of existing rows first (`select photo_url from players where photo_url is not null limit 3;`) — the example path above is an assumption.
5. Photo checklist: filename `camelCase` of the name (`joaoSilva`), folder = existing team folder in `public/team_photos/` (list them with `ls public/team_photos`), WebP ≤ 400px wide. If the user provides image files, resize/convert them before adding to the repo.
