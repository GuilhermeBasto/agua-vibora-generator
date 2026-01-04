import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import apiRouter from './routes/api.routes';
import scheduleRouter from './routes/schedule.routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerDocs } from './config/swagger';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from public directory (must be before other routes to serve index.html)
app.use(express.static(path.join(__dirname, '../public')));

// Swagger API documentation (available in all environments)
app.use(
  '/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocs)
);

// API Routes
app.use('/api', apiRouter);
app.use('/api/irrigation', scheduleRouter);

app.get('/api/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global error handler (must be after routes)
app.use(errorHandler);

export default app;
