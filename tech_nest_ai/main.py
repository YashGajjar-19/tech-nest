from fastapi import FastAPI
from pydantic import BaseModel
from intent_engine import parse_intent
from rag import retrieve_context
from recommender import generate_answer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Tech Nest AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    session_id: str = "default"

@app.post("/ai/chat")
async def chat(request: ChatRequest):
    query = request.query
    
    # 1. Understand Intent
    intent = parse_intent(query)
    
    # 2. Retrieve Knowledge (RAG)
    context = retrieve_context(query)
    
    # 3. Generate Answer (Recommendation/Response)
    answer = generate_answer(query, intent, context)
    
    return {
        "response": answer,
        "intent": intent,
        "context_used": bool(context)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
