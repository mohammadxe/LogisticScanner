# 📋 API Specification

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`

## Authentication
Currently no authentication. Future versions will support JWT.

---

## Endpoints

### Health Check
**GET** `/health`

Check if the API is running.

**Response** (200):
```json
{
  "status": "ok",
  "service": "Freight Rate Optimizer"
}
```

---

### Validate Shipment
**POST** `/api/agent/validate`

Validates and normalizes shipment details. Checks for compliance, hazmat restrictions, and data integrity.

**Request Body**:
```json
{
  "shipmentTypes": ["Ocean (FCL)", "Air Cargo"],
  "weight": 1000,
  "weightUnit": "kg",
  "volume": 10.5,
  "commodity": "Electronics",
  "hsCode": "850231",
  "hazardous": false,
  "temperatureControlled": true,
  "origin": "Shanghai, China",
  "destination": "Rotterdam, Netherlands",
  "departureWindow": "2024-12-15",
  "incoterms": "CIF",
  "customsClearance": true,
  "insurance": true,
  "lastMileDelivery": true,
  "warehousing": false
}
```

**Response** (200):
```json
{
  "valid": true,
  "normalized": { /* normalized shipment data */ },
  "warnings": [
    "Hazmat requires special handling - rates will be higher"
  ],
  "errors": []
}
```

**Response** (400):
```json
{
  "detail": {
    "errors": ["Weight must be greater than 0"],
    "warnings": []
  }
}
```

---

### Get Multimodal Quotes
**POST** `/api/multimodal/quote`

Main endpoint. Gets freight rate quotes across all modes (ocean, air, land).

Performs full 6-step agent workflow:
1. Validate input
2. Determine transport legs
3. Fetch quotes from providers
4. Combine into multimodal routes
5. Optimize by price/speed/reliability
6. Generate AI recommendations

**Request Body**: Same as `/api/agent/validate`

**Response** (200):
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
        "duration": "2 days",
        "carrier": null,
        "distance_km": null
      },
      {
        "mode": "Ocean",
        "origin": "Shanghai, China Port",
        "destination": "Rotterdam, Netherlands Port",
        "duration": "28 days",
        "carrier": "Maersk",
        "distance_km": 20000
      },
      {
        "mode": "Truck",
        "origin": "Rotterdam, Netherlands Port",
        "destination": "Rotterdam, Netherlands",
        "duration": "2 days",
        "carrier": null,
        "distance_km": null
      }
    ],
    "carbonFootprint": 250.0,
    "reliability": 0.92
  },
  "fastest": {
    "mode": "Air Cargo",
    "price": 4200.00,
    "transitDays": 5,
    "route": [
      {
        "mode": "Truck",
        "origin": "Shanghai, China",
        "destination": "Shanghai, China Airport",
        "duration": "1 day",
        "carrier": null,
        "distance_km": null
      },
      {
        "mode": "Air",
        "origin": "Shanghai, China Airport",
        "destination": "Rotterdam, Netherlands Airport",
        "duration": "3 days",
        "carrier": "KLM Cargo",
        "distance_km": 9000
      },
      {
        "mode": "Truck",
        "origin": "Rotterdam, Netherlands Airport",
        "destination": "Rotterdam, Netherlands",
        "duration": "1 day",
        "carrier": null,
        "distance_km": null
      }
    ],
    "carbonFootprint": 1200.0,
    "reliability": 0.98
  },
  "bestValue": {
    "mode": "FTL Trucking",
    "price": 2200.00,
    "transitDays": 7,
    "route": [
      {
        "mode": "Truck",
        "origin": "Shanghai, China",
        "destination": "Rotterdam, Netherlands",
        "duration": "7 days",
        "carrier": "Premium Logistics",
        "distance_km": 15000
      }
    ],
    "carbonFootprint": 350.0,
    "reliability": 0.95
  },
  "options": [
    {
      "mode": "Ocean (FCL)",
      "price": 1450.00,
      "transitDays": 32,
      "route": [ /* ... */ ],
      "carbonFootprint": 250.0,
      "reliability": 0.92
    },
    {
      "mode": "Air Cargo",
      "price": 4200.00,
      "transitDays": 5,
      "route": [ /* ... */ ],
      "carbonFootprint": 1200.0,
      "reliability": 0.98
    },
    {
      "mode": "FTL Trucking",
      "price": 2200.00,
      "transitDays": 7,
      "route": [ /* ... */ ],
      "carbonFootprint": 350.0,
      "reliability": 0.95
    }
  ],
  "aiSummary": "Based on your shipment requirements (1000 kg of Electronics):\n\n💰 **Cheapest Option**: Ocean (FCL) at $1,450.00 (32 days)\n⚡ **Fastest Option**: Air Cargo at $4,200.00 (5 days)\n⭐ **Best Value**: FTL Trucking at $2,200.00 (7 days)\n\n**Recommendation**: Based on typical shipping priorities and your route (Shanghai, China → Rotterdam, Netherlands), the FTL Trucking option offers the optimal balance of cost and speed.",
  "requestId": "RQ-20241117120000-ABC123"
}
```

**Response** (404):
```json
{
  "detail": "No shipping options available for this route"
}
```

**Response** (500):
```json
{
  "detail": "Error generating quotes: [error details]"
}
```

---

### Get Recommendations
**POST** `/api/agent/recommend`

Get AI-powered recommendations based on specific priorities.

**Request Body**:
```json
{
  "shipmentDetails": {
    "shipmentTypes": ["Ocean (FCL)"],
    "weight": 1000,
    "weightUnit": "kg",
    "volume": 10,
    "commodity": "Electronics",
    "hazardous": false,
    "temperatureControlled": false,
    "origin": "Shanghai, China",
    "destination": "Rotterdam, Netherlands",
    "incoterms": "CIF"
  },
  "options": [
    {
      "mode": "Ocean (FCL)",
      "price": 1450.00,
      "transitDays": 32,
      "route": [ /* ... */ ],
      "carbonFootprint": 250.0,
      "reliability": 0.92
    }
  ],
  "priorities": {
    "cost": 0.5,
    "speed": 0.3,
    "reliability": 0.2
  }
}
```

**Response** (200):
```json
{
  "recommendations": [
    {
      "rank": 1,
      "option": "FTL Trucking",
      "price": 2200.00,
      "transit_days": 7,
      "score": 0.87
    },
    {
      "rank": 2,
      "option": "Ocean (FCL)",
      "price": 1450.00,
      "transit_days": 32,
      "score": 0.72
    }
  ],
  "analysis": "Analysis based on your priorities (Cost: 0.5, Speed: 0.3, Reliability: 0.2):\n\nSelected Option: FTL Trucking at $2,200.00 with 7 days transit time.\nThis option provides the best overall value given your priorities.",
  "selectedOption": {
    "mode": "FTL Trucking",
    "price": 2200.00,
    "transitDays": 7,
    "route": [ /* ... */ ],
    "carbonFootprint": 350.0,
    "reliability": 0.95
  }
}
```

---

## Data Types

### ShipmentDetailsRequest
```typescript
{
  shipmentTypes: string[];           // ["Ocean (FCL)", "Air Cargo", "FTL Trucking", ...]
  weight: number;                    // > 0
  weightUnit: "kg" | "tons";
  volume: number;                    // >= 0 (CBM)
  commodity: string;                 // e.g., "Electronics", "Textiles"
  hsCode?: string;                   // e.g., "850231"
  hazardous: boolean;
  temperatureControlled: boolean;
  origin: string;                    // "Shanghai, China"
  destination: string;               // "Rotterdam, Netherlands"
  departureWindow?: string;          // ISO date "2024-12-15"
  incoterms: "EXW"|"FOB"|"CIF"|"DDP";
  customsClearance: boolean;
  insurance: boolean;
  lastMileDelivery: boolean;
  warehousing: boolean;
}
```

### ShippingOptionResponse
```typescript
{
  mode: string;                      // "Ocean (FCL)", "Air Cargo", etc.
  price: number;                     // USD
  transitDays: number;
  route: TransportLegResponse[];
  carbonFootprint?: number;          // kg CO2
  reliability?: number;              // 0-1 score
}
```

### TransportLegResponse
```typescript
{
  mode: string;                      // "Truck", "Ocean", "Air"
  origin: string;
  destination: string;
  duration: string;                  // "3 days", "28 days"
  carrier?: string;                  // "Maersk", "KLM Cargo"
  distance_km?: number;
}
```

---

## Error Handling

All errors return JSON with `detail` field:

| Status | Code | Message |
|--------|------|---------|
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | No options available |
| 500 | Server Error | Internal error |

**Error Response Format**:
```json
{
  "detail": "Error description"
}
```

---

## Rate Limiting

- **Free Tier**: 60 requests/minute per IP
- **Pro Tier**: 1000 requests/minute (future)

Returns `429 Too Many Requests` if exceeded.

---

## Caching

- Quote responses cached for 24 hours
- Cache key: `{origin}:{destination}:{shipment_types}`
- Clear cache: Admin endpoint (future)

---

## OpenAPI Documentation

**Swagger UI**: `GET /docs`
**ReDoc**: `GET /redoc`
**OpenAPI JSON**: `GET /openapi.json`

---

## Webhook Support (Future)

Planned for booking notifications:

```json
{
  "event": "booking.created",
  "data": {
    "booking_id": "BK-xxx",
    "status": "confirmed"
  }
}
```

---

## Versioning

API version in header:
```
X-API-Version: 1.0.0
```

Current version: `1.0.0`

Future versions will be available at:
- `/api/v1/...`
- `/api/v2/...`

---

## Examples

### cURL

```bash
# Get quotes
curl -X POST http://localhost:8000/api/multimodal/quote \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentTypes": ["Ocean (FCL)"],
    "weight": 1000,
    "weightUnit": "kg",
    "volume": 10,
    "commodity": "Electronics",
    "origin": "Shanghai, China",
    "destination": "Rotterdam, Netherlands",
    "incoterms": "CIF"
  }'
```

### Python

```python
import requests

payload = {
    "shipmentTypes": ["Ocean (FCL)"],
    "weight": 1000,
    "weightUnit": "kg",
    "volume": 10,
    "commodity": "Electronics",
    "origin": "Shanghai, China",
    "destination": "Rotterdam, Netherlands",
    "incoterms": "CIF"
}

response = requests.post(
    "http://localhost:8000/api/multimodal/quote",
    json=payload
)

print(response.json())
```

### JavaScript

```javascript
const payload = {
  shipmentTypes: ["Ocean (FCL)"],
  weight: 1000,
  weightUnit: "kg",
  volume: 10,
  commodity: "Electronics",
  origin: "Shanghai, China",
  destination: "Rotterdam, Netherlands",
  incoterms: "CIF"
};

const response = await fetch(
  "http://localhost:8000/api/multimodal/quote",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }
);

const data = await response.json();
console.log(data);
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |

---

Last updated: 2024-11-17
