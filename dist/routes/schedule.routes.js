"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schedule_controller_1 = require("../controllers/schedule.controller");
const router = (0, express_1.Router)();
/**
 * GET /download-full-agenda
 * Downloads the full irrigation schedule with times in the specified format
 */
router.get('/download-full-agenda', schedule_controller_1.downloadFullAgenda);
/**
 * GET /download-template
 * Downloads a blank template without irrigation times
 */
router.get('/download-template', schedule_controller_1.downloadTemplate);
/**
 * GET /download-calendar
 * Downloads the irrigation schedule as iCalendar (.ics) for Google Calendar
 */
router.get('/download-calendar', schedule_controller_1.downloadCalendar);
exports.default = router;
//# sourceMappingURL=schedule.routes.js.map