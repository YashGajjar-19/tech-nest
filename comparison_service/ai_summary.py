# import os
# from openai import OpenAI

# client = None
# if os.environ.get("OPENAI_API_KEY"):
#     client = OpenAI()

def generate_comparison_summary(device_a_name: str, device_b_name: str, verdicts: dict):
    """
    Simulates AI summary generation for now.
    In the future, this takes the `verdicts` and real names, passes to OpenAI, and gets a paragraph back.
    """
    wins_a = sum(1 for v in verdicts.values() if v == 'A')
    wins_b = sum(1 for v in verdicts.values() if v == 'B')

    if wins_a > wins_b:
        winner = device_a_name
        loser = device_b_name
    elif wins_b > wins_a:
        winner = device_b_name
        loser = device_a_name
    else:
        return f"It is a remarkably close tie between {device_a_name} and {device_b_name}. Both excel in different areas."

    return f"Based on raw specifications, the {winner} edges out the {loser} with superior hardware metrics in key categories. It is the better choice for power users prioritizing performance."
