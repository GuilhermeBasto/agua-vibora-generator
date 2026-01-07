import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import type { ScheduleEntry } from "./types";
import { addDays, set } from "date-fns";

export const generatePDF = (title: string, data: any[]) => {
  // PDF configuration (reduced top margin)
  const doc = new PDFDocument({ margin: 30, size: "A4" });

  // Title (smaller and tighter spacing)
  doc.fontSize(12).font("Helvetica-Bold").text(title, {
    align: "center",
  });
  doc.moveDown(0.5);

  // Table configuration
  const startX = 30;
  const pageWidth = 595; // A4 width in points
  const margin = 30;
  const totalWidth = pageWidth - 2 * margin;
  const colWidths = {
    date: 120,
    location: 150,
    schedule: totalWidth - 120 - 150,
  };
  const rowHeight = 20;

  let currentY = doc.y;

  // Draw data rows
  data.forEach((item) => {
    // Check if we need a new page (adjusted for smaller bottom margin)
    if (currentY > 780) {
      doc.addPage();
      currentY = 30;
    }

    // Set font based on bold flag
    doc.font(item.isBold ? "Helvetica-Bold" : "Helvetica").fontSize(10);

    // Date column
    doc.rect(startX, currentY, colWidths.date, rowHeight).stroke();
    doc.text(item.dateFormatted, startX + 5, currentY + 5, {
      width: colWidths.date - 10,
      align: "left",
    });

    // Location column
    doc
      .rect(startX + colWidths.date, currentY, colWidths.location, rowHeight)
      .stroke();
    doc.text(item.location, startX + colWidths.date + 5, currentY + 5, {
      width: colWidths.location - 10,
      align: "left",
    });

    // Schedule column
    doc
      .rect(
        startX + colWidths.date + colWidths.location,
        currentY,
        colWidths.schedule,
        rowHeight
      )
      .stroke();
    doc.text(
      item.schedule,
      startX + colWidths.date + colWidths.location + 5,
      currentY + 5,
      {
        width: colWidths.schedule - 10,
        align: "left",
      }
    );

    currentY += rowHeight;
  });

  return doc;
};

/**
 * RFC 5987 compliant Content-Disposition filename encoding.
 * Ensures filenames download correctly across Android/iOS/desktop.
 */
export const getContentDispositionHeader = (fileName: string) => {
  const encoded = encodeURIComponent(fileName).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
  return `attachment; filename*=UTF-8''${encoded}; filename="${fileName}"`;
};

/**
 * Adds black borders to an Excel cell
 * @param cell - ExcelJS cell object
 */
export const addBordersToCell = (cell: ExcelJS.Cell): void => {
  cell.border = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };
};

/**
 * Adds a centered, bold title row to an Excel worksheet.
 * @param worksheet ExcelJS worksheet object.
 * @param year Year to display in the title.
 * @param title Title text to display.
 */
export const addTitleToWorksheet = (
  worksheet: ExcelJS.Worksheet,
  year: number,
  title: string
): void => {
  worksheet.insertRow(1, [title + " - Ano " + year]);
  worksheet.mergeCells("A1:C1");
  const titleCell = worksheet.getCell("A1");
  titleCell.font = { name: "Arial", size: 14, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.addRow([]); // Empty separator row
};

/**
 * Generates an ExcelJS Workbook from an array of schedule entries.
 * Shared utility to avoid duplication across API routes.
 */
export const generateWorkbookFromData = (
  title: string,
  year: number,
  data: ScheduleEntry[]
): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  worksheet.columns = [
    { key: "date", width: 15 },
    { key: "location", width: 20 },
    { key: "schedule", width: 40 },
  ];

  addTitleToWorksheet(worksheet, year, title);

  data.forEach((item) => {
    const row = worksheet.addRow({
      date: item.dateFormatted,
      location: item.location,
      schedule: item.schedule,
    });
    row.eachCell((cell: ExcelJS.Cell) => addBordersToCell(cell));
    if (item.isBold) {
      row.getCell("date").font = { bold: true };
      row.getCell("location").font = { bold: true };
      row.getCell("schedule").font = { bold: true };
    }
  });

  return workbook;
};

export const generateSchedulePointers = (
  config: Record<string, string[]>
): Record<string, number> => {
  return Object.keys(config).reduce(
    (acc, location) => {
      acc[location] = 0;
      return acc;
    },
    {} as Record<string, number>
  );
};

/**
 * Rotates a list based on the year offset from a reference year.
 */
export const getOrder = <T>(
  list: T[],
  year: number,
  referenceYear: number
): T[] => {
  const offset = (year - referenceYear) % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
};

/**
 * Retrieves the per-village schedule labels for the given year parity.
 */
export const getYearScheduleDurations = (
  year: number,
  schedule: { odd: Record<string, string[]>; even: Record<string, string[]> }
): Record<string, string[]> => {
  return year % 2 === 0 ? schedule.even : schedule.odd;
};

/**
 * Builds the start and end `Date` objects for the schedule window.
 */
export const getDateRange = (
  year: number,
  startCfg: { month: number; date: number },
  endCfg: { month: number; date: number }
): { startDate: Date; endDate: Date } => {
  const startDate = set(new Date(), {
    year,
    month: startCfg.month,
    date: startCfg.date,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const endDate = set(new Date(), {
    year,
    month: endCfg.month,
    date: endCfg.date,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  return { startDate, endDate };
};

/**
 * Builds schedule entries from a rotating sequence and per-location label arrays.
 * @param yearSequence Ordered list of locations for the year.
 * @param schedulesByLocation Map of location -> label list.
 * @param schedulePointers Map of location -> current pointer index.
 * @param startDate Inclusive start date.
 * @param endDate Inclusive end date.
 * @param formatDate Function to format a given date.
 * @returns Array of entries: { date, dateFormatted, location, schedule }.
 */
export const buildScheduleData = (
  yearSequence: string[],
  schedulesByLocation: Record<string, string[]>,
  schedulePointers: Record<string, number>,
  startDate: Date,
  endDate: Date,
  formatDate: (d: Date) => string
) => {
  const scheduleData: {
    date: Date;
    dateFormatted: string;
    location: string;
    schedule: string;
  }[] = [];

  let currentDate = startDate;
  let dayIndex = 0;

  while (currentDate <= endDate) {
    const locationName = yearSequence[dayIndex % yearSequence.length];
    let scheduleStr = "";

    if (schedulesByLocation[locationName]) {
      const list = schedulesByLocation[locationName];
      scheduleStr = list[schedulePointers[locationName] % list.length];
      schedulePointers[locationName]++;
    }

    scheduleData.push({
      date: currentDate,
      dateFormatted: formatDate(currentDate),
      location: locationName,
      schedule: scheduleStr,
    });

    currentDate = addDays(currentDate, 1);
    dayIndex++;
  }

  return scheduleData;
};
