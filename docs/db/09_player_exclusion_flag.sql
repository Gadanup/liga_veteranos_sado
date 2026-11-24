-- =====================================================================
-- Liga Veteranos do Sado — flag de exclusão no jogador (irradiado)
--                                                   PROPOSTA, NÃO APLICADA
-- ---------------------------------------------------------------------
-- Depende de docs/db/08_discipline_exclusion_flag.sql (corre o 08 primeiro).
--
-- ---------------------------------------------------------------------
-- Problema
-- ---------------------------------------------------------------------
-- Não existe maneira de registar que um jogador foi irradiado. A prática
-- actual é meter um número de jogos de castigo alto o suficiente para
-- durar até ao fim da época. Medido na época corrente:
--
--   suspensions:       Bruno Basílio, 30 jogos, active = true,
--                      "Vermelho Directo (Irradiado)"
--   team_punishments:  Jogo Castigo x30  = 750 pontos  ("Vermelho Directo")
--                      Jogo Castigo x1   =  25 pontos  (duplo amarelo)
--                      Excluido Taça Disciplina x1 = 0 pontos
--
-- Dois problemas, não um:
--
--  (1) O 30 é um valor-sentinela. Nunca expira, fica eternamente em
--      active = true (há 6 suspensões activas em 2024, época fechada há
--      mais de um ano) e a UI mostra "30" onde devia dizer "Irradiado".
--
--  (2) Os 750 pontos. Uma exclusão não são 30 jogos de castigo: o
--      Regulamento trata a exclusão como sanção própria (art. 8), não
--      como uma soma de jogos. A nota no topo de 06_discipline_rules.sql
--      já avisava disto — "as exclusões (irradiados) NÃO entram nos 25
--      pontos por jogo" — e é exactamente o que está a acontecer. O Alto
--      da Guerra tem 810 pontos na Taça Disciplina, dos quais 750 são
--      este sentinela.
--
-- ---------------------------------------------------------------------
-- O que este script faz
-- ---------------------------------------------------------------------
--  PARTE 1  players.excluded, e a exclusão da equipa passa a derivar
--           também dela (Regulamento art. 8: "a exclusão de um jogador do
--           Torneio implica a eliminação da equipa na Taça Disciplina").
--           Marcar o jogador passa a chegar — não é preciso lançar à mão
--           o castigo tipo 8 na equipa.
--  PARTE 2  Marca o Bruno Basílio e normaliza o sentinela de 30 para 0.
--  PARTE 3  Apaga os 750 pontos. SEPARADA DE PROPÓSITO: muda a Taça
--           Disciplina da época corrente. Decisão do Ricardo.
--
-- RISCO: PARTE 1 baixo (coluna nova com default false, função e trigger).
--        PARTE 2 baixo, 2 linhas. PARTE 3 muda pontos publicados.
-- Rollback: docs/db/09_player_exclusion_flag_rollback.sql
-- Antes de correr: backup (CLAUDE.md § Safety).
-- =====================================================================


-- #####################################################################
-- PARTE 1 — players.excluded
-- #####################################################################

begin;

alter table public.players
  add column if not exists excluded boolean not null default false;

comment on column public.players.excluded is
  'Jogador irradiado (exclusão total do Torneio). Substitui o valor-sentinela de 20/30/100 jogos em suspensions.matches_suspended. Regulamento art. 8: implica a eliminação da equipa na Taça Disciplina.';

-- A derivação da flag da equipa passa a ter duas fontes: o castigo
-- tipo 8 lançado à mão (como no 08) OU um jogador irradiado do plantel.
-- `players` não tem coluna de época — a época vem da equipa do jogador,
-- por isso o join a teams.
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

  -- Épocas fechadas ficam como foram publicadas — ver a nota no 08.
  if p_season is distinct from (select id from public.seasons where is_current) then
    return;
  end if;

  update public.discipline_standings as ds
     set excluded = (
           exists (
             select 1
               from public.team_punishments tp
              where tp.team_id = p_team_id
                and tp.season  = p_season
                and tp.punishment_type_id = 8   -- 'Excluido Taça Disciplina'
           )
           or exists (
             select 1
               from public.players p
               join public.teams t on t.id = p.team_id
              where p.team_id = p_team_id
                and t.season  = p_season
                and p.excluded
           )
         )
   where ds.team_id = p_team_id
     and ds.season  = p_season;
end;
$function$;

-- Trigger em players: marcar ou desmarcar um jogador tem de mexer na
-- flag da equipa. Sai fora quando a escrita não toca em `excluded` nem
-- muda de equipa, para não recalcular a cada edição de jogador.
create or replace function public.sync_discipline_exclusion_from_player()
returns trigger
language plpgsql
as $function$
declare
  v_old_season bigint;
  v_new_season bigint;
begin
  if tg_op = 'UPDATE'
     and old.excluded is not distinct from new.excluded
     and old.team_id  is not distinct from new.team_id then
    return null;
  end if;

  if tg_op in ('UPDATE', 'DELETE') then
    select t.season into v_old_season from public.teams t where t.id = old.team_id;
    perform public.apply_discipline_exclusion(old.team_id, v_old_season);
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    select t.season into v_new_season from public.teams t where t.id = new.team_id;
    perform public.apply_discipline_exclusion(new.team_id, v_new_season);
  end if;

  return null;
end;
$function$;

drop trigger if exists sync_discipline_exclusion_on_players on public.players;

create trigger sync_discipline_exclusion_on_players
  after insert or update or delete on public.players
  for each row execute function public.sync_discipline_exclusion_from_player();

commit;


-- #####################################################################
-- PARTE 2 — marcar o caso actual
-- #####################################################################
-- REVER A LISTA ANTES DE CORRER. Hoje há um só candidato na época
-- corrente, identificado pelo sentinela:
--
-- select p.id, p.name, t.short_name, s.matches_suspended, s.reason
--   from suspensions s
--   join players p on p.id = s.player_id
--   left join teams t on t.id = p.team_id
--  where s.season = (select id from seasons where is_current)
--    and s.matches_suspended > 5;
--
-- Esperado: Bruno Basílio, Alto da Guerra, 30 jogos,
--           "Vermelho Directo (Irradiado)".

begin;

update public.players
   set excluded = true
 where id in (
   select s.player_id
     from public.suspensions s
    where s.season = (select id from public.seasons where is_current)
      and s.matches_suspended > 5
      and s.active
 );

-- O número de jogos deixa de querer dizer nada para quem está irradiado:
-- a sanção é a exclusão, não uma contagem. Fica a 0 para que a derivação
-- dos 25 pontos por jogo de suspensão (06_discipline_rules.sql PARTE 2,
-- ainda não aplicada) não lhe cobre 750 pontos. A data e o motivo ficam.
update public.suspensions as s
   set matches_suspended = 0
  from public.players p
 where p.id = s.player_id
   and p.excluded
   and s.season = (select id from public.seasons where is_current)
   and s.matches_suspended > 5;

commit;

-- As épocas fechadas não são tocadas: as 6 suspensões-sentinela activas
-- de 2024 e as de 2025 ficam como estão, pelo mesmo motivo do 08. Para
-- as arrumar um dia, a lista está em 06_discipline_rules.sql PARTE 3.


-- #####################################################################
-- PARTE 3 — os 750 pontos             CORRER SÓ DEPOIS DE DECIDIR
-- ---------------------------------------------------------------------
-- Apaga a linha 'Jogo Castigo' x30 do Alto da Guerra, que cobra a
-- exclusão como se fossem 30 jogos de castigo. Mantém a x1 (25 pontos),
-- que é o duplo amarelo e é devido.
--
-- Antes:  other_punishments = 775, calculated_points = 810, 7 jogos
-- Depois: other_punishments =  25, calculated_points =  60, 7 jogos
--
-- Na prática não muda o que se vê, porque a equipa está excluída e a
-- página mostra "-" em vez dos números. Muda o que está gravado.
--
-- Confirmar a linha antes de apagar:
--
-- select tp.team_punishment_id, t.short_name, tp.quantity, tp.description
--   from team_punishments tp join teams t on t.id = tp.team_id
--  where tp.punishment_type_id = 9
--    and tp.season = (select id from seasons where is_current)
--    and tp.quantity > 5;
-- #####################################################################

-- delete from public.team_punishments
--  where punishment_type_id = 9
--    and season = (select id from public.seasons where is_current)
--    and quantity > 5;


-- =====================================================================
-- Verificar DEPOIS de correr
-- =====================================================================
-- (a) O jogador está marcado e a equipa saiu da Taça Disciplina:
--
-- select p.name, p.excluded as jogador, t.short_name, ds.excluded as equipa
--   from players p
--   join teams t on t.id = p.team_id
--   join discipline_standings ds on ds.team_id = t.id and ds.season = t.season
--  where p.excluded;
--
-- Esperado: Bruno Basílio · jogador = true · Alto da Guerra · equipa = true.
--
-- (b) A derivação funciona nos dois sentidos — desmarcar o jogador tira a
--     exclusão da equipa, a menos que o castigo tipo 8 continue lançado.
--     (Hoje continua: o Alto da Guerra tem os dois. Para testar a sério,
--     apagar primeiro o castigo tipo 8.)
--
-- (c) Regenerar os tipos depois da coluna nova:
--     npx supabase gen types typescript --project-id dmsocybvdzdzafpemybt \
--       --schema public > src/types/database.types.ts
