"""
Decision Engine API
─────────────────────
Orchestrates the deterministic scoring verdict for a set of devices
under a given user context.

Network Integration (Intelligence Network):
  - POST /orchestrate now fetches network enrichment signals for all devices
    BEFORE computing verdicts, so the Decision AI can see:
      * Which devices have high user selection rates (network_multiplier > 1.0)
      * Which devices are being actively dismissed (multiplier < 1.0 / dismiss trend)
    This is used to adjust confidence_score, not the verdict itself.
    The VERDICT (BUY/WAIT/SKIP) remains purely spec-based and deterministic.
    The CONFIDENCE reflects how much behavioral evidence supports that verdict.

  - Every session logs a start_decision event per device (interaction_events)
    so the trend engine can observe Decision AI usage patterns.
"""

from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Optional

from app.services.decision_memory import DecisionMemoryService
from app.services.event_logger import log_event
from app.services.intelligence_graph import enhance_decision_context

router = APIRouter()


class DeviceVerdict(BaseModel):
    device_id:           str
    verdict:             str    # BUY, WAIT, SKIP
    confidence_score:    float
    network_boost:       float  # ±confidence modifier from network signals
    definitive_reason:   str
    pillars:             Dict[str, dict]


class DecisionRequest(BaseModel):
    session_id:    str
    device_ids:    List[str]
    user_id:       Optional[str] = None       # From auth token in production
    intent_vector: Optional[List[float]] = None  # From /intelligence/context


@router.post("/orchestrate", response_model=List[DeviceVerdict])
async def generate_decision(payload: DecisionRequest, background_tasks: BackgroundTasks):
    """
    The Intelligence Heavy Lifter.

    1. Fetches network enrichment for all candidate devices (non-blocking: read from
       device_network_stats — already aggregated, sub-millisecond query).
    2. Adjust confidence_score based on network_multiplier signal:
         - multiplier > 1.2 → strong behavioral confirmation → confidence +0.05
         - multiplier < 0.8 → behavioral concern    → confidence -0.07
    3. Run deterministic spec-based scoring for BUY/WAIT/SKIP verdict.
    4. Log start_decision events for all considered devices (background).
    5. Log decision memory for the top-verdict device (background).
    """

    # ── Step 1: Network enrichment ────────────────────────────────────────────
    network_enrichments = {}
    if payload.device_ids:
        try:
            network_enrichments = enhance_decision_context(payload.device_ids)
        except Exception:
            pass  # Network enrichment is non-critical — gracefully degrade

    # ── Step 2 + 3: Score + Verdict ───────────────────────────────────────────
    # In production: run real scoring engine against adjusted intent_vector.
    # Here we compute the confidence modifier from network signals.

    verdicts = []
    for device_id in payload.device_ids:
        enrichment      = network_enrichments.get(device_id, {})
        net_multiplier  = enrichment.get("network_multiplier", 1.0)

        # Map multiplier [0.5, 1.5] → confidence modifier [-0.07, +0.05]
        if net_multiplier >= 1.2:
            network_boost = +0.05
        elif net_multiplier <= 0.8:
            network_boost = -0.07
        else:
            network_boost = 0.0

        # Deterministic base confidence from spec scoring (real engine replaces this stub)
        base_confidence = 0.92
        final_confidence = round(min(0.99, max(0.50, base_confidence + network_boost)), 2)

        verdicts.append(DeviceVerdict(
            device_id=device_id,
            verdict="BUY",
            confidence_score=final_confidence,
            network_boost=network_boost,
            definitive_reason=(
                "Unmatched sustained performance and highest community sentiment "
                "among creative professionals."
            ),
            pillars={
                "hardware":   {"score": 9.5, "explanation": "A18 Pro offers unparalleled rendering speeds."},
                "experience": {"score": 8.0, "explanation": "iOS 18 provides stable but rigid workflows."},
                "value":      {"score": 6.5, "explanation": "Premium tax applies, but holds value on resale."},
            }
        ))

    # ── Step 4: Log start_decision events for all devices (background) ─────────
    for device_id in payload.device_ids:
        background_tasks.add_task(
            log_event,
            event_type="start_decision",
            device_id=device_id,
            user_id=payload.user_id,
            metadata={"session_id": payload.session_id},
        )

    # ── Step 5: Log decision memory for top verdict (background) ───────────────
    if verdicts:
        top = verdicts[0]
        memory_service = DecisionMemoryService()
        background_tasks.add_task(
            memory_service.log_decision,
            user_id=payload.user_id or "anonymous",
            session_id=payload.session_id,
            chosen_device_id=top.device_id,
            decision_type="upgrade_phone",
        )

    return verdicts


# Note: The SSE AI synthesis endpoint would live here as well.
# e.g., @router.post("/synthesize") streaming the semantic explanation of the Verdict.
