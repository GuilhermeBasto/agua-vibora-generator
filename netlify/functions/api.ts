import serverless from 'serverless-http';
import app from '../../dist/app';

const handler = serverless(app, {
  binary: ['image/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
});

export { handler };
