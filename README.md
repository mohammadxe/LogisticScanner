# Freight Rate Optimizer Platform

A comprehensive AI-powered multi-modal freight rate comparison platform that aggregates ocean, air, and land transport quotes.

**"Skyscanner + Uber Freight + Freightos, all in one — powered by an autonomous AI agent."**

## 🚀 Features

### 1. **Multimodal Shipment Input**
- Ocean freight (FCL, LCL)
- Air cargo
- Land transport (FTL/LTL trucking)
- Hazmat & temperature control options
- Customs, insurance, and last-mile services

### 2. **Intelligent Rate Aggregation**
- Query multiple freight providers
- Real-time quote comparison
- Automatic fallback to mock data (for MVP)
- Support for Freightos, ShipEngine, EasyPost APIs

### 3. **Agentic AI Workflow**
The autonomous agent performs 6 steps:

1. **Validate & Normalize** - Validates dimensions, compliance, hazmat
2. **Determine Routes** - Breaks multimodal journey into transport legs
3. **Fetch Quotes** - Queries APIs for each leg type
4. **Combine Routes** - Assembles multimodal options (Truck→Ship→Truck, etc.)
5. **Optimize** - Ranks by price, speed, reliability, carbon footprint
6. **Recommend** - Generates AI summaries with intelligent suggestions

### 4. **Smart Recommendations**
- **Cheapest Route** - Lowest total cost
- **Fastest Route** - Shortest transit time
- **Best Value** - Optimal price-to-speed ratio
- **AI Summary** - Natural language analysis with priorities

### 5. **Results Dashboard**
- Side-by-side route comparison
- Detailed leg-by-leg breakdown
- Carbon footprint calculations
- Reliability scores
- One-click booking integration

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | FastAPI, Python 3.11 |
| **AI/Agents** | OpenAI GPT-4 with Function Calling |
| **Database** | PostgreSQL (production) / SQLite (dev) |
| **APIs** | Freightos, ShipEngine, EasyPost, Xeneta |
| **Deployment** | Docker Compose |

## 📋 Project Structure

```
logistic/
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── ShipmentForm.tsx
│   │   │   └── Results.tsx
│   │   ├── lib/
│   │   │   ├── types.ts      # Type definitions
│   │   │   └── api.ts        # API client
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── package.json
│   └── Dockerfile
│
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── models/
│   │   │   ├── schemas.py    # Pydantic models
│   │   │   └── database.py   # ORM models
│   │   ├── routes/
│   │   │   ├── agent.py      # /agent/* endpoints
│   │   │   └── quotes.py     # /multimodal/quote endpoint
│   │   ├── services/
│   │   │   ├── agent.py      # Agentic AI logic (6-step workflow)
│   │   │   └── freight_providers.py  # API integrations
│   │   ├── utils/
│   │   │   ├── helpers.py    # Helper functions
│   │   │   └── config.py     # Settings
│   │   └── database.py       # DB initialization
│   ├── main.py               # FastAPI entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
└── docker-compose.yml        # Full stack orchestration

```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
cd logistic
docker-compose up -d
```

Services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: PostgreSQL on :5432

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/agent/validate` | Validate shipment details |
| POST | `/api/multimodal/quote` | Get multimodal freight quotes (full workflow) |
| POST | `/api/agent/recommend` | Get AI recommendations |

### Example Request

```bash
curl -X POST http://localhost:8000/api/multimodal/quote \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentTypes": ["Ocean (FCL)", "Air Cargo"],
    "weight": 1000,
    "weightUnit": "kg",
    "volume": 10,
    "commodity": "Electronics",
    "hazardous": false,
    "temperatureControlled": false,
    "origin": "Shanghai, China",
    "destination": "Rotterdam, Netherlands",
    "incoterms": "CIF"
  }'
```

### Example Response

```json
{
  "cheapest": {
    "mode": "Ocean (FCL)",
    "price": 1450.00,
    "transitDays": 32,
    "route": [
      {
        "mode": "Truck",
        "origin": "Shanghai, China",
        "destination": "Shanghai, China Port",
        "duration": "2 days"
      },
      {
        "mode": "Ocean",
        "origin": "Shanghai, China Port",
        "destination": "Rotterdam, Netherlands Port",
        "duration": "28 days",
        "carrier": "Maersk"
      },
      {
        "mode": "Truck",
        "origin": "Rotterdam, Netherlands Port",
        "destination": "Rotterdam, Netherlands",
        "duration": "2 days"
      }
    ],
    "carbonFootprint": 250.0,
    "reliability": 0.92
  },
  "fastest": {
    "mode": "Air Cargo",
    "price": 4200.00,
    "transitDays": 5,
    "route": [...]
  },
  "bestValue": {
    "mode": "FTL Trucking",
    "price": 2200.00,
    "transitDays": 7,
    "route": [...]
  },
  "options": [...],
  "aiSummary": "Ocean freight is the cheapest at €1450 but takes 32 days...",
  "requestId": "RQ-20241117120000-ABC123"
}
```

## 🧠 Agentic AI Workflow

The `FreightRateAgent` class orchestrates 6 autonomous steps:

```python
# Step 1: Validate
validation = await agent.validate_shipment(details)

# Step 2: Determine transport legs
legs = await agent.determine_transport_legs(details)

# Step 3: Fetch quotes
quotes = await agent.fetch_quotes_autonomously(details, legs)

# Step 4: Combine routes (automatic in previous steps)

# Step 5 & 6: Optimize and recommend
response = await agent.optimize_routes(details, quotes)
```

**Features:**
- Automatic retry logic on API failures
- Fallback to mock data for MVP
- Multi-leg routing (e.g., Truck→Ocean→Truck)
- Price/speed/reliability optimization
- Carbon footprint calculations
- Natural language AI summaries

## 🔌 API Integrations (Extensible)

Currently using **mock data**, but ready to integrate:

- **Freightos** - Ocean + Air rates
- **ShipEngine** - LTL trucking
- **EasyPost** - Multi-carrier quotes
- **Xeneta** - Market benchmarking
- **Direct Carriers** - Maersk, MSC, CMA CGM, DHL

To add a provider:
1. Implement in `app/services/freight_providers.py`
2. Add API key to `.env`
3. Update agent to call new provider

## 📊 Database Schema

**Quotes Table**
```sql
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR UNIQUE,
  origin VARCHAR,
  destination VARCHAR,
  shipment_types JSONB,
  weight FLOAT,
  volume FLOAT,
  commodity VARCHAR,
  price FLOAT,
  transit_days INT,
  mode VARCHAR,
  route JSONB,
  carbon_footprint FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  booking_id VARCHAR UNIQUE,
  quote_id VARCHAR,
  user_email VARCHAR,
  status VARCHAR,
  selected_option JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in `.env`
- [ ] Configure PostgreSQL production database
- [ ] Add real API keys (Freightos, ShipEngine, etc.)
- [ ] Set up OpenAI API key for agentic features
- [ ] Deploy with Docker: `docker-compose -f docker-compose.prod.yml up`
- [ ] Set up SSL/TLS
- [ ] Configure CORS for frontend domain

### Recommended Deployment Platforms
- **Backend**: AWS ECS, Google Cloud Run, Railway.app
- **Frontend**: Vercel, Netlify
- **Database**: AWS RDS, Heroku Postgres, Supabase

## 📈 Future Enhancements

1. **Real API Integration** - Connect to actual freight providers
2. **Historical Data** - Track rates over time
3. **Booking Management** - Full booking workflow
4. **User Accounts** - Save preferences and routes
5. **Rate Notifications** - Alert users to price drops
6. **Advanced Analytics** - Carbon tracking, cost optimization
7. **Mobile App** - React Native companion
8. **White-label Version** - SaaS for freight forwarders

## 🤝 Contributing

Contributions welcome! Areas to improve:
- Additional freight provider integrations
- Advanced routing algorithms
- Real-time delay prediction
- Customs clearance automation
- Multi-leg optimization

## 📞 Support

For issues or questions:
- Check API docs at `/docs`
- Review example requests in `backend/examples/`
- Check logs: `docker-compose logs -f backend`

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for modern logistics**
