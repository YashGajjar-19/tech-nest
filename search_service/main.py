from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from search import search_devices

app = FastAPI(title="Tech Nest Discovery Engine")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(q: str):
    """
    Unified Discovery Endpoint.
    Returns intelligent intent-based results combining devices, articles, etc.
    """
    results = await search_devices(q)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
