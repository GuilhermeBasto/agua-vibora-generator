import { Router } from 'express';
import { getApiInfo } from '../controllers/api.controller';

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get API information
 *     description: Returns API documentation page with available endpoints
 *     tags: [API]
 *     responses:
 *       200:
 *         description: HTML page with API information
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', getApiInfo);

export default router;
