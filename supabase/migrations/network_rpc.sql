-- ============================================================
-- Supabase RPC: get_devices_needing_aggregation
-- ============================================================
-- Returns device_ids that have new interaction_events since the last
-- time they were aggregated in device_network_stats.
--
-- Called by: network_learning.py → run_incremental_aggregation()
-- Performance: Uses the existing idx_ie_device_time partial index.
-- ============================================================

CREATE OR REPLACE FUNCTION get_devices_needing_aggregation()
RETURNS TABLE (device_id UUID)
LANGUAGE sql
STABLE
AS $$
    -- Devices with events but NO entry in device_network_stats yet
    SELECT DISTINCT ie.device_id
    FROM interaction_events ie
    WHERE ie.device_id IS NOT NULL
      AND ie.device_id NOT IN (
          SELECT dns.device_id FROM device_network_stats dns
      )

    UNION

    -- Devices where new events exist AFTER their last aggregation watermark
    SELECT DISTINCT ie.device_id
    FROM interaction_events ie
    JOIN device_network_stats dns ON dns.device_id = ie.device_id
    WHERE ie.created_at > dns.last_aggregated_at
      AND ie.device_id IS NOT NULL;
$$;
