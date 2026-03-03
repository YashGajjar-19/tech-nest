# Tech Nest: Intelligence OS Backend

This directory houses the foundational Python/FastAPI backend and Supabase schema defined in the Intelligence & Data Operating System Blueprint.

## Architecture

- **`app/main.py`**: The FastAPI application and core routing.
- **`app/api/endpoints/`**:
  - `decision.py`: The Decision Intelligence Layer orchestrator.
  - `intelligence.py`: The User Zero-Party Behavioral tracker.
  - `knowledge_graph.py`: The pgvector semantic adjacency engine.
  - `market.py`: Abstract behavioral logging hooks.
- **`app/core/config.py`**: Environment management.
- **`app/db/supabase_schema.sql`**: The PostgreSQL schema injecting `pgvector` for semantic relationship matching.

## Getting Started

1. Create a `virtualenv`:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Database Initialization

Execute the SQL in `app/db/supabase_schema.sql` directly in your Supabase project's SQL Editor to instantiate the Knowledge Graph architecture, vectors, and market signals tables.
