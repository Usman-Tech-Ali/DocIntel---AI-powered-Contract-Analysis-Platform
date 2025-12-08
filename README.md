# DocIntel

AI-powered Contract Analysis Platform

## Project Structure

```
DocIntel/
├── apps/
│   ├── frontend/     # Next.js 15 + Tailwind + ShadCN
│   ├── backend/      # Node.js + Express + LangChain
│   └── worker/       # Python FastAPI AI microservice
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # Shared TypeScript interfaces
│   ├── utils/        # Shared utilities
│   └── config/       # Shared configuration
├── infrastructure/   # Docker configuration
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js >= 18.0.0
- PNPM >= 8.0.0
- Python >= 3.11

## Getting Started

### 1. Install Node.js Dependencies

```bash
cd DocIntel
pnpm install
```

### 2. Install Python Dependencies (Worker)

```bash
cd apps/worker
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Setup

Create `.env` files in the appropriate directories with required environment variables.

### 4. Development

```bash
# Run all services
pnpm dev

# Run individual services
pnpm --filter frontend dev
pnpm --filter backend dev

# Run Python worker
cd apps/worker && uvicorn src.main:app --reload
```

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TailwindCSS + ShadCN UI
- Zustand / React Query
- TypeScript

### Backend
- Express.js
- LangChain
- MongoDB + Mongoose
- JWT Authentication
- TypeScript

### Worker (AI Service)
- FastAPI
- PyMuPDF / Tesseract OCR
- Sentence Transformers
- OpenAI API
- Pydantic

## License

Private - All rights reserved

