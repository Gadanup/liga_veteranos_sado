-- =====================================================================
-- 03 — Store the Supertaça stadium on the match itself
-- ---------------------------------------------------------------------
-- The match page used to hardcode the Supertaça stadium in MatchHeader.jsx
-- (2024 -> António Henrique de Matos, any other season -> Bela Vista).
-- The code now shows matches.stadium_name when set, otherwise the home
-- team's stadium. This moves the two old hardcoded values into the data.
-- The 2026/27 Supertaça (id 437) already has its stadium set.
--
-- Run BEFORE merging the PR "fix(supertaca): show the match's own stadium".
-- Only touches matches 233 and 256, and only if stadium_name is still empty.
-- =====================================================================
begin;

update public.matches set stadium_name = 'Campo António Henrique de Matos'
where id = 233 and competition_type = 'Supercup' and season = 2024 and stadium_name is null;

update public.matches set stadium_name = 'Campo Municipal da Bela Vista'
where id = 256 and competition_type = 'Supercup' and season = 2025 and stadium_name is null;

commit;

-- check: expect 3 rows, each with a stadium
select id, season, match_date, stadium_name
from public.matches where competition_type = 'Supercup' order by season;

-- rollback (only if needed):
-- update public.matches set stadium_name = null where id in (233, 256);
