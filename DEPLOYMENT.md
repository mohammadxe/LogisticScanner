# 🚀 Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] API keys validated
- [ ] CORS configured for frontend domain
- [ ] SSL/TLS certificates ready
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Monitoring set up

## Local Development Deployment

### Prerequisites
- Docker & Docker Compose
- Git
- 8GB RAM minimum

### Step-by-Step

1. **Clone repository**
```bash
git clone <repo> logistic
cd logistic
```

2. **Configure environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your API keys
cd ../frontend
cp .env.example .env.local
# Edit if needed
```

3. **Start services**
```bash
cd ..
docker-compose up -d
```

4. **Verify deployment**
```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:8000/health

# API Docs
curl http://localhost:8000/docs
```

## Production Deployment

### Option 1: AWS ECS + Vercel

**Backend on AWS:**
1. Build image: `docker build -t freight-backend ./backend`
2. Push to ECR: `aws ecr push freight-backend:latest`
3. Create ECS task definition
4. Deploy to ECS cluster
5. Configure RDS PostgreSQL
6. Set up CloudWatch logs

**Frontend on Vercel:**
1. Connect GitHub repo to Vercel
2. Set environment: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
3. Deploy

### Option 2: Heroku

**Backend:**
```bash
heroku login
heroku create freight-optimizer-api
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

**Frontend (Vercel recommended)**

### Option 3: Google Cloud Run

**Backend:**
```bash
# Build and push
docker build -t gcr.io/PROJECT/freight-backend ./backend
docker push gcr.io/PROJECT/freight-backend

# Deploy
gcloud run deploy freight-backend \
  --image gcr.io/PROJECT/freight-backend:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=postgresql://...
```

## Environment Configuration

### Backend (.env)

```ini
# API Configuration
DEBUG=False

# Database
DATABASE_URL=postgresql://user:pass@host:5432/freight_db

# OpenAI for AI agent
OPENAI_API_KEY=sk-...

# Freight APIs (Optional)
FREIGHTOS_API_KEY=xxx
SHIPENGINE_API_KEY=xxx
EASYPOST_API_KEY=xxx
XENETA_API_KEY=xxx

# Frontend
FRONTEND_URL=https://yourdomain.com

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_ENV=production
```

## Database Setup

### PostgreSQL Production

1. **Create database:**
```bash
createdb freight_rates
```

2. **Apply migrations:**
```bash
# Currently uses SQLAlchemy auto-creation
# For production, use Alembic:
alembic upgrade head
```

3. **Create backups:**
```bash
pg_dump freight_rates > backup.sql
```

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring & Logging

### Application Logging

Update `app/config.py`:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Health Checks

Endpoint: `GET /health`

Use with:
- AWS ECS health check
- Kubernetes liveness probe
- Third-party monitoring (Datadog, New Relic)

### Performance Monitoring

Add to backend:
```python
from prometheus_client import Counter, Histogram
from fastapi_prometheus_middleware import PrometheusMiddleware

app.add_middleware(PrometheusMiddleware)
```

## Rate Limiting

Configure in FastAPI:
```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/multimodal/quote")
@limiter.limit("10/minute")
async def get_quotes(request: Request, ...):
    pass
```

## CORS Configuration

Update `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## Security Best Practices

1. **API Keys**: Use AWS Secrets Manager or HashiCorp Vault
2. **Database**: Enable SSL connections
3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: Pydantic handles this
5. **HTTPS Only**: Redirect HTTP to HTTPS
6. **CORS**: Whitelist domains
7. **Authentication**: Add JWT if needed

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push Docker image
        run: |
          docker build -t freight-backend ./backend
          docker push gcr.io/PROJECT/freight-backend:latest
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy freight-backend \
            --image gcr.io/PROJECT/freight-backend:latest
```

## Rollback Procedure

1. **Docker**: Keep previous image tag
```bash
docker tag freight-backend:v1.0 freight-backend:stable
docker run -d freight-backend:stable  # Rollback
```

2. **Database**: Maintain backups
```bash
pg_restore -d freight_rates backup.sql
```

## Performance Optimization

1. **CDN for Frontend**: Use Cloudflare or AWS CloudFront
2. **Database Indexes**: Add on frequently queried columns
3. **Caching**: Redis for quote caching
4. **Async Workers**: Use Celery for long tasks
5. **Compression**: Enable gzip

## Monitoring Dashboards

### Datadog Integration
```python
from ddtrace import patch_all

patch_all()
```

### New Relic
```python
import newrelic.agent
newrelic.agent.initialize('newrelic.ini')
```

## Cost Optimization

| Service | Est. Cost/Month |
|---------|-----------------|
| Backend (Cloud Run) | $10-50 |
| Frontend (Vercel) | $20-100 |
| Database (RDS) | $30-100 |
| Storage | $5-20 |
| **Total** | **$65-270** |

Tips:
- Use free tier for dev/staging
- Scale down non-peak times
- Use spot instances for batch jobs
- Optimize database queries

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Check port conflicts
lsof -i :8000

# Restart
docker-compose restart backend
```

### Database connection issues
```bash
# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Frontend can't reach API
```bash
# Check CORS
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  http://localhost:8000

# Check API URL
echo $NEXT_PUBLIC_API_URL
```

## Support & Resources

- **Docs**: https://api.yourdomain.com/docs
- **Status**: https://status.yourdomain.com
- **Issues**: GitHub Issues
- **Email**: support@yourdomain.com

---

Last updated: 2024-11-17
