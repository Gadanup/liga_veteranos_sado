-- =====================================================================
-- Rollback de docs/db/08_discipline_exclusion_flag.sql
-- ---------------------------------------------------------------------
-- Tira o trigger e as duas funções, e põe a flag da época corrente como
-- estava antes do backfill: nenhuma equipa excluída em 2026.
--
-- As épocas anteriores não são tocadas aqui porque o script 08 também não
-- as tocou.
--
-- ATENÇÃO: se entretanto tiverem sido lançados mais castigos tipo 8 na
-- época corrente, este UPDATE apaga as exclusões correspondentes. Listar
-- primeiro:
--
-- select t.short_name, ds.excluded
--   from discipline_standings ds join teams t on t.id = ds.team_id
--  where ds.season = (select id from seasons where is_current) and ds.excluded;
-- =====================================================================

begin;

drop trigger if exists sync_discipline_exclusion_on_team_punishments
  on public.team_punishments;

drop function if exists public.sync_discipline_exclusion();
drop function if exists public.apply_discipline_exclusion(integer, bigint);

-- Estado anterior da época corrente: Alto da Guerra 2026 estava a false,
-- como todas as outras.
update public.discipline_standings
   set excluded = false
 where season = (select id from public.seasons where is_current);

commit;

-- Verificar (esperado: 0 linhas):
-- select count(*) from discipline_standings
--  where season = (select id from seasons where is_current) and excluded;
