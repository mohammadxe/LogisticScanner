# Development guide for Freight Rate Optimizer

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ShipmentForm → API Call → Results Display            │   │
│  │ (Tailwind UI) → (Axios) → (Route Visualization)     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/JSON (CORS enabled)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ POST /api/multimodal/quote                           │   │
│  │ ├─ validation                                        │   │
│  │ ├─ route determination                               │   │
│  │ ├─ provider queries                                  │   │
│  │ ├─ optimization                                      │   │
│  │ └─ recommendations                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ FreightRateAgent (Agentic AI)                        │   │
│  │ ├─ validate_shipment()                               │   │
│  │ ├─ determine_transport_legs()                        │   │
│  │ ├─ fetch_quotes_autonomously()                       │   │
│  │ ├─ optimize_routes()                                 │   │
│  │ └─ _generate_ai_summary()                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ FreightProviders (API Integration Layer)             │   │
│  │ ├─ get_ocean_freight_quotes()  [Mock]               │   │
│  │ ├─ get_air_freight_quotes()    [Mock]               │   │
│  │ └─ get_land_freight_quotes()   [Mock]               │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │ SQL
                 ▼
        ┌─────────────────┐
        │   PostgreSQL    │
        │   (Optional)    │
        └─────────────────┘
```

## 📝 Key Components

### Frontend Components
- **ShipmentForm**: Collects user input (shipment types, weight, volume, route, services)
- **Results**: Displays optimal routes, pricing, transit times
- **API Client**: Handles communication with backend

### Backend Services

#### `FreightRateAgent` (Main orchestrator)
```python
# 6-step autonomous workflow
1. validate_shipment()        # Check compliance, normalization
2. determine_transport_legs() # Break into multimodal segments
3. fetch_quotes_autonomously()# Query providers with retry logic
4. combine_legs()              # Automatic in step 3
5. optimize_routes()           # Sort by price/speed/reliability
6. generate_ai_summary()       # Natural language recommendations
```

#### `FreightProviders` (API integration)
- Currently returns mock data
- Ready for real API integration
- Supports: Freightos, ShipEngine, EasyPost, Xeneta

### Database (Optional)
- `quotes`: Store rate responses
- `bookings`: Track user bookings

## 🔄 Data Flow Example

```
User submits form
   ↓
Frontend: POST /api/multimodal/quote
   ↓
Backend validates input
   ↓
Agent determines: Shanghai → (Truck) → Port → (Ocean) → Port → (Truck) → Rotterdam
   ↓
Queries all providers (ocean, air, land)
   ↓
Returns: Cheapest, Fastest, Best Value
   ↓
AI generates natural language summary
   ↓
Frontend displays rich UI with all options
   ↓
User selects option → (Future) Book shipment
```

## 💻 Development Workflow

### Add a New Freight Provider

1. **Implement in `freight_providers.py`:**
```python
async def get_your_provider_quotes(self, details: ShipmentDetailsRequest):
    # Call their API
    # Parse response
    # Return ShippingOptionResponse list
```

2. **Update agent to call it:**
```python
# In fetch_quotes_autonomously()
your_quotes = await self.providers.get_your_provider_quotes(details)
quotes.extend(your_quotes)
```

3. **Add API key to `.env`:**
```
YOUR_PROVIDER_API_KEY=xxx
```

### Add a New Shipment Type

1. **Add to `ShipmentTypeEnum` in `schemas.py`**
2. **Add routing logic in `determine_transport_legs()`**
3. **Add provider query in `fetch_quotes_autonomously()`**

### Improve Route Optimization

Edit the optimization logic in `optimize_routes()`:
```python
# Current: sorts by price, time, ratio
# Could add: reliability, carbon, delay risk, etc.
```

## 🧪 Testing Locally

### 1. Start the backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2. In another terminal, test the API
```bash
curl -X POST http://localhost:8000/api/multimodal/quote \
  -H "Content-Type: application/json" \
  -d @test_payload.json
```

### 3. Or use Python
```bash
python examples.py
```

### 4. Check API documentation
Visit: http://localhost:8000/docs

## 🐳 Docker Development

### Build and run
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Access services
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
OPENAI_API_KEY=your_key
DATABASE_URL=sqlite:///./freight_rates.db
FREIGHTOS_API_KEY=xxx
SHIPENGINE_API_KEY=xxx
EASYPOST_API_KEY=xxx
DEBUG=False
```

### Frontend
```bash
# .env.local (optional)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📊 Performance Tips

1. **Caching**: Add Redis for frequent routes
2. **Async Queries**: Already using async/await
3. **Rate Limiting**: Add per-IP limits
4. **Database Indexing**: Add indexes on origin/destination
5. **CDN**: Deploy frontend to Vercel CDN

## 🚀 Scaling Considerations

### Horizontal Scaling
- Run multiple FastAPI instances
- Use load balancer (Nginx, AWS ALB)
- Scale DB separately (RDS read replicas)

### Rate API Caching
- Cache quotes for 1-24 hours
- Invalidate on price updates
- Use Redis or Memcached

### Queue Processing
- Use Celery for long-running agent tasks
- Separate sync/async operations
- Enable background quote updates

## 🐛 Debugging

### Backend Logs
```bash
# Docker
docker-compose logs -f backend

# Local
python main.py  # See stdout
```

### Frontend DevTools
- Chrome DevTools: F12
- Network tab: Check API requests
- Console: Check for errors

### API Documentation
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📚 Resources

- FastAPI: https://fastapi.tiangolo.com/
- Next.js: https://nextjs.org/docs
- Pydantic: https://docs.pydantic.dev/
- Tailwind: https://tailwindcss.com/docs

---

Happy coding! 🚀
