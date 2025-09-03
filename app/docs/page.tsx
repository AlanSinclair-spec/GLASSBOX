export default function DocsPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Documentation</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <div className="bg-gray-900 p-4 rounded-lg">
            <pre className="text-sm text-gray-100">
{`curl -X POST ${process.env.NEXT_PUBLIC_SITE_URL || 'https://glassbox-nhtt.vercel.app'}/api/ingest \\
  -H "x-glassbox-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "request_id": "test_001",
    "step_type": "llm",
    "tool_name": "gpt-4",
    "input_tokens": 100,
    "output_tokens": 200,
    "cost_usd": 0.01,
    "latency_ms": 1000,
    "status": "ok"
  }'`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
          <p>Full documentation coming soon. For now, use the endpoint above to send events.</p>
        </section>
      </div>
    </div>
  )
}
