export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      employee_records: {
        Row: {
          id: string;
          employee_name: string;
          employee_email: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          contact_relationship: string | null;
          authorize_detention: boolean;
          signature_base64: string | null;
          language: string;
          ip_address: string | null;
          user_agent: string | null;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_name: string;
          employee_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          contact_relationship?: string | null;
          authorize_detention?: boolean;
          signature_base64?: string | null;
          language?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_name?: string;
          employee_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          contact_relationship?: string | null;
          authorize_detention?: boolean;
          signature_base64?: string | null;
          language?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          completed_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      employers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          stripe_customer_id: string | null;
          plan: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          stripe_customer_id?: string | null;
          plan?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          stripe_customer_id?: string | null;
          plan?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      employer_roster: {
  Row: {
    id: string;
    employee_name: string;
    employee_email: string | null;
    department: string;
    status: 'active' | 'terminated';
    uploaded_at: string;
    terminated_at: string | null;
  };
  Insert: {
    id?: string;
    employee_name: string;
    employee_email?: string | null;
    department?: string;
    status?: 'active' | 'terminated';
    uploaded_at?: string;
    terminated_at?: string | null;
  };
  Update: {
    id?: string;
    employee_name?: string;
    employee_email?: string | null;
    department?: string;
    status?: 'active' | 'terminated';
    uploaded_at?: string;
    terminated_at?: string | null;
  };
  Relationships: [];
};
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    PostgrestVersion: "12";        // ← required in v2.39+
  };
};