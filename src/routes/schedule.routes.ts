import { Router } from 'express';
import {
  downloadFullAgenda,
  downloadTemplate,
  downloadCalendar,
} from '../controllers/schedule.controller';

const router = Router();

/**
 * @swagger
 * /irrigation/download-full-agenda:
 *   get:
 *     summary: Download full irrigation schedule
 *     description: Downloads the complete irrigation schedule with times in the specified format
 *     tags: [Irrigation]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year for the schedule (defaults to current year)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [xlsx, csv, pdf]
 *           default: xlsx
 *         description: File format for the download
 *     responses:
 *       200:
 *         description: Schedule file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/download-full-agenda', downloadFullAgenda);

/**
 * @swagger
 * /irrigation/download-template:
 *   get:
 *     summary: Download blank schedule template
 *     description: Downloads a blank template without irrigation times
 *     tags: [Irrigation]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year for the template (defaults to current year)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [xlsx, csv, pdf]
 *           default: xlsx
 *         description: File format for the download
 *     responses:
 *       200:
 *         description: Template file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/download-template', downloadTemplate);

/**
 * @swagger
 * /irrigation/download-calendar:
 *   get:
 *     summary: Download schedule as iCalendar
 *     description: Downloads the irrigation schedule as an iCalendar (.ics) file for Google Calendar
 *     tags: [Irrigation]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year for the calendar (defaults to current year)
 *     responses:
 *       200:
 *         description: iCalendar file download
 *         content:
 *           text/calendar:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/download-calendar', downloadCalendar);

export default router;
