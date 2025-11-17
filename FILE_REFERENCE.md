# Project File Reference

Complete inventory of all files in the Freight Rate Optimizer Platform.

## 📄 Root Level Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main project overview, features, tech stack |
| `GETTING_STARTED.md` | Quick start guide (READ THIS FIRST) |
| `API_SPEC.md` | Complete API specification & examples |
| `DEVELOPMENT.md` | Development guide & architecture |
| `DEPLOYMENT.md` | Production deployment guide |
| `docker-compose.yml` | Docker orchestration config |
| `quickstart.bat` | Windows quick start script |
| `quickstart.sh` | macOS/Linux quick start script |

## 🎨 Frontend (Next.js)

### Configuration
```
frontend/
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── .gitignore             # Git ignore rules
├── Dockerfile             # Docker image config
└── README.md              # Frontend README
```

### Application Code
```
frontend/app/
├── layout.tsx             # Root layout
├── page.tsx               # Main page component
├── globals.css            # Global styles
│
├── components/
│   ├── ShipmentForm.tsx   # Shipment input form
│   └── Results.tsx        # Results display component
│
└── lib/
    ├── types.ts           # TypeScript interfaces
    └── api.ts             # API client
```

**Key Components:**
- `ShipmentForm`: Multi-step form for shipment details
- `Results`: Displays quotes with AI recommendations
- API client handles communication with backend

## 🔧 Backend (FastAPI)

### Configuration
```
backend/
├── main.py                # FastAPI entry point
├── requirements.txt       # Python dependencies
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── Dockerfile             # Docker image config
├── README.md              # Backend README
├── examples.py            # Example API calls
└── test_payload.json      # Test data
```

### Application Structure
```
backend/app/
├── __init__.py
├── database.py            # Database initialization
├── config.py              # Settings management
│
├── models/
│   ├── __init__.py
│   ├── schemas.py         # Pydantic request/response models
│   └── database.py        # SQLAlchemy ORM models
│
├── routes/
│   ├── __init__.py
│   ├── agent.py           # /api/agent/* endpoints
│   └── quotes.py          # /api/multimodal/quote endpoint
│
├── services/
│   ├── __init__.py
│   ├── agent.py           # Core agentic AI logic
│   └── freight_providers.py # Freight API integrations
│
└── utils/
    ├── __init__.py
    ├── helpers.py         # Utility functions
    └── config.py          # Configuration settings
```

**Core Services:**
- `agent.py`: 6-step autonomous freight optimization workflow
- `freight_providers.py`: API integrations (mock data + extensible)

## 📊 Database

### Models
```
Quotes Table
├── id (primary key)
├── request_id (unique)
├── origin
├── destination
├── shipment_types (JSON)
├── weight
├── volume
├── commodity
├── price
├── transit_days
├── mode
├── route (JSON)
├── carbon_footprint
└── created_at

Bookings Table
├── id (primary key)
├── booking_id (unique)
├── quote_id
├── user_email
├── status
├── selected_option (JSON)
└── created_at
```

## 🔌 API Endpoints

### Agent Endpoints
- `POST /api/agent/validate` - Validate shipment details
- `POST /api/agent/recommend` - Get AI recommendations

### Quote Endpoints
- `POST /api/multimodal/quote` - Get multimodal freight quotes (main endpoint)

### Health
- `GET /health` - Health check

## 📦 Dependencies

### Frontend (package.json)
- `react`: UI library
- `next`: React framework
- `typescript`: Type safety
- `tailwindcss`: CSS framework
- `axios`: HTTP client
- `lucide-react`: Icons
- `react-select`: Select component
- `date-fns`: Date utilities

### Backend (requirements.txt)
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `pydantic`: Data validation
- `sqlalchemy`: ORM
- `psycopg2-binary`: PostgreSQL driver
- `httpx`: HTTP client
- `openai`: OpenAI API (planned)
- `python-dotenv`: Environment loading

## 🚀 Docker Files

### docker-compose.yml Structure
```
Services:
├── frontend (Next.js on :3000)
├── backend (FastAPI on :8000)
└── db (PostgreSQL on :5432)

Volumes:
└── postgres_data (database persistence)
```

### Dockerfiles
```
frontend/Dockerfile
├── Node.js base image
├── Install dependencies
├── Copy source
└── Run dev server

backend/Dockerfile
├── Python base image
├── Install dependencies
├── Copy source
└── Run uvicorn
```

## 🧠 Agentic AI Workflow

### Core Logic (app/services/agent.py)

The `FreightRateAgent` class handles:

1. **validate_shipment()** - Input validation & normalization
2. **determine_transport_legs()** - Route breakdown
3. **fetch_quotes_autonomously()** - Provider queries
4. **optimize_routes()** - Ranking & optimization
5. **_generate_ai_summary()** - Natural language recommendations

### Key Features
- ✅ Mock data for MVP testing
- ✅ Extensible provider architecture
- ✅ Multi-leg route composition
- ✅ Automatic fallback handling
- ✅ Carbon footprint calculations

## 📝 Configuration Files

### Environment Variables (.env)
```
API Keys:
- OPENAI_API_KEY
- FREIGHTOS_API_KEY
- SHIPENGINE_API_KEY
- EASYPOST_API_KEY

Database:
- DATABASE_URL

Settings:
- DEBUG
- FRONTEND_URL
```

### Example Configuration
See `backend/.env.example` for template

## 📖 Documentation Files

### README.md
Main project overview with:
- Features list
- Tech stack
- Quick start
- API endpoints
- Usage examples

### GETTING_STARTED.md
Beginner-friendly guide with:
- 5-minute quick start
- Web UI testing
- Project structure
- Common tasks
- Troubleshooting

### API_SPEC.md
Complete API reference with:
- All endpoints
- Request/response schemas
- Error handling
- Code examples
- Rate limiting

### DEVELOPMENT.md
Developer guide with:
- Architecture overview
- Development workflow
- Component structure
- Testing guide
- Performance tips

### DEPLOYMENT.md
Production deployment with:
- Deployment options
- Configuration guide
- Security best practices
- Monitoring setup
- Troubleshooting

## 🔄 Data Flow

```
User Input
    ↓
Frontend Form (ShipmentForm.tsx)
    ↓
API Call (axios to /api/multimodal/quote)
    ↓
Backend Validation (agent.validate_shipment())
    ↓
Route Determination (agent.determine_transport_legs())
    ↓
Provider Queries (agent.fetch_quotes_autonomously())
    ↓
Route Optimization (agent.optimize_routes())
    ↓
AI Summary (agent._generate_ai_summary())
    ↓
JSON Response (QuoteResponse)
    ↓
Frontend Display (Results.tsx)
    ↓
User Sees Recommendations
```

## 🎯 File Purposes Summary

| Category | Purpose | Key Files |
|----------|---------|-----------|
| **Documentation** | Guide users & developers | README.md, GETTING_STARTED.md |
| **Configuration** | Environment & build setup | docker-compose.yml, .env |
| **Frontend** | React UI & forms | ShipmentForm.tsx, Results.tsx |
| **Backend** | API & business logic | main.py, agent.py, routes/ |
| **Services** | Core features | agent.py, freight_providers.py |
| **Database** | Data persistence | models/database.py, database.py |
| **Docker** | Containerization | Dockerfile, docker-compose.yml |

## 📊 Project Statistics

- **Total Files**: 44+
- **Frontend Files**: 15+
- **Backend Files**: 20+
- **Configuration Files**: 9+
- **Total Lines of Code**: 3000+
- **Documentation Pages**: 6

## 🔗 File Dependencies

```
main.py
├─ app/routes/agent.py
│  └─ app/services/agent.py
├─ app/routes/quotes.py
│  └─ app/services/agent.py
└─ app/database.py
   └─ app/models/database.py

frontend/app/page.tsx
├─ components/ShipmentForm.tsx
├─ components/Results.tsx
└─ lib/api.ts
   └─ lib/types.ts
```

---

Last updated: 2024-11-17
