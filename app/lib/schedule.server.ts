/**
 * @fileoverview Server-only utility for generating Água de Víbora irrigation schedules
 * This file uses the .server.ts convention to ensure it's never bundled to the client
 * Handles schedule generation for different villages and creates Excel/PDF outputs
 */

import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { createEvents, type EventAttributes } from "ics";
import type { ScheduleEntry } from "./types";
import {
  addBordersToCell,
  addTitleToWorksheet,
  generatePDF,
  generateSchedulePointers,
  buildScheduleData,
  getOrder,
  getYearScheduleDurations,
  getDateRange,
} from "./utils.server";

/** Reference year for schedule rotation calculations */
const REFERENCE_YEAR = 2025;

/** Start date configuration for the irrigation schedule (June 25) */
const SCHEDULE_START = { month: 5, date: 25 };

/** End date configuration for the irrigation schedule (September 29) */
const SCHEDULE_END = { month: 8, date: 29 };

/** Date format string for Portuguese locale */
const DATE_FORMAT = "dd 'de' MMMM";

/**
 * Villages grouped by region (Torre and Santo-Antonio)
 */
const VILLAGES: Record<string, string[]> = {
  Torre: ["Torre", "Crasto", "Passo", "Ramada", "Figueiredo", "Redondinho"],
  "Santo-Antonio": [
    "Casa Nova",
    "Eirô",
    "Cimo de Aldeia",
    "Portela",
    "Casa de Baixo",
  ],
};

/**
 * Time schedules for specific villages in odd and even years
 */
type YearScheduleConfig = Record<string, string[]>;

const YEAR_SCHEDULE: { odd: YearScheduleConfig; even: YearScheduleConfig } = {
  odd: {
    Torre: ["1h30 da tarde", "12h até as 2h da tarde"],
    Passo: [
      "10 da noite até ás 1h30/5h30 da tarde",
      "9h30 até 10h30/13h30 até 17h",
    ],
    Figueiredo: [
      "Ao pôr do sol até à meia noite",
      "3h da tarde até ao pôr do sol",
    ],
  },
  even: {
    Torre: ["12h", "13h30"],
    Passo: [
      "9h30 até 10h30 da Noite/13h30 até 17h",
      "10 da noite até á 1h30/5h30 da tarde",
    ],
    Figueiredo: ["Nascer do sol às 12h", "3h até ao Nascer do sol"],
  },
};

/**
 * Valid village names that have specific schedules
 */
type ScheduledVillage = keyof YearScheduleConfig;

/**
 * Type guard to check if a village has a specific schedule
 */
const isScheduledVillage = (village: string): village is ScheduledVillage => {
  return village === "Torre" || village === "Passo" || village === "Figueiredo";
};

/**
 * Rotates a list based on the year offset from a reference year
 * @param list - The list to rotate
 * @param year - The target year
 * @param referenceYear - The reference year for calculating offset
 * @returns The rotated list
 */
// getOrder moved to utils.server

/**
 * Gets the time schedule durations for a specific year
 * @param year - The target year
 * @returns Schedule durations for odd or even year
 */
// getYearScheduleDurations moved to utils.server

/**
 * Generates the complete village rotation schedule for a given year
 * @param year - The target year
 * @returns Ordered list of village names for the year
 */
const getYearSchedule = (year: number): string[] => {
  const torrePlaces = getOrder(VILLAGES.Torre, year, REFERENCE_YEAR);
  const santoAntonioPlaces = getOrder(
    VILLAGES["Santo-Antonio"],
    year,
    REFERENCE_YEAR
  );
  return year % 2 === 0
    ? [...santoAntonioPlaces, ...torrePlaces]
    : [...torrePlaces, ...santoAntonioPlaces];
};

/**
 * Creates start and end dates for the irrigation schedule
 * @param year - The target year
 * @returns Object containing start and end dates
 */
// getDateRange moved to utils.server

/**
 * Generates the complete schedule data for the year
 * @param year - The target year
 * @param template - If true, generates a template without time schedules
 * @returns Array of schedule entries
 */
const generateScheduleData = (
  year: number,
  template: boolean = false
): ScheduleEntry[] => {
  const yearSequence = getYearSchedule(year);
  const schedulesByLocation = template
    ? {}
    : getYearScheduleDurations(year, YEAR_SCHEDULE);
  const schedulePointers: Record<string, number> =
    generateSchedulePointers(schedulesByLocation);

  const { startDate, endDate } = getDateRange(
    year,
    SCHEDULE_START,
    SCHEDULE_END
  );
  const baseData = buildScheduleData(
    yearSequence,
    schedulesByLocation,
    schedulePointers,
    startDate,
    endDate,
    (d) => format(d, DATE_FORMAT, { locale: pt })
  );

  const scheduleData: ScheduleEntry[] = baseData.map((entry) => ({
    ...entry,
    isBold:
      !template &&
      isScheduledVillage(entry.location) &&
      !!schedulesByLocation[entry.location],
  }));

  return scheduleData;
};

/**
 * Generates the complete schedule data for the year
 * @param year - The target year
 * @param template - If true, generates a template without time schedules
 * @returns Array of schedule entries
 */
const generateCustomScheduleData = (
  year: number,
  schedulesByLocation: Record<string, string[]>
): ScheduleEntry[] => {
  const yearSequence = getYearSchedule(year);
  const schedulePointers: Record<string, number> =
    generateSchedulePointers(schedulesByLocation);
  const { startDate, endDate } = getDateRange(
    year,
    SCHEDULE_START,
    SCHEDULE_END
  );
  const baseData = buildScheduleData(
    yearSequence,
    schedulesByLocation,
    schedulePointers,
    startDate,
    endDate,
    (d) => format(d, DATE_FORMAT, { locale: pt })
  );

  const scheduleData: ScheduleEntry[] = baseData.map((entry) => ({
    ...entry,
    isBold: !!schedulesByLocation[entry.location],
  }));

  return scheduleData;
};

/**
 * Generates the complete schedule data for the year
 * @param year - The target year
 * @param template - If true, generates a template without time schedules
 * @returns Array of schedule entries
 */

/**
 * Generates an Excel workbook with the irrigation schedule
 * @param year - The target year
 * @param template - If true, generates a template without time schedules
 * @returns ExcelJS Workbook object
 */
const generateScheduleWorkbook = (
  year: number,
  template: boolean = false
): ExcelJS.Workbook => {
  const scheduleData = generateScheduleData(year, template);

  // Excel configuration
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Agua de Vibora");

  worksheet.columns = [
    { key: "date", width: 15 },
    { key: "location", width: 20 },
    { key: "schedule", width: 40 },
  ];

  // Add title
  addTitleToWorksheet(worksheet, year, "Agua de Vibora");

  // Add data rows
  scheduleData.forEach((item) => {
    const row = worksheet.addRow({
      date: item.dateFormatted,
      location: item.location,
      schedule: item.schedule,
    });

    // Add black borders to all cells
    row.eachCell((cell: ExcelJS.Cell) => addBordersToCell(cell));

    // Make bold if needed
    if (item.isBold) {
      row.getCell("date").font = { bold: true };
      row.getCell("location").font = { bold: true };
      row.getCell("schedule").font = { bold: true };
    }
  });

  return workbook;
};

/**
 * Generates a PDF document with the irrigation schedule
 * @param year - The target year
 * @param template - If true, generates a template without time schedules
 * @returns PDFKit Document object
 */
const generateSchedulePDF = (year: number, template: boolean = false) => {
  const scheduleData = generateScheduleData(year, template);

  return generatePDF(`Aviança da Água de Víbora - Ano ${year}`, scheduleData);
};

/**
 * Parses Portuguese time strings to 24-hour format
 * Examples:
 * - "1h30 da tarde" -> { hour: 13, minute: 30 }
 * - "10 da noite" -> { hour: 22, minute: 0 }
 * - "12h" -> { hour: 12, minute: 0 }
 * - "Nascer do sol" -> { hour: 6, minute: 0 }
 * @param timeStr - Time string in Portuguese
 * @returns Object with hour and minute
 */
const parsePortugueseTime = (
  timeStr: string
): { hour: number; minute: number } => {
  const str = timeStr.toLowerCase().trim();

  // Special cases
  if (str.includes("nascer")) {
    return { hour: 6, minute: 0 }; // Sunrise
  }
  if (str.includes("pôr do sol")) {
    return { hour: 18, minute: 30 }; // Sunset
  }
  if (str.includes("meia noite") || str.includes("meia-noite")) {
    return { hour: 0, minute: 0 }; // Midnight
  }

  // Parse time patterns like "1h30", "12h", "10", "9h30"
  const timePattern = /(\d{1,2})(?:h(\d{2}))?/;
  const match = str.match(timePattern);

  if (!match) {
    return { hour: 9, minute: 0 }; // Default fallback
  }

  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;

  // Adjust for afternoon/night context
  if (str.includes("tarde") && hour < 12) {
    hour += 12; // "1h30 da tarde" -> 13:30
  } else if (str.includes("noite") && hour < 12) {
    hour += 12; // "10 da noite" -> 22:00
  }

  return { hour, minute };
};

/**
 * Parses Portuguese time range strings and calculates duration
 * Examples:
 * - "12h até as 2h da tarde" -> { start: {hour: 12, minute: 0}, end: {hour: 14, minute: 0}, durationHours: 2, durationMinutes: 0 }
 * - "10 da noite até ás 1h30" -> { start: {hour: 22, minute: 0}, end: {hour: 1, minute: 30}, durationHours: 3, durationMinutes: 30 }
 * - "9h30 até 10h30" -> { start: {hour: 9, minute: 30}, end: {hour: 10, minute: 30}, durationHours: 1, durationMinutes: 0 }
 * @param timeStr - Time string in Portuguese
 * @returns Object with start time, optional end time, and duration
 */
const parseTimeRange = (
  timeStr: string
): {
  start: { hour: number; minute: number };
  end?: { hour: number; minute: number };
  durationHours: number;
  durationMinutes: number;
} => {
  const str = timeStr.toLowerCase();

  // Check if it's a time range with "até"
  if (str.includes("até")) {
    // Split by "até" and handle variations like "às", "as", "á", "ás"
    const parts = str.split(/até\s+(?:à?s?\s+)?/);

    if (parts.length >= 2) {
      const startTime = parsePortugueseTime(parts[0]);
      const endTime = parsePortugueseTime(parts[1]);

      // Calculate duration (handle overnight scenarios)
      let totalMinutes =
        endTime.hour * 60 +
        endTime.minute -
        (startTime.hour * 60 + startTime.minute);

      // If negative, it means the end time is the next day
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60; // Add 24 hours
      }

      const durationHours = Math.floor(totalMinutes / 60);
      const durationMinutes = totalMinutes % 60;

      return {
        start: startTime,
        end: endTime,
        durationHours,
        durationMinutes,
      };
    }
  }

  // No "até" found, use single time with default 2 hour duration
  const startTime = parsePortugueseTime(timeStr);
  return {
    start: startTime,
    durationHours: 2,
    durationMinutes: 0,
  };
};

/**
 * Generates an iCalendar (.ics) file for Google Calendar integration
 * @param year - The target year
 * @returns ICS file content as string or error
 */
const generateScheduleCalendar = (
  year: number
): { error: Error } | { value: string } => {
  const scheduleData = generateScheduleData(year, false);

  const events: EventAttributes[] = scheduleData
    .filter((item) => item.schedule) // Only include entries with schedules
    .map((item) => {
      // Parse the time range from the schedule string
      const timeRange = parseTimeRange(item.schedule);

      return {
        start: [
          item.date.getFullYear(),
          item.date.getMonth() + 1,
          item.date.getDate(),
          timeRange.start.hour,
          timeRange.start.minute,
        ],
        duration: {
          hours: timeRange.durationHours,
          minutes: timeRange.durationMinutes,
        },
        title: `Água do casal: ${item.location}`,
        description: `Horário: ${item.schedule}`,
        status: "CONFIRMED" as const,
        busyStatus: "BUSY" as const,
        organizer: { name: "Água de Víbora" },
        categories: ["Água de víbora", item.location],
      };
    });

  const result = createEvents(events);

  if (result.error) {
    return { error: result.error };
  }

  if (!result.value) {
    return { error: new Error("Failed to generate calendar") };
  }

  return { value: result.value };
};

export {
  getYearSchedule,
  generateScheduleData,
  generateCustomScheduleData,
  generateScheduleWorkbook,
  generateSchedulePDF,
  generateScheduleCalendar,
};
