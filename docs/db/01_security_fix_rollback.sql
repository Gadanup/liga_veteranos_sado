-- Rollback for 01_security_fix.sql — restores the previous (open) state.
-- Only use if the site breaks after applying the fix; then tell Claude what broke.

begin;

do $$
declare
  t text;
begin
  foreach t in array array[
    'matches', 'match_events', 'players', 'teams',
    'suspensions', 'team_punishments', 'punishment_types',
    'league_standings', 'discipline_standings',
    'cup_group_teams', 'cup_matches', 'season_stats'
  ]
  loop
    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format('drop policy if exists "admin_write" on public.%I', t);
    execute format('alter table public.%I disable row level security', t);
  end loop;

  -- tables that already had RLS before: restore their original policies
  foreach t in array array['seasons', 'season_winners', 'competition_type', 'event_type']
  loop
    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format('drop policy if exists "admin_write" on public.%I', t);
  end loop;
end $$;

create policy "Enable read access for all users" on public.seasons for select to public using (true);
create policy "Allow public read access" on public.season_winners for select to public using (true);
create policy "Allow authenticated insert/update" on public.season_winners for all to public using (auth.role() = 'authenticated');

drop policy if exists "read_own_admin_row" on public.admin_users;
create policy "Anyone can read admin_users" on public.admin_users for select to anon, authenticated using (true);

grant insert, update, delete on public.admin_users to anon, authenticated;
grant truncate, trigger, references on all tables in schema public to anon, authenticated;

grant insert, update, delete, truncate on public.cup_group_matches, public.cup_group_standings to anon, authenticated;

drop function if exists public.is_admin();

commit;
