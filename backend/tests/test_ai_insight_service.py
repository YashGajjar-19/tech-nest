import pytest
from unittest.mock import patch, MagicMock
from app.services.ai_insight_service import _build_prompt, _call_llm, run_ai_insight_service
from app.models.decision import CategoryScores, RawDeviceSpecs, AIInsightOutput

@pytest.fixture
def mock_specs():
    return RawDeviceSpecs(
        id="dev-1",
        name="Test Phone 15",
        brand="TestBrand",
        price=999,
        chipset="A16",
        ram_gb=8,
        storage_gb=256,
        screen_size=6.1,
        refresh_rate=120,
        panel_type="OLED",
        main_camera_mp=48,
        video_recording="4K",
        battery_mah=3500,
        charging_w=20,
        wireless_charging=True,
        has_5g=True
    )

@pytest.fixture
def mock_scores():
    return CategoryScores(
        device_id="dev-1",
        display_score=9.0,
        performance_score=9.5,
        camera_score=9.0,
        battery_score=8.0,
        design_score=9.0,
        software_score=9.5,
        overall_score=9.0
    )

def test_build_prompt(mock_specs, mock_scores):
    prompt = _build_prompt("Test Phone 15", mock_specs, mock_scores)
    
    assert "Test Phone 15" in prompt
    assert "999" in prompt
    assert "A16" in prompt
    assert "OUTPUT SCHEMA" in prompt

@patch("app.services.ai_insight_service._get_client")
def test_call_llm_success(mock_get_client):
    # Setup mock deep object tree
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.message.content = '{"summary": "A great phone.", "pros": ["Fast"], "cons": ["Expensive"], "best_for": ["Users"], "avoid_if": ["Broke"]}'
    mock_client.chat.completions.create.return_value.choices = [mock_message]
    
    mock_get_client.return_value = mock_client
    
    result = _call_llm("Fake Prompt", max_retries=1)
    
    assert isinstance(result, AIInsightOutput)
    assert result.summary == "A great phone."
    assert "Fast" in result.pros
    assert "Expensive" in result.cons

@patch("app.services.ai_insight_service.supabase")
@patch("app.services.ai_insight_service._call_llm")
def test_run_ai_insight_service_insights_exist(mock_call_llm, mock_supabase, mock_specs, mock_scores):
    # Mock supabase to return existing insights
    mock_supabase.table().select().eq().maybe_single().execute().data = {"device_id": "dev-1"}
    # Mock returning actual existing data
    mock_supabase.table().select().eq().single().execute().data = {
        "summary": "Existing Summary",
        "pros": [], "cons": [], "best_for": [], "avoid_if": []
    }
    
    result = run_ai_insight_service("dev-1", mock_specs, mock_scores, force=False)
    
    # Should not have called LLM
    mock_call_llm.assert_not_called()
    assert result.summary == "Existing Summary"

@patch("app.services.ai_insight_service.supabase")
@patch("app.services.ai_insight_service._call_llm")
def test_run_ai_insight_service_force_regenerate(mock_call_llm, mock_supabase, mock_specs, mock_scores):
    mock_call_llm.return_value = AIInsightOutput(
        summary="Newly Generated",
        pros=[], cons=[], best_for=[], avoid_if=[]
    )
    
    result = run_ai_insight_service("dev-1", mock_specs, mock_scores, force=True)
    
    # Should have called LLM and persisted
    mock_call_llm.assert_called_once()
    mock_supabase.table().upsert.assert_called()
    assert result.summary == "Newly Generated"
