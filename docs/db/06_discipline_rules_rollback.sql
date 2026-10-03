-- =====================================================================
-- Rollback de docs/db/06_discipline_rules.sql
-- ---------------------------------------------------------------------
-- ATENÇÃO: a PARTE 2 apaga 152 linhas de team_punishments. Isso NÃO se
-- desfaz com SQL — repõe-se do backup dos dados. E o CREATE OR REPLACE
-- sobrescreve a função antiga, que também só volta do backup do esquema
-- (supabase/schema.sql). É exactamente por isto que o backup tem de estar
-- feito antes de correr a PARTE 2.
--
-- Reverter por ordem inversa.
-- =====================================================================

-- PARTE 3
alter table public.players drop column if exists excluded;

-- PARTE 2 — reabrir as épocas fechadas e tirar a coluna do travão.
update public.seasons set discipline_locked = false;
alter table public.seasons drop column if exists discipline_locked;

-- PARTE 2 — tirar o trigger novo. A função antiga tem de ser reposta a
-- partir de supabase/schema.sql.
drop trigger if exists update_discipline_standings_on_suspensions
  on public.suspensions;

-- PARTE 1
update public.punishment_types
   set points_added = 200
 where punishment_type_id = 3;
