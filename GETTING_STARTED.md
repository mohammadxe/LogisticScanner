# 🚀 Getting Started Guide

Welcome to the Freight Rate Optimizer Platform! This guide will get you up and running in minutes.

## 📋 What You Have

A complete, production-ready AI-powered freight rate comparison platform featuring:

✅ **Next.js Frontend** - Beautiful, responsive shipment form  
✅ **FastAPI Backend** - High-performance async API  
✅ **Agentic AI Layer** - 6-step autonomous workflow  
✅ **Multi-Modal Support** - Ocean, Air, Land transport  
✅ **Docker Setup** - One-command deployment  
✅ **Comprehensive Docs** - API specs, deployment guides  

---

## 🎯 Quick Start (5 minutes)

### Option A: Windows Users

1. **Open PowerShell** and navigate to the project:
```powershell
cd c:\Users\pedro\Desktop\logistic
```

2. **Run the quick start script**:
```powershell
.\quickstart.bat
```

3. **Select option 1** to start the full stack

### Option B: macOS/Linux Users

1. **Open Terminal** and navigate to the project:
```bash
cd ~/Desktop/logistic
```

2. **Run the quick start script**:
```bash
bash quickstart.sh
```

3. **Select option 1** to start the full stack

### Option C: Manual Docker Start

```bash
cd c:\Users\pedro\Desktop\logistic
docker-compose up -d
```

### ✅ Verify it's Working

Wait 10-15 seconds, then visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🧪 Test the Platform

### Via Web UI (Easiest)

1. Go to http://localhost:3000
2. Fill out the form:
   - **Shipment Types**: Select "Ocean (FCL)", "Air Cargo"
   - **Weight**: 1000 kg
   - **Volume**: 10 CBM
   - **Commodity**: Electronics
   - **Origin**: Shanghai, China
   - **Destination**: Rotterdam, Netherlands
   - **Incoterms**: CIF

3. Click "Get Freight Quotes"
4. See results with AI recommendations!

### Via API (Advanced)

**Using curl:**
```bash
curl -X POST http://localhost:8000/api/multimodal/quote \
  -H "Content-Type: application/json" \
  -d @c:\Users\pedro\Desktop\logistic\backend\test_payload.json
```

**Using Python:**
```bash
cd c:\Users\pedro\Desktop\logistic\backend
python examples.py
```

---

## 📁 Project Structure

```
logistic/
├── frontend/              # Next.js React app
│   ├── app/
│   │   ├── components/   # ShipmentForm, Results UI
│   │   ├── lib/          # Types, API client
│   │   └── page.tsx      # Main page
│   ├── package.json
│   └── Dockerfile
│
├── backend/              # FastAPI Python app
│   ├── app/
│   │   ├── models/       # Schemas, database models
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Agent, freight providers
│   │   └── utils/        # Helpers, config
│   ├── main.py           # Entry point
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml    # Full stack orchestration
├── README.md             # Project overview
├── API_SPEC.md           # Complete API docs
├── DEVELOPMENT.md        # Dev guide
├── DEPLOYMENT.md         # Production guide
└── GETTING_STARTED.md    # This file
```

---

## 🔑 Key Concepts

### The 6-Step Agent Workflow

When you submit shipment details, the AI agent performs:

```
1️⃣  VALIDATE
    ↓ Checks compliance, hazmat, dimensions
2️⃣  DETERMINE ROUTES
    ↓ Breaks into: Truck → Ocean → Truck
3️⃣  FETCH QUOTES
    ↓ Queries ocean, air, land providers
4️⃣  COMBINE
    ↓ Creates multimodal options
5️⃣  OPTIMIZE
    ↓ Ranks by price, speed, reliability
6️⃣  RECOMMEND
    ↓ Generates AI summary
```

### Mock Data (MVP)

Currently uses realistic **mock data** for:
- Ocean freight (Maersk, etc.)
- Air cargo (KLM, DHL, etc.)
- Land trucking (Premium Logistics, etc.)

**Ready to integrate** with real APIs:
- Freightos
- ShipEngine
- EasyPost
- Xeneta

---

## 🛠 Common Tasks

### Add Your API Keys (Optional)

1. Open `backend/.env`:
```bash
notepad c:\Users\pedro\Desktop\logistic\backend\.env
```

2. Add your API keys:
```
OPENAI_API_KEY=sk-...
FREIGHTOS_API_KEY=xxx
SHIPENGINE_API_KEY=xxx
```

3. Restart backend:
```bash
docker-compose restart backend
```

### View API Documentation

Visit: **http://localhost:8000/docs**

Interactive Swagger UI lets you test endpoints!

### Check Logs

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f db
```

### Stop Services

```bash
docker-compose down
```

---

## 🧠 How the Frontend Works

### Components

**ShipmentForm.tsx**
- Collects shipment details
- Multi-select for transport modes
- Date picker for departure window
- Service checkboxes (insurance, customs, etc.)

**Results.tsx**
- Displays 3 recommended options (cheapest, fastest, best value)
- Shows complete routes with legs
- Lists all available options in table
- AI summary explaining choices

### State Management

- **results**: Stores quote response
- **loading**: Shows loading state
- **error**: Displays error messages

---

## 🚀 Backend API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/api/agent/validate` | Validate shipment |
| POST | `/api/multimodal/quote` | Get quotes (main endpoint) |
| POST | `/api/agent/recommend` | Get recommendations |

---

## 💾 Database

### Currently Supports

- **SQLite** (development) - no setup needed
- **PostgreSQL** (production) - configure in `.env`

### Tables

- `quotes` - Stores rate responses
- `bookings` - Tracks user bookings (future)

**View data:**
```bash
# SQLite
sqlite3 logistic/freight_rates.db

# PostgreSQL
psql postgresql://user:pass@localhost/freight_db
```

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### "Docker daemon not running"
```bash
# Start Docker Desktop on macOS/Windows
# Or start Docker daemon on Linux:
sudo systemctl start docker
```

### "Backend API not responding"
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Verify API is running
curl http://localhost:8000/health
```

### "Cannot connect to database"
```bash
# Check if database is running
docker-compose ps

# Restart database
docker-compose restart db

# Check connection string
echo $DATABASE_URL
```

---

## 📚 Next Steps

### To Learn More

1. **API Docs**: Read `API_SPEC.md`
2. **Development**: Read `DEVELOPMENT.md`
3. **Deployment**: Read `DEPLOYMENT.md`
4. **Interactive Docs**: Visit http://localhost:8000/docs

### To Add Features

1. **New Freight Provider**: Edit `app/services/freight_providers.py`
2. **New Shipment Type**: Update `models/schemas.py`
3. **Better Optimization**: Enhance `FreightRateAgent` class
4. **User Authentication**: Add JWT to `main.py`

### To Deploy

1. Read `DEPLOYMENT.md`
2. Configure environment variables
3. Choose platform (AWS, Heroku, Google Cloud Run, etc.)
4. Deploy containers

---

## 📞 Support

### Resources

- **API Docs**: http://localhost:8000/docs
- **Project README**: `README.md`
- **API Reference**: `API_SPEC.md`
- **Dev Guide**: `DEVELOPMENT.md`
- **Deployment Guide**: `DEPLOYMENT.md`

### Debugging Checklist

- [ ] Docker is running
- [ ] Ports 3000, 8000, 5432 are available
- [ ] `.env` file configured (optional)
- [ ] Check logs: `docker-compose logs -f`
- [ ] Verify services: `docker-compose ps`

---

## ✨ What You Can Do

### Immediate (No Setup)

- ✅ Submit shipments and get quotes
- ✅ See AI recommendations
- ✅ Compare routes
- ✅ View detailed leg breakdowns

### With Configuration

- 🔧 Connect real freight APIs (Freightos, ShipEngine, etc.)
- 🔧 Add OpenAI API key for GPT integration
- 🔧 Configure PostgreSQL for production

### Custom Development

- 🛠️ Add user authentication
- 🛠️ Implement booking workflow
- 🛠️ Add rate history/trending
- 🛠️ Build admin dashboard
- 🛠️ Create mobile app

---

## 🎉 You're Ready!

Your complete AI-powered freight rate optimizer is running!

```
Frontend:    http://localhost:3000
Backend:     http://localhost:8000
API Docs:    http://localhost:8000/docs
```

**Next**: Fill out a shipment and get your first set of quotes! 🚀

---

## 📝 Useful Commands

```bash
# Start full stack
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down

# Restart a service
docker-compose restart backend

# Check service status
docker-compose ps

# Run backend examples
cd backend && python examples.py

# Access shell in container
docker exec -it <container_name> /bin/bash
```

---

## 🗓️ Quick Reference

| Question | Answer |
|----------|--------|
| How do I start? | Run `quickstart.bat` (Windows) or `quickstart.sh` (Mac/Linux) |
| Where is the frontend? | http://localhost:3000 |
| Where is the API? | http://localhost:8000 |
| Where are API docs? | http://localhost:8000/docs |
| How do I test? | Fill the form at localhost:3000 or use `python examples.py` |
| How do I add APIs? | Edit `backend/app/services/freight_providers.py` |
| How do I deploy? | Read `DEPLOYMENT.md` |
| What's the tech stack? | Next.js + FastAPI + PostgreSQL + Docker |

---

**Happy shipping! 🚢✈️🚚**

Last updated: 2024-11-17
