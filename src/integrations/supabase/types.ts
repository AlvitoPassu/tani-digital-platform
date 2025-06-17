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
      articles: {
        Row: {
          author_id: number
          content: string
          created_at: string | null
          id: number
          image_url: string | null
          status: Database["public"]["Enums"]["article_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: number
          content: string
          created_at?: string | null
          id?: number
          image_url?: string | null
          status?: Database["public"]["Enums"]["article_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: number
          content?: string
          created_at?: string | null
          id?: number
          image_url?: string | null
          status?: Database["public"]["Enums"]["article_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cart: {
        Row: {
          created_at: string
          id: string
          product_id: number
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: number
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: number
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crop_calendar: {
        Row: {
          actual_harvest_date: string | null
          created_at: string | null
          crop_name: string
          expected_harvest_date: string
          farmer_id: number
          id: number
          notes: string | null
          planting_date: string
          status: Database["public"]["Enums"]["crop_status"] | null
          updated_at: string | null
        }
        Insert: {
          actual_harvest_date?: string | null
          created_at?: string | null
          crop_name: string
          expected_harvest_date: string
          farmer_id: number
          id?: number
          notes?: string | null
          planting_date: string
          status?: Database["public"]["Enums"]["crop_status"] | null
          updated_at?: string | null
        }
        Update: {
          actual_harvest_date?: string | null
          created_at?: string | null
          crop_name?: string
          expected_harvest_date?: string
          farmer_id?: number
          id?: number
          notes?: string | null
          planting_date?: string
          status?: Database["public"]["Enums"]["crop_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_calendar_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string
          receiver_id: number
          sender_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message: string
          receiver_id: number
          sender_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string
          receiver_id?: number
          sender_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: number
          order_id: number
          price_per_unit: number
          product_id: number
          quantity: number
          total_price: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_id: number
          price_per_unit: number
          product_id: number
          quantity: number
          total_price: number
        }
        Update: {
          created_at?: string | null
          id?: number
          order_id?: number
          price_per_unit?: number
          product_id?: number
          quantity?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: number
          created_at: string | null
          id: number
          payment_method: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          shipping_address: string
          shipping_phone: string
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          buyer_id: number
          created_at?: string | null
          id?: number
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          shipping_address: string
          shipping_phone: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: number
          created_at?: string | null
          id?: number
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          shipping_address?: string
          shipping_phone?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: number
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number
          seller_id: number
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number
          unit: string
          updated_at: string | null
        }
        Insert: {
          category_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          seller_id: number
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number
          unit: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          seller_id?: number
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          name: string | null
          phone_number: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id: string
          name?: string | null
          phone_number?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          product_id: number
          rating: number | null
          user_id: number
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          product_id: number
          rating?: number | null
          user_id: number
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          product_id?: number
          rating?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: number
          name: string
          password: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id?: number
          name: string
          password: string
          phone_number?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          password?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          created_at: string | null
          humidity: number | null
          id: number
          location_name: string
          rainfall: number | null
          recorded_at: string
          temperature: number | null
        }
        Insert: {
          created_at?: string | null
          humidity?: number | null
          id?: number
          location_name: string
          rainfall?: number | null
          recorded_at: string
          temperature?: number | null
        }
        Update: {
          created_at?: string | null
          humidity?: number | null
          id?: number
          location_name?: string
          rainfall?: number | null
          recorded_at?: string
          temperature?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_cart_item: {
        Args: { p_user_id: string; p_product_id: number; p_quantity: number }
        Returns: undefined
      }
    }
    Enums: {
      article_status: "draft" | "published" | "archived"
      crop_status: "planned" | "planted" | "harvested" | "failed"
      notification_type: "order" | "message" | "system" | "weather"
      order_status:
        | "pending"
        | "paid"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_status_enum: "pending" | "paid" | "failed" | "refunded"
      product_status: "available" | "out_of_stock" | "archived"
      user_role: "admin" | "farmer" | "buyer"
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
    Enums: {
      article_status: ["draft", "published", "archived"],
      crop_status: ["planned", "planted", "harvested", "failed"],
      notification_type: ["order", "message", "system", "weather"],
      order_status: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status_enum: ["pending", "paid", "failed", "refunded"],
      product_status: ["available", "out_of_stock", "archived"],
      user_role: ["admin", "farmer", "buyer"],
    },
  },
} as const
