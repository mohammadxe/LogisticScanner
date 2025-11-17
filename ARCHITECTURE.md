# 🎨 System Architecture Diagrams

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                      (http://localhost:3000)                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Shipment Form                                           │  │
│  │  • Transport Mode Selection                             │  │
│  │  • Cargo Details                                        │  │
│  │  • Route Input                                          │  │
│  │  • Services Selection                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ HTTP/JSON (CORS)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND                              │
│              (http://localhost:8000/api)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Layer                                               │  │
│  │  • /agent/validate                                      │  │
│  │  • /multimodal/quote                                    │  │
│  │  • /agent/recommend                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────┴────────────────────────────────────┐  │
│  │  Agentic AI Layer (FreightRateAgent)                     │  │
│  │                                                          │  │
│  │  1. validate_shipment()      [Input validation]        │  │
│  │  2. determine_transport_legs() [Route breakdown]       │  │
│  │  3. fetch_quotes_autonomously() [Provider queries]    │  │
│  │  4. combine_routes()          [Multimodal assembly]    │  │
│  │  5. optimize_routes()         [Ranking & scoring]      │  │
│  │  6. generate_ai_summary()     [Natural language]       │  │
│  └────────────────────┬────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────┴────────────────────────────────────┐  │
│  │  Provider Integration Layer (FreightProviders)         │  │
│  │                                                         │  │
│  │  ├─ get_ocean_freight_quotes()   [Currently Mock]     │  │
│  │  ├─ get_air_freight_quotes()     [Currently Mock]     │  │
│  │  └─ get_land_freight_quotes()    [Currently Mock]     │  │
│  │                                                         │  │
│  │  Ready to integrate:                                   │  │
│  │  • Freightos API                                       │  │
│  │  • ShipEngine API                                      │  │
│  │  • EasyPost API                                        │  │
│  │  • Xeneta API                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ SQL
                       ▼
        ┌──────────────────────────────┐
        │  PostgreSQL Database         │
        │                              │
        │  Tables:                     │
        │  • quotes                    │
        │  • bookings                  │
        └──────────────────────────────┘
```

## 2. Frontend Component Hierarchy

```
App (page.tsx)
│
├─ Header
│  └─ "Freight Rate Optimizer"
│
├─ ShipmentForm (if !results)
│  │
│  ├─ Shipment Type Selection
│  │  ├─ Ocean (FCL)
│  │  ├─ Ocean (LCL)
│  │  ├─ Air Cargo
│  │  ├─ FTL Trucking
│  │  └─ LTL Trucking
│  │
│  ├─ Cargo Details
│  │  ├─ Weight & Unit
│  │  ├─ Volume (CBM)
│  │  ├─ Commodity
│  │  ├─ HS Code
│  │  ├─ Hazardous Flag
│  │  └─ Temperature Control Flag
│  │
│  ├─ Route Details
│  │  ├─ Origin Input
│  │  ├─ Destination Input
│  │  ├─ Departure Window
│  │  └─ Incoterms Selector
│  │
│  ├─ Services Selection
│  │  ├─ Customs Clearance
│  │  ├─ Insurance
│  │  ├─ Last-Mile Delivery
│  │  └─ Warehousing
│  │
│  └─ Submit Button
│     └─ "Get Freight Quotes"
│
└─ Results (if results)
   │
   ├─ New Search Button
   │
   ├─ AI Summary Panel
   │  └─ Natural language analysis
   │
   ├─ Recommendations
   │  │
   │  ├─ 💰 Cheapest Option
   │  │  ├─ Price Display
   │  │  ├─ Transit Days
   │  │  ├─ Route Legs
   │  │  └─ Metrics (carbon, reliability)
   │  │
   │  ├─ ⚡ Fastest Option
   │  │  ├─ Price Display
   │  │  ├─ Transit Days
   │  │  ├─ Route Legs
   │  │  └─ Metrics (carbon, reliability)
   │  │
   │  └─ ⭐ Best Value Option
   │     ├─ Price Display
   │     ├─ Transit Days
   │     ├─ Route Legs
   │     └─ Metrics (carbon, reliability)
   │
   └─ All Options Table
      ├─ Mode | Price | Transit | Actions
      ├─ Ocean (FCL) | $1,450 | 32 | Book
      ├─ Air Cargo | $4,200 | 5 | Book
      └─ FTL Trucking | $2,200 | 7 | Book
```

## 3. Backend Service Architecture

```
main.py (FastAPI App)
│
├─ CORS Middleware
├─ Trusted Host Middleware
│
├─ Routes
│  │
│  ├─ routes/agent.py
│  │  ├─ POST /api/agent/validate
│  │  │  └─ Calls: agent.validate_shipment()
│  │  │
│  │  └─ POST /api/agent/recommend
│  │     └─ Calls: scoring logic
│  │
│  └─ routes/quotes.py
│     └─ POST /api/multimodal/quote
│        └─ Orchestrates full 6-step workflow
│
├─ Services
│  │
│  ├─ services/agent.py (FreightRateAgent)
│  │  ├─ validate_shipment() .................. STEP 1
│  │  ├─ determine_transport_legs() ........... STEP 2
│  │  ├─ fetch_quotes_autonomously() ......... STEP 3
│  │  ├─ optimize_routes() ................... STEP 5
│  │  └─ _generate_ai_summary() .............. STEP 6
│  │
│  └─ services/freight_providers.py (FreightProviders)
│     ├─ get_ocean_freight_quotes() .......... [Mock Data]
│     ├─ get_air_freight_quotes() ............ [Mock Data]
│     └─ get_land_freight_quotes() ........... [Mock Data]
│
├─ Models
│  ├─ models/schemas.py (Pydantic)
│  │  ├─ ShipmentDetailsRequest
│  │  ├─ ShippingOptionResponse
│  │  ├─ TransportLegResponse
│  │  ├─ QuoteResponse
│  │  └─ ValidationResponse
│  │
│  └─ models/database.py (SQLAlchemy ORM)
│     ├─ Quote (table)
│     └─ Booking (table)
│
└─ Utils
   ├─ utils/helpers.py
   │  ├─ cbm_from_dimensions()
   │  ├─ get_port_code()
   │  ├─ parse_distance_from_location()
   │  ├─ estimate_transit_days()
   │  └─ calculate_carbon_footprint()
   │
   └─ config.py
      └─ Settings (environment vars)
```

## 4. Data Flow: Quote Generation

```
User Submits Form
   ↓
Frontend: axios.post("/api/multimodal/quote", shipmentData)
   ↓
Backend receives ShipmentDetailsRequest
   ↓
Validation (Step 1)
├─ Check weight > 0
├─ Check origin & destination
├─ Check shipment types selected
└─ Return warnings/errors
   ↓
Determine Routes (Step 2)
├─ Ocean: Factory → Port → Port → Warehouse
├─ Air: Factory → Airport → Airport → Warehouse
└─ Land: Factory → Warehouse
   ↓
Fetch Quotes (Step 3)
├─ Ocean Queries
│  └─ Mock: Maersk, MSC, CMA CGM
├─ Air Queries
│  └─ Mock: KLM, DHL, Lufthansa
└─ Land Queries
   └─ Mock: Premium Logistics
   ↓
Optimize Routes (Step 5)
├─ Sort by price (cheapest)
├─ Sort by transit (fastest)
├─ Calculate score (best value)
└─ Rank all options
   ↓
Generate AI Summary (Step 6)
├─ Compare options
├─ Provide recommendations
└─ Explain trade-offs
   ↓
Return QuoteResponse JSON
   ↓
Frontend receives response
   ↓
Results component renders:
├─ Cheapest option display
├─ Fastest option display
├─ Best value option display
└─ All options table
   ↓
User sees results
```

## 5. Agentic AI Workflow in Detail

```
Step 1: VALIDATE
├─ Input: ShipmentDetails
├─ Process:
│  ├─ Verify weight > 0
│  ├─ Check dimensions
│  ├─ Validate hazmat restrictions
│  ├─ Confirm port/airport codes
│  └─ Check temperature requirements
├─ Output: valid flag + warnings/errors
└─ Response: ValidationResponse

Step 2: DETERMINE ROUTES
├─ Input: Validated shipment + selected modes
├─ Process:
│  ├─ IF Ocean: add Truck→Ocean→Truck legs
│  ├─ IF Air: add Truck→Air→Truck legs
│  └─ IF Land: add Truck leg
├─ Output: List of transport legs
└─ Response: TransportLeg objects

Step 3: FETCH QUOTES
├─ Input: Shipment details + leg requirements
├─ Process:
│  ├─ Ocean provider queries
│  │  └─ Returns: ShippingOption[]
│  ├─ Air provider queries
│  │  └─ Returns: ShippingOption[]
│  └─ Land provider queries
│     └─ Returns: ShippingOption[]
├─ Error handling:
│  ├─ Catch provider errors
│  └─ Fallback to mock data
└─ Output: ShippingOption[]

Step 4: COMBINE ROUTES
├─ Automatic from Step 3
├─ Each option contains:
│  ├─ Transport mode
│  ├─ Complete leg sequence
│  ├─ Total price
│  ├─ Total transit days
│  └─ Metrics (carbon, reliability)
└─ Output: ShippingOption[]

Step 5: OPTIMIZE
├─ Input: All ShippingOption[]
├─ Process:
│  ├─ Find minimum price → cheapest
│  ├─ Find minimum transit_days → fastest
│  ├─ Calculate price/transit ratio → best_value
│  └─ Sort all by score
├─ Scoring: price weight (0.5) + speed (0.3) + reliability (0.2)
└─ Output: ranked options + top 3

Step 6: RECOMMEND
├─ Input: Top options + user preferences
├─ Process:
│  ├─ Compare price vs. transit tradeoff
│  ├─ Analyze carbon impact
│  ├─ Consider reliability scores
│  └─ Generate natural language analysis
├─ Output: Natural language summary
└─ Response: QuoteResponse with analysis
```

## 6. Docker Service Architecture

```
docker-compose.yml
│
├─ Services
│  │
│  ├─ frontend
│  │  ├─ Build: ./frontend/Dockerfile
│  │  ├─ Port: 3000:3000
│  │  ├─ Env: NEXT_PUBLIC_API_URL
│  │  ├─ Depends on: backend
│  │  └─ Volume: ./frontend:/app
│  │
│  ├─ backend
│  │  ├─ Build: ./backend/Dockerfile
│  │  ├─ Port: 8000:8000
│  │  ├─ Env: DATABASE_URL, OPENAI_API_KEY, etc.
│  │  ├─ Depends on: db
│  │  └─ Volume: ./backend:/app
│  │
│  └─ db
│     ├─ Image: postgres:15-alpine
│     ├─ Port: 5432:5432
│     ├─ Env: POSTGRES_USER, PASSWORD, DB
│     └─ Volume: postgres_data:/var/lib/postgresql/data
│
└─ Volumes
   └─ postgres_data (persistent storage)
```

## 7. Database Schema

```
QUOTES TABLE
├─ id: INTEGER PRIMARY KEY
├─ request_id: VARCHAR UNIQUE
├─ origin: VARCHAR
├─ destination: VARCHAR
├─ shipment_types: JSONB (["Ocean (FCL)", "Air Cargo"])
├─ weight: FLOAT
├─ volume: FLOAT
├─ commodity: VARCHAR
├─ price: FLOAT
├─ transit_days: INTEGER
├─ mode: VARCHAR ("Ocean", "Air", "Truck", etc.)
├─ route: JSONB (Array of leg objects)
├─ carbon_footprint: FLOAT (kg CO2)
├─ created_at: TIMESTAMP
└─ updated_at: TIMESTAMP

BOOKINGS TABLE
├─ id: INTEGER PRIMARY KEY
├─ booking_id: VARCHAR UNIQUE
├─ quote_id: VARCHAR FOREIGN KEY
├─ user_email: VARCHAR
├─ status: VARCHAR ("pending", "confirmed", "cancelled")
├─ selected_option: JSONB (Complete ShippingOption)
├─ created_at: TIMESTAMP
└─ updated_at: TIMESTAMP
```

## 8. Request/Response Flow

```
HTTP Request (Frontend → Backend)
   │
   ├─ URL: POST http://localhost:8000/api/multimodal/quote
   ├─ Headers: Content-Type: application/json
   └─ Body: ShipmentDetailsRequest JSON
      {
        "shipmentTypes": ["Ocean (FCL)"],
        "weight": 1000,
        "weightUnit": "kg",
        "volume": 10,
        "commodity": "Electronics",
        "origin": "Shanghai, China",
        "destination": "Rotterdam, Netherlands",
        ... (14 more fields)
      }
   ↓
FastAPI Router (routes/quotes.py)
   │
   ├─ Parses request
   ├─ Validates input
   └─ Calls agent functions
   ↓
FreightRateAgent (services/agent.py)
   │
   ├─ Step 1-6 workflow
   └─ Generates response
   ↓
HTTP Response (Backend → Frontend)
   │
   ├─ Status: 200 OK
   ├─ Headers: Content-Type: application/json
   └─ Body: QuoteResponse JSON
      {
        "cheapest": { ShippingOption },
        "fastest": { ShippingOption },
        "bestValue": { ShippingOption },
        "options": [ ShippingOption[] ],
        "aiSummary": "Based on your requirements...",
        "requestId": "RQ-20241117120000-ABC123"
      }
   ↓
Frontend (app/page.tsx)
   │
   ├─ Receives response
   ├─ Sets state: setResults(response)
   └─ Renders Results component
   ↓
Results Component (components/Results.tsx)
   │
   ├─ Displays cheapest
   ├─ Displays fastest
   ├─ Displays bestValue
   ├─ Shows AI summary
   └─ Lists all options
   ↓
User sees results on screen
```

## 9. Technology Integration Points

```
Next.js Frontend
├─ React Components
├─ TypeScript
├─ Tailwind CSS Styling
├─ Lucide React Icons
├─ Axios HTTP Client
└─ State Management (useState)
   │
   └─→ API Communication ←─┐
                           │
FastAPI Backend           │
├─ Python 3.11           │
├─ FastAPI Framework     │
├─ Pydantic Validation   │
├─ SQLAlchemy ORM        │
├─ Uvicorn Server        │
└─ Async/Await          │
   │
   └─→ Database ←─────────┘
       │
       ├─ PostgreSQL
       └─ SQLite
          │
          └─ Persistent Storage
              (Quotes, Bookings)

Docker
├─ Frontend Container
├─ Backend Container
└─ Database Container
   │
   └─→ Networking
       └─ Internal DNS
```

---

*Last updated: 2024-11-17*
