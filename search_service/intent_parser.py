def parse_query(q: str):
    q = q.lower().strip()

    if "vs" in q:
        return {"type": "comparison", "query": q}

    if "best" in q:
        return {"type": "recommendation", "query": q}

    return {"type": "keyword", "query": q}
