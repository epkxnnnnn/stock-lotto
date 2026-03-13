-- Stock Results table
-- Stores all lottery results for both VVIP and Platinum sources

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE stock_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  source text NOT NULL CHECK (source IN ('vvip', 'platinum')),
  market text NOT NULL,
  market_label_th text NOT NULL,
  market_label_lo text,
  flag_emoji text NOT NULL DEFAULT '',
  winning_number text CHECK (winning_number ~ '^\d{3}$' OR winning_number IS NULL),
  round_date date NOT NULL DEFAULT CURRENT_DATE,
  close_time timestamptz NOT NULL,
  result_time timestamptz,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'resulted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (source, market, round_date)
);

-- Index for common queries
CREATE INDEX idx_stock_results_source_date ON stock_results (source, round_date DESC);
CREATE INDEX idx_stock_results_status ON stock_results (status);
CREATE INDEX idx_stock_results_close_time ON stock_results (close_time);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_results_updated_at
  BEFORE UPDATE ON stock_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE stock_results;
