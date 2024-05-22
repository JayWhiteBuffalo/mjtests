
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  private: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      BusinessRequest: {
        Row: {
          archived: boolean
          createdAt: string
          createdById: string
          id: string
          producer: Json | null
          referrer: string | null
          status: string
          type: string
          updatedAt: string
          updatedById: string
          user: Json
          vendor: Json | null
          version: number
        }
        Insert: {
          archived?: boolean
          createdAt?: string
          createdById: string
          id: string
          producer?: Json | null
          referrer?: string | null
          status: string
          type: string
          updatedAt: string
          updatedById: string
          user: Json
          vendor?: Json | null
          version?: number
        }
        Update: {
          archived?: boolean
          createdAt?: string
          createdById?: string
          id?: string
          producer?: Json | null
          referrer?: string | null
          status?: string
          type?: string
          updatedAt?: string
          updatedById?: string
          user?: Json
          vendor?: Json | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "BusinessRequest_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BusinessRequest_updatedById_fkey"
            columns: ["updatedById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ImageRef: {
        Row: {
          assetId: string | null
          fileSize: number | null
          lastModified: string | null
          originalFilename: string | null
          producerId: string | null
          productId: string | null
          publicId: string
          size: number[] | null
          updatedAt: string
          uploadedById: string | null
          vendorId: string | null
        }
        Insert: {
          assetId?: string | null
          fileSize?: number | null
          lastModified?: string | null
          originalFilename?: string | null
          producerId?: string | null
          productId?: string | null
          publicId: string
          size?: number[] | null
          updatedAt: string
          uploadedById?: string | null
          vendorId?: string | null
        }
        Update: {
          assetId?: string | null
          fileSize?: number | null
          lastModified?: string | null
          originalFilename?: string | null
          producerId?: string | null
          productId?: string | null
          publicId?: string
          size?: number[] | null
          updatedAt?: string
          uploadedById?: string | null
          vendorId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ImageRef_producerId_fkey"
            columns: ["producerId"]
            isOneToOne: false
            referencedRelation: "Producer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ImageRef_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ImageRef_uploadedById_fkey"
            columns: ["uploadedById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ImageRef_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "Vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      Producer: {
        Row: {
          archived: boolean
          contact: Json
          createdAt: string
          createdById: string
          flags: Json
          id: string
          license: Json
          location: Json
          mainImageRefId: string | null
          name: string
          signupStatus: Json
          slug: string
          updatedAt: string
          updatedById: string
          version: number
        }
        Insert: {
          archived?: boolean
          contact: Json
          createdAt?: string
          createdById: string
          flags: Json
          id: string
          license: Json
          location: Json
          mainImageRefId?: string | null
          name: string
          signupStatus: Json
          slug: string
          updatedAt: string
          updatedById: string
          version?: number
        }
        Update: {
          archived?: boolean
          contact?: Json
          createdAt?: string
          createdById?: string
          flags?: Json
          id?: string
          license?: Json
          location?: Json
          mainImageRefId?: string | null
          name?: string
          signupStatus?: Json
          slug?: string
          updatedAt?: string
          updatedById?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "Producer_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Producer_mainImageRefId_fkey"
            columns: ["mainImageRefId"]
            isOneToOne: false
            referencedRelation: "ImageRef"
            referencedColumns: ["publicId"]
          },
          {
            foreignKeyName: "Producer_updatedById_fkey"
            columns: ["updatedById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Product: {
        Row: {
          archived: boolean
          batch: string | null
          brand: string | null
          concentrateType: string | null
          createdAt: string
          createdById: string
          cultivar: string | null
          flags: Json
          id: string
          isDraft: boolean
          mainImageRefId: string | null
          name: string
          normalizedTerps: Json | null
          potency: Json
          price: number | null
          pricePerGram: number | null
          producerId: string | null
          productType: string | null
          rating: Json | null
          slug: string | null
          subspecies: string | null
          terps: Json | null
          updatedAt: string
          updatedById: string
          vendorId: string | null
          version: number
          weight: number | null
        }
        Insert: {
          archived?: boolean
          batch?: string | null
          brand?: string | null
          concentrateType?: string | null
          createdAt?: string
          createdById: string
          cultivar?: string | null
          flags: Json
          id: string
          isDraft: boolean
          mainImageRefId?: string | null
          name: string
          normalizedTerps?: Json | null
          potency: Json
          price?: number | null
          pricePerGram?: number | null
          producerId?: string | null
          productType?: string | null
          rating?: Json | null
          slug?: string | null
          subspecies?: string | null
          terps?: Json | null
          updatedAt: string
          updatedById: string
          vendorId?: string | null
          version?: number
          weight?: number | null
        }
        Update: {
          archived?: boolean
          batch?: string | null
          brand?: string | null
          concentrateType?: string | null
          createdAt?: string
          createdById?: string
          cultivar?: string | null
          flags?: Json
          id?: string
          isDraft?: boolean
          mainImageRefId?: string | null
          name?: string
          normalizedTerps?: Json | null
          potency?: Json
          price?: number | null
          pricePerGram?: number | null
          producerId?: string | null
          productType?: string | null
          rating?: Json | null
          slug?: string | null
          subspecies?: string | null
          terps?: Json | null
          updatedAt?: string
          updatedById?: string
          vendorId?: string | null
          version?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Product_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Product_mainImageRefId_fkey"
            columns: ["mainImageRefId"]
            isOneToOne: false
            referencedRelation: "ImageRef"
            referencedColumns: ["publicId"]
          },
          {
            foreignKeyName: "Product_producerId_fkey"
            columns: ["producerId"]
            isOneToOne: false
            referencedRelation: "Producer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Product_updatedById_fkey"
            columns: ["updatedById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Product_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "Vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string | null
          profileImageUrl: string | null
          roles: string[] | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          name?: string | null
          profileImageUrl?: string | null
          roles?: string[] | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          profileImageUrl?: string | null
          roles?: string[] | null
          updatedAt?: string
        }
        Relationships: []
      }
      UserOnProducer: {
        Row: {
          producerId: string
          role: string
          updatedAt: string
          userId: string
        }
        Insert: {
          producerId: string
          role: string
          updatedAt: string
          userId: string
        }
        Update: {
          producerId?: string
          role?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserOnProducer_producerId_fkey"
            columns: ["producerId"]
            isOneToOne: false
            referencedRelation: "Producer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserOnProducer_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      UserOnVendor: {
        Row: {
          role: string
          updatedAt: string
          userId: string
          vendorId: string
        }
        Insert: {
          role: string
          updatedAt: string
          userId: string
          vendorId: string
        }
        Update: {
          role?: string
          updatedAt?: string
          userId?: string
          vendorId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserOnVendor_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserOnVendor_vendorId_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "Vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      Vendor: {
        Row: {
          archived: boolean
          contact: Json
          createdAt: string
          createdById: string
          flags: Json
          id: string
          latLng: unknown | null
          license: Json
          location: Json
          mainImageRefId: string | null
          name: string
          operatingStatus: string
          rating: Json | null
          schedule: Json
          signupStatus: Json
          slug: string
          updatedAt: string
          updatedById: string
          version: number
        }
        Insert: {
          archived?: boolean
          contact: Json
          createdAt?: string
          createdById: string
          flags: Json
          id: string
          latLng?: unknown | null
          license: Json
          location: Json
          mainImageRefId?: string | null
          name: string
          operatingStatus: string
          rating?: Json | null
          schedule: Json
          signupStatus: Json
          slug: string
          updatedAt: string
          updatedById: string
          version?: number
        }
        Update: {
          archived?: boolean
          contact?: Json
          createdAt?: string
          createdById?: string
          flags?: Json
          id?: string
          latLng?: unknown | null
          license?: Json
          location?: Json
          mainImageRefId?: string | null
          name?: string
          operatingStatus?: string
          rating?: Json | null
          schedule?: Json
          signupStatus?: Json
          slug?: string
          updatedAt?: string
          updatedById?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "Vendor_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Vendor_mainImageRefId_fkey"
            columns: ["mainImageRefId"]
            isOneToOne: false
            referencedRelation: "ImageRef"
            referencedColumns: ["publicId"]
          },
          {
            foreignKeyName: "Vendor_updatedById_fkey"
            columns: ["updatedById"]
            isOneToOne: false
            referencedRelation: "User"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
