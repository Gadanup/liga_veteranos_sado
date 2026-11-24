-- =====================================================================
-- Rollback de docs/db/09_player_exclusion_flag.sql
-- ---------------------------------------------------------------------
-- Correr as partes ao contrário: 3, depois 2, depois 1. A PARTE 1 tem de
-- ser a última porque as outras precisam da coluna `players.excluded`
-- para saber a quem se aplicam.
--
-- Deixa o 08 a funcionar: a PARTE 1 repõe a versão de
-- apply_discipline_exclusion() que o 08 instalou (só o castigo tipo 8).
-- =====================================================================


-- #####################################################################
-- PARTE 3 — repor os 750 pontos (só se a PARTE 3 do 09 foi corrida)
-- #####################################################################
-- Valores da linha original, lidos antes de ser apagada:
--   team_punishment_id 197 · team_id 47 (Alto da Guerra) · tipo 9
--   event_date 2026-11-22 · 'Vermelho Directo' · season 2026
--   quantity 30 · player_id 817
--
-- O id é serial; não vale a pena forçá-lo. Confirmar primeiro que a linha
-- não está lá:
--
-- select count(*) from team_punishments
--  where punishment_type_id = 9 and season = 2026 and quantity > 5;

-- insert into public.team_punishments
--   (team_id, punishment_type_id, match_id, event_date, description, season, quantity, player_id)
-- values
--   (47, 9, null, '2026-11-22', 'Vermelho Directo', 2026, 30, 817);


-- #####################################################################
-- PARTE 2 — repor o valor-sentinela nas suspensões
-- #####################################################################

begin;

update public.suspensions as s
   set matches_suspended = 30
  from public.players p
 where p.id = s.player_id
   and p.excluded
   and s.season = (select id from public.seasons where is_current)
   and s.matches_suspended = 0;

commit;


-- #####################################################################
-- PARTE 1 — tirar a coluna, o trigger, e repor a função do 08
-- #####################################################################

begin;

drop trigger if exists sync_discipline_exclusion_on_players on public.players;
drop function if exists public.sync_discipline_exclusion_from_player();

-- Versão do 08: a exclusão da equipa deriva só do castigo tipo 8.
create or replace function public.apply_discipline_exclusion(
  p_team_id integer,
  p_season  bigint
)
returns void
language plpgsql
as $function$
begin
  if p_team_id is null or p_season is null then
    return;
  end if;

  if p_season is distinct from (select id from public.seasons where is_current) then
    return;
  end if;

  update public.discipline_standings as ds
     set excluded = exists (
           select 1
             from public.team_punishments tp
            where tp.team_id = p_team_id
              and tp.season  = p_season
              and tp.punishment_type_id = 8
         )
   where ds.team_id = p_team_id
     and ds.season  = p_season;
end;
$function$;

alter table public.players drop column if exists excluded;

commit;

-- Depois disto, voltar a gerar os tipos:
-- npx supabase gen types typescript --project-id dmsocybvdzdzafpemybt \
--   --schema public > src/types/database.types.ts
