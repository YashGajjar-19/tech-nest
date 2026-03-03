"""
AI Insight Service
──────────────────
Generates human-readable intelligence (summary, pros, cons, best_for, avoid_if)
by sending structured device context to an LLM.

Design principles:
  - We send SCORES + KEY SPECS, not raw spec dump (token efficient)
  - Prompt is fully deterministic and versioned
  - Idempotent: checks for existing insights before calling the LLM
  - Retry logic with exponential backoff (max 3 attempts)
  - Structured output via JSON mode — no regex parsing
"""

from __future__ import annotations
import json
import logging
import time
from datetime import datetime, timezone
from typing import Optional

from openai import OpenAI, APIError, RateLimitError
from app.db.supabase import supabase
from app.core.config import settings
from app.intelligence.models import CategoryScores, AIInsightOutput, RawDeviceSpecs

logger = logging.getLogger(__name__)

_openai_client: Optional[OpenAI] = None


def _get_client() -> OpenAI:
    global _openai_client
    if _openai_client is None:
        _openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _openai_client


# ── Prompt builder ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are Tech Nest's Device Intelligence Engine.
Your job is to generate concise, accurate, and useful device insights for consumers.
You write in a clear, confident tone — like a trusted tech advisor, not a marketer.
You must output ONLY valid JSON matching the specified schema. No markdown fences."""

INSIGHT_SCHEMA = {
    "summary": "string (2-3 sentences: what is this device, who is it for, one standout strength)",
    "pros": "array of 3-5 short strings (concrete advantages)",
    "cons": "array of 2-4 short strings (real trade-offs, not trivial nitpicks)",
    "best_for": "array of 2-4 user personas or use-cases (e.g., 'Mobile gamers', 'Budget shoppers')",
    "avoid_if": "array of 1-3 conditions where this device is a poor fit",
}


def _build_prompt(device_name: str, specs: RawDeviceSpecs, scores: CategoryScores) -> str:
    """Constructs a compact, token-efficient prompt. Sends structured context, not raw specs."""
    context = {
        "device": device_name,
        "price_usd": specs.price,
        "scores_out_of_10": {
            "display": scores.display_score,
            "performance": scores.performance_score,
            "camera": scores.camera_score,
            "battery": scores.battery_score,
            "design": scores.design_score,
            "software": scores.software_score,
            "overall": scores.overall_score,
        },
        "key_specs": {
            "chipset": specs.chipset,
            "ram_gb": specs.ram_gb,
            "storage_gb": specs.storage_gb,
            "screen_size_inches": specs.screen_size,
            "refresh_rate_hz": specs.refresh_rate,
            "panel_type": specs.panel_type,
            "main_camera_mp": specs.main_camera_mp,
            "video_recording": specs.video_recording,
            "battery_mah": specs.battery_mah,
            "charging_w": specs.charging_w,
            "wireless_charging": specs.wireless_charging,
            "has_5g": specs.has_5g,
        },
    }
    return (
        f"Generate device insights for the following device context.\n\n"
        f"CONTEXT:\n{json.dumps(context, indent=2)}\n\n"
        f"OUTPUT SCHEMA:\n{json.dumps(INSIGHT_SCHEMA, indent=2)}\n\n"
        f"Return ONLY the JSON object. No explanation. No markdown."
    )


# ── LLM caller with retry ─────────────────────────────────────────────────────

def _call_llm(prompt: str, max_retries: int = 3) -> AIInsightOutput:
    client = _get_client()
    last_error: Optional[Exception] = None

    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"[AI Insights] LLM call attempt {attempt}/{max_retries}")
            response = client.chat.completions.create(
                model="gpt-4o-mini",          # cost-efficient; upgrade to gpt-4o for quality
                response_format={"type": "json_object"},
                temperature=0.3,              # low temp = consistent, factual outputs
                max_tokens=800,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
            )
            raw_json = response.choices[0].message.content
            parsed = json.loads(raw_json)

            return AIInsightOutput(
                summary=parsed.get("summary", ""),
                pros=parsed.get("pros", []),
                cons=parsed.get("cons", []),
                best_for=parsed.get("best_for", []),
                avoid_if=parsed.get("avoid_if", []),
            )

        except RateLimitError as e:
            last_error = e
            wait = 2 ** attempt  # 2s, 4s, 8s
            logger.warning(f"[AI Insights] Rate limited. Waiting {wait}s before retry.")
            time.sleep(wait)

        except (APIError, json.JSONDecodeError) as e:
            last_error = e
            logger.warning(f"[AI Insights] Attempt {attempt} failed: {e}")
            if attempt < max_retries:
                time.sleep(1)

    raise RuntimeError(f"LLM call failed after {max_retries} attempts: {last_error}")


# ── Idempotency guard ─────────────────────────────────────────────────────────

def _insights_already_exist(device_id: str) -> bool:
    """Returns True if insights were already generated for this device."""
    resp = (
        supabase.table("device_ai_insights")
        .select("device_id")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )
    return resp.data is not None


# ── Persist ────────────────────────────────────────────────────────────────────

def _persist_insights(device_id: str, insights: AIInsightOutput) -> None:
    supabase.table("device_ai_insights").upsert(
        {
            "device_id": device_id,
            "summary": insights.summary,
            "pros": insights.pros,
            "cons": insights.cons,
            "best_for": insights.best_for,
            "avoid_if": insights.avoid_if,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        },
        on_conflict="device_id",
    ).execute()


# ── Main entry point ──────────────────────────────────────────────────────────

def run_ai_insight_service(
    device_id: str,
    specs: RawDeviceSpecs,
    scores: CategoryScores,
    force: bool = False,
) -> AIInsightOutput:
    """
    Generates and persists AI insights for a device.

    Args:
        device_id: Target device UUID.
        specs: Pre-fetched hydrated spec DTO (from scoring engine).
        scores: Pre-computed category scores.
        force: If True, regenerates even if insights exist (admin re-run).

    Returns:
        AIInsightOutput
    """
    if not force and _insights_already_exist(device_id):
        logger.info(f"[AI Insights] Skipping {device_id} — insights already exist.")
        # Return existing insights from DB
        resp = (
            supabase.table("device_ai_insights")
            .select("*")
            .eq("device_id", device_id)
            .single()
            .execute()
        )
        d = resp.data
        return AIInsightOutput(
            summary=d.get("summary", ""),
            pros=d.get("pros", []),
            cons=d.get("cons", []),
            best_for=d.get("best_for", []),
            avoid_if=d.get("avoid_if", []),
        )

    prompt = _build_prompt(specs.name, specs, scores)
    insights = _call_llm(prompt)
    _persist_insights(device_id, insights)

    logger.info(f"[AI Insights] Generated and persisted insights for {device_id}")
    return insights
