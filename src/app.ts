import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import homeRouter from './routes/home.routes';
import scheduleRouter from './routes/schedule.routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerDocs } from './config/swagger';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to restrict Swagger to localhost only
const localhostOnly = (req: Request, res: Response, next: NextFunction) => {
  const host = req.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
    return next();
  }
  res.status(403).json({ error: 'API documentation is only available on localhost' });
};

app.use('/api-docs', localhostOnly, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/', homeRouter);
app.use('/api/irrigation', scheduleRouter);

app.get('/api/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})


// Global error handler (must be after routes)
app.use(errorHandler);

export default app;
