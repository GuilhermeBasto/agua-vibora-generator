import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

import homeRouter from './routes/home.routes';
import scheduleRouter from './routes/schedule.routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files for Swagger UI
const publicPath = path.join(__dirname, '..', 'public');
app.use('/public', express.static(publicPath));

// Swagger documentation with custom CSS and static assets
const swaggerOptions = {
  customCssUrl: '/public/swagger-ui.css',
  customSiteTitle: 'Água Víbora Generator - API Documentation',
  customJs: [
    '/public/swagger-ui-bundle.js',
    '/public/swagger-ui-standalone-preset.js'
  ]
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// Routes
app.use('/', homeRouter);
app.use('/irrigation', scheduleRouter);

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// Global error handler (must be after routes)
app.use(errorHandler);

export default app;
