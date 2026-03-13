-- API Usage Logs table
-- Tracks all agent API requests for monitoring and rate limiting

CREATE TABLE api_usage_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent_id uuid REFERENCES agent_api_keys(id) ON DELETE SET NULL,
  endpoint text NOT NULL,
  ip_address inet NOT NULL,
  response_code int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_api_usage_logs_agent_time ON api_usage_logs (agent_id, created_at DESC);
CREATE INDEX idx_api_usage_logs_created ON api_usage_logs (created_at DESC);

-- Partition or auto-clean old logs (keep 90 days)
-- Can be done via pg_cron or Supabase scheduled function
