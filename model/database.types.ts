export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      dashboard: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          code: string;
          created_at: string;
          dashboard_id: number | null;
          deleted_at: string | null;
          id: number;
          invitation_by: string | null;
          invitation_to: string | null;
          is_accept: boolean | null;
          note: string | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          dashboard_id?: number | null;
          deleted_at?: string | null;
          id?: number;
          invitation_by?: string | null;
          invitation_to?: string | null;
          is_accept?: boolean | null;
          note?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          dashboard_id?: number | null;
          deleted_at?: string | null;
          id?: number;
          invitation_by?: string | null;
          invitation_to?: string | null;
          is_accept?: boolean | null;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invitations_dashboard_id_fkey';
            columns: ['dashboard_id'];
            isOneToOne: false;
            referencedRelation: 'dashboard';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invitations_invitation_by_fkey';
            columns: ['invitation_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'invitations_invitation_to_fkey1';
            columns: ['invitation_to'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          },
        ];
      };
      locale: {
        Row: {
          created_at: string;
          created_by: string | null;
          dashboard_id: number | null;
          deleted_at: string | null;
          id: number;
          locale: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          dashboard_id?: number | null;
          deleted_at?: string | null;
          id?: number;
          locale?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          dashboard_id?: number | null;
          deleted_at?: string | null;
          id?: number;
          locale?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'locale_created_by_fkey1';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'locale_dashboard_id_fkey';
            columns: ['dashboard_id'];
            isOneToOne: false;
            referencedRelation: 'dashboard';
            referencedColumns: ['id'];
          },
        ];
      };
      locale_content: {
        Row: {
          content: string | null;
          created_at: string;
          created_by: string;
          deleted_at: string | null;
          id: number;
          key: string | null;
          locale_id: number | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          created_by: string;
          deleted_at?: string | null;
          id?: number;
          key?: string | null;
          locale_id?: number | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          id?: number;
          key?: string | null;
          locale_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'locale_content_created_by_fkey1';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'locale_content_locale_id_fkey';
            columns: ['locale_id'];
            isOneToOne: false;
            referencedRelation: 'locale';
            referencedColumns: ['id'];
          },
        ];
      };
      team: {
        Row: {
          created_at: string;
          dashboard_id: number | null;
          deleted_at: string | null;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dashboard_id?: number | null;
          deleted_at?: string | null;
          id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dashboard_id?: number | null;
          deleted_at?: string | null;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'team_dashboard_id_fkey';
            columns: ['dashboard_id'];
            isOneToOne: false;
            referencedRelation: 'dashboard';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'team_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          data: string | null;
          email: string | null;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          data?: string | null;
          email?: string | null;
          id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: string | null;
          email?: string | null;
          id?: number;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
