-- reset_and_recalculate_league_standings
CREATE OR REPLACE FUNCTION public.reset_and_recalculate_league_standings()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    match RECORD;
    home_result TEXT;
    away_result TEXT;
    affected_season BIGINT;
BEGIN
    -- Get the season from the modified match
    affected_season := NEW.season;
    
    -- Step 1: Reset the league_standings table for all teams involved in the affected season
    UPDATE league_standings
    SET wins = 0,
        draws = 0,
        losses = 0,
        goals_for = 0,
        goals_against = 0,
        matches_played = 0
    WHERE season_year = affected_season
      AND team_id IN (
        SELECT DISTINCT home_team_id FROM matches WHERE competition_type = 'League' AND season = affected_season
        UNION
        SELECT DISTINCT away_team_id FROM matches WHERE competition_type = 'League' AND season = affected_season
    );

    -- Step 2: Loop through each league match in the affected season and recalculate standings
    FOR match IN
        SELECT id, home_team_id, away_team_id, home_goals, away_goals
        FROM matches
        WHERE competition_type = 'League'
          AND season = affected_season
          AND home_goals IS NOT NULL  -- Only process matches where both teams have goals
          AND away_goals IS NOT NULL
    LOOP
        -- Increment matches played for both home and away teams
        UPDATE league_standings
        SET matches_played = matches_played + 1
        WHERE team_id = match.home_team_id AND season_year = affected_season;

        UPDATE league_standings
        SET matches_played = matches_played + 1
        WHERE team_id = match.away_team_id AND season_year = affected_season;

        -- Determine result for home and away teams
        IF match.home_goals > match.away_goals THEN
            home_result := 'win';
            away_result := 'loss';
        ELSIF match.home_goals < match.away_goals THEN
            home_result := 'loss';
            away_result := 'win';
        ELSE
            home_result := 'draw';
            away_result := 'draw';
        END IF;

        -- Update home team's standings
        IF home_result = 'win' THEN
            UPDATE league_standings
            SET wins = wins + 1,
                goals_for = goals_for + match.home_goals,
                goals_against = goals_against + match.away_goals
            WHERE team_id = match.home_team_id AND season_year = affected_season;
        ELSIF home_result = 'loss' THEN
            UPDATE league_standings
            SET losses = losses + 1,
                goals_for = goals_for + match.home_goals,
                goals_against = goals_against + match.away_goals
            WHERE team_id = match.home_team_id AND season_year = affected_season;
        ELSE
            UPDATE league_standings
            SET draws = draws + 1,
                goals_for = goals_for + match.home_goals,
                goals_against = goals_against + match.away_goals
            WHERE team_id = match.home_team_id AND season_year = affected_season;
        END IF;

        -- Update away team's standings
        IF away_result = 'win' THEN
            UPDATE league_standings
            SET wins = wins + 1,
                goals_for = goals_for + match.away_goals,
                goals_against = goals_against + match.home_goals
            WHERE team_id = match.away_team_id AND season_year = affected_season;
        ELSIF away_result = 'loss' THEN
            UPDATE league_standings
            SET losses = losses + 1,
                goals_for = goals_for + match.away_goals,
                goals_against = goals_against + match.home_goals
            WHERE team_id = match.away_team_id AND season_year = affected_season;
        ELSE
            UPDATE league_standings
            SET draws = draws + 1,
                goals_for = goals_for + match.away_goals,
                goals_against = goals_against + match.home_goals
            WHERE team_id = match.away_team_id AND season_year = affected_season;
        END IF;

    END LOOP;
    -- Return NULL as this is a trigger function
    RETURN NULL;
    
END;$function$


-- update_discipline_standings
CREATE OR REPLACE FUNCTION public.update_discipline_standings()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Reset yellow cards, red cards, and matches_played for all teams
    UPDATE discipline_standings
    SET yellow_cards = 0, red_cards = 0, matches_played = 0, other_punishments = 0 
    WHERE true;

    -- Yellow cards: attribute to team player was on AT TIME OF MATCH
    UPDATE discipline_standings AS ds
    SET yellow_cards = COALESCE(yellow_data.yellow_card_count, 0)
    FROM (
        SELECT
            CASE
                WHEN p."transferDate" IS NOT NULL
                     AND p."previousClub" IS NOT NULL
                     AND m.match_date < p."transferDate"
                THEN p."previousClub"::integer
                ELSE p.team_id
            END AS responsible_team_id,
            m.season,
            COUNT(me.id) AS yellow_card_count
        FROM match_events AS me
        JOIN players AS p ON me.player_id = p.id
        JOIN matches AS m ON me.match_id = m.id
        WHERE me.event_type = 2
        GROUP BY
            CASE
                WHEN p."transferDate" IS NOT NULL
                     AND p."previousClub" IS NOT NULL
                     AND m.match_date < p."transferDate"
                THEN p."previousClub"::integer
                ELSE p.team_id
            END,
            m.season
    ) AS yellow_data
    WHERE ds.team_id = yellow_data.responsible_team_id
      AND ds.season = yellow_data.season;

    -- Red cards: attribute to team player was on AT TIME OF MATCH
    UPDATE discipline_standings AS ds
    SET red_cards = COALESCE(red_data.red_card_count, 0)
    FROM (
        SELECT
            CASE
                WHEN p."transferDate" IS NOT NULL
                     AND p."previousClub" IS NOT NULL
                     AND m.match_date < p."transferDate"
                THEN p."previousClub"::integer
                ELSE p.team_id
            END AS responsible_team_id,
            m.season,
            COUNT(me.id) AS red_card_count
        FROM match_events AS me
        JOIN players AS p ON me.player_id = p.id
        JOIN matches AS m ON me.match_id = m.id
        WHERE me.event_type = 3
        GROUP BY
            CASE
                WHEN p."transferDate" IS NOT NULL
                     AND p."previousClub" IS NOT NULL
                     AND m.match_date < p."transferDate"
                THEN p."previousClub"::integer
                ELSE p.team_id
            END,
            m.season
    ) AS red_data
    WHERE ds.team_id = red_data.responsible_team_id
      AND ds.season = red_data.season;

    -- matches_played: unchanged
    UPDATE discipline_standings AS ds
    SET matches_played = COALESCE(matches_data.match_count, 0)
    FROM (
        SELECT team_id, season, COUNT(id) AS match_count
        FROM (
            SELECT home_team_id AS team_id, id, season
            FROM matches
            WHERE competition_type IN ('League', 'Cup')
            AND home_goals IS NOT NULL
            AND away_goals IS NOT NULL
            UNION ALL
            SELECT away_team_id AS team_id, id, season
            FROM matches
            WHERE competition_type IN ('League', 'Cup')
            AND home_goals IS NOT NULL
            AND away_goals IS NOT NULL
        ) AS all_matches
        GROUP BY team_id, season
    ) AS matches_data
    WHERE ds.team_id = matches_data.team_id
      AND ds.season = matches_data.season;

    -- other_punishments: unchanged
    UPDATE discipline_standings AS ds
    SET other_punishments = COALESCE(punishment_data.total_punishment_points, 0)
    FROM (
        SELECT tp.team_id, tp.season, SUM(pt.points_added * COALESCE(tp.quantity, 1)) AS total_punishment_points
        FROM team_punishments AS tp
        JOIN punishment_types AS pt ON tp.punishment_type_id = pt.punishment_type_id
        GROUP BY tp.team_id, tp.season
    ) AS punishment_data
    WHERE ds.team_id = punishment_data.team_id
      AND ds.season = punishment_data.season;

    RETURN NULL;
END;
$function$


