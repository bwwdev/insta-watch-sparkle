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
      post_child_comments: {
        Row: {
          comment_id: number | null
          comment_likes: number | null
          comment_post_date: string | null
          comment_text: string | null
          created_at: string | null
          id: number
          parent_comment_id: number | null
          user: Json | null
        }
        Insert: {
          comment_id?: number | null
          comment_likes?: number | null
          comment_post_date?: string | null
          comment_text?: string | null
          created_at?: string | null
          id?: number
          parent_comment_id?: number | null
          user?: Json | null
        }
        Update: {
          comment_id?: number | null
          comment_likes?: number | null
          comment_post_date?: string | null
          comment_text?: string | null
          created_at?: string | null
          id?: number
          parent_comment_id?: number | null
          user?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "post_child_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comment_lead_identification"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comment_lead_identification: {
        Row: {
          analysis_result: Json | null
          caption: string | null
          child_comments: number | null
          comment_id: number | null
          comment_likes: number | null
          comment_post_date: string | null
          comment_text: string | null
          created_at: string | null
          id: number
          insta_post_code: string | null
          is_comment_analysed: boolean | null
          is_email_sent: boolean | null
          is_video: boolean | null
          lead_potential: string | null
          request_id: string | null
          user: Json | null
          video_explanation: string | null
        }
        Insert: {
          analysis_result?: Json | null
          caption?: string | null
          child_comments?: number | null
          comment_id?: number | null
          comment_likes?: number | null
          comment_post_date?: string | null
          comment_text?: string | null
          created_at?: string | null
          id?: number
          insta_post_code?: string | null
          is_comment_analysed?: boolean | null
          is_email_sent?: boolean | null
          is_video?: boolean | null
          lead_potential?: string | null
          request_id?: string | null
          user?: Json | null
          video_explanation?: string | null
        }
        Update: {
          analysis_result?: Json | null
          caption?: string | null
          child_comments?: number | null
          comment_id?: number | null
          comment_likes?: number | null
          comment_post_date?: string | null
          comment_text?: string | null
          created_at?: string | null
          id?: number
          insta_post_code?: string | null
          is_comment_analysed?: boolean | null
          is_email_sent?: boolean | null
          is_video?: boolean | null
          lead_potential?: string | null
          request_id?: string | null
          user?: Json | null
          video_explanation?: string | null
        }
        Relationships: []
      }
      watch_dog: {
        Row: {
          caption: string | null
          comments: number | null
          created_at: string
          followers: number | null
          id: number
          is_video: boolean | null
          likes: number | null
          post_code: string | null
          post_date: string | null
          post_url: string | null
          profile_key: string | null
          shares: number | null
          thumbnail: string | null
          username: string | null
          video_duration: number | null
          video_url: string | null
          views: number | null
        }
        Insert: {
          caption?: string | null
          comments?: number | null
          created_at?: string
          followers?: number | null
          id?: number
          is_video?: boolean | null
          likes?: number | null
          post_code?: string | null
          post_date?: string | null
          post_url?: string | null
          profile_key?: string | null
          shares?: number | null
          thumbnail?: string | null
          username?: string | null
          video_duration?: number | null
          video_url?: string | null
          views?: number | null
        }
        Update: {
          caption?: string | null
          comments?: number | null
          created_at?: string
          followers?: number | null
          id?: number
          is_video?: boolean | null
          likes?: number | null
          post_code?: string | null
          post_date?: string | null
          post_url?: string | null
          profile_key?: string | null
          shares?: number | null
          thumbnail?: string | null
          username?: string | null
          video_duration?: number | null
          video_url?: string | null
          views?: number | null
        }
        Relationships: []
      }
      watch_dog_post_comments: {
        Row: {
          comment_date: string | null
          comment_replies: number | null
          comment_text: string | null
          created_at: string
          id: number
          sentiment_analysis: string | null
          watch_dog_id: number | null
        }
        Insert: {
          comment_date?: string | null
          comment_replies?: number | null
          comment_text?: string | null
          created_at?: string
          id?: number
          sentiment_analysis?: string | null
          watch_dog_id?: number | null
        }
        Update: {
          comment_date?: string | null
          comment_replies?: number | null
          comment_text?: string | null
          created_at?: string
          id?: number
          sentiment_analysis?: string | null
          watch_dog_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "watch_dog_post_comments_watch_dog_id_fkey"
            columns: ["watch_dog_id"]
            isOneToOne: false
            referencedRelation: "watch_dog"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
