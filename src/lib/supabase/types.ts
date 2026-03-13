export interface Database {
  public: {
    Tables: {
      stock_results: {
        Row: {
          id: string;
          source: string;
          market: string;
          market_label_th: string;
          market_label_lo: string | null;
          flag_emoji: string;
          winning_number: string | null;
          round_date: string;
          close_time: string;
          result_time: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          market: string;
          market_label_th: string;
          market_label_lo?: string | null;
          flag_emoji?: string;
          winning_number?: string | null;
          round_date?: string;
          close_time: string;
          result_time?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          market?: string;
          market_label_th?: string;
          market_label_lo?: string | null;
          flag_emoji?: string;
          winning_number?: string | null;
          round_date?: string;
          close_time?: string;
          result_time?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      agent_api_keys: {
        Row: {
          id: string;
          agent_name: string;
          api_key: string;
          allowed_sources: string[];
          allowed_ips: string[] | null;
          rate_limit: number;
          is_active: boolean;
          webhook_url: string | null;
          last_used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_name: string;
          api_key: string;
          allowed_sources?: string[];
          allowed_ips?: string[] | null;
          rate_limit?: number;
          is_active?: boolean;
          webhook_url?: string | null;
          last_used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          agent_name?: string;
          api_key?: string;
          allowed_sources?: string[];
          allowed_ips?: string[] | null;
          rate_limit?: number;
          is_active?: boolean;
          webhook_url?: string | null;
          last_used_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      api_usage_logs: {
        Row: {
          id: number;
          agent_id: string | null;
          endpoint: string;
          ip_address: string;
          response_code: number;
          created_at: string;
        };
        Insert: {
          agent_id?: string | null;
          endpoint: string;
          ip_address: string;
          response_code: number;
          created_at?: string;
        };
        Update: {
          agent_id?: string | null;
          endpoint?: string;
          ip_address?: string;
          response_code?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'api_usage_logs_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'agent_api_keys';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
