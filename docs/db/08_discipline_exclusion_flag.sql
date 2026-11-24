-- =====================================================================
-- Liga Veteranos do Sado — "Excluido Taça Disciplina" passa a activar a
-- flag de exclusão                                 PROPOSTA, NÃO APLICADA
-- ---------------------------------------------------------------------
-- Problema, medido hoje:
--
--   O castigo punishment_type_id = 8 ('Excluido Taça Disciplina',
--   points_added = 0) só grava a ocorrência. A coluna que a aplicação lê
--   para mostrar a equipa como excluída, discipline_standings.excluded,
--   nunca é escrita por ninguém: nem pelo trigger
--   update_discipline_standings() (que mexe em yellow_cards, red_cards,
--   matches_played e other_punishments, e nunca em excluded), nem pela
--   aplicação. Os valores que lá estão foram postos à mão.
--
--   Estado actual (select na secção de verificação):
--     2026  Alto da Guerra   castigo tipo 8 lançado, excluded = false  <-- o bug
--     2024  ADRA Azeda, Bairro Liceu, Bicross, Sports Cafe
--                            tipo 8 lançado e excluded = true
--     2024  Pontes                           excluded = true, sem tipo 8
--     2025  Amarelos, Pontes, Santo Ovidio   excluded = true, sem tipo 8
--
--   Como o castigo vale 0 pontos e a flag não liga, a exclusão de 2026
--   não tem hoje efeito nenhum na aplicação.
--
-- Fonte regulamentar: Regulamento, art. 8 — "A exclusão de um jogador do
-- Torneio implica a eliminação da equipa na Taça Disciplina." A ligação
-- entre o castigo e a flag é regulamentar, não uma conveniência de
-- implementação. (A mesma nota está em 06_discipline_rules.sql, PARTE 3.)
--
-- ---------------------------------------------------------------------
-- O que este script faz
-- ---------------------------------------------------------------------
--  1. Uma função que recalcula discipline_standings.excluded de uma
--     equipa numa época, a partir da existência de um castigo tipo 8.
--  2. Um trigger em team_punishments que a chama. Funciona nos dois
--     sentidos: lançar o castigo exclui, apagá-lo ou mudar-lhe o tipo
--     deixa de excluir — o que importa agora que a UI já edita e apaga
--     castigos (PR #182).
--  3. Um backfill, só da época corrente, que põe a flag de acordo com os
--     castigos já lançados. Hoje isto muda UMA linha: Alto da Guerra 2026
--     passa a excluded = true.
--
-- ---------------------------------------------------------------------
-- O que este script NÃO faz, de propósito
-- ---------------------------------------------------------------------
--  * Não toca nas épocas anteriores. 4 das 9 exclusões históricas foram
--    marcadas à mão sem castigo tipo 8 (Pontes 2024, e as três de 2025);
--    uma derivação cega apagava-lhes a flag e reescrevia classificações
--    já publicadas. A função sai fora quando a época não é a corrente, o
--    que mantém a decisão da direção de 2026-10-02: não reescrever o
--    passado. Consequência a assumir: lançar ou apagar um castigo tipo 8
--    numa época fechada não move a flag dessa época — é preciso o UPDATE
--    à mão que está no fim do ficheiro.
--  * Não toca em update_discipline_standings(). Essa função está para ser
--    reescrita de alto a baixo em 06_discipline_rules.sql PARTE 2, que
--    continua sem ser aplicada (verificado na base: a função em produção
--    é ainda a antiga, com o reset WHERE true e sem os duplos amarelos).
--    Uma função separada e de uma só responsabilidade sobrevive a essa
--    reescrita sem conflito.
--  * Não toca em teams.excluded, que é outra coisa: equipa fora da Liga,
--    lida pela página de classificação. A Taça Disciplina lê
--    discipline_standings.excluded.
--
-- RISCO: baixo. Uma função nova, um trigger novo, e um UPDATE que muda um
-- valor. Rollback: docs/db/08_discipline_exclusion_flag_rollback.sql
--
-- Antes de correr: backup (CLAUDE.md § Safety).
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Recalcular a flag de uma equipa numa época
-- ---------------------------------------------------------------------
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

  -- Épocas fechadas ficam como foram publicadas — ver a nota no topo.
  if p_season is distinct from (select id from public.seasons where is_current) then
    return;
  end if;

  update public.discipline_standings as ds
     set excluded = exists (
           select 1
             from public.team_punishments tp
            where tp.team_id = p_team_id
              and tp.season  = p_season
              and tp.punishment_type_id = 8   -- 'Excluido Taça Disciplina'
         )
   where ds.team_id = p_team_id
     and ds.season  = p_season;
end;
$function$;

-- ---------------------------------------------------------------------
-- 2. Trigger em team_punishments
-- ---------------------------------------------------------------------
create or replace function public.sync_discipline_exclusion()
returns trigger
language plpgsql
as $function$
begin
  -- Numa UPDATE que mude a equipa ou a época há duas linhas de
  -- discipline_standings a recalcular: a de onde o castigo saiu e a para
  -- onde foi.
  if tg_op in ('UPDATE', 'DELETE') then
    perform public.apply_discipline_exclusion(old.team_id, old.season);
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    perform public.apply_discipline_exclusion(new.team_id, new.season);
  end if;

  return null;
end;
$function$;

drop trigger if exists sync_discipline_exclusion_on_team_punishments
  on public.team_punishments;

create trigger sync_discipline_exclusion_on_team_punishments
  after insert or update or delete on public.team_punishments
  for each row execute function public.sync_discipline_exclusion();

-- ---------------------------------------------------------------------
-- 3. Backfill da época corrente
-- ---------------------------------------------------------------------
-- Esperado HOJE: 14 linhas tocadas, 1 valor mudado — Alto da Guerra 2026
-- passa a true; as outras 13 já estavam false e ficam false.
update public.discipline_standings as ds
   set excluded = exists (
         select 1
           from public.team_punishments tp
          where tp.team_id = ds.team_id
            and tp.season  = ds.season
            and tp.punishment_type_id = 8
       )
 where ds.season = (select id from public.seasons where is_current);

commit;


-- =====================================================================
-- Verificar DEPOIS de correr
-- =====================================================================
-- (a) Época corrente: a flag tem de acompanhar o castigo.
--
-- select t.short_name,
--        ds.excluded,
--        exists (select 1 from team_punishments tp
--                 where tp.team_id = ds.team_id and tp.season = ds.season
--                   and tp.punishment_type_id = 8) as tem_castigo
--   from discipline_standings ds
--   join teams t on t.id = ds.team_id
--  where ds.season = (select id from seasons where is_current)
--  order by ds.excluded desc, t.short_name;
--
-- Esperado: excluded = tem_castigo em todas as linhas, e Alto da Guerra
-- com as duas colunas a true.
--
-- (b) O passado ficou intacto.
--
-- select season, count(*) from discipline_standings
--  where excluded group by season order by season;
--
-- Esperado: 2024 -> 5, 2025 -> 3, 2026 -> 1.


-- =====================================================================
-- Corrigir a flag numa época fechada (à mão, caso seja preciso)
-- =====================================================================
-- A função sai fora nas épocas que não são a corrente, de propósito. Para
-- forçar uma delas, listar primeiro e só depois correr o UPDATE com os
-- IDs confirmados:
--
-- update discipline_standings set excluded = true
--  where season = /* época */ and team_id in (/* IDs revistos */);
