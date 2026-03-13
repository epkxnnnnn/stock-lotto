-- Row Level Security policies

-- Enable RLS on all tables
ALTER TABLE stock_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

-- stock_results: public read, service-role write
CREATE POLICY "stock_results_public_read"
  ON stock_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "stock_results_service_write"
  ON stock_results
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- agent_api_keys: service-role only
CREATE POLICY "agent_api_keys_service_only"
  ON agent_api_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- api_usage_logs: service-role insert/read
CREATE POLICY "api_usage_logs_service_only"
  ON api_usage_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
