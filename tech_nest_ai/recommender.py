def generate_answer(query: str, intent: str, context: str) -> str:
    """
    Uses LLM to generate the final answer, leveraging the retrieved context.
    """
    # Example integration:
    # response = client.chat.completions.create(
    #     model="gpt-4o-mini",
    #     messages=[
    #         {"role": "system", "content": "You are Tech Nest AI."},
    #         {"role": "user", "content": query},
    #         {"role": "assistant", "content": context}
    #     ]
    # )
    
    if intent == "recommendation":
        return f"AI Recommendation for '{query}' based on DB context."
    elif intent == "comparison":
        return f"AI Comparison for '{query}' based on DB context."
    else:
        return f"AI Answer for '{query}' based on DB context."

def rank_devices(devices, camera_weight=0.3, battery_weight=0.2, performance_weight=0.3, value_weight=0.2):
    """
    Scores and ranks devices based on given weights.
    """
    ranked = []
    for device in devices:
        score = (
            device.get('camera', 0) * camera_weight +
            device.get('battery', 0) * battery_weight +
            device.get('performance', 0) * performance_weight +
            device.get('value', 0) * value_weight
        )
        ranked.append((score, device))
    return sorted(ranked, key=lambda x: x[0], reverse=True)
