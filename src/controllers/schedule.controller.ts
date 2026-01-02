import { Request, Response, NextFunction } from 'express';
import {
  generateScheduleWorkbook,
  generateSchedulePDF,
  generateScheduleCalendar,
} from '../services/schedule.service';

/**
 * Valid file formats for schedule export
 */
type FileFormat = 'pdf' | 'xlsx' | 'csv';

/**
 * MIME types for different file formats
 */
const MIME_TYPES: Record<FileFormat, string> = {
  pdf: 'application/pdf',
  csv: 'text/csv; charset=utf-8',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

/**
 * Type guard to check if a string is a valid file format
 */
const isValidFileFormat = (format: unknown): format is FileFormat => {
  return format === 'pdf' || format === 'xlsx' || format === 'csv';
};

/**
 * Safely parses a year from query parameter
 */
const parseYear = (yearParam: unknown): number => {
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
const getFileFormat = (
  formatParam: unknown,
  defaultFormat: FileFormat,
): FileFormat => {
  if (isValidFileFormat(formatParam)) {
    return formatParam;
  }
  return defaultFormat;
};

/**
 * Sends a PDF document as response
 */
const sendPDF = (
  res: Response,
  doc: PDFKit.PDFDocument,
  filename: string,
): void => {
  res.setHeader('Content-Type', MIME_TYPES.pdf);
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  doc.pipe(res);
  doc.end();
};

/**
 * Sends an Excel/CSV workbook as response
 */
const sendWorkbook = async (
  res: Response,
  workbook: any,
  format: 'xlsx' | 'csv',
  filename: string,
): Promise<void> => {
  res.setHeader('Content-Type', MIME_TYPES[format]);
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  if (format === 'csv') {
    await workbook.csv.write(res);
  } else {
    await workbook.xlsx.write(res);
  }
  res.end();
};

/**
 * Generates and sends schedule file in the requested format
 */
const sendScheduleFile = async (
  res: Response,
  year: number,
  format: FileFormat,
  filenamePrefix: string,
  isTemplate: boolean = false,
): Promise<void> => {
  if (format === 'pdf') {
    const doc = generateSchedulePDF(year, isTemplate);
    sendPDF(res, doc, `${filenamePrefix}-${year}.pdf`);
  } else {
    const workbook = generateScheduleWorkbook(year, isTemplate);
    await sendWorkbook(res, workbook, format, `${filenamePrefix}-${year}.${format}`);
  }
};

/**
 * Downloads the full irrigation schedule with times in the specified format
 * Query parameters:
 *   - year: Year for the schedule (defaults to current year)
 *   - fileFormat: Format of the file (pdf, xlsx, csv) - defaults to pdf
 */
export const downloadFullAgenda = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const year = parseYear(req.query.year);
    const format = getFileFormat(req.query.fileFormat, 'pdf');

    await sendScheduleFile(res, year, format, 'agua-vibora', false);
  } catch (error) {
    next(error);
  }
};

/**
 * Downloads a blank template without irrigation times
 * Query parameters:
 *   - year: Year for the template (defaults to current year)
 *   - fileFormat: Format of the file (pdf, xlsx, csv) - defaults to pdf
 */
export const downloadTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const year = parseYear(req.query.year);
    const format = getFileFormat(req.query.fileFormat, 'pdf');

    await sendScheduleFile(res, year, format, 'agua-vibora-casais', true);
  } catch (error) {
    next(error);
  }
};

/**
 * Downloads the irrigation schedule as an iCalendar (.ics) file for Google Calendar
 * Query parameters:
 *   - year: Year for the schedule (defaults to current year)
 */
export const downloadCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const year = parseYear(req.query.year);
    const result = generateScheduleCalendar(year);

    if ('error' in result) {
      throw result.error;
    }

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=agua-vibora-${year}.ics`,
    );
    res.send(result.value);
  } catch (error) {
    next(error);
  }
};
