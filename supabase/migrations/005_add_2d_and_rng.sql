-- Add 2-digit winning number, generation method, and seed for RNG audit trail

-- 2-digit lower number (2 ตัวล่าง)
ALTER TABLE stock_results
  ADD COLUMN winning_number_2d text
  CHECK (winning_number_2d ~ '^\d{2}$' OR winning_number_2d IS NULL);

-- Track how the result was generated
ALTER TABLE stock_results
  ADD COLUMN generation_method text
  CHECK (generation_method IN ('auto', 'manual') OR generation_method IS NULL);

-- Hex-encoded random bytes for auditability
ALTER TABLE stock_results
  ADD COLUMN generation_seed text;

-- Partial index for the Edge Function cron query:
-- find closed markets that haven't been resulted yet
CREATE INDEX idx_stock_results_pending_rng
  ON stock_results (status, close_time)
  WHERE status = 'closed' AND winning_number IS NULL;
