import { Router } from 'express';
import {
  downloadFullAgenda,
  downloadTemplate,
  downloadCalendar,
} from '../controllers/schedule.controller';

const router = Router();

/**
 * GET /download-full-agenda
 * Downloads the full irrigation schedule with times in the specified format
 */
router.get('/download-full-agenda', downloadFullAgenda);

/**
 * GET /download-template
 * Downloads a blank template without irrigation times
 */
router.get('/download-template', downloadTemplate);

/**
 * GET /download-calendar
 * Downloads the irrigation schedule as iCalendar (.ics) for Google Calendar
 */
router.get('/download-calendar', downloadCalendar);

export default router;
