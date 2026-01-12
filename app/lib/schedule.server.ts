/**
 * @fileoverview Server-only utility for generating Água de Víbora irrigation schedules
 * This file uses the .server.ts convention to ensure it's never bundled to the client
 * Handles schedule generation for different villages and creates Excel/PDF outputs
 */
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import ExcelJS from 'exceljs'
import ical, { type ICalEventData } from 'ical-generator'
import SunCalc from 'suncalc'
import type { ScheduleEntry } from './types'
import {
    addBordersToCell,
    addTitleToWorksheet,
    generatePDF,
    generateSchedulePointers,
    buildScheduleData,
    getOrder,
    getYearScheduleDurations,
    getDateRange,
} from './utils.server'

/** Reference year for schedule rotation calculations */
const REFERENCE_YEAR = 2025

/** Start date configuration for the irrigation schedule (June 25) */
const SCHEDULE_START = { month: 5, date: 25 }

/** End date configuration for the irrigation schedule (September 29) */
const SCHEDULE_END = { month: 8, date: 29 }

/** Date format string for Portuguese locale */
const DATE_FORMAT = "dd 'de' MMMM"

/** Geographic coordinates for Abadim, Cabeceiras de Basto, Portugal */
const ABADIM_COORDINATES = {
    latitude: 41.5167, // 41°31'N
    longitude: -7.9167, // 7°55'W
}

/**
 * Calculates the exact sunset time for a given date in Abadim
 * Uses astronomical calculations based on geographic coordinates
 *
 * @param date - The date to calculate sunset for
 * @returns Hour of sunset (24-hour format, decimal)
 *
 * @example
 * getSunsetHour(new Date(2026, 5, 25)) // June 25, 2026
 * // Returns: ~21.5 (around 21:30 in summer)
 *
 * @example
 * getSunsetHour(new Date(2026, 11, 25)) // December 25, 2026
 * // Returns: ~17.15 (around 17:09 in winter)
 */
const getSunsetHour = (date: Date): number => {
    const times = SunCalc.getTimes(
        date,
        ABADIM_COORDINATES.latitude,
        ABADIM_COORDINATES.longitude
    )

    const sunsetDate = times.sunset
    const sunsetHour = sunsetDate.getHours() + sunsetDate.getMinutes() / 60

    return sunsetHour
}

/**
 * Villages grouped by region (Torre and Santo-Antonio)
 */
export const VILLAGES: Record<string, string[]> = {
    Torre: ['Torre', 'Crasto', 'Passo', 'Ramada', 'Figueiredo', 'Redondinho'],
    'Santo-Antonio': [
        'Casa Nova',
        'Eirô',
        'Cimo de Aldeia',
        'Portela',
        'Casas de Baixo',
    ],
}

/**
 * Time schedules for specific villages in odd and even years
 */
type YearScheduleConfig = Record<string, string[]>

const YEAR_SCHEDULE: { odd: YearScheduleConfig; even: YearScheduleConfig } = {
    odd: {
        Torre: ['1h30 da tarde', '12h até as 2h da tarde'],
        Passo: [
            '10 da noite até ás 1h30/5h30 da tarde',
            '9h30 até 10h30/13h30 até 17h',
        ],
        Figueiredo: [
            'Ao pôr do sol até à meia noite',
            '3h da tarde até ao pôr do sol',
        ],
    },
    even: {
        Torre: ['12h', '13h30'],
        Passo: [
            '9h30 até 10h30 da Noite/13h30 até 17h',
            '10 da noite até á 1h30/5h30 da tarde',
        ],
        Figueiredo: ['Nascer do sol às 12h', '3h até ao Nascer do sol'],
    },
}

/**
 * Valid village names that have specific schedules
 */
type ScheduledVillage = keyof YearScheduleConfig

/**
 * Type guard to check if a village has a specific schedule
 */
const isScheduledVillage = (village: string): village is ScheduledVillage => {
    return (
        village === 'Torre' || village === 'Passo' || village === 'Figueiredo'
    )
}

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
    const torrePlaces = getOrder(VILLAGES.Torre, year, REFERENCE_YEAR)
    const santoAntonioPlaces = getOrder(
        VILLAGES['Santo-Antonio'],
        year,
        REFERENCE_YEAR
    )
    return year % 2 === 0
        ? [...santoAntonioPlaces, ...torrePlaces]
        : [...torrePlaces, ...santoAntonioPlaces]
}

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
    const yearSequence = getYearSchedule(year)
    const schedulesByLocation = template
        ? {}
        : getYearScheduleDurations(year, YEAR_SCHEDULE)
    const schedulePointers: Record<string, number> =
        generateSchedulePointers(schedulesByLocation)

    const { startDate, endDate } = getDateRange(
        year,
        SCHEDULE_START,
        SCHEDULE_END
    )
    const baseData = buildScheduleData(
        yearSequence,
        schedulesByLocation,
        schedulePointers,
        startDate,
        endDate,
        (d) => format(d, DATE_FORMAT, { locale: pt })
    )

    const scheduleData: ScheduleEntry[] = baseData.map((entry) => ({
        ...entry,
        isBold:
            !template &&
            isScheduledVillage(entry.location) &&
            !!schedulesByLocation[entry.location],
    }))

    return scheduleData
}

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
    const yearSequence = getYearSchedule(year)
    const schedulePointers: Record<string, number> =
        generateSchedulePointers(schedulesByLocation)
    const { startDate, endDate } = getDateRange(
        year,
        SCHEDULE_START,
        SCHEDULE_END
    )
    const baseData = buildScheduleData(
        yearSequence,
        schedulesByLocation,
        schedulePointers,
        startDate,
        endDate,
        (d) => format(d, DATE_FORMAT, { locale: pt })
    )

    const scheduleData: ScheduleEntry[] = baseData.map((entry) => ({
        ...entry,
        isBold: !!schedulesByLocation[entry.location],
    }))

    return scheduleData
}

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
    const scheduleData = generateScheduleData(year, template)

    // Excel configuration
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Agua de Vibora')

    worksheet.columns = [
        { key: 'date', width: 15 },
        { key: 'location', width: 20 },
        { key: 'schedule', width: 40 },
    ]

    // Add title
    addTitleToWorksheet(worksheet, year, 'Agua de Vibora')

    // Add data rows
    scheduleData.forEach((item) => {
        const row = worksheet.addRow({
            date: item.dateFormatted,
            location: item.location,
            schedule: item.schedule,
        })

        // Add black borders to all cells
        row.eachCell((cell: ExcelJS.Cell) => addBordersToCell(cell))

        // Make bold if needed
        if (item.isBold) {
            row.getCell('date').font = { bold: true }
            row.getCell('location').font = { bold: true }
            row.getCell('schedule').font = { bold: true }
        }
    })

    return workbook
}

/**
 * Generates a PDF document with the irrigation schedule
 * @param year - The target year
 * @param template - If true, generates a template without time schedules
 * @returns PDFKit Document object
 */
const generateSchedulePDF = (year: number, template: boolean = false) => {
    const scheduleData = generateScheduleData(year, template)

    return generatePDF(
        `Aviança da Água de Víbora - Ano ${year}`,
        scheduleData,
        ['Data', 'Casal', 'Horário']
    )
}

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
    const str = timeStr.toLowerCase().trim()

    // Special cases
    if (str.includes('nascer')) {
        return { hour: 6, minute: 0 } // Sunrise
    }
    if (str.includes('pôr do sol')) {
        return { hour: 18, minute: 30 } // Sunset
    }
    if (str.includes('meia noite') || str.includes('meia-noite')) {
        return { hour: 0, minute: 0 } // Midnight
    }

    // Parse time patterns like "1h30", "12h", "10", "9h30"
    const timePattern = /(\d{1,2})(?:h(\d{2}))?/
    const match = str.match(timePattern)

    if (!match) {
        return { hour: 9, minute: 0 } // Default fallback
    }

    let hour = parseInt(match[1], 10)
    const minute = match[2] ? parseInt(match[2], 10) : 0

    // Adjust for afternoon/night context
    if (str.includes('tarde') && hour < 12) {
        hour += 12 // "1h30 da tarde" -> 13:30
    } else if (str.includes('noite') && hour < 12) {
        hour += 12 // "10 da noite" -> 22:00
    }

    return { hour, minute }
}

/** Default duration when no end time is specified (in hours) */
const DEFAULT_DURATION_HOURS = 2

/** Minutes in a day for overnight calculation */
const MINUTES_PER_DAY = 24 * 60

/**
 * Calculates duration between two times, handling overnight scenarios
 * @param start - Start time
 * @param end - End time
 * @returns Duration in hours and minutes
 */
const calculateDuration = (
    start: { hour: number; minute: number },
    end: { hour: number; minute: number }
): { hours: number; minutes: number } => {
    const startMinutes = start.hour * 60 + start.minute
    const endMinutes = end.hour * 60 + end.minute

    // Handle overnight: if end < start, it's the next day
    let totalMinutes = endMinutes - startMinutes
    if (totalMinutes < 0) {
        totalMinutes += MINUTES_PER_DAY
    }

    return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
    }
}

/**
 * Parses Portuguese time range strings and calculates duration
 * Supports various formats: "12h até as 2h da tarde", "10 da noite até ás 1h30", etc.
 *
 * @param timeStr - Time string in Portuguese
 * @returns Object with start time, optional end time, and duration
 *
 * @example
 * parseTimeRange("12h até as 2h da tarde")
 * // Returns: { start: {hour: 12, minute: 0}, end: {hour: 14, minute: 0}, durationHours: 2, durationMinutes: 0 }
 *
 * @example
 * parseTimeRange("10 da noite até ás 1h30")
 * // Returns: { start: {hour: 22, minute: 0}, end: {hour: 1, minute: 30}, durationHours: 3, durationMinutes: 30 }
 *
 * @example
 * parseTimeRange("1h30 da tarde")
 * // Returns: { start: {hour: 13, minute: 30}, durationHours: 2, durationMinutes: 0 }
 */
const parseTimeRange = (
    timeStr: string
): {
    start: { hour: number; minute: number }
    end?: { hour: number; minute: number }
    durationHours: number
    durationMinutes: number
} => {
    const str = timeStr.toLowerCase()

    // Check if it's a time range with "até"
    if (str.includes('até')) {
        // Split by "até" and handle variations like "às", "as", "á", "ás"
        const parts = str.split(/até\s+(?:a[oà]?\s+)?(?:à?s?\s+)?/)

        if (parts.length >= 2) {
            const startTime = parsePortugueseTime(parts[0])
            const endTime = parsePortugueseTime(parts[1])
            const duration = calculateDuration(startTime, endTime)

            return {
                start: startTime,
                end: endTime,
                durationHours: duration.hours,
                durationMinutes: duration.minutes,
            }
        }
    }

    // Check for "X às Y" format (e.g., "Nascer do sol às 12h")
    if (str.includes(' às ') || str.includes(' as ')) {
        const parts = str.split(/\s+[àa]s\s+/)

        if (parts.length >= 2) {
            const startTime = parsePortugueseTime(parts[0])
            const endTime = parsePortugueseTime(parts[1])
            const duration = calculateDuration(startTime, endTime)

            return {
                start: startTime,
                end: endTime,
                durationHours: duration.hours,
                durationMinutes: duration.minutes,
            }
        }
    }

    // No "até" or "às" found, use single time with default duration
    const startTime = parsePortugueseTime(timeStr)
    return {
        start: startTime,
        durationHours: DEFAULT_DURATION_HOURS,
        durationMinutes: 0,
    }
}

/** Milliseconds in one day */
const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Number of hours before event to trigger alarm notification */
const ALARM_HOURS_BEFORE = 2

/**
 * Checks if a schedule starts after sunset (ancestral "next day")
 *
 * In the ancestral system, the "day" started at sunset, not midnight.
 * ANY schedule starting at or after sunset belongs to the ancestral "next day".
 * Therefore, in the modern calendar (ICS), it should start on the PREVIOUS day.
 *
 * This function uses precise astronomical calculations for Abadim, Cabeceiras de Basto.
 * Sunset varies throughout the year: ~21:30 in summer (June-July) to ~17:00 in winter (December)
 *
 * Rule: If start time is at or after sunset for that specific date, use previous day.
 *
 * @param startTime - Parsed start time
 * @param date - The date to check sunset for
 * @returns true if event starts after sunset (should use previous day in ICS)
 *
 * @example
 * // Summer (June 25, sunset ~21:30)
 * startsAfterSunset({ hour: 22, minute: 0 }, new Date(2026, 5, 25))
 * // Returns: true → 22:00 > 21:30 = use previous day
 *
 * @example
 * // Summer (June 25, sunset ~21:30)
 * startsAfterSunset({ hour: 15, minute: 0 }, new Date(2026, 5, 25))
 * // Returns: false → 15:00 < 21:30 = same day
 *
 * @example
 * // Winter (December 25, sunset ~17:00)
 * startsAfterSunset({ hour: 18, minute: 0 }, new Date(2026, 11, 25))
 * // Returns: true → 18:00 > 17:00 = use previous day
 */
const startsAfterSunset = (
    startTime: { hour: number; minute: number },
    date: Date
): boolean => {
    const sunsetHour = getSunsetHour(date)
    const startHourDecimal = startTime.hour + startTime.minute / 60

    // If event starts at or after sunset, it belongs to the "next day" in ancestral system
    // Therefore, in modern calendar (ICS), use the PREVIOUS day
    return startHourDecimal >= sunsetHour
}

/**
 * Creates a single ICS event from schedule text and date
 *
 * @param scheduleText - The schedule text (e.g., "10 da noite até á 1h30")
 * @param location - Location name
 * @param date - Event date
 * @returns ICS event data compatible with ical-generator
 */
const createSingleCalendarEvent = (
    scheduleText: string,
    location: string,
    date: Date
): ICalEventData => {
    const timeRange = parseTimeRange(scheduleText)
    const usePreviousDay = startsAfterSunset(timeRange.start, date)

    // Ancestral rule: Events after sunset start on previous day
    const eventDate = usePreviousDay
        ? new Date(date.getTime() - MS_PER_DAY)
        : date

    // Use the parsed start time (no override needed)
    const startHour = timeRange.start.hour
    const startMinute = timeRange.start.minute

    // Calculate end time using Date objects
    const startDate = new Date(eventDate)
    startDate.setHours(startHour, startMinute, 0, 0)

    const totalMinutes =
        timeRange.durationHours * 60 + timeRange.durationMinutes
    const endDate = new Date(startDate.getTime() + totalMinutes * 60 * 1000)

    return {
        start: startDate,
        end: endDate,
        summary: `Água do casal: ${location}`,
        description: `Horário: ${scheduleText}\nLocal: ${location}`,
        location: location,
        organizer: {
            name: 'Água de Víbora',
            email: 'noreply@agua-vibora.pt',
        },
        categories: [{ name: 'Água de víbora' }, { name: location }],
        alarms: [
            {
                trigger: ALARM_HOURS_BEFORE * 60 * 60, // 2 hours before in seconds
            },
        ],
    }
}

/**
 * Creates ICS event objects from a schedule entry
 *
 * Handles schedules with multiple time slots separated by "/" (e.g., "9h30 até 10h30 da Noite/13h30 até 17h")
 * and creates separate events for each time slot.
 *
 * Applies the ancestral rule: Events starting after sunset use the PREVIOUS day,
 * as the "day" began at sunset in the traditional system.
 *
 * Uses precise astronomical calculations for Abadim, Cabeceiras de Basto.
 * Sunset varies: ~21:30 in summer, ~17:00 in winter.
 *
 * @param item - Schedule entry
 * @returns Array of ICS event data (one or more)
 *
 * @example
 * // Single event: "25 de junho | Torre | 3h da tarde até ao pôr do sol"
 * // Returns: [ICalEventData] (1 event)
 *
 * @example
 * // Multiple events: "25 de junho | Passo | 9h30 até 10h30 da Noite/13h30 até 17h"
 * // Returns: [ICalEventData, ICalEventData] (2 events)
 */
const createCalendarEvents = (item: ScheduleEntry): ICalEventData[] => {
    // Check if schedule contains multiple time slots separated by "/"
    if (item.schedule.includes('/')) {
        const timeSlots = item.schedule.split('/').map((slot) => slot.trim())
        return timeSlots.map((scheduleText) =>
            createSingleCalendarEvent(scheduleText, item.location, item.date)
        )
    }

    // Single time slot
    return [createSingleCalendarEvent(item.schedule, item.location, item.date)]
}

/**
 * Generates an iCalendar (.ics) file for Google Calendar integration using ical-generator
 *
 * Ancestral System Rule: In the traditional system, the "day" started at sunset.
 * Therefore, overnight events (night to early morning) start on the PREVIOUS day.
 *
 * @param year - The target year
 * @returns ICS file content as string or error object
 *
 * @example
 * // Table row: "25 de agosto | Passo | 10 da noite até ás 1h30"
 * // ICS event: August 24, 22:00 → August 25, 01:30
 *
 * @example
 * // Table row: "25 de julho | Figueiredo | Ao pôr do sol até à meia noite"
 * // ICS event: July 24, 20:30 → July 25, 00:00
 */
const generateScheduleCalendar = (
    year: number
): { error: Error } | { value: string } => {
    try {
        const scheduleData = generateScheduleData(year, false)

        // Create calendar using ical-generator (better mobile compatibility)
        const calendar = ical({
            name: `Água de Víbora ${year}`,
            prodId: {
                company: 'Água de Víbora',
                product: 'agua-vibora-generator',
                language: 'PT',
            },
            timezone: 'Europe/Lisbon',
        })

        // Convert schedule entries to calendar events
        // Use flatMap to handle multiple events per schedule entry (e.g., "9h30/13h30")
        const events: ICalEventData[] = scheduleData
            .filter((item) => item.schedule) // Only entries with schedules
            .flatMap(createCalendarEvents)

        // Add all events to calendar
        events.forEach((eventData) => {
            calendar.createEvent(eventData)
        })

        // Generate ICS content
        const icsContent = calendar.toString()

        return { value: icsContent }
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error
                    : new Error('Failed to generate calendar'),
        }
    }
}

export {
    getYearSchedule,
    generateScheduleData,
    generateCustomScheduleData,
    generateScheduleWorkbook,
    generateSchedulePDF,
    generateScheduleCalendar,
}
