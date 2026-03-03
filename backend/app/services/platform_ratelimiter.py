"""
In-Process Token Bucket Rate Limiter
──────────────────────────────────────
Implements a sliding window token bucket rate limiter that runs in-process
with zero external infrastructure (no Redis required).

Architecture:
  - Uses a module-level dict as a singleton store of (tokens, last_refill_time).
  - Each API client gets a bucket keyed by their client_id.
  - Tokens refill continuously (fractional refill per second = rate_limit / 60).
  - On each request: deduct 1 token; if tokens < 0, reject with 429.

Concurrency safety:
  - FastAPI runs on async event loop (single thread for I/O-bound handlers).
  - The bucket dict is accessed synchronously — no race condition in a single
    Uvicorn worker. For multi-worker (Gunicorn) deployments, migrate to
    Redis with the INCR + TTL pattern. The migration is isolated to this file.

Cleanup:
  - Buckets older than BUCKET_TTL_SECONDS are evicted during each check()
    to prevent unbounded memory growth (one dict entry per unique client_id).

Limits:
  - rate_limit is per-minute (matches the database `rate_limit` column).
"""

from __future__ import annotations

import time
import logging
from dataclasses import dataclass
from typing import Tuple

logger = logging.getLogger(__name__)

_BUCKET_TTL_SECONDS: int = 3600   # Evict inactive buckets after 1 hour


@dataclass
class _TokenBucket:
    capacity: float          # max tokens = rate_limit (per minute)
    tokens: float            # current token count
    refill_rate: float       # tokens per second = capacity / 60
    last_access: float       # unix timestamp of last request


# Module-level singleton — lives for the lifetime of the process
_buckets: dict[str, _TokenBucket] = {}


def _evict_stale_buckets(now: float) -> None:
    """Remove buckets that haven't been active in the TTL window."""
    stale = [k for k, v in _buckets.items() if now - v.last_access > _BUCKET_TTL_SECONDS]
    for k in stale:
        del _buckets[k]


def check_rate_limit(client_id: str, rate_limit_per_minute: int) -> Tuple[bool, dict]:
    """
    Check and consume one token for the given client.

    Returns:
        (allowed: bool, headers: dict)
        headers contains X-RateLimit-* values for the response.
    """
    now = time.monotonic()

    # Lazy eviction — only when called
    if len(_buckets) > 10_000:
        _evict_stale_buckets(now)

    if client_id not in _buckets:
        capacity = float(rate_limit_per_minute)
        _buckets[client_id] = _TokenBucket(
            capacity=capacity,
            tokens=capacity,           # Start full
            refill_rate=capacity / 60.0,
            last_access=now,
        )

    bucket = _buckets[client_id]

    # Refill tokens based on elapsed time since last access
    elapsed = now - bucket.last_access
    bucket.tokens = min(bucket.capacity, bucket.tokens + elapsed * bucket.refill_rate)
    bucket.last_access = now

    remaining = int(bucket.tokens)

    if bucket.tokens < 1.0:
        # Rate limit exceeded
        retry_after = int((1.0 - bucket.tokens) / bucket.refill_rate) + 1
        headers = {
            "X-RateLimit-Limit":     str(rate_limit_per_minute),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset":     str(int(now + retry_after)),
            "Retry-After":           str(retry_after),
        }
        logger.warning(f"[RateLimit] Client {client_id} exceeded limit ({rate_limit_per_minute}/min)")
        return False, headers

    # Consume one token
    bucket.tokens -= 1.0

    headers = {
        "X-RateLimit-Limit":     str(rate_limit_per_minute),
        "X-RateLimit-Remaining": str(max(0, remaining - 1)),
        "X-RateLimit-Reset":     str(int(now + 60)),
    }
    return True, headers
