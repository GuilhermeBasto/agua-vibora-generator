"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCalendar = exports.downloadTemplate = exports.downloadFullAgenda = void 0;
const schedule_service_1 = require("../services/schedule.service");
/**
 * MIME types for different file formats
 */
const MIME_TYPES = {
    pdf: 'application/pdf',
    csv: 'text/csv; charset=utf-8',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
/**
 * Type guard to check if a string is a valid file format
 */
const isValidFileFormat = (format) => {
    return format === 'pdf' || format === 'xlsx' || format === 'csv';
};
/**
 * Safely parses a year from query parameter
 */
const parseYear = (yearParam) => {
    if (typeof yearParam === 'string') {
        const parsed = parseInt(yearParam, 10);
        if (!isNaN(parsed) && parsed > 1900 && parsed < 2100) {
            return parsed;
        }
    }
    return new Date().getFullYear();
};
/**
 * Safely gets file format from query parameter
 */
const getFileFormat = (formatParam, defaultFormat) => {
    if (isValidFileFormat(formatParam)) {
        return formatParam;
    }
    return defaultFormat;
};
/**
 * Sends a PDF document as response
 */
const sendPDF = (res, doc, filename) => {
    res.setHeader('Content-Type', MIME_TYPES.pdf);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    doc.pipe(res);
    doc.end();
};
/**
 * Sends an Excel/CSV workbook as response
 */
const sendWorkbook = async (res, workbook, format, filename) => {
    res.setHeader('Content-Type', MIME_TYPES[format]);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    if (format === 'csv') {
        await workbook.csv.write(res);
    }
    else {
        await workbook.xlsx.write(res);
    }
    res.end();
};
/**
 * Generates and sends schedule file in the requested format
 */
const sendScheduleFile = async (res, year, format, filenamePrefix, isTemplate = false) => {
    if (format === 'pdf') {
        const doc = (0, schedule_service_1.generateSchedulePDF)(year, isTemplate);
        sendPDF(res, doc, `${filenamePrefix}-${year}.pdf`);
    }
    else {
        const workbook = (0, schedule_service_1.generateScheduleWorkbook)(year, isTemplate);
        await sendWorkbook(res, workbook, format, `${filenamePrefix}-${year}.${format}`);
    }
};
/**
 * Downloads the full irrigation schedule with times in the specified format
 * Query parameters:
 *   - year: Year for the schedule (defaults to current year)
 *   - fileFormat: Format of the file (pdf, xlsx, csv) - defaults to pdf
 */
const downloadFullAgenda = async (req, res, next) => {
    try {
        const year = parseYear(req.query.year);
        const format = getFileFormat(req.query.fileFormat, 'pdf');
        await sendScheduleFile(res, year, format, 'agua-vibora', false);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadFullAgenda = downloadFullAgenda;
/**
 * Downloads a blank template without irrigation times
 * Query parameters:
 *   - year: Year for the template (defaults to current year)
 *   - fileFormat: Format of the file (pdf, xlsx, csv) - defaults to pdf
 */
const downloadTemplate = async (req, res, next) => {
    try {
        const year = parseYear(req.query.year);
        const format = getFileFormat(req.query.fileFormat, 'pdf');
        await sendScheduleFile(res, year, format, 'agua-vibora-casais', true);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadTemplate = downloadTemplate;
/**
 * Downloads the irrigation schedule as an iCalendar (.ics) file for Google Calendar
 * Query parameters:
 *   - year: Year for the schedule (defaults to current year)
 */
const downloadCalendar = async (req, res, next) => {
    try {
        const year = parseYear(req.query.year);
        const result = (0, schedule_service_1.generateScheduleCalendar)(year);
        if ('error' in result) {
            throw result.error;
        }
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=agua-vibora-${year}.ics`);
        res.send(result.value);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadCalendar = downloadCalendar;
//# sourceMappingURL=schedule.controller.js.map