import os
from openai import OpenAI

client = None
if os.environ.get("OPENAI_API_KEY"):
    client = OpenAI()

def embed(text: str):
    if not client:
        return []

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding
