const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

app.get('/', (req, res) => {
  httpRequestCounter.inc({ method: 'GET', route: '/', status: 200 });
  res.json({
    message: 'Welcome to DevOps Project 3!',
    app: 'Node.js CI/CD Pipeline',
    platform: 'Minikube + Kubernetes + Jenkins',
    status: 'Running successfully'
  });
});

app.get('/health', (req, res) => {
  httpRequestCounter.inc({ method: 'GET', route: '/health', status: 200 });
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = app;