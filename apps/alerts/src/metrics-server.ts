import express from 'express'
import { register } from 'prom-client'

export function startMetricsServer(): void {
  const app = express()
  const port = process.env.METRICS_PORT || process.env.PROMETHEUS_PORT || 3001

  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType)
      const metrics = await register.metrics()
      res.end(metrics)
    } catch (error) {
      res.status(500).end(`Error generating metrics: ${error}`)
    }
  })

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.listen(port, () => {
    console.log(`[Metrics Server] Prometheus metrics server listening on port ${port}`)
    console.log(`[Metrics Server] Metrics endpoint: http://localhost:${port}/metrics`)
  })
}