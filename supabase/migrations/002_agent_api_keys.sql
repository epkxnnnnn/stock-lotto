-- Agent API Keys table
-- Stores API keys for whitelisted agents (KBIZ289, Khong.vip, etc.)

CREATE TABLE agent_api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL,
  api_key text NOT NULL UNIQUE, -- SHA-256 hashed
  allowed_sources text[] NOT NULL DEFAULT '{vvip,platinum}',
  allowed_ips inet[],
  rate_limit int NOT NULL DEFAULT 60, -- requests per minute
  is_active boolean NOT NULL DEFAULT true,
  webhook_url text,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_api_keys_api_key ON agent_api_keys (api_key);
CREATE INDEX idx_agent_api_keys_active ON agent_api_keys (is_active) WHERE is_active = true;
