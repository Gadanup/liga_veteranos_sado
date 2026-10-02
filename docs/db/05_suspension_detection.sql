-- =====================================================================
-- Liga Veteranos do Sado — Deteção de suspensões     PROPOSTA, NÃO APLICADA
-- ---------------------------------------------------------------------
-- SÓ LEITURA. Cria três vistas e mais nada: não escreve uma linha, não
-- cria suspensões, não mexe em triggers. É o passo 1 de dois — serve para
-- PROVAR a regra contra o histórico antes de se automatizar o que quer que
-- seja. O passo 2 (triggers que criam as suspensões) só depois de backup.
--
-- Rollback: docs/db/05_suspension_detection_rollback.sql
--
-- ---------------------------------------------------------------------
-- O que foi medido em produção a 2026-10-02
-- ---------------------------------------------------------------------
-- A regra "3 amarelos = 1 jogo de suspensão, a cada múltiplo de 3"
-- reproduz-se a partir dos eventos:
--
--   época   previstas por floor(amarelos/3)   criadas à mão
--   2024                               47               44
--   2025                               46               46
--
-- 2025 bate exactamente. Das 3 divergências de 2024, uma era erro da
-- minha classificação (o texto de `reason` usa "acumular 3 cartões" para
-- a regra dos 3 e "acumulação de amarelos" para o duplo amarelo, que são
-- coisas opostas) e as outras duas são divergências reais — ver a
-- vista v_suspension_audit no fim.
--
-- Dois factos do modelo que esta vista assume, ambos verificados:
--
--  1. Um duplo amarelo é gravado SÓ como event_type = 5. Em 24 duplos não
--     há um único event_type = 2 do mesmo jogador no mesmo jogo. Logo
--     contar event_type = 2 já é contar "amarelos que contam para os 3",
--     sem precisar de excluir nada.
--  2. Suspensão a cada 3 amarelos, indefinidamente. O regulamento (Disciplina
--     e Sanções, art. 1) diz "após cumprir castigo limpa os cartões e contagem
--     recomeçará"; na prática isso é o mesmo que suspender a cada múltiplo de
--     3, porque reiniciar e contar 3 outra vez chega ao 6º amarelo da época.
--     Os dados confirmam-no: há suspensões registadas pelo 6º e pelo 9º.
--     Onde as duas leituras divergem é num caso de fronteira — amarelos
--     apanhados DEPOIS do 3º mas ANTES de cumprir o castigo. Pelo texto do
--     art. 1 seriam limpos; por múltiplos de 3 contam. Não há nenhum caso
--     destes no histórico, por isso a vista usa múltiplos de 3.
--
--  3. O art. 2 confirma o ponto 1 por outro lado: no duplo amarelo "a contagem
--     (3 cartões amarelos) não reiniciará e serão mantidos a contagem dos
--     cartões da jornada anterior".
--
-- Os amarelos da Taça contam (há suspensões pelo "3º amarelo na final da
-- Taça"), por isso a vista não filtra competition_type. Se a intenção for
-- outra, é aqui que se muda — uma linha.
--
-- NÃO cobre vermelhos directos: ficam para o passo 2. A regra é 2 jogos por
-- omissão, ajustados depois pela liga conforme a gravidade, o que explica o
-- histórico aparentemente contraditório — os castigos de 1, 3 e 4 jogos são o
-- valor DEPOIS do ajuste, não erros. Consequência para o desenho do trigger:
-- ele só pode INSERIR o valor inicial, nunca reescrever uma linha existente,
-- senão apaga a decisão da liga à primeira recontagem.
--
-- Os castigos de 20, 30 e 100 jogos são exclusões da competição decididas em
-- conselho de disciplina e nunca devem ser automatizadas.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Progresso de amarelos: um registo por amarelo, numerado por época
-- ---------------------------------------------------------------------
-- A ordenação é determinística (data, hora, minuto, id) para que o
-- "enésimo amarelo" seja sempre o mesmo em consultas repetidas.
create or replace view public.v_yellow_card_progress
with (security_invoker = true) as
select
  m.season,
  e.player_id,
  e.match_id,
  m.match_date,
  m.competition_type,
  m.week,
  e.minute,
  row_number() over (
    partition by m.season, e.player_id
    order by m.match_date, m.match_time, e.minute nulls last, e.id
  ) as nth_yellow
from public.match_events e
join public.matches m on m.id = e.match_id
where e.event_type = 2;


-- ---------------------------------------------------------------------
-- 2. Suspensões em dívida: o amarelo que fecha cada múltiplo de 3
-- ---------------------------------------------------------------------
-- Cada linha é uma suspensão de 1 jogo que a regra manda cumprir, com o
-- jogo que a desencadeou. `already_created` diz se já existe uma suspensão
-- correspondente na tabela — ver a nota sobre `reason` em v_suspension_audit.
create or replace view public.v_suspension_due_yellows
with (security_invoker = true) as
select
  y.season,
  y.player_id,
  p.name as player_name,
  p.team_id,
  y.nth_yellow,
  y.nth_yellow / 3 as suspension_number,
  y.match_id as triggered_by_match,
  y.match_date as triggered_on,
  y.competition_type,
  y.week,
  1 as matches_suspended
from public.v_yellow_card_progress y
join public.players p on p.id = y.player_id
where y.nth_yellow % 3 = 0;


-- ---------------------------------------------------------------------
-- 3. Auditoria: o que a regra manda vs. o que está registado
-- ---------------------------------------------------------------------
-- `reason` é texto livre — 160 valores distintos em 169 linhas — por isso a
-- classificação abaixo é heurística e NÃO serve para decidir nada
-- automaticamente. Serve para apontar onde olhar à mão. A ordem dos WHEN
-- importa: o duplo amarelo é apanhado primeiro, senão "acumulação de
-- amarelos" (duplo) seria confundido com "acumular 3 cartões" (regra dos 3).
create or replace view public.v_suspension_audit
with (security_invoker = true) as
with created as (
  select
    s.season,
    s.player_id,
    count(*) filter (
      where s.reason !~* 'duplo|acumula(ç|c)[ãa]o de amarelos'
        and s.reason ~* '(3|6|9|12)\s*[ºo]?\s*(cart|amarel)|terceiro|sexto|nono|acumular\s+3'
    ) as created_for_yellows
  from public.suspensions s
  group by s.season, s.player_id
),
due as (
  select season, player_id, count(*) as due_for_yellows
  from public.v_suspension_due_yellows
  group by season, player_id
)
select
  coalesce(d.season, c.season) as season,
  coalesce(d.player_id, c.player_id) as player_id,
  p.name as player_name,
  coalesce(d.due_for_yellows, 0) as due_for_yellows,
  coalesce(c.created_for_yellows, 0) as created_for_yellows,
  coalesce(d.due_for_yellows, 0) - coalesce(c.created_for_yellows, 0) as delta
from due d
full outer join created c
  on c.season = d.season and c.player_id = d.player_id
join public.players p on p.id = coalesce(d.player_id, c.player_id)
where coalesce(d.due_for_yellows, 0) <> coalesce(c.created_for_yellows, 0);


-- =====================================================================
-- Verificação (correr depois)
-- =====================================================================
-- 1. A regra reproduz o histórico? Esperado: 47/44 em 2024 e 46/46 em 2025.
--
-- select season, count(*) as due from v_suspension_due_yellows
-- group by season order by season;
--
-- 2. Onde é que divergem — a lista para revisão manual:
--
-- select * from v_suspension_audit order by season, abs(delta) desc;
--
-- 3. Quem está em dívida nesta época:
--
-- select player_name, nth_yellow, triggered_on
-- from v_suspension_due_yellows
-- where season = (select id from seasons where is_current)
-- order by triggered_on desc;
-- =====================================================================
