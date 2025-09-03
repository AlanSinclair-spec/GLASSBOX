# Glass Box - AI Agent Observability Platform

See inside your AI agents. Track tokens, costs, latency, and debug failures with a developer-first observability platform.

## Features

- **Real-time Logging** - Stream events from your agents with our simple API
- **Cost Tracking** - Monitor token usage and costs across all your agents
- **Performance Metrics** - Track latency, cache hits, and success rates
- **Timeline View** - Debug agent runs step-by-step
- **Multi-tier Billing** - Flexible plans from hobbyists to enterprise

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/glass-box.git
cd glass-box
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial.sql` in the SQL editor
3. Copy your project URL and keys to `.env.local`

### 3. Set up Stripe (Test Mode)

1. Create a Stripe account and get test keys from the dashboard
2. Create 3 products with monthly prices:
   - Hacker: $29/mo
   - Startup: $99/mo  
   - Scale: $299/mo
3. Add price IDs to `.env.local`
4. Set up webhook endpoint: `https://yoursite.com/api/stripe/webhook`
5. Listen for events: `checkout.session.completed`, `customer.subscription.*`

### 4. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

### 5. Seed Demo Data (Optional)

```bash
npm run seed
```

### 6. Run Development Server

```bash
npm run dev
# Visit http://localhost:3000
```

## API Usage

### Authentication

Get your API key from the Settings page after signing up.

### Ingest Events

```bash
curl -X POST https://app.glassbox.dev/api/ingest \
  -H "Content-Type: application/json" \
  -H "x-glassbox-key: YOUR_API_KEY" \
  -d '{
    "request_id": "req_123",
    "step_type": "llm",
    "tool_name": "gpt-4",
    "input_tokens": 150,
    "output_tokens": 200,
    "cost_usd": 0.0105,
    "latency_ms": 1200,
    "cache_hit": false,
    "status": "ok",
    "payload": {
      "model": "gpt-4",
      "temperature": 0.7
    },
    "index": 0
  }'
```

### Node.js SDK Example

```javascript
import { GlassBox } from 'glassbox-sdk'; // Coming soon

const gb = new GlassBox({ apiKey: process.env.GLASSBOX_KEY });

// Log a single step
await gb.log({
  requestId: 'req_123',
  stepType: 'llm',
  toolName: 'gpt-4',
  inputTokens: 150,
  outputTokens: 200,
  costUsd: 0.0105,
  latencyMs: 1200,
  status: 'ok'
});

// Or use the tracer for automatic tracking
const tracer = gb.trace('req_123');
const response = await tracer.llm('gpt-4', { 
  messages: [...] 
});
```

## Deployment

### Deploy to Vercel

1. Fork this repository
2. Import to Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/glass-box)

### Production Checklist

- [ ] Enable Supabase RLS policies
- [ ] Switch Stripe to live mode
- [ ] Set up monitoring (Sentry, PostHog)
- [ ] Configure rate limiting
- [ ] Set up backup strategy
- [ ] Add custom domain
- [ ] Enable SSL certificate

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js   │────▶│   Supabase   │────▶│  Postgres   │
│  App Router │     │   Auth/RLS   │     │   Database  │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                         │
       ▼                                         ▼
┌─────────────┐                         ┌─────────────┐
│    Stripe   │                         │   Events    │
│   Billing   │                         │    Table    │
└─────────────┘                         └─────────────┘
```

## Testing

### Test Cards (Stripe)

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3DS Required: `4000 0025 0000 3155`

### Rate Limits

- Ingest API: 60 requests/minute per key
- Dashboard: No limits
- Metrics: Cached for 60 seconds

## Support

- Documentation: [docs.glassbox.dev](https://docs.glassbox.dev)
- Discord: [discord.gg/glassbox](https://discord.gg/glassbox)
- Email: support@glassbox.dev

## License

MIT

---

Built with ❤️ for the AI agent community.
