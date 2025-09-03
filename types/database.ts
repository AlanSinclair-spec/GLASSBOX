export type Database = {
  public: {
    Tables: {
      orgs: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          user_id: string
          org_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          user_id: string
          org_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          user_id?: string
          org_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          org_id: string
          key_hash: string
          name: string
          created_at: string
          revoked_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          key_hash: string
          name?: string
          created_at?: string
          revoked_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          key_hash?: string
          name?: string
          created_at?: string
          revoked_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          org_id: string
          created_at: string
          request_id: string
          step_type: string | null
          tool_name: string | null
          input_tokens: number
          output_tokens: number
          cost_usd: number
          latency_ms: number
          cache_hit: boolean
          status: 'ok' | 'error' | 'partial'
          payload: any
          index: number
        }
        Insert: {
          id?: string
          org_id: string
          created_at?: string
          request_id: string
          step_type?: string | null
          tool_name?: string | null
          input_tokens?: number
          output_tokens?: number
          cost_usd?: number
          latency_ms?: number
          cache_hit?: boolean
          status?: 'ok' | 'error' | 'partial'
          payload?: any
          index?: number
        }
        Update: {
          id?: string
          org_id?: string
          created_at?: string
          request_id?: string
          step_type?: string | null
          tool_name?: string | null
          input_tokens?: number
          output_tokens?: number
          cost_usd?: number
          latency_ms?: number
          cache_hit?: boolean
          status?: 'ok' | 'error' | 'partial'
          payload?: any
          index?: number
        }
      }
      subscriptions: {
        Row: {
          id: string
          org_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'hacker' | 'startup' | 'scale'
          status: string
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'hacker' | 'startup' | 'scale'
          status?: string
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'hacker' | 'startup' | 'scale'
          status?: string
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
