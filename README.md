# Tech Nest

Tech Nest is an intelligent technology decision platform that helps users choose the right device in a single visit.

Instead of browsing multiple websites for specs, reviews, and comparisons, Tech Nest transforms structured device data into clear insights, comparisons, and recommendations.

The goal is to simplify technology decisions through intelligent data, structured comparisons, and AI-assisted insights.

---

# Vision

Technology decisions should be simple and confident.

Tech Nest aims to become a trusted platform where users can explore devices, compare them, understand strengths and weaknesses, and receive recommendations based on their needs.

---

# Core Features

### Device Intelligence
A structured device database containing specifications, variants, pricing, and device relationships.

### Smart Comparisons
Side-by-side device comparisons powered by structured specification data.

### Intelligence Scores
Automated scoring system evaluating devices across key categories:
- Display
- Performance
- Camera
- Battery
- Design
- Software

### AI Insights
Readable summaries explaining device strengths, weaknesses, and best use cases.

### Decision Assistant
Recommendation system suggesting devices based on user preferences such as budget, priorities, and usage.

### Trending Intelligence
Network signals detect trending devices based on views, comparisons, and user behavior.

---

# Technology Stack

## Frontend
- Next.js 15
- TypeScript
- TailwindCSS

## Backend
- FastAPI (Python)

## Database
- PostgreSQL
- Supabase

## Architecture
- Modular service architecture
- Structured device knowledge graph
- AI-assisted insights
- Scalable database design

---

# Project Structure

```

technest/
│
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
├── features/           # Feature-based modules
├── hooks/              # Custom React hooks
├── lib/                # External integrations
├── services/           # API communication layer
├── utils/              # Helper utilities
├── types/              # TypeScript type definitions
│
backend/
│
├── routers/            # FastAPI API endpoints
├── services/           # Business logic services
├── models/             # Database models
├── schemas/            # API request/response schemas
├── workers/            # Background jobs
│
supabase/
│
├── migrations/         # Database migrations
├── seeds/              # Seed data
│
database/
│
└── db.sql              # Complete database schema

```

---

# Core Data Model

The Tech Nest system is structured as a knowledge graph:

```

Brand → Device → Variant → Specifications → Intelligence → Relationships

````

This structure enables:

- flexible specification storage
- automatic comparisons
- scalable device categories
- AI-based insights
- recommendation systems

---

# Specification System

Specifications are stored using a flexible schema:

- spec_categories
- spec_definitions
- device_spec_values

This allows new specification types without changing the database schema.

---

# Intelligence Engine

The intelligence engine processes device specifications and calculates scores for key categories.

Example categories:

- Display quality
- Performance
- Camera capability
- Battery endurance
- Design
- Software experience

These scores power comparisons and recommendation logic.

---

# Device Relationships

Devices are connected through relationships such as:

- competitor
- previous generation
- upgrade option
- alternative

This graph enables intelligent comparisons and upgrade suggestions.

---

# Key Pages

### Homepage
Search-driven discovery and trending devices.

### Device Page
Detailed device view including scores, specifications, variants, AI insights, and related devices.

### Comparison Page
Side-by-side device comparison with structured specs and category scores.

### Category Pages
Filtered device exploration by device type.

### Decision Assistant
Guided recommendation system based on user needs.

---

# Local Development

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL
- Supabase (optional)

---

# Install Frontend

```bash
npm install
````

Run development server:

```bash
npm run dev
```

---

# Run Backend

```bash
cd backend
pip install -r requirements.txt
```

Start API server:

```bash
uvicorn app.main:app --reload
```

---

# Database Setup

Create database and run schema:

```bash
psql -f database/db.sql
```

Or use Supabase migrations.

---

# Environment Variables

Example `.env` configuration:

```
DATABASE_URL=postgresql://user:password@localhost:5432/technest
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

---

# Design Philosophy

Tech Nest follows a calm and structured interface inspired by modern product design.

Design principles:

* minimal visual noise
* clear information hierarchy
* structured comparison layout
* large whitespace
* decision-focused UI

---

# Future Roadmap

Planned improvements include:

* automated device discovery
* price monitoring
* user personalization
* improved recommendation engine
* developer API platform
* analytics-driven insights

---

# Contributing

Contributions are welcome.

Guidelines:

1. Follow the project structure.
2. Keep components reusable and modular.
3. Maintain consistent naming conventions.
4. Write clear and maintainable code.

---

# License

This project is currently under active development and not publicly licensed.

---

# Tech Nest

Helping people make better technology decisions.

```

---

If you'd like, I can also generate a **much more advanced README (v2)** that includes:

- **system architecture diagrams**
- **database ER diagram**
- **API documentation**
- **decision engine flow diagram**

This type of README is what **serious engineering teams use internally** and makes the project much easier to understand.
```