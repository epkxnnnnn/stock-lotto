-- API access requests from existing system operators
CREATE TABLE api_access_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  line_id text NOT NULL,
  system_name text NOT NULL,
  system_url text,
  use_case text NOT NULL,
  expected_volume text,
  requested_sources text[] NOT NULL DEFAULT '{vvip}',
  webhook_url text,
  source text NOT NULL DEFAULT 'vvip',
  status text NOT NULL DEFAULT 'pending',  -- pending / approved / rejected
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_api_access_requests_status ON api_access_requests (status);
ALTER TABLE api_access_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service key full access" ON api_access_requests FOR ALL USING (true) WITH CHECK (true);
