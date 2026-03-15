-- Add result verification columns for trust & integrity

-- SHA-256 hash of result data for immutability proof
ALTER TABLE stock_results ADD COLUMN IF NOT EXISTS result_hash text;

-- Stock index reference price at close time (weekday results)
ALTER TABLE stock_results ADD COLUMN IF NOT EXISTS reference_price text;

-- Allow 'stock_ref' as a new generation_method value
ALTER TABLE stock_results DROP CONSTRAINT IF EXISTS stock_results_generation_method_check;
ALTER TABLE stock_results ADD CONSTRAINT stock_results_generation_method_check
  CHECK (generation_method IN ('auto', 'manual', 'stock_ref') OR generation_method IS NULL);

-- Index for hash lookups (verification page)
CREATE INDEX IF NOT EXISTS idx_stock_results_hash
  ON stock_results (result_hash) WHERE result_hash IS NOT NULL;
