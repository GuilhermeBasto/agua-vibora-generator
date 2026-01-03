import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Água Víbora Generator API',
      version: '0.0.0',
      description:
        'API for generating irrigation schedules for the Água de Víbora irrigation system',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Home',
        description: 'Home page and general information',
      },
      {
        name: 'Irrigation',
        description: 'Irrigation schedule management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
