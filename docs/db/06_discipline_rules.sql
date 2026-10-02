-- =====================================================================
-- Liga Veteranos do Sado — Disciplina conforme regulamento
--                                                   PROPOSTA, NÃO APLICADA
-- ---------------------------------------------------------------------
-- Alinha o cálculo da Taça Disciplina com o Regulamento (Revisão
-- 2025-2026), secção DISCIPLINA E SANÇÕES, e com as decisões da direção
-- de 2026-10-02.
--
-- Está dividido em TRÊS PARTES com riscos muito diferentes. Correr por
-- ordem, e parar entre elas para verificar. A PARTE 1 pode ir hoje; as
-- PARTES 2 e 3 só DEPOIS DO BACKUP (CLAUDE.md § Safety).
--
-- Rollback: docs/db/06_discipline_rules_rollback.sql
--
-- ---------------------------------------------------------------------
-- Regras aplicadas, com a fonte
-- ---------------------------------------------------------------------
--  Amarelo                     5 pontos   tabela de sanções
--  Vermelho                   20 pontos   tabela de sanções
--  Duplo amarelo              20 pontos   decisão da direção: conta como
--                                         vermelho, porque os dois amarelos
--                                         não contam (art. 2)
--  Jogo de suspensão          25 pontos   tabela de sanções, "Jogo de
--                                         castigo", por CADA jogo
--  Falta de comparência       50 pontos   tabela de sanções
--  Falta compar. com aviso    30 pontos   tabela de sanções
--  Classificação = média      art. 9, "média entre os pontos obtidos e os
--                             jogos efetuados"
--  Todas as competições       art. 26, "os castigos são acumulados entre
--                             todas as competições"
--
-- As exclusões (irradiados) NÃO entram nos 25 pontos por jogo. Em 2024 os
-- castigos de exclusão somam 500 jogos; a 25 pontos dariam 12 500 pontos
-- a uma equipa. Vão pela coluna excluded — PARTE 3.
-- =====================================================================


-- #####################################################################
-- PARTE 1 — Corrigir a falta de comparência (200 -> 50)
-- ---------------------------------------------------------------------
-- RISCO: baixo. Uma linha de uma tabela de referência, reversível com um
-- UPDATE ao contrário.
--
-- IMPACTO REAL, medido: existe 1 castigo deste tipo aplicado, na época
-- 2024. NÃO muda a classificação de 2024, porque o trigger só recalcula
-- quando há uma escrita nessa época, e depois da PARTE 2 a época fica
-- fechada. A tabela de referência passa a valer para o futuro.
--
-- Não corras nenhuma propagação forçada deste UPDATE. Havia aqui uma
-- linha "update team_punishments set season = season" de quando se
-- pensava reescrever o passado; ela recalcularia 2024 com as regras
-- novas, que é precisamente o que a direção decidiu não fazer.
-- #####################################################################

update public.punishment_types
   set points_added = 50
 where punishment_type_id = 3;   -- 'Falta Comparência'

-- Verificar (esperado: 50):
-- select punishment_type_id, description, points_added
-- from punishment_types where punishment_type_id = 3;

-- Esta parte pode ir antes do backup: muda uma linha de uma tabela de
-- referência, não recalcula nada e desfaz-se com um UPDATE ao contrário.


-- #####################################################################
-- PARTE 2 — Trigger da disciplina conforme regulamento
-- ---------------------------------------------------------------------
-- RISCO: MÉDIO-ALTO. Reescreve a função que calcula a Taça Disciplina de
-- todas as épocas, e apaga 152 linhas. Exige backup antes.
--
-- Corrige quatro coisas:
--
--  (a) matches_played passa a incluir a Supertaça. Hoje filtra
--      competition_type IN ('League','Cup') enquanto os cartões não
--      filtram competição nenhuma, logo quem jogou a Supertaça tem os
--      cartões no numerador e não tem o jogo no denominador: a média do
--      art. 9 sai inflacionada.
--
--  (b) O duplo amarelo (event_type = 5) passa a contar em red_cards.
--      Hoje não conta em lado nenhum — 24 expulsões a somar zero pontos.
--
--  (c) Os 25 pontos por jogo de suspensão passam a ser calculados a
--      partir de suspensions em vez de inseridos à mão. Medido: faltam 4
--      jogos em 2024, 8 em 2025 e 2 em 2026 — 350 pontos nunca cobrados.
--
--  (d) O recálculo deixa de ser WHERE true sobre todas as épocas. Hoje
--      cada cartão inserido recalcula a história inteira, que é a causa
--      dos 119 milhões de linhas lidas em match_events.
--
-- DUPLA CONTAGEM: ao automatizar (c), as linhas de 'Jogo Castigo'
-- (punishment_type_id = 9) metidas à mão têm de sair, senão os 25 pontos
-- contam duas vezes. São 152 linhas — 79 em 2024, 73 em 2025. O DELETE
-- está no fim desta parte, na MESMA transação.
-- #####################################################################

begin;

-- O cálculo sai da função de trigger para uma função normal, para poder
-- ser chamado à mão com p_season = NULL, ou seja todas as épocas. Antes
-- isso não era possível: o recálculo total dependia de haver uma escrita
-- em cada época, e uma época sem castigos lançados (como a 2026) nunca
-- era recalculada.
create or replace function public.recalculate_discipline_standings(
  p_season bigint default null
)
returns void
language plpgsql
as $function$
begin
  -- Reset só da época indicada; NULL recalcula todas.
  update public.discipline_standings
     set yellow_cards = 0, red_cards = 0, matches_played = 0,
         other_punishments = 0
   where (p_season is null or season = p_season)
     and not exists (select 1 from public.seasons sl
                      where sl.id = discipline_standings.season
                        and sl.discipline_locked);

  -- ---- Amarelos, 5 pontos cada. Só event_type = 2: os dois amarelos de
  -- ---- um duplo amarelo não são gravados como tipo 2 (verificado em
  -- ---- 24 duplos, zero tipo 2 do mesmo jogador no mesmo jogo).
  update public.discipline_standings as ds
     set yellow_cards = coalesce(d.n, 0)
    from (
      select
        case
          when p."transferDate" is not null
           and p."previousClub" is not null
           and m.match_date < p."transferDate"
          then p."previousClub"::integer
          else p.team_id
        end as team_id,
        m.season,
        count(*) as n
      from public.match_events me
      join public.players p on p.id = me.player_id
      join public.matches m on m.id = me.match_id
      where me.event_type = 2
      group by 1, 2
    ) d
   where ds.team_id = d.team_id
     and ds.season = d.season
     and (p_season is null or ds.season = p_season)
     and not exists (select 1 from public.seasons sl
                      where sl.id = ds.season and sl.discipline_locked);

  -- ---- Vermelhos, 20 pontos cada. (b) inclui agora o duplo amarelo.
  update public.discipline_standings as ds
     set red_cards = coalesce(d.n, 0)
    from (
      select
        case
          when p."transferDate" is not null
           and p."previousClub" is not null
           and m.match_date < p."transferDate"
          then p."previousClub"::integer
          else p.team_id
        end as team_id,
        m.season,
        count(*) as n
      from public.match_events me
      join public.players p on p.id = me.player_id
      join public.matches m on m.id = me.match_id
      where me.event_type in (3, 5)   -- 3 vermelho directo, 5 duplo amarelo
      group by 1, 2
    ) d
   where ds.team_id = d.team_id
     and ds.season = d.season
     and (p_season is null or ds.season = p_season)
     and not exists (select 1 from public.seasons sl
                      where sl.id = ds.season and sl.discipline_locked);

  -- ---- (a) Jogos efectuados: as três competições.
  update public.discipline_standings as ds
     set matches_played = coalesce(d.n, 0)
    from (
      select team_id, season, count(*) as n
      from (
        select home_team_id as team_id, season from public.matches
         where competition_type in ('League', 'Cup', 'Supercup')
           and home_goals is not null and away_goals is not null
        union all
        select away_team_id as team_id, season from public.matches
         where competition_type in ('League', 'Cup', 'Supercup')
           and home_goals is not null and away_goals is not null
      ) t
      group by 1, 2
    ) d
   where ds.team_id = d.team_id
     and ds.season = d.season
     and (p_season is null or ds.season = p_season)
     and not exists (select 1 from public.seasons sl
                      where sl.id = ds.season and sl.discipline_locked);

  -- ---- other_punishments = castigos da tabela + (c) 25 por jogo suspenso.
  -- Entra por aqui, e não na coluna gerada calculated_points, para que a
  -- fórmula publicada (red*20 + yellow*5 + other) fique intacta.
  update public.discipline_standings as ds
     set other_punishments = coalesce(d.total, 0)
    from (
      select team_id, season, sum(pontos) as total
      from (
        -- castigos lançados à mão: bolas, inscrições, dirigentes, ...
        select tp.team_id, tp.season,
               pt.points_added * coalesce(tp.quantity, 1) as pontos
          from public.team_punishments tp
          join public.punishment_types pt
            on pt.punishment_type_id = tp.punishment_type_id

        union all

        -- 25 pontos por cada jogo de suspensão, atribuídos à equipa do
        -- jogador à data do castigo (mesma regra de transferência).
        select
          case
            when p."transferDate" is not null
             and p."previousClub" is not null
             and s.suspension_date < p."transferDate"
            then p."previousClub"::integer
            else p.team_id
          end as team_id,
          s.season,
          s.matches_suspended * 25 as pontos
        from public.suspensions s
        join public.players p on p.id = s.player_id
        -- Exclusões fora: ver a nota no topo. O limite de 5 jogos é uma
        -- heurística sobre os valores-sentinela de hoje (20/30/100) e
        -- deixa de ser preciso depois da PARTE 3, passando a
        -- `where not p.excluded`.
        where s.matches_suspended <= 5
      ) t
      group by 1, 2
    ) d
   where ds.team_id = d.team_id
     and ds.season = d.season
     and (p_season is null or ds.season = p_season)
     and not exists (select 1 from public.seasons sl
                      where sl.id = ds.season and sl.discipline_locked);

end;
$function$;


-- A função de trigger fica a ser só a casca: descobre a época afectada
-- pela linha escrita e delega. match_events traz match_id e não season,
-- por isso há que ir buscá-la a matches.
create or replace function public.update_discipline_standings()
returns trigger
language plpgsql
as $function$
declare
  v_row jsonb;
begin
  v_row := to_jsonb(coalesce(new, old));

  perform public.recalculate_discipline_standings(coalesce(
    (case when v_row ? 'season' then (v_row ->> 'season')::bigint end),
    (select m.season from public.matches m
      where m.id = (v_row ->> 'match_id')::integer)
  ));

  return null;
end;
$function$;

-- O cálculo passa a depender de suspensions, logo o trigger tem de
-- disparar também aí: criar uma suspensão tem de actualizar os pontos.
drop trigger if exists update_discipline_standings_on_suspensions
  on public.suspensions;
create trigger update_discipline_standings_on_suspensions
  after insert or update or delete on public.suspensions
  for each row execute function public.update_discipline_standings();

-- Tirar as linhas manuais de 'Jogo Castigo' das épocas que passam a ser
-- calculadas, senão os 25 pontos contavam duas vezes. As de 2024 e 2025
-- ficam onde estão: pertencem a épocas fechadas, que a função nunca
-- recalcula, logo não há dupla contagem possível e não se perde registo
-- histórico.
--
-- Esperado HOJE: DELETE 0 — a época corrente ainda não tem nenhuma
-- lançada à mão. É este o motivo pelo qual esta parte deixou de apagar
-- 152 linhas e passou a não apagar nada.
delete from public.team_punishments
 where punishment_type_id = 9
   and season >= (select id from public.seasons where is_current);

-- Recalcular só a época corrente. As anteriores estão fechadas acima e
-- ficam exactamente como foram publicadas — decisão da direção de
-- 2026-10-02: "não precisamos de reescrever o passado".
--
-- O custo assumido: 2024 e 2025 deixam de ser comparáveis com as épocas
-- seguintes, porque têm os duplos amarelos a zero e os jogos de suspensão
-- em falta. Se algum dia se quiser reconciliar, basta pôr
-- discipline_locked = false nessa época e chamar a função com o id dela.
select public.recalculate_discipline_standings(
  (select id from public.seasons where is_current));

commit;

-- Verificar ANTES de dar por boa:
--
-- select season, sum(matches_played) as jogos, sum(yellow_cards) as amarelos,
--        sum(red_cards) as vermelhos, sum(other_punishments) as outros
-- from discipline_standings group by season order by season;
--
-- Esperado: `vermelhos` sobe 24 no total (os duplos amarelos), `jogos`
-- sobe 2 em cada época com Supertaça, `outros` passa a incluir
-- 25 × jogos de suspensão.


-- #####################################################################
-- PARTE 3 — Jogadores excluídos (irradiados)
-- ---------------------------------------------------------------------
-- RISCO: baixo no esquema, mas obriga a mexer na UI, que hoje mostra
-- "20 jogos" onde queremos "Irradiado".
--
-- Hoje a exclusão é registada como 20, 30 ou 100 jogos de castigo. É um
-- valor-sentinela: nunca expira, fica eternamente em active = true (há 6
-- suspensões activas em 2024, época fechada há mais de um ano) e envenena
-- qualquer conta que multiplique jogos por pontos.
--
-- A coluna tem o mesmo nome da que já existe em discipline_standings, por
-- coerência.
-- #####################################################################

alter table public.players
  add column if not exists excluded boolean not null default false;

-- Regulamento art. 8: "A exclusão de um jogador do Torneio implica a
-- eliminação da equipa na Taça Disciplina." A ligação entre as duas
-- colunas é regulamentar, não uma conveniência de implementação.
--
-- Marcação dos casos históricos — REVER A LISTA À MÃO ANTES DE CORRER,
-- porque identifica-os pelo valor-sentinela e não por um registo
-- explícito. Listar primeiro:
--
-- select p.id, p.name, s.season, s.matches_suspended, s.reason
-- from suspensions s join players p on p.id = s.player_id
-- where s.matches_suspended > 5 order by s.season, p.name;
--
-- Depois, só para os IDs confirmados:
--
-- update players set excluded = true where id in (/* IDs revistos */);
