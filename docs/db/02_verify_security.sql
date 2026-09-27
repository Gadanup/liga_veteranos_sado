-- =====================================================================
-- Verify the security fix — SAFE TO RUN ANY TIME, CHANGES NOTHING
-- ---------------------------------------------------------------------
-- It pretends to be (1) an anonymous visitor and (2) an admin, tries reads and
-- writes, and then deliberately raises an error at the end. The error aborts
-- the transaction, so EVERY change made during the test is undone.
-- The "error" message you see in the SQL Editor IS the test report.
--
-- Before running: replace  ADMIN_EMAIL_HERE  with an email that is in admin_users.
-- Run it AFTER 01_security_fix.sql (it uses the is_admin() function the fix creates).
-- Expected: every line says OK.
-- =====================================================================
do $$
declare
  report text := '';
  n int;
  admin_email text := 'ADMIN_EMAIL_HERE';
  match_id bigint;
begin
  select id into match_id from public.matches
  where competition_type = 'League' and home_goals is not null
  order by id desc limit 1;

  -- ---------- 1. anonymous visitor ----------
  execute 'set local role anon';
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);

  select count(*) into n from public.matches;
  report := report || format(E'anon can read matches ............ %s\n', case when n > 0 then 'OK' else 'FAIL' end);
  select count(*) into n from public.league_standings;
  report := report || format(E'anon can read league table ....... %s\n', case when n > 0 then 'OK' else 'FAIL' end);
  select count(*) into n from public.cup_group_standings;
  report := report || format(E'anon can read cup groups view .... %s (%s rows)\n', 'OK', n);
  select count(*) into n from public.admin_users;
  report := report || format(E'anon cannot see admin emails ..... %s\n', case when n = 0 then 'OK' else 'FAIL' end);

  update public.matches set home_goals = home_goals where id = match_id;
  get diagnostics n = row_count;
  report := report || format(E'anon cannot update matches ....... %s\n', case when n = 0 then 'OK' else 'FAIL' end);

  begin
    delete from public.players where id = (select min(id) from public.players);
    get diagnostics n = row_count;
    report := report || format(E'anon cannot delete players ....... %s\n', case when n = 0 then 'OK' else 'FAIL' end);
  exception when insufficient_privilege then
    report := report || E'anon cannot delete players ....... OK\n';
  when others then
    report := report || format(E'anon cannot delete players ....... FAIL (%s)\n', sqlerrm);
  end;

  begin
    insert into public.suspensions (player_id, suspension_date, matches_suspended, active)
    values ((select min(id) from public.players), current_date, 1, true);
    report := report || E'anon cannot insert suspensions ... FAIL\n';
  exception when insufficient_privilege then
    report := report || E'anon cannot insert suspensions ... OK\n';
  when others then
    report := report || format(E'anon cannot insert suspensions ... FAIL (%s)\n', sqlerrm);
  end;

  begin
    execute 'truncate public.match_events';
    report := report || E'anon cannot truncate ............. FAIL\n';
  exception when insufficient_privilege then
    report := report || E'anon cannot truncate ............. OK\n';
  when others then
    report := report || format(E'anon cannot truncate ............. FAIL (%s)\n', sqlerrm);
  end;

  execute 'reset role';

  -- ---------- 2. admin ----------
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims',
    json_build_object('email', admin_email, 'role', 'authenticated')::text, true);

  report := report || format(E'admin recognised by is_admin() ... %s\n', case when public.is_admin() then 'OK' else 'FAIL (check the email)' end);
  select count(*) into n from public.admin_users;
  report := report || format(E'admin sees own admin row ......... %s\n', case when n = 1 then 'OK' else 'FAIL' end);

  update public.matches set home_goals = home_goals where id = match_id;   -- fires the standings trigger
  get diagnostics n = row_count;
  report := report || format(E'admin can edit a match + trigger . %s\n', case when n = 1 then 'OK' else 'FAIL' end);

  begin
    insert into public.match_events (match_id, player_id, event_type, minute)
    values (match_id, (select min(id) from public.players), 2, 1);           -- fires the discipline trigger
    report := report || E'admin can add a match event ...... OK\n';
  exception when others then
    report := report || format(E'admin can add a match event ...... FAIL (%s)\n', sqlerrm);
  end;

  execute 'reset role';

  raise exception E'\n==== SECURITY TEST REPORT (all changes rolled back) ====\n%', report;
end $$;
