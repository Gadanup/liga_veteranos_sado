export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      competition_type: {
        Row: {
          competition: string | null
          created_at: string
          id: number
        }
        Insert: {
          competition?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          competition?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      cup_group_teams: {
        Row: {
          created_at: string | null
          group_name: string
          id: number
          season: number
          team_id: number
        }
        Insert: {
          created_at?: string | null
          group_name: string
          id?: number
          season: number
          team_id: number
        }
        Update: {
          created_at?: string | null
          group_name?: string
          id?: number
          season?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cup_group_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      cup_matches: {
        Row: {
          id: number
          match_id: number | null
          round: string | null
          winner_team_id: number | null
        }
        Insert: {
          id?: number
          match_id?: number | null
          round?: string | null
          winner_team_id?: number | null
        }
        Update: {
          id?: number
          match_id?: number | null
          round?: string | null
          winner_team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cup_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "cup_group_matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "cup_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_matches_match_id_fkey1"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "cup_group_matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "cup_matches_match_id_fkey1"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_matches_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_matches_winner_team_id_fkey1"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      discipline_standings: {
        Row: {
          calculated_points: number | null
          excluded: boolean | null
          matches_played: number | null
          other_punishments: number | null
          red_cards: number | null
          season: number | null
          team_id: number
          yellow_cards: number | null
        }
        Insert: {
          calculated_points?: number | null
          excluded?: boolean | null
          matches_played?: number | null
          other_punishments?: number | null
          red_cards?: number | null
          season?: number | null
          team_id: number
          yellow_cards?: number | null
        }
        Update: {
          calculated_points?: number | null
          excluded?: boolean | null
          matches_played?: number | null
          other_punishments?: number | null
          red_cards?: number | null
          season?: number | null
          team_id?: number
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discipline_standings_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipline_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      event_type: {
        Row: {
          created_at: string
          event: string | null
          id: number
        }
        Insert: {
          created_at?: string
          event?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          event?: string | null
          id?: number
        }
        Relationships: []
      }
      league_standings: {
        Row: {
          away_draws: number | null
          away_goals_against: number | null
          away_goals_for: number | null
          away_losses: number | null
          away_matches_played: number | null
          away_wins: number | null
          draws: number | null
          goals_against: number | null
          goals_for: number | null
          home_draws: number | null
          home_goals_against: number | null
          home_goals_for: number | null
          home_losses: number | null
          home_matches_played: number | null
          home_wins: number | null
          id: number
          losses: number | null
          matches_played: number | null
          points: number | null
          season_year: number | null
          team_id: number | null
          wins: number | null
        }
        Insert: {
          away_draws?: number | null
          away_goals_against?: number | null
          away_goals_for?: number | null
          away_losses?: number | null
          away_matches_played?: number | null
          away_wins?: number | null
          draws?: number | null
          goals_against?: number | null
          goals_for?: number | null
          home_draws?: number | null
          home_goals_against?: number | null
          home_goals_for?: number | null
          home_losses?: number | null
          home_matches_played?: number | null
          home_wins?: number | null
          id?: number
          losses?: number | null
          matches_played?: number | null
          points?: number | null
          season_year?: number | null
          team_id?: number | null
          wins?: number | null
        }
        Update: {
          away_draws?: number | null
          away_goals_against?: number | null
          away_goals_for?: number | null
          away_losses?: number | null
          away_matches_played?: number | null
          away_wins?: number | null
          draws?: number | null
          goals_against?: number | null
          goals_for?: number | null
          home_draws?: number | null
          home_goals_against?: number | null
          home_goals_for?: number | null
          home_losses?: number | null
          home_matches_played?: number | null
          home_wins?: number | null
          id?: number
          losses?: number | null
          matches_played?: number | null
          points?: number | null
          season_year?: number | null
          team_id?: number | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_league_standings_season"
            columns: ["season_year"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_standings_team_id_fkey1"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      match_events: {
        Row: {
          event_type: number | null
          id: number
          match_id: number | null
          minute: number | null
          player_id: number | null
        }
        Insert: {
          event_type?: number | null
          id?: number
          match_id?: number | null
          minute?: number | null
          player_id?: number | null
        }
        Update: {
          event_type?: number | null
          id?: number
          match_id?: number | null
          minute?: number | null
          player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_events_event_type_fkey"
            columns: ["event_type"]
            isOneToOne: false
            referencedRelation: "event_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "cup_group_matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey1"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "cup_group_matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey1"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey1"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_goals: number | null
          away_penalties: number | null
          away_team_id: number | null
          competition_type: string | null
          group_name: string | null
          home_goals: number | null
          home_penalties: number | null
          home_team_id: number | null
          id: number
          match_date: string | null
          match_sheet: string | null
          match_time: string | null
          round: string | null
          season: number | null
          stadium_name: string | null
          week: number | null
        }
        Insert: {
          away_goals?: number | null
          away_penalties?: number | null
          away_team_id?: number | null
          competition_type?: string | null
          group_name?: string | null
          home_goals?: number | null
          home_penalties?: number | null
          home_team_id?: number | null
          id?: number
          match_date?: string | null
          match_sheet?: string | null
          match_time?: string | null
          round?: string | null
          season?: number | null
          stadium_name?: string | null
          week?: number | null
        }
        Update: {
          away_goals?: number | null
          away_penalties?: number | null
          away_team_id?: number | null
          competition_type?: string | null
          group_name?: string | null
          home_goals?: number | null
          home_penalties?: number | null
          home_team_id?: number | null
          id?: number
          match_date?: string | null
          match_sheet?: string | null
          match_time?: string | null
          round?: string | null
          season?: number | null
          stadium_name?: string | null
          week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_matches_season"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_away_team_id_fkey1"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey1"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          appearances: number | null
          assists: number | null
          birthdate: string | null
          goals: number | null
          height: number | null
          id: number
          joker: boolean
          name: string
          nationality: string | null
          number: number | null
          photo_url: string | null
          position: string | null
          previousClub: number | null
          red_cards: number | null
          team_id: number | null
          transferDate: string | null
          weight: number | null
          yellow_cards: number | null
        }
        Insert: {
          appearances?: number | null
          assists?: number | null
          birthdate?: string | null
          goals?: number | null
          height?: number | null
          id?: number
          joker?: boolean
          name: string
          nationality?: string | null
          number?: number | null
          photo_url?: string | null
          position?: string | null
          previousClub?: number | null
          red_cards?: number | null
          team_id?: number | null
          transferDate?: string | null
          weight?: number | null
          yellow_cards?: number | null
        }
        Update: {
          appearances?: number | null
          assists?: number | null
          birthdate?: string | null
          goals?: number | null
          height?: number | null
          id?: number
          joker?: boolean
          name?: string
          nationality?: string | null
          number?: number | null
          photo_url?: string | null
          position?: string | null
          previousClub?: number | null
          red_cards?: number | null
          team_id?: number | null
          transferDate?: string | null
          weight?: number | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_previousClub_fkey"
            columns: ["previousClub"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_team_id_fkey1"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      punishment_types: {
        Row: {
          description: string
          points_added: number
          punishment_type_id: number
        }
        Insert: {
          description: string
          points_added: number
          punishment_type_id?: number
        }
        Update: {
          description?: string
          points_added?: number
          punishment_type_id?: number
        }
        Relationships: []
      }
      season_stats: {
        Row: {
          appearances: number | null
          assists: number | null
          goals: number | null
          id: number
          player_id: number | null
          red_cards: number | null
          season_year: number | null
          yellow_cards: number | null
        }
        Insert: {
          appearances?: number | null
          assists?: number | null
          goals?: number | null
          id?: number
          player_id?: number | null
          red_cards?: number | null
          season_year?: number | null
          yellow_cards?: number | null
        }
        Update: {
          appearances?: number | null
          assists?: number | null
          goals?: number | null
          id?: number
          player_id?: number | null
          red_cards?: number | null
          season_year?: number | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_stats_player_id_fkey1"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      season_winners: {
        Row: {
          created_at: string | null
          cup_winner_id: number | null
          discipline_red_cards: number | null
          discipline_winner_id: number | null
          discipline_yellow_cards: number | null
          id: number
          league_winner_id: number | null
          season_id: number | null
          supercup_match_path: string | null
          supercup_winner_id: number | null
          top_scorer_1_goals: number | null
          top_scorer_1_id: number | null
          top_scorer_2_goals: number | null
          top_scorer_2_id: number | null
          top_scorer_3_goals: number | null
          top_scorer_3_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cup_winner_id?: number | null
          discipline_red_cards?: number | null
          discipline_winner_id?: number | null
          discipline_yellow_cards?: number | null
          id?: number
          league_winner_id?: number | null
          season_id?: number | null
          supercup_match_path?: string | null
          supercup_winner_id?: number | null
          top_scorer_1_goals?: number | null
          top_scorer_1_id?: number | null
          top_scorer_2_goals?: number | null
          top_scorer_2_id?: number | null
          top_scorer_3_goals?: number | null
          top_scorer_3_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cup_winner_id?: number | null
          discipline_red_cards?: number | null
          discipline_winner_id?: number | null
          discipline_yellow_cards?: number | null
          id?: number
          league_winner_id?: number | null
          season_id?: number | null
          supercup_match_path?: string | null
          supercup_winner_id?: number | null
          top_scorer_1_goals?: number | null
          top_scorer_1_id?: number | null
          top_scorer_2_goals?: number | null
          top_scorer_2_id?: number | null
          top_scorer_3_goals?: number | null
          top_scorer_3_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "season_winners_cup_winner_id_fkey"
            columns: ["cup_winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_winners_discipline_winner_id_fkey"
            columns: ["discipline_winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_winners_league_winner_id_fkey"
            columns: ["league_winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_winners_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_winners_supercup_winner_id_fkey"
            columns: ["supercup_winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_winners_top_scorer_1_id_fkey"
            columns: ["top_scorer_1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_winners_top_scorer_2_id_fkey"
            columns: ["top_scorer_2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_winners_top_scorer_3_id_fkey"
            columns: ["top_scorer_3_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          cup_group_stage: boolean
          description: string | null
          end_date: string | null
          id: number
          is_current: boolean | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          cup_group_stage?: boolean
          description?: string | null
          end_date?: string | null
          id?: number
          is_current?: boolean | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          cup_group_stage?: boolean
          description?: string | null
          end_date?: string | null
          id?: number
          is_current?: boolean | null
          start_date?: string | null
        }
        Relationships: []
      }
      suspensions: {
        Row: {
          active: boolean | null
          id: number
          matches_suspended: number
          player_id: number | null
          reason: string | null
          season: number | null
          suspension_date: string
        }
        Insert: {
          active?: boolean | null
          id?: number
          matches_suspended: number
          player_id?: number | null
          reason?: string | null
          season?: number | null
          suspension_date: string
        }
        Update: {
          active?: boolean | null
          id?: number
          matches_suspended?: number
          player_id?: number | null
          reason?: string | null
          season?: number | null
          suspension_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "suspensions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suspensions_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      team_punishments: {
        Row: {
          description: string | null
          event_date: string
          match_id: number | null
          player_id: number | null
          punishment_type_id: number
          quantity: number | null
          season: number | null
          team_id: number
          team_punishment_id: number
        }
        Insert: {
          description?: string | null
          event_date?: string
          match_id?: number | null
          player_id?: number | null
          punishment_type_id: number
          quantity?: number | null
          season?: number | null
          team_id: number
          team_punishment_id?: number
        }
        Update: {
          description?: string | null
          event_date?: string
          match_id?: number | null
          player_id?: number | null
          punishment_type_id?: number
          quantity?: number | null
          season?: number | null
          team_id?: number
          team_punishment_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_punishments_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "cup_group_matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "team_punishments_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_punishments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_punishments_punishment_type_id_fkey"
            columns: ["punishment_type_id"]
            isOneToOne: false
            referencedRelation: "punishment_types"
            referencedColumns: ["punishment_type_id"]
          },
          {
            foreignKeyName: "team_punishments_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_punishments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          alternative_color: string | null
          alternative_jersey: string | null
          excluded: boolean | null
          excluded_description: string | null
          founded: string | null
          id: number
          logo_url: string | null
          main_color: string | null
          main_jersey: string | null
          manager_name: string | null
          manager_photo_url: string | null
          name: string | null
          roster_url: string | null
          season: number | null
          short_name: string | null
          stadium_name: string | null
        }
        Insert: {
          alternative_color?: string | null
          alternative_jersey?: string | null
          excluded?: boolean | null
          excluded_description?: string | null
          founded?: string | null
          id?: never
          logo_url?: string | null
          main_color?: string | null
          main_jersey?: string | null
          manager_name?: string | null
          manager_photo_url?: string | null
          name?: string | null
          roster_url?: string | null
          season?: number | null
          short_name?: string | null
          stadium_name?: string | null
        }
        Update: {
          alternative_color?: string | null
          alternative_jersey?: string | null
          excluded?: boolean | null
          excluded_description?: string | null
          founded?: string | null
          id?: never
          logo_url?: string | null
          main_color?: string | null
          main_jersey?: string | null
          manager_name?: string | null
          manager_photo_url?: string | null
          name?: string | null
          roster_url?: string | null
          season?: number | null
          short_name?: string | null
          stadium_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cup_group_matches: {
        Row: {
          away_goals: number | null
          away_team_color: string | null
          away_team_id: number | null
          away_team_logo: string | null
          away_team_name: string | null
          group_name: string | null
          home_goals: number | null
          home_team_color: string | null
          home_team_id: number | null
          home_team_logo: string | null
          home_team_name: string | null
          match_date: string | null
          match_id: number | null
          match_status: string | null
          match_time: string | null
          result: string | null
          season: number | null
          stadium: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_matches_season"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_away_team_id_fkey1"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey1"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      cup_group_standings: {
        Row: {
          draws: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          group_name: string | null
          logo_url: string | null
          losses: number | null
          matches_played: number | null
          points: number | null
          season: number | null
          team_id: number | null
          team_name: string | null
          wins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cup_group_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_group_standings_for_season: {
        Args: { p_group_name?: string; p_season: number }
        Returns: {
          draws: number
          goal_difference: number
          goals_against: number
          goals_for: number
          group_name: string
          logo_url: string
          losses: number
          main_color: string
          matches_played: number
          points: number
          team_id: number
          team_name: string
          team_position: number
          wins: number
        }[]
      }
      get_group_summary: {
        Args: { p_group_name: string; p_season: number }
        Returns: {
          avg_goals_per_match: number
          completed_matches: number
          group_name: string
          teams_count: number
          total_goals: number
          total_matches: number
        }[]
      }
      get_qualified_teams_for_season: {
        Args: { p_season: number }
        Returns: {
          goal_difference: number
          group_name: string
          logo_url: string
          points: number
          qualification_type: string
          semifinal_info: string
          semifinal_seed: string
          team_id: number
          team_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
