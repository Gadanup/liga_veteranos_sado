-- =====================================================================
-- Liga Veteranos do Sado — Índices (N11)                PROPOSTA, NÃO APLICADA
-- ---------------------------------------------------------------------
-- Medido em produção a 2026-10-02 (pg_stat_user_tables):
--
--   tabela                scans seq    linhas lidas    scans por índice
--   match_events             69 413       119 381 214              407
--   teams                 4 287 891        84 836 884           47 401
--   matches                 213 872        57 250 495           78 200
--   players                 109 290        46 040 727        1 628 241
--   suspensions             312 181        37 711 811              240
--   league_standings        439 481         9 028 255              618
--
-- A base é pequena — 3694 eventos, 651 jogadores, 581 jogos — mas é lida
-- milhares de vezes por dia e quase sempre de ponta a ponta. Havia 40 chaves
-- estrangeiras sem índice de apoio, o que trava os joins e também os
-- apagamentos (cada DELETE no pai varre a tabela filha inteira à procura de
-- referências).
--
-- Só cria índices. Não altera dados, nem constraints, nem triggers.
--
-- CONCURRENTLY não bloqueia leituras nem escritas, mas em troca não pode
-- correr dentro de uma transação: por isso o ficheiro NÃO tem begin/commit, e
-- cada comando é independente. Se um falhar, os anteriores ficam feitos e o
-- índice falhado fica INVALID — ver a verificação no fim.
--
-- Como aplicar: Supabase Dashboard → SQL Editor, correr o ficheiro todo.
-- Demora segundos nesta escala.
-- Rollback: docs/db/04_indexes_rollback.sql
-- =====================================================================

-- match_events: a tabela mais lida da app. Todas as páginas de jogo, de
-- marcadores e de disciplina a filtram por match_id ou por player_id.
create index concurrently if not exists idx_match_events_match_id
  on public.match_events (match_id);

create index concurrently if not exists idx_match_events_player_id
  on public.match_events (player_id);

-- Golos e cartões são sempre pedidos por tipo, normalmente já restritos a um
-- conjunto de jogos: o índice composto serve os dois lados.
create index concurrently if not exists idx_match_events_type_match
  on public.match_events (event_type, match_id);

-- players: o plantel de uma equipa, e quem lá estava antes de uma
-- transferência. previousClub precisa de aspas — foi criada em camelCase.
create index concurrently if not exists idx_players_team_id
  on public.players (team_id);

create index concurrently if not exists idx_players_previous_club
  on public.players ("previousClub");

-- matches: season + competition_type é o filtro de praticamente todas as
-- páginas; os dois team_id servem a página de equipa e os apagamentos.
create index concurrently if not exists idx_matches_season_competition
  on public.matches (season, competition_type);

create index concurrently if not exists idx_matches_home_team_id
  on public.matches (home_team_id);

create index concurrently if not exists idx_matches_away_team_id
  on public.matches (away_team_id);

-- teams: 42 linhas, varridas 4,3 milhões de vezes. Quase sempre por época.
create index concurrently if not exists idx_teams_season
  on public.teams (season);

-- suspensions: o filtro do hook novo é exactamente (season, active).
create index concurrently if not exists idx_suspensions_season_active
  on public.suspensions (season, active);

create index concurrently if not exists idx_suspensions_player_id
  on public.suspensions (player_id);

-- team_punishments: lido por equipa e época pelo trigger da disciplina.
create index concurrently if not exists idx_team_punishments_season_team
  on public.team_punishments (season, team_id);

create index concurrently if not exists idx_team_punishments_player_id
  on public.team_punishments (player_id);

create index concurrently if not exists idx_team_punishments_type
  on public.team_punishments (punishment_type_id);

-- Classificações: o trigger actualiza-as por (team_id, época) a cada evento.
create index concurrently if not exists idx_league_standings_season_year
  on public.league_standings (season_year);

create index concurrently if not exists idx_league_standings_team_id
  on public.league_standings (team_id);

create index concurrently if not exists idx_discipline_standings_season
  on public.discipline_standings (season);

-- =====================================================================
-- Verificação (correr depois)
-- =====================================================================
-- 1. Nenhum índice ficou inválido (esperado: 0 linhas):
--
-- select c.relname
-- from pg_index i
-- join pg_class c on c.oid = i.indexrelid
-- join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname = 'public' and not i.indisvalid;
--
-- 2. Os 17 índices existem:
--
-- select indexname from pg_indexes
-- where schemaname = 'public' and indexname like 'idx_%'
-- order by indexname;
--
-- 3. Passados uns dias, confirmar que estão a ser usados — idx_scan deve
--    subir e seq_tup_read deve estabilizar:
--
-- select relname, seq_scan, seq_tup_read, idx_scan
-- from pg_stat_user_tables
-- where schemaname = 'public'
-- order by seq_tup_read desc;
--
-- Um índice com idx_scan = 0 ao fim de uma época é candidato a ser apagado:
-- cada índice tem custo nas escritas.
-- =====================================================================
