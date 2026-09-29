import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

import mockRoutes from './routes/mock.js';
import gatewayRoutes from './routes/gateway.js';
import applicationsRoutes from './routes/applications.js';
import workflowsRoutes from './routes/workflows.js';
import consentRoutes from './routes/consent.js';
import adminRoutes from './routes/admin.js';
import registryRoutes from './routes/registry.js';
import cronRoutes from './routes/cron.js';

const app = express();

// Standard Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth & Session Middleware
app.use(authMiddleware);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'SetuLink Interoperability Platform',
    version: '1.0.0-SIH26129',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/mock', mockRoutes);
app.use('/api/gateway', gatewayRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/workflows', workflowsRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/registry', registryRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api', cronRoutes); // Exposes /api/notifications as well

// Central Error Handler
app.use(errorHandler);

// Standalone Server Run
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` SetuLink Backend Server Running on http://localhost:${PORT}`);
    console.log(` Gateway Endpoint:  http://localhost:${PORT}/api/gateway/citizen/CIT-100000000001`);
    console.log(` Mock Health (JSON): http://localhost:${PORT}/api/mock/health`);
    console.log(` Mock Transport (XML): http://localhost:${PORT}/api/mock/transport`);
    console.log(` Mock Municipal (CSV): http://localhost:${PORT}/api/mock/municipal`);
    console.log(`=======================================================`);
  });
}

export default app;
