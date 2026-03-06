-- Fix device_scores column types to support floating point scores
ALTER TABLE public.device_scores 
  ALTER COLUMN display_score TYPE NUMERIC(3,1),
  ALTER COLUMN performance_score TYPE NUMERIC(3,1),
  ALTER COLUMN camera_score TYPE NUMERIC(3,1),
  ALTER COLUMN battery_score TYPE NUMERIC(3,1),
  ALTER COLUMN design_score TYPE NUMERIC(3,1),
  ALTER COLUMN software_score TYPE NUMERIC(3,1),
  ALTER COLUMN overall_score TYPE NUMERIC(3,1);

-- Ensure intelligence_status exists in devices
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='devices' AND column_name='intelligence_status') THEN
        ALTER TABLE public.devices ADD COLUMN intelligence_status TEXT DEFAULT 'pending';
    END IF;
END $$;
