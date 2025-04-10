export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      learning_activities: {
        Row: {
          category_id: string | null
          content: Json
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          content: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_activities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_goal: number | null
          default_arabic_variant: string | null
          display_name: string | null
          id: string
          last_study_date: string | null
          name: string | null
          script_difficulty_level: number | null
          show_tashkeel: boolean | null
          streak_count: number | null
          theme: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_goal?: number | null
          default_arabic_variant?: string | null
          display_name?: string | null
          id: string
          last_study_date?: string | null
          name?: string | null
          script_difficulty_level?: number | null
          show_tashkeel?: boolean | null
          streak_count?: number | null
          theme?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_goal?: number | null
          default_arabic_variant?: string | null
          display_name?: string | null
          id?: string
          last_study_date?: string | null
          name?: string | null
          script_difficulty_level?: number | null
          show_tashkeel?: boolean | null
          streak_count?: number | null
          theme?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      study_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          launch_url: string
          name: string
          thumbnail_url: string | null
          variant_type: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          launch_url: string
          name: string
          thumbnail_url?: string | null
          variant_type: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          launch_url?: string
          name?: string
          thumbnail_url?: string | null
          variant_type?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          activity_id: string | null
          correct_answers: number | null
          created_at: string | null
          end_time: string | null
          group_id: string | null
          id: string
          pronunciation_accuracy: number | null
          script_recognition_accuracy: number | null
          start_time: string
          user_id: string | null
          variant_type: string | null
          words_studied: number | null
        }
        Insert: {
          activity_id?: string | null
          correct_answers?: number | null
          created_at?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          pronunciation_accuracy?: number | null
          script_recognition_accuracy?: number | null
          start_time?: string
          user_id?: string | null
          variant_type?: string | null
          words_studied?: number | null
        }
        Update: {
          activity_id?: string | null
          correct_answers?: number | null
          created_at?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          pronunciation_accuracy?: number | null
          script_recognition_accuracy?: number | null
          start_time?: string
          user_id?: string | null
          variant_type?: string | null
          words_studied?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "study_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "word_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          created_at: string
          id: string
          last_reviewed: string | null
          next_review: string | null
          proficiency_level: number | null
          user_id: string | null
          word_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          proficiency_level?: number | null
          user_id?: string | null
          word_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          proficiency_level?: number | null
          user_id?: string | null
          word_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          arabic_word: string
          audio_url: string | null
          category_id: string | null
          created_at: string
          difficulty_level: number | null
          english_translation: string
          example_sentence: string | null
          final_form: string | null
          id: string
          initial_form: string | null
          isolated_form: string | null
          medial_form: string | null
          metadata: Json | null
          pattern_id: string | null
          pronunciation_correct: number | null
          pronunciation_wrong: number | null
          related_words: string[] | null
          root_letters: string[] | null
          script_recognition_correct: number | null
          script_recognition_wrong: number | null
          tags: string[] | null
          tashkeel_form: string | null
          transliteration: string | null
        }
        Insert: {
          arabic_word: string
          audio_url?: string | null
          category_id?: string | null
          created_at?: string
          difficulty_level?: number | null
          english_translation: string
          example_sentence?: string | null
          final_form?: string | null
          id?: string
          initial_form?: string | null
          isolated_form?: string | null
          medial_form?: string | null
          metadata?: Json | null
          pattern_id?: string | null
          pronunciation_correct?: number | null
          pronunciation_wrong?: number | null
          related_words?: string[] | null
          root_letters?: string[] | null
          script_recognition_correct?: number | null
          script_recognition_wrong?: number | null
          tags?: string[] | null
          tashkeel_form?: string | null
          transliteration?: string | null
        }
        Update: {
          arabic_word?: string
          audio_url?: string | null
          category_id?: string | null
          created_at?: string
          difficulty_level?: number | null
          english_translation?: string
          example_sentence?: string | null
          final_form?: string | null
          id?: string
          initial_form?: string | null
          isolated_form?: string | null
          medial_form?: string | null
          metadata?: Json | null
          pattern_id?: string | null
          pronunciation_correct?: number | null
          pronunciation_wrong?: number | null
          related_words?: string[] | null
          root_letters?: string[] | null
          script_recognition_correct?: number | null
          script_recognition_wrong?: number | null
          tags?: string[] | null
          tashkeel_form?: string | null
          transliteration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocabulary_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "word_patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      word_groups: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "word_groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      word_patterns: {
        Row: {
          created_at: string
          description: string | null
          id: string
          pattern: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          pattern: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          pattern?: string
        }
        Relationships: []
      }
      word_reviews: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          review_type: string
          study_session_id: string | null
          word_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct: boolean
          review_type: string
          study_session_id?: string | null
          word_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          review_type?: string
          study_session_id?: string | null
          word_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "word_reviews_study_session_id_fkey"
            columns: ["study_session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "word_reviews_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
