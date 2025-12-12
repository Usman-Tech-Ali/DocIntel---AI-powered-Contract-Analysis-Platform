# DocIntel - AI Contract Analysis Platform

An AI-powered contract analysis platform that helps freelancers and businesses understand, analyze, and negotiate contracts with confidence.

## 🚀 Features

### 1. Universal Document Ingestion
- Reads PDFs, Word files, scanned images, screenshots, camera photos
- Handles messy layouts (columns, tables, signatures, headers, footers)
- OCR for non-digital documents (scanned or blurred images)
- Automatic language detection (English, Urdu, Hindi, Arabic, Spanish, French, German, Chinese)

### 2. Plain-English Contract Summary
- Converts long legal documents into 3–5 simple bullet points
- Explains obligations, payments, rights, risks
- Removes legal jargon and gives a normal-human description

### 3. Traffic-Light Risk Score (0–100)
- Assigns a simple Green / Yellow / Red score
- Shows overall danger level
- Highlights high-risk clauses with explanations

### 4. Full Clause Extraction (30+ Key Fields)
Automatically identifies and extracts:
- Payment terms, milestones, due dates
- Termination notice period, liability limitations
- IP ownership, confidentiality requirements
- Revision count, governing law, non-compete
- Dispute resolution, deliverables, scope
- And 20+ more fields

### 5. Missing Clause Detector
Finds things that SHOULD be in a contract but are missing:
- Kill fee, late payment penalty
- IP protection, confidentiality obligations
- Termination notice, liability cap
- Scope of work boundaries

### 6. Red Flag Detection (Dangerous Clauses)
Detects dangerous clauses like:
- Unlimited revisions
- Work ownership transferred before payment
- No kill fee, one-sided termination
- No dispute resolution, no payment schedule
- Full refund clause even after work delivered

### 7. One-Click Clause Fixer (Auto-Negotiator)
- Fixes bad clauses with professionally written legal text
- Suggests safer alternatives
- Generates polite negotiation wording
- Creates copy-paste replacement clauses

### 8. Legal Q&A Chat – Ask Anything
- Chat with the document in plain language
- Multi-language support (Urdu, Hindi, Arabic, English)
- AI responds by citing the exact clause
- Suggested follow-up questions

### 9. Annotated Contract Report (Downloadable PDF)
- Color-coded highlights (green = good, yellow = warning, red = danger)
- Notes explaining each issue
- Summary page, risk score
- Suggested improvements, extracted clauses table

### 10. Jurisdiction & Law Checker
- Detects governing law (e.g., California, Pakistan, India, UAE)
- Checks if cited laws are updated
- Warns about outdated or non-compliant clauses

### 11. Document Type Auto-Classification
Recognizes contract types:
- NDA, Employment, Service agreement
- Vendor contract, Lease, SaaS agreement
- Partnership agreement, Loan agreement, Freelance contract

### 12. Multi-Agent AI Orchestration
The system uses 5 specialized AI agents:
- **Supervisor Agent** – routes tasks
- **Ingestion Agent** – cleans + structures the document
- **Clause Extractor Agent** – finds all key data
- **Risk Engine Agent** – compares with "safe contract" patterns
- **Explainer/Chat Agent** – answers user questions + generates report

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS, Radix UI
- **Backend**: Express.js, TypeScript, MongoDB
- **AI Worker**: Python, FastAPI, Gemini API
- **OCR**: PyMuPDF, Tesseract OCR
- **Infrastructure**: Docker, Docker Compose

## 📦 Project Structure

```
docintel/
├── apps/
│   ├── frontend/          # Next.js frontend
│   ├── backend/           # Express.js API
│   └── worker/            # Python AI worker
├── packages/
│   ├── types/             # Shared TypeScript types
│   ├── config/            # Shared configuration
│   ├── utils/             # Shared utilities
│   └── ui/                # Shared UI components
└── infrastructure/        # Docker configs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- pnpm 8+
- Tesseract OCR (for document scanning)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/docintel.git
cd docintel
```

2. Install Node.js dependencies:
```bash
pnpm install
```

3. Install Python dependencies:
```bash
cd apps/worker
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Copy example env files
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env
cp apps/worker/.env.example apps/worker/.env
```

5. Start the development servers:

Terminal 1 - Frontend & Backend:
```bash
pnpm dev
```

Terminal 2 - AI Worker:
```bash
pnpm dev:worker
```

### Using Docker

```bash
# Build and start all services
pnpm docker:up

# Stop all services
pnpm docker:down
```

## 🔑 API Configuration

The platform uses Google's Gemini API for AI analysis. Set your API key in the worker's `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

## 📝 API Endpoints

### Document Management
- `POST /api/documents/upload` - Upload a document
- `POST /api/documents/:id/analyze` - Analyze a document
- `GET /api/documents/:id/analysis` - Get analysis results
- `GET /api/documents/:id/report` - Download PDF report
- `DELETE /api/documents/:id` - Delete a document

### AI Features
- `POST /api/documents/:id/chat` - Chat with document
- `POST /api/fix-clause` - Fix a problematic clause

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

Made with ❤️ by Dawood
