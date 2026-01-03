import serverless from 'serverless-http';
import app from '../../dist/app';

const handler = serverless(app);

export { handler };
