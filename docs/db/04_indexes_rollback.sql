-- =====================================================================
-- Rollback de docs/db/04_indexes.sql
-- ---------------------------------------------------------------------
-- Apaga os 17 índices criados. Não toca em dados, constraints ou triggers:
-- apagar um índice nunca perde informação, só volta a tornar as consultas
-- lentas.
--
-- DROP INDEX CONCURRENTLY também não pode correr dentro de uma transação.
-- =====================================================================

drop index concurrently if exists public.idx_match_events_match_id;
drop index concurrently if exists public.idx_match_events_player_id;
drop index concurrently if exists public.idx_match_events_type_match;

drop index concurrently if exists public.idx_players_team_id;
drop index concurrently if exists public.idx_players_previous_club;

drop index concurrently if exists public.idx_matches_season_competition;
drop index concurrently if exists public.idx_matches_home_team_id;
drop index concurrently if exists public.idx_matches_away_team_id;

drop index concurrently if exists public.idx_teams_season;

drop index concurrently if exists public.idx_suspensions_season_active;
drop index concurrently if exists public.idx_suspensions_player_id;

drop index concurrently if exists public.idx_team_punishments_season_team;
drop index concurrently if exists public.idx_team_punishments_player_id;
drop index concurrently if exists public.idx_team_punishments_type;

drop index concurrently if exists public.idx_league_standings_season_year;
drop index concurrently if exists public.idx_league_standings_team_id;
drop index concurrently if exists public.idx_discipline_standings_season;
