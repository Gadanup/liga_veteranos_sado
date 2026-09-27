-- =====================================================================
-- Liga Veteranos do Sado — Security fix (S1)       PROPOSAL, NOT APPLIED
-- ---------------------------------------------------------------------
-- Problem (checked 2026-09-26, see docs/db/tables_rls.txt, anon_grants.txt, policies.txt):
--   * RLS is DISABLED on matches, match_events, players, teams, suspensions,
--     team_punishments, league_standings, discipline_standings, cup_group_teams,
--     cup_matches, punishment_types, season_stats.
--   * The `anon` role (the public key shipped in the website JS) has
--     SELECT, INSERT, UPDATE, DELETE and TRUNCATE on every table.
--   => anyone can edit or wipe league data from the browser console.
--   * admin_users is readable by everyone (admin emails are public).
--   * season_winners can be written by ANY logged-in user, not only admins.
--
-- What this script does:
--   1. public.is_admin() helper (email in admin_users, case-insensitive).
--   2. Enables RLS on every table: public READ, admin-only WRITE.
--   3. admin_users: a logged-in user can only read their own row (the app's
--      admin check keeps working), nobody can write via the API.
--   4. Revokes TRUNCATE/TRIGGER/REFERENCES from anon/authenticated
--      (TRUNCATE ignores RLS, so it must be revoked explicitly).
--   5. Views become read-only for API roles.
--   It changes PERMISSIONS ONLY — no row of data is inserted, updated or deleted.
--   It runs in one transaction: if any statement fails, nothing is applied.
--
-- Why the app keeps working:
--   * Every page only SELECTs as anon  -> allowed by "public read".
--   * Admin actions run as the logged-in admin (authenticated + is_admin()).
--   * The standings triggers run as the caller (SECURITY INVOKER), i.e. as the
--     admin who edits a match -> allowed by "admin write" on the standings tables.
--   * The Supabase dashboard / SQL editor use the service role -> bypass RLS.
--
-- How to apply:
--   1. Read it. 2. Run in Supabase Dashboard -> SQL Editor (one run, it is a transaction).
--   3. Run the checks at the bottom. 4. Test on the site: pages load logged out;
--      as admin, edit a result and add an event -> standings update.
--   Rollback: docs/db/01_security_fix_rollback.sql
-- =====================================================================

begin;

-- 1. Helper ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Data tables: public read, admin write --------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'matches', 'match_events', 'players', 'teams', 'seasons',
    'suspensions', 'team_punishments', 'punishment_types',
    'league_standings', 'discipline_standings',
    'cup_group_teams', 'cup_matches', 'season_stats', 'season_winners',
    'competition_type', 'event_type'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format(
      'create policy "public_read" on public.%I for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "admin_write" on public.%I', t);
    execute format(
      'create policy "admin_write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- old policies replaced by the ones above
drop policy if exists "Allow authenticated insert/update" on public.season_winners;
drop policy if exists "Allow public read access"          on public.season_winners;
drop policy if exists "Enable read access for all users"  on public.seasons;

-- 3. admin_users: only your own row, no writes through the API ------------
alter table public.admin_users enable row level security;
drop policy if exists "Anyone can read admin_users" on public.admin_users;
drop policy if exists "read_own_admin_row" on public.admin_users;
create policy "read_own_admin_row" on public.admin_users
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
revoke insert, update, delete on public.admin_users from anon, authenticated;

-- 4. Dangerous privileges that RLS does not cover ---------------------------
revoke truncate, trigger, references on all tables in schema public from anon, authenticated;

-- 5. Views: read-only for API roles (they keep running with the owner's rights,
--    exactly as today — the data they show is public anyway) ---------------
revoke insert, update, delete, truncate on public.cup_group_matches, public.cup_group_standings from anon, authenticated;

commit;

-- =====================================================================
-- Checks (run after commit)
-- =====================================================================
-- a) every table has RLS on (expect no rows):
-- select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;

-- b) policies in place:
-- select tablename, policyname, cmd, roles from pg_policies where schemaname = 'public' order by 1, 2;

-- c) anon can no longer truncate:
-- select table_name, privilege_type from information_schema.role_table_grants
-- where grantee = 'anon' and table_schema = 'public' and privilege_type in ('TRUNCATE','TRIGGER','REFERENCES');

-- Also recommended (Dashboard -> Authentication -> Providers -> Email):
--   disable "Allow new users to sign up" if only admins ever need accounts.
