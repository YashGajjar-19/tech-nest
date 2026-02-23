def parse_intent(query: str) -> str:
    """
    Analyzes the user's query to determine the intent.
    Returns structured intent representation.
    To be replaced with LLM parsing.
    """
    query_lower = query.lower()
    
    if "best" in query_lower:
        return "recommendation"
    if "vs" in query_lower or "compare" in query_lower or "better" in query_lower:
        return "comparison"
    
    return "search"
