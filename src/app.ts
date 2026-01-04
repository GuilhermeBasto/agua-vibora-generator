import express from 'express';
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

// Swagger API documentation (available in all environments)
app.use(
  '/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocs, {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js'
    ]
  })
);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', homeRouter);
app.use('/api/irrigation', scheduleRouter);

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Bem-vindo à API da Água de Víbora',
    version: '1.0.0',
    description: 'API para gestão de calendários de rega',
    endpoints: {
      'GET /api/healthz': 'Verifica o estado da API',
      'GET /api/irrigation/download-full-agenda': 'Descarrega calendário completo (xlsx, pdf)',
      'GET /api/irrigation/download-template': 'Descarrega template sem horários (xlsx, pdf)',
      'GET /api/irrigation/download-calendar': 'Descarrega calendário .ics para importar',
    },
    documentation: '/api-docs' 
  })
})

app.get('/api/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})


// Global error handler (must be after routes)
app.use(errorHandler);

export default app;
