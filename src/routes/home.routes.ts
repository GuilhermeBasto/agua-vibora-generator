import { Router } from 'express';
import { getHomePage } from '../controllers/home.controller';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get home page
 *     description: Returns the application home page with API information
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: HTML home page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', getHomePage);

export default router;
