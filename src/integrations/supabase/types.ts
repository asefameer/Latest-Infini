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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string
          id: string
          image: string
          name: string
          product_count: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image?: string
          name: string
          product_count?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image?: string
          name?: string
          product_count?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          banner_image: string
          brand: string
          city: string
          created_at: string
          date: string
          description: string
          end_date: string | null
          faq: Json
          id: string
          is_featured: boolean
          lineup: Json | null
          og_image: string | null
          schedule: Json | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          ticket_tiers: Json
          time: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          banner_image?: string
          brand: string
          city?: string
          created_at?: string
          date: string
          description?: string
          end_date?: string | null
          faq?: Json
          id?: string
          is_featured?: boolean
          lineup?: Json | null
          og_image?: string | null
          schedule?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          ticket_tiers?: Json
          time?: string
          title: string
          updated_at?: string
          venue?: string
        }
        Update: {
          banner_image?: string
          brand?: string
          city?: string
          created_at?: string
          date?: string
          description?: string
          end_date?: string | null
          faq?: Json
          id?: string
          is_featured?: boolean
          lineup?: Json | null
          og_image?: string | null
          schedule?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          ticket_tiers?: Json
          time?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      homepage_banners: {
        Row: {
          accent_color: string
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link: string
          name: string
          sort_order: number
          tagline: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          link?: string
          name: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link?: string
          name?: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          href: string
          id: string
          is_visible: boolean
          label: string
          location: string
          parent_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_visible?: boolean
          label: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_visible?: boolean
          label?: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          category: string
          compare_at_price: number | null
          created_at: string
          currency: string
          description: string
          id: string
          images: Json
          in_stock: boolean
          is_new: boolean
          is_trending: boolean
          name: string
          og_image: string | null
          price: number
          seo_description: string | null
          seo_title: string | null
          slug: string
          specs: Json
          tags: Json
          updated_at: string
          variants: Json
        }
        Insert: {
          brand: string
          category: string
          compare_at_price?: number | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          images?: Json
          in_stock?: boolean
          is_new?: boolean
          is_trending?: boolean
          name: string
          og_image?: string | null
          price: number
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          specs?: Json
          tags?: Json
          updated_at?: string
          variants?: Json
        }
        Update: {
          brand?: string
          category?: string
          compare_at_price?: number | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          images?: Json
          in_stock?: boolean
          is_new?: boolean
          is_trending?: boolean
          name?: string
          og_image?: string | null
          price?: number
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          specs?: Json
          tags?: Json
          updated_at?: string
          variants?: Json
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: string
          created_at: string
          id: string
          section: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value?: string
          created_at?: string
          id?: string
          section: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: string
          created_at?: string
          id?: string
          section?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
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
