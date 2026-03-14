-- Agent registration applications table
CREATE TABLE agent_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  phone text NOT NULL,
  line_id text NOT NULL,
  experience text,
  referral_source text,
  source text NOT NULL DEFAULT 'vvip',
  status text NOT NULL DEFAULT 'pending',  -- pending / approved / rejected
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_applications_status ON agent_applications (status);
CREATE INDEX idx_agent_applications_source ON agent_applications (source);
ALTER TABLE agent_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service key full access" ON agent_applications FOR ALL USING (true) WITH CHECK (true);
