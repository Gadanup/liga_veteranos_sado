-- =====================================================================
-- Rollback de docs/db/05_suspension_detection.sql
-- ---------------------------------------------------------------------
-- Apaga as três vistas. Como são só leitura, apagá-las não perde dados:
-- a informação toda continua em match_events e suspensions.
--
-- A ordem importa — v_suspension_audit depende de
-- v_suspension_due_yellows, que depende de v_yellow_card_progress.
-- =====================================================================

drop view if exists public.v_suspension_audit;
drop view if exists public.v_suspension_due_yellows;
drop view if exists public.v_yellow_card_progress;
